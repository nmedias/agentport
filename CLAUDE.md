# CLAUDE.md

## Project

**agentport** — a shadcn/ui component library (**Agentport DS**) re-clothed in its own token layer and
built through an agent-driven Figma ↔ code pipeline. This repo is **frontend UI only**: React +
shadcn/ui + Tailwind in an Nx workspace, no app shell, no backend, no live data. Storybook is the
product surface; every component ships with stories that double as browser tests.

## Pipeline (design ↔ code)

```
1. Port     /shadcn-component-port   shadcn anatomy (MCP) → token-bound Figma set → code on DS utilities
2. Sync     /component-sync          Figma change → read live bindings → diff → apply to code (Figma read-only)
3. Prove    npm run check            lint + jsdom specs + story tests in Chromium (+ axe) + typecheck
```

## Stack

- **Nx monorepo** — one project: `libs/ui` (`@agentport/ui`). shadcn internals use the `@/` alias
  (→ `libs/ui/src`).
- **shadcn/ui** (Radix + Tailwind v4), `libs/ui/components.json` style `radix-nova` — the base, not a
  ceiling; custom components build on the **same tokens**. Never run `shadcn init` again.
- React 19, TypeScript, Vite 8, Tailwind v4, Storybook 10, Vitest 4, Playwright, Changesets.

## Commands

```
npm run storybook                 # components in isolation (port 6006) — the entry point
npm run check                     # lint + test + typecheck — THE GATE (test/lint alone don't typecheck)
npm run test:unit                 # jsdom .spec units (@agentport/ui project)
npm run test:stories              # stories as browser tests (storybook project → Chromium + axe)
npm run shoot -- <storyId>        # screenshot a story from a RUNNING Storybook → tools/screenshots/
npm run ui:add -- <component>     # add a shadcn component source into libs/ui (writes flat — see below)
```

Visual verification: `npm run shoot -- <storyId>` drives headless Chromium over a running Storybook;
look at the PNG yourself. `SELECTOR=.docblock-argstable` crops to one element.

## Repo structure / key files

```
libs/ui/            @agentport/ui — shadcn primitives + DS token layer + Storybook docs
agent-runs/         component-port / component-sync run notes (one folder per run, dated)
design-docs/   design-system/tokens-reference.md (token crosswalk — data source for the skills)
                    design-system/components-reference.md (component catalog: Figma set/node IDs + code location)
                    token-analysis-*.md (how the token system was derived)
tools/              shoot-stories.mjs
```

- **One folder per component:** `libs/ui/src/components/ui/<name>/` holds `<name>.tsx` +
  `.stories.tsx` + `.spec.tsx` + `index.ts`. `ui:add` writes **flat** — move it into its folder, add
  the barrel, re-export in `libs/ui/src/index.ts` (shadcn won't).
- `libs/ui/src/styles/globals.css` is the single seam for the Figma semantics: `tokens.css` (export)
  → `tw-theme.css` (@theme bridge) + `tw-utilities.css` (DS @utility classes) + `tw-variants.css`.
- `libs/ui/src/blocks/` is the blocks layer (organisms) — structure only, nothing ported yet.
- `handoff-component-port-open.md` — resume doc for the port strand: open items + consolidated skill
  findings.
- Read `components-reference.md` first to locate a component before a port/sync; update it after
  every code ↔ Figma sync (node IDs, variant axes, `figma_synced`, dated note).

## Figma

- The skills read/build in the file configured in `.claude/skills/{shadcn-component-port,component-sync}/config.json`
  (`figma.fileKey` — placeholder until you enter your own file). Components page: `Shadcn Components`.
- **Figma Plugin MCP only** by default; `figma-console` only when explicitly requested.
- **Never detach** instances without an explicit request. Use components through their intended APIs
  (slots, properties, auto layout); no structural changes to instances.
- DS artefacts stay factual: Storybook intro/docs describe only what ships.

## Commit style

`<type>(<scope>): <description>` — English, no trailers. Types: `feat`, `fix`, `refine`, `refactor`,
`docs`, `chore`. Scopes: `(ui)`, `(tokens)`, `(figma)`, or omit.

## Branch workflow

Work on `<type>/<topic>` branches; integrate into `main` with `git merge --ff-only`. Push/merge only
when asked.

## Skills

Project-local under `.claude/skills/` (writing rules: `.claude/skills/CLAUDE.md`):

- `/shadcn-component-port` — first-time port of one shadcn component (Figma set + code).
- `/component-sync` — reconcile a built component after a Figma change (Figma → code).
- `/docgen-props` — annotate a component so react-docgen exposes its prop API.
- `/storybook-rules` — author/update a component's `.stories.tsx` to the house pattern.
- `/figma-build-rules`, `/figma-create-section`, `/figma-verify`, `/figma-status` — Figma build craft + checks.
- `/skill-feedback [on|off]` — capture skill-improvement findings during a run.
- `/handoff` — freeze the session into a resume doc.
