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
                             (component catalog with Figma node IDs), design-system/token-changelog.md (token
                             history), token-analysis-*.md (token system derivation)
.claude/skills/              the pipeline skills (see below)
tools/shoot-stories.mjs      Playwright screenshots of a running Storybook, for visual checks
```

## Prerequisites

- **Node ≥ 24** and **npm ≥ 11** (npm workspaces; the lockfile is authoritative). `npm install` also
  fetches Chromium for the story tests (`postinstall` → `playwright install chromium`).
- Only for running the design pipeline: **Claude Code** with the plugins and MCP servers listed under
  *Agent tooling*, **Figma Desktop** with the Figma MCP plugin enabled, and access to the Figma file
  that holds the design system (see *Figma* below)

## Getting started

```bash
npm install                # installs deps + Chromium for Playwright
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

## Working with the agent

The pipeline is driven from a **Claude Code** session opened at the repo root. Setup (plugins, MCP servers,
Figma file) is described under *Agent tooling* and *Figma* below; this section is about the day-to-day loop.

### Before a run

```bash
npm run storybook            # :6006 — the storybook MCP (addon-mcp) serves story docs + test runs to the agent
```

- Open the DS file in **Figma Desktop** with the MCP plugin enabled; `/figma-status` in Claude Code
  must report the Plugin MCP connected. Without it a port stops before the Figma build.
- Optionally `/skill-feedback on` — the agent then records skill gaps it hits during the run into a
  `skill-feedback.md` next to the run notes (see *What a run leaves behind*).

### A first-time port, end to end

```
/shadcn-component-port popover
```

What happens, from your side of the screen:

1. **Anatomy** — the agent pulls the stock source (`ui:add`) and the doc examples through the shadcn MCP,
   lists variant axes, slots and every stock class string.
2. **Stories first** — the shadcn usage examples become Storybook stories on the house pattern
   (`/storybook-rules`) *before* anything touches Figma. You see them in the running Storybook.
3. **Translate** — stock classes → DS utilities via `design-docs/design-system/tokens-reference.md` §6,
   written down as one mapping table. This is where the agent **asks you** when the token name match
   would be visually wrong (e.g. a near-white `muted` tint for a *selected* row) or when a composite
   needs a decision: part split, Slot vs. Swap for open content, variant granularity.
4. **Figma build + verify** — a token-bound component set (full variant matrix, sorted grid) inside a
   Section on the components page, plus a permanent usage-examples group mirroring the stories;
   `/figma-verify` must come back `CLEAN`.
5. **Code** — the component is rewritten on the DS vocabulary, the prop API annotated for Autodocs
   (`/docgen-props`), `.spec.tsx` added, folder + barrel wired. Gate: `npx nx test|typecheck|lint
   @agentport/ui` green, every story renders in Chromium, axe clean.
6. **Notes + catalog** — run notes and the component catalog are updated (below).

The agent works on a branch (`feat/shadcn-popover-port`) and commits locally; it does **not** push or
merge into `master` unless you say so (`CLAUDE.md` → *Branch Workflow*).

### Prompt examples

Skills are slash commands; the argument is the shadcn item name (`argument-hint` in each `SKILL.md`).
Plain-language requests trigger the same skills when they match the skill description.

| You want to …                                              | Type                                                                                              |
|------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Port a component that does not exist in the DS yet         | `/shadcn-component-port tabs`                                                                     |
| Same, in prose                                             | `Port the shadcn tabs component into the DS — Figma set and code.`                                |
| Port a multi-part composite (agent asks about part split)  | `/shadcn-component-port dialog`                                                                   |
| Capture skill-improvement findings during the run          | `/skill-feedback on` → run the port → `/skill-feedback off`                                       |
| Pull a Figma change into an existing component             | `/component-sync badge`                                                                           |
| Same, with context                                         | `The Badge set in Figma got a new outline variant and a smaller radius — sync the code to it.`    |
| Rework stories after an API change (no Figma involved)     | `Reconcile switch.stories.tsx with the new size prop — follow /storybook-rules.`                  |
| Surface a component's props in Autodocs                    | `Annotate the Select prop API per /docgen-props so it shows up in the ArgsTable.`                 |
| Check a render visually                                    | `Shoot ui-table--row-states and compare the selected-row tint with the Figma set.`                |
| Check the Figma link                                       | `/figma-status`                                                                                   |
| Freeze the session for later                               | `/handoff popover-port en`                                                                        |

Decisions the agent will hand back to you instead of guessing: token choices that would be visually
wrong under a name-faithful mapping, composite granularity (which parts become their own set), Slot vs.
Swap for content-bearing parts, and anything that would require detaching a Figma instance (it never does).

### What a run leaves behind

```
agent-runs/component-port/<YYYY-MM-DD>-<component>/notes.md      mapping table, Figma node + variable IDs,
                                                                  example inventory, gate state, preview URLs
agent-runs/component-port/<YYYY-MM-DD>-<component>/skill-feedback.md   only if /skill-feedback was on
agent-runs/component-sync/<YYYY-MM-DD>-<component>/notes.md      delta list + DEVIATIONS (code ≠ Figma binding)
design-docs/design-system/components-reference.md                 catalog entry updated (status, node IDs, axes)
libs/ui/src/components/ui/<component>/                            <component>.tsx + .stories.tsx + .spec.tsx + index.ts
```

