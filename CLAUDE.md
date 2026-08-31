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

## shadcn Gotchas

- `npx shadcn add <component>` re-imports components under their **original names** (no auto-rename).
  Apply a one-time find&replace, or use an alias for new components — decide once and stay consistent.
- shadcn/ui has **no** official Figma kit with Variables — the Figma token system is built manually.

## Repo Structure / Key Files

```
libs/ui/            @agentport/ui — shadcn primitives + DS token layer (globals.css) + Storybook docs
  src/components/ui/<name>/   one folder per component (.tsx + .stories.tsx + .spec.tsx + index.ts)
  src/blocks/                 blocks layer (organisms) — structure only, nothing ported yet
  src/docs/                   Storybook Introduction + Foundations pages
  src/styles/                 tokens.css (Figma export) + tw-theme / tw-utilities / tw-variants
agent-runs/         component-port / component-sync run notes (one dated folder per run)
design-docs/        Machine-readable DS data: design-system/tokens-reference.md,
                    design-system/components-reference.md, token-analysis-*.md
tools/              shoot-stories.mjs — Playwright screenshots of a running Storybook (visual verify)
```

- shadcn internals use the `@/` alias (→ `libs/ui/src`); consumers import from `@agentport/ui`.
- **One folder per component:** `libs/ui/src/components/ui/<name>/` holds `<name>.tsx` +
  `.stories.tsx` + `.spec.tsx` + a barrel `index.ts`. `ui:add` writes **flat**
  (`components/ui/<name>.tsx`) — move it into its folder, add the barrel, then re-export the folder
  in `libs/ui/src/index.ts` (shadcn won't).
- `globals.css` (`libs/ui/src/styles/`) is the single entry/seam for the Figma "Agentport DS"
  semantics — internally split into `tw-theme.css` (@theme bridge), `tw-utilities.css` (DS
  @utility classes) and `tw-variants.css` (@custom-variant plumbing), all imported by `globals.css`.
- `handoff-component-port-open.md` — **resume doc** for the port strand: open items + the
  consolidated skill findings from the port runs. Component locations/status live in the
  components-reference catalog below.
- `design-docs/design-system/tokens-reference.md` — the machine-readable token crosswalk; data source
  for `/shadcn-component-port` + `/component-sync`.
- `design-docs/design-system/components-reference.md` — the machine-readable **component catalog**:
  which components are ported + their status, and where each lives in Figma (set/node IDs) and code
  (folder/exports/barrel). Read first to locate an existing component before a port/sync.

## Figma

- **File:** "Agentport DS", fileKey `ejFKo4MNuvC9TSDKOCUvyq`, configured in
  `.claude/skills/{shadcn-component-port,component-sync}/config.json` (`figma.fileKey`, `figma.pageId`).
  Components page: `Shadcn Components` (`3126:2`); variable collections `reference` (primitives),
  `semantic` (color), `semantic-dimension`, `semantic-typo` — components bind color/dimension directly,
  typography via text styles. The file is view-shared via link — nothing product- or
  customer-specific belongs in it (layer names, text content, variable descriptions included).
- **Figma Plugin MCP only.** Use Figma Console MCP only when explicitly requested.
- **Never detach** instances without an explicit user request.
- Use components through their intended APIs: **Slots**, **Properties** (text/variant/boolean),
  **Auto Layout**. No structural changes to instances (no child add/remove except via slots).
- **After a code↔Figma sync (either direction):** update the `components-reference.md` catalog (node IDs,
  variant axes/values, `figma_synced`, dated note) — the read-first source of truth for Figma IDs. If the
  Figma side changed (code→Figma push/build — new variant, swapped glyph, retuned binding), also run
  `/figma-verify`, `CLEAN` before handoff; Figma→code (`/component-sync`) is Figma-read-only, so the green
  gate is the check.
- DS artefacts stay factual: Storybook intro/docs describe only what ships.

## Commit Style

`<type>(<scope>): <description>` — always **English**, no `Co-Authored-By` trailer.

| Type       | Usage                                   |
|------------|-----------------------------------------|
| `feat`     | New design artefact, component, feature |
| `fix`      | Correct a wrong value / reference       |
| `refine`   | Improve, tweak, adjust existing work    |
| `refactor` | Restructure (move, rename, split)       |
| `docs`     | README, handoff, run notes              |
| `chore`    | Skills, config, tooling                 |

Scopes: `(figma)` = Figma only, `(tokens)`, `(ui)` = the lib; omit = general.

## Branch Workflow

- **Never commit directly to `master`.** Do the work on a feature branch named `<type>/<topic>`
  (e.g. `feat/shadcn-kbd-port`, `fix/font-loading`) — same `<type>` vocabulary as commits.
- **Integrate via fast-forward.** When done, `git checkout master && git merge --ff-only <branch>` —
  keeps history linear, no merge commit. A rebase is a no-op while `master` hasn't diverged (it usually
  hasn't in a solo repo), so prefer the fast-forward; only rebase if `master` actually moved ahead.
- **Push / merge only when the user asks.** Branching and local commits are fine to do proactively;
  pushing and integrating into `master` are not.

## Skills

Project-local under `.claude/skills/` (writing rules: `.claude/skills/CLAUDE.md`):

- `/shadcn-component-port` — first-time port of one shadcn component (Figma set + code).
- `/component-sync` — reconcile a built component after a Figma change (Figma → code).
- `/docgen-props` — annotate a component so react-docgen exposes its prop API.
- `/storybook-rules` — author/update a component's `.stories.tsx` to the house pattern.
- `/figma-build-rules`, `/figma-create-section`, `/figma-verify`, `/figma-status` — Figma build craft + checks.
- `/skill-feedback [on|off]` — capture skill-improvement findings during a run.
- `/handoff` — freeze the session into a resume doc.
