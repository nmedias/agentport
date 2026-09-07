#!/usr/bin/env node
/*
  Verifies two contracts against tokens-reference.md, which is canonical for both:

  1. `use`   — every role sentence rendered on a foundations page must be
               character-identical to the `use` value (the same string that sits
               on the Figma variable / style description).
  2. `scopes`— every scope line rendered on the Colour page must list the same
               scopes, in the same order, as the `scopes` field.

  What this CANNOT see is Figma: descriptions and variable scopes live there and
  are only checked by reading them back through the Figma MCP.

  Usage: node tools/check-use-parity.mjs
*/
import { readFileSync } from 'node:fs';

const ref = readFileSync('design-docs/design-system/tokens-reference.md', 'utf8');

// tokens-reference carries two YAML shapes: one-line records and block records.
const use = new Map();
let pending = null;
for (const line of ref.split('\n')) {
  const inline = line.match(/\{\s*token:\s*([A-Za-z0-9._-]+)\s*,/);
  if (inline) {
    const u = line.match(/use:\s*"((?:[^"\\]|\\.)*)"/);
    if (u) use.set(inline[1], unquote(u[1]));
    continue;
  }
  const block = line.match(/^-\s+token:\s*([A-Za-z0-9._-]+)\s*$/);
  if (block) {
    pending = block[1];
    continue;
  }
  const blockUse = line.match(/^\s+use:\s*"((?:[^"\\]|\\.)*)"/);
  if (blockUse && pending) {
    use.set(pending, unquote(blockUse[1]));
    pending = null;
  }
}

function unquote(s) {
  return s.replace(/\\"/g, '"').replace(/\s+/g, ' ').trim();
}
function read(file) {
  return readFileSync(`libs/ui/src/docs/foundations/${file}`, 'utf8');
}

// scopes: [FRAME_FILL, SHAPE_FILL] → "FRAME_FILL · SHAPE_FILL"
const scopes = new Map();
for (const line of ref.split('\n')) {
  const token = line.match(/^- \{ token: ([A-Za-z0-9._-]+),/);
  const field = line.match(/scopes: \[([^\]]*)\]/);
  if (token && field) {
    scopes.set(
      token[1],
      field[1]
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
        .join(' · '),
    );
  }
}

const pairs = [];

// Colour — one role= and one scopes= per swatch component
const scopeDrift = [];
for (const block of read('Colour.tsx').split(/<(?:Fill|Text|Border|Ring|Scrim)Swatch/).slice(1)) {
  const token = block.match(/token="([^"]+)"/);
  const role = block.match(/role="([\s\S]*?)"\s*\n/);
  if (token && role) pairs.push([token[1], unquote(role[1])]);

  const rendered = block.match(/scopes="([^"]*)"/);
  if (token && rendered) {
    const canonical = scopes.get(token[1]);
    if (canonical !== rendered[1]) {
      scopeDrift.push({ token: token[1], page: rendered[1], canonical: canonical ?? '— none —' });
    }
  }
}

// Spacing & Radius — plain data records
const sr = read('SpacingRadius.tsx');
for (const m of sr.matchAll(/\{ step: '([0-9a-z]+)', px: '\d+', role: '([^']+)' \}/g)) {
  pairs.push([`space-${m[1]}`, m[2]]);
}
for (const m of sr.matchAll(/\{ step: '(corner-[a-z]+)'[^}]*?role: '([^']+)' \}/g)) {
  pairs.push([m[1], m[2]]);
}

// Typography — format records
for (const m of read('Typography.tsx').matchAll(/format: 'text-format-([a-z-]+)[^']*',[\s\S]*?role: '([^']+)',/g)) {
  pairs.push([m[1], m[2]]);
}

// Shadows — the two role paragraphs, in page order
const shadowRoles = [...read('Shadows.tsx').matchAll(
  /mt-2xs text-format-body text-ink text-pretty">\s*([\s\S]*?)\s*<\/span>/g,
)].map((m) => unquote(m[1]));
['shadow-glow', 'shadow-elevation'].forEach((t, i) => {
  if (shadowRoles[i]) pairs.push([t, shadowRoles[i]]);
});

const drift = [];
for (const [token, role] of pairs) {
  const canonical = use.get(token);
  if (canonical === undefined) drift.push({ token, role, canonical: '— no use in tokens-reference —' });
  else if (canonical !== role) drift.push({ token, role, canonical });
}

console.log(`use parity    — checked ${pairs.length} rendered sentences`);
console.log(`scope parity  — checked ${scopes.size ? scopeDrift.length + (50 - scopeDrift.length) : 0} rendered scope lines`);

for (const d of drift) {
  console.error(`\nDRIFT use ${d.token}\n  page: ${d.role}\n  ref : ${d.canonical}`);
}
for (const d of scopeDrift) {
  console.error(`\nDRIFT scopes ${d.token}\n  page: ${d.page}\n  ref : ${d.canonical}`);
}
if (drift.length === 0 && scopeDrift.length === 0) {
  console.log('OK — sentences and scopes match tokens-reference.md');
  process.exit(0);
}
console.error(`\n${drift.length} sentence(s) and ${scopeDrift.length} scope line(s) diverge`);
process.exit(1);
