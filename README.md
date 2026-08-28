# agentport

**Agentport DS** — a shadcn/ui component library re-clothed in its own design-token layer, built and
maintained through an **agent-driven Figma ↔ code pipeline**. Every component here was ported by a
Claude Code skill: read the shadcn anatomy via MCP, build a token-bound Figma component set, write
the React code on the DS utility vocabulary, and prove it in Storybook (browser story tests + axe).

The repo is the *result* of that pipeline plus the tooling to keep running it: 22 ported primitives
in Storybook, the run notes of every port and sync, the token/component reference the skills read,
and the skills themselves.

## What is in here

```
libs/ui/                     @agentport/ui — the library
  src/components/ui/<name>/  one folder per component: <name>.tsx + .stories.tsx + .spec.tsx + index.ts
  src/blocks/                blocks layer (organisms composed from primitives) — structure only, nothing ported yet
  src/docs/                  Storybook Introduction + Foundations pages (Primitives, Colors, Typography, Spacing, Effects)
  src/styles/                globals.css → tokens.css (Figma export) + tw-theme.css / tw-utilities.css / tw-variants.css
  .storybook/                Storybook 10 (react-vite) + addon-vitest + addon-a11y + addon-mcp
agent-runs/component-port/   run notes per first-time port (date-component)
agent-runs/component-sync/   run notes per Figma → code reconciliation
design-docs/            design-system/tokens-reference.md (token crosswalk), design-system/components-reference.md
                             (component catalog with Figma node IDs), token-analysis-*.md (token system derivation)
.claude/skills/              the pipeline skills (see below)
tools/shoot-stories.mjs      Playwright screenshots of a running Storybook, for visual checks
```

## Prerequisites

- **Node ≥ 24** and **npm ≥ 11** (npm workspaces; the lockfile is authoritative)
- **Chromium for Playwright** — story tests run in a real browser: `npx playwright install chromium`
- Optional, only for running the design pipeline: **Claude Code** with the Figma plugin, **Figma
  Desktop** with the Figma MCP plugin enabled, and your own Figma file (see *Figma* below)

## Getting started

```bash
npm install
npx playwright install chromium
npm run storybook          # http://localhost:6006 — the entry point
npm run check              # lint + tests + typecheck — the gate
```

## Scripts

| Script                       | What it runs                                                                    |
|------------------------------|---------------------------------------------------------------------------------|
| `npm run storybook`          | Storybook dev server for `@agentport/ui` (port 6006)                            |
| `npm run build-storybook`    | Static Storybook build                                                          |
| `npm test`                   | All tests via Nx (`nx run-many -t test`)                                        |
| `npm run test:unit`          | jsdom unit specs only (`@agentport/ui` Vitest project)                          |
| `npm run test:stories`       | Every story rendered in Chromium + axe accessibility check (`storybook` project)|
| `npm run lint` / `typecheck` | ESLint / TypeScript across the workspace                                        |
| `npm run check`              | lint + test + typecheck — **the gate**; test or lint alone do not typecheck     |
| `npm run shoot -- <storyId>` | Screenshot a story from a *running* Storybook → `tools/screenshots/`            |
| `npm run ui:add -- <name>`   | Pull a shadcn component source into `libs/ui` (see *Adding a component*)        |
| `npm run graph`              | Nx project graph                                                                |

Testing is **two Vitest projects** under one config (`libs/ui/vite.config.mts`): `@agentport/ui`
(jsdom `.spec.tsx`) and `storybook` (`@storybook/addon-vitest`: each story is a browser test, and
`addon-a11y` runs axe with `test: 'error'`, so an accessibility violation fails the run).

## The pipeline

```
shadcn registry (style: radix-nova)
   │  /shadcn-component-port  — first-time port
   │     1. read the anatomy through the shadcn MCP
   │     2. build a token-bound Figma component set (variants, slots, state axis)
   │     3. write the code on the DS utility vocabulary, story + spec, prop docs
   │     4. gate: nx test | typecheck | lint green, axe clean
   ▼
libs/ui/src/components/ui/<name>/          ←→   Figma component set
   ▲
   │  /component-sync — after a Figma change: read the live per-variant token bindings,
   │                    diff against the code, apply the delta (Figma → code, read-only on Figma)
```

