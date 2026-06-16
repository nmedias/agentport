#!/usr/bin/env node
// Screenshot Storybook stories from the running dev server for visual verification.
//
// Storybook must already be running (npm run storybook → :6006). This drives a
// headless Chromium over the live preview iframe and writes one PNG per target,
// so the rendered result can be inspected without a human in the loop.
//
// Usage:
//   node tools/shoot-stories.mjs <storyId>[@viewMode] ...
//   node tools/shoot-stories.mjs ui-checkbox--choice-card ui-checkbox--docs
//
// viewMode defaults to "story"; ids ending in "--docs" default to "docs".
// Env overrides:
//   SB_URL    base url            (default http://localhost:6006)
//   OUT_DIR   screenshot out dir  (default tools/screenshots, relative to repo root)
//   WIDTH     viewport width      (default 1000)
//   SELECTOR  if set, crop to the first matching element instead of full page
//             (e.g. SELECTOR=.docblock-argstable to grab just an Autodocs table)

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SB_URL = (process.env.SB_URL ?? 'http://localhost:6006').replace(/\/$/, '');
const OUT_DIR = resolve(repoRoot, process.env.OUT_DIR ?? 'tools/screenshots');
const WIDTH = Number(process.env.WIDTH ?? 1000);
const SELECTOR = process.env.SELECTOR || null;

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node tools/shoot-stories.mjs <storyId>[@viewMode] ...');
  process.exit(2);
}

const targets = args.map((arg) => {
  const [id, mode] = arg.split('@');
  const viewMode = mode ?? (id.endsWith('--docs') ? 'docs' : 'story');
  return { id, viewMode };
});

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const results = [];
try {
  for (const { id, viewMode } of targets) {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: 800 },
      deviceScaleFactor: 2,
    });
    const url = `${SB_URL}/iframe.html?id=${encodeURIComponent(id)}&viewMode=${viewMode}`;
    const outPath = join(OUT_DIR, `${id}__${viewMode}.png`);
    try {
      // 'load' (not 'networkidle') — Storybook's HMR socket keeps the network busy.
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      const ready = viewMode === 'docs' ? '.sbdocs-wrapper, #storybook-docs' : '#storybook-root';
      await page.waitForSelector(ready, { timeout: 15000 });
      await page.waitForTimeout(400); // let fonts/transitions settle
      if (SELECTOR) {
        await page.locator(SELECTOR).first().screenshot({ path: outPath });
      } else {
        await page.screenshot({ path: outPath, fullPage: true });
      }
      results.push({ id, viewMode, outPath, ok: true });
      console.log(`✓ ${id} (${viewMode}) -> ${outPath}`);
    } catch (err) {
      results.push({ id, viewMode, ok: false, error: err?.message ?? String(err) });
      console.error(`✗ ${id} (${viewMode}): ${err?.message ?? err}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} captured -> ${OUT_DIR}`);
process.exit(failed.length ? 1 : 0);