Read `agent-runs/component-port/2026-06-26-table/` for a complete example: notes with a user decision
(row-tint tone) recorded as such, and a `skill-feedback.md` listing the skill gaps that surfaced in that run.

The rules the agent follows — commit style, branch workflow, Figma dos and don'ts, "docs describe only
what ships" — are in `CLAUDE.md`; the skills themselves in `.claude/skills/`.

## Agent tooling

The pipeline runs in **Claude Code**. It needs two kinds of tooling: plugins (installed once per
machine, enabled per project in `.claude/settings.json`) and MCP servers (configured per project in
`.mcp.json`).

### Claude Code plugins

`.claude/settings.json` enables these plugins; install them once from inside Claude Code:

```
/plugin install figma@claude-plugins-official          # Figma Plugin MCP + figma-use skills (required)
/plugin marketplace add Remix-Design/remixicon-mcp      # third-party marketplace for the icon MCP
/plugin install remix-icon-mcp@remix-icon-mcp           # Remix Icon search MCP (required for icon picks)
/plugin install superpowers@claude-plugins-official     # brainstorming / planning / TDD workflow (recommended)
/plugin install claude-md-management@claude-plugins-official   # CLAUDE.md maintenance (optional)
/plugin install skill-creator@claude-plugins-official   # authoring/evaluating skills (optional)
```

The Figma plugin talks to **Figma Desktop**: open the file there, enable the local MCP server in
Figma's preferences, then `/figma-status` in Claude Code confirms the link.

### MCP servers (`.mcp.json`)

Copy `.mcp.json.example` to `.mcp.json` (git-ignored) and adjust:

| Server           | How it runs                                              | Used for                                                       |
|------------------|----------------------------------------------------------|----------------------------------------------------------------|
| `shadcn`         | `npx shadcn@latest mcp` (no install, no token)           | reading component anatomy from the shadcn registry             |
| `storybook`      | HTTP `http://localhost:6006/mcp`, served by `@storybook/addon-mcp` while `npm run storybook` runs | story docs, previews, story-test runs for the agent |
| `figma-console`  | `npx -y figma-console-mcp@latest`; authenticates with a Figma personal access token (see below) | optional REST/console bridge (variable probes); Plugin MCP is the default channel and needs no token |

**Figma token for `figma-console`** (skip this if you only use the Plugin MCP):

1. In Figma: account menu → *Settings* → *Security* → *Personal access tokens* → *Generate new token*.
   Scopes: *File content: Read* and *Variables: Read* (add *Variables: Write* only if the console bridge
   should write variables). Figma shows the token once — copy it right away.
2. Paste it into `.mcp.json` as the value of `mcpServers.figma-console.env.FIGMA_ACCESS_TOKEN`
   (the placeholder `<your Figma personal access token>` in the example file marks the spot).

Never commit `.mcp.json` with a token in it — the file is git-ignored for that reason. After editing,
restart Claude Code or run `/mcp` to reconnect.

## Figma

The design system lives in the Figma file **[Agentport DS](https://www.figma.com/design/ejFKo4MNuvC9TSDKOCUvyq/Agentport-DS?node-id=3126-2)**
(view access via link). Component sets live on the page `Shadcn Components` (`3126:2`). The token
layer (`libs/ui/src/styles/tokens.css`) is exported from its four variable collections: `reference`
(primitives → `--ap-color-*`, `--ap-font-*`, `--ap-effect-*`, `--ap-dimension-*`), `semantic` (color),
`semantic-dimension` (radius/spacing) and `semantic-typo` (typography) → `--ap-sys-*`. Components bind
color and dimension variables directly and typography through the text styles (`Display` … `Kbd`), which
mirror `semantic-typo`. Names and node IDs are documented in
`design-docs/design-system/tokens-reference.md` and `components-reference.md`.

The skills read the file through `.claude/skills/shadcn-component-port/config.json` and
`.claude/skills/component-sync/config.json` (`figma.fileKey`, `figma.pageId`). To run the pipeline
against it, open the file in Figma Desktop with the MCP plugin enabled and confirm the link with
`/figma-status`; writes go through your own Figma login, view access alone is not enough. To work on
a copy of the file, duplicate it in Figma (node IDs survive duplication) and change the two
`fileKey` values.

## Adding a component

```bash
npm run ui:add -- popover
```

`ui:add` writes the shadcn source *flat* (`libs/ui/src/components/ui/popover.tsx`). Move it into its
folder, add the barrel, re-export the folder in `libs/ui/src/index.ts`, then re-clothe it in the DS
tokens — or run `/shadcn-component-port popover` and let the skill do all of that against Figma
(see *Working with the agent*).

## Tech stack

Nx 22 · React 19 · TypeScript · Vite 8 · Tailwind v4 (CSS-first `@theme`) · shadcn/ui (style
`radix-nova`, Radix UI) · Storybook 10 (react-vite, addon-docs, addon-a11y, addon-vitest,
addon-mcp, pseudo-states) · Vitest 4 (jsdom + Playwright/Chromium) · Remix Icon · Hanken Grotesk +
Geist Mono (fontsource)