Each run leaves a `notes.md` (and often a `skill-feedback.md`) under `agent-runs/`; the catalog
`design-docs/design-system/components-reference.md` records where every component lives in
Figma (set/node IDs, variant axes) and in code (folder, exports, barrel).

### Skills (`.claude/skills/`)

| Skill                     | Role                                                                                 |
|---------------------------|--------------------------------------------------------------------------------------|
| `/shadcn-component-port`  | First-time port of one shadcn component: anatomy → Figma set → code                  |
| `/component-sync`         | Reconcile an already-built component after a Figma change (Figma → code)            |
| `/docgen-props`           | Annotate a component so react-docgen exposes its public prop API in Autodocs         |
| `/storybook-rules`        | The house story pattern: Default playground + play, Usage, States gallery, a11y      |
| `/figma-build-rules`      | Build craft for token-bound Figma component sets via the Plugin MCP                  |
| `/figma-create-section`   | Canonical Section wrapper on a Figma page (used by the port skill)                   |
| `/figma-verify`           | Deterministic pre-handoff check (icons are vectors, no clipping/overlap)             |
| `/figma-status`           | Check Figma Desktop + Plugin MCP connection                                          |
| `/skill-feedback`         | Toggle before a run to capture skill-improvement findings into the run notes         |
| `/handoff`                | Freeze a session into a resume doc                                                   |

Writing rules for skills live in `.claude/skills/CLAUDE.md`.

## MCP setup

Copy `.mcp.json.example` to `.mcp.json` (git-ignored) and fill in what you use:

- **Figma Plugin MCP** — comes with the Claude Code Figma plugin (`.claude/settings.json` enables
  it); needs Figma Desktop with the MCP plugin running. This is the default Figma channel.
- **`figma-console`** — optional REST/console bridge; needs a personal access token in
  `FIGMA_ACCESS_TOKEN`. Never commit the token.
- **shadcn MCP** — registry access for anatomy reads (`npx shadcn@latest mcp`).
- **Storybook MCP** — served by `@storybook/addon-mcp` on `http://localhost:6006/mcp` while
  `npm run storybook` runs; gives agents story docs, previews and test runs.

## Figma

The token layer (`libs/ui/src/styles/tokens.css`) is an export of the Figma variable collections;
the skills read and build in a Figma file of your own. Point them at it:

1. Create a Figma file with a page named `Shadcn Components` and the variable collections
   `semantic` (color) and `semantic-dimension` (dimension) — names as in
   `design-docs/design-system/tokens-reference.md`.
2. Enter its file key in `.claude/skills/shadcn-component-port/config.json` and
   `.claude/skills/component-sync/config.json` (`figma.fileKey`, currently the placeholder
   `FIGMA_FILE_KEY`) and the page ID in `figma.pageId`.
3. Node IDs recorded in `components-reference.md` and the run notes refer to the original file and
   will be replaced as sets are rebuilt.

## Adding a component

```bash
npm run ui:add -- popover
```

`ui:add` writes the shadcn source *flat* (`libs/ui/src/components/ui/popover.tsx`). Move it into its
folder, add the barrel, re-export the folder in `libs/ui/src/index.ts`, then re-clothe it in the DS
tokens — or run `/shadcn-component-port popover` and let the skill do all of that against Figma.

## Tech stack

Nx 22 · React 19 · TypeScript · Vite 8 · Tailwind v4 (CSS-first `@theme`) · shadcn/ui (style
`radix-nova`, Radix UI) · Storybook 10 (react-vite, addon-docs, addon-a11y, addon-vitest,
addon-mcp, pseudo-states) · Vitest 4 (jsdom + Playwright/Chromium) · Remix Icon · Hanken Grotesk +
Geist Mono (fontsource)
