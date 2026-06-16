# CLAUDE.md

## Project

**Agentport** — internal **Tauri desktop ECM app** (Windows/macOS) for the vendor
consulting/pre-sales/support: connect to ECM systems, browse and edit their schema, run
SQL queries. *(That's the product context — the Tauri shell, Rust backend, and data layer are
built elsewhere.)*

**This repo delivers the frontend UI only.** Two strands:

1. **Design** — redesign the Agentport in Figma (Sketch → Design-Punk exploration → token system).
2. **Code** — implement the resulting designs as the **shadcn/ui + Tailwind UI layer** (React) in
   the Nx monorepo here (`apps/` + `libs/`). **No** Tauri shell, no backend, no live data wiring —
   states are driven by mock/static data.

Brief / design direction: [`Agentport/design-direction.md`](Agentport/design-direction.md) (+ product
description `Agentport/produktbeschreibung-standalone.html`). 

## The Pipeline (design → code)

```
1. Design exploration in Figma              /sketch-jammer (structure) → /design-punk (visual language)
2. Token/Component consolidation in Figma   free Design-Punk designs → Variables: Primitives + Semantics; Components
3. Code in the Nx monorepo                  shadcn init → globals.css ← Figma semantics → build components
```

## Stack

- **Scope: frontend UI only** — React + shadcn/ui + Tailwind. No Tauri/Rust, no backend, no live
  data integration; build UI states against mock/static data.
- **Nx monorepo** — `apps/agentport` (React + Vite harness) + `libs/ui` (`@agentport/ui`).
- **shadcn/ui** (Radix + Tailwind v4) — the component base, **not a ceiling**: the Agentport's
  signature moves go beyond stock shadcn. Custom components build on the **same tokens**.
- Tooling: React 19, TypeScript, Vite, Tailwind v4, Storybook, Vitest, Playwright, tsx, Changesets.

## Commands

Full table in [`README.md`](./README.md). Essentials:

```
npm run dev                       # app at http://localhost:4200
npm run storybook                 # components in isolation (@agentport/ui)
npm run check                     # lint + test + typecheck — THE GATE (test/lint alone don't typecheck)
npm run test:unit                 # jsdom .spec units only (@agentport/ui project)
npm run test:stories              # stories as browser tests (storybook project → Chromium + axe a11y)
npm run shoot -- <storyId>        # screenshot a story from a RUNNING Storybook → tools/screenshots/
npm run ui:add -- <component>     # add a shadcn component into libs/ui
```

### Testing = two Vitest projects under one `npm run test`:
  - @agentport/ui — jsdom .spec units
  - storybook    — every story rendered in Chromium (@storybook/addon-vitest) + axe a11y
A story that throws/regresses fails the gate. `test:unit` / `test:stories` scope to one project.

### Visual verification: 
`npm run shoot -- <storyId> …` drives headless Chromium over a RUNNING
Storybook → PNGs in tools/screenshots; Claude eyeballs the render itself.
SELECTOR=.docblock-argstable crops to one element. Start `npm run storybook` first.


## shadcn Gotchas

- `npx shadcn add <component>` re-imports components under their **original names** (no auto-rename).
  Apply a one-time find&replace, or use an alias for new components — decide once and stay consistent.
- shadcn/ui has **no** official Figma kit with Variables — the Figma token system is built manually.


## Repo Structure / Key Files

```
apps/agentport/       React + Vite app — composes UI states against mock data (port 4200)
libs/ui/            @agentport/ui — shadcn primitives + signature components, globals.css token layer
Agentport/            Brief + roadmaps + design direction
design-docs/   Machine-readable DS data (e.g. design-system/tokens-reference.md)
agent-runs/         Sketch / Design-Punk / component-port run notes (per direction + rationale)
tools/              shoot-stories.mjs — Playwright screenshots of running Storybook (visual verify)
```

- The app consumes the lib via `@agentport/ui`; shadcn internals use the `@/` alias (→ `libs/ui/src`).
- **One folder per component:** `libs/ui/src/components/ui/<name>/` holds `<name>.tsx` +
  `.stories.tsx` + `.spec.tsx` + a barrel `index.ts`. `ui:add` writes **flat**
  (`components/ui/<name>.tsx`) — move it into its folder, add the barrel, then re-export the folder
  in `libs/ui/src/index.ts` (shadcn won't).
- `globals.css` (`libs/ui/src/styles/`) is the single entry/seam for the Figma "Agentport DS"
  semantics — internally split into `tw-theme.css` (@theme bridge), `tw-utilities.css` (DS
  @utility classes) and `tw-variants.css` (@custom-variant plumbing), all imported by `globals.css`.

- `handoff-agentport-design-visual.md` — **design reference** (not an active to-do): the locked visual
  language + the decided Explorer component designs (Figma node IDs, exploration file
  `FIGMA_EXPLORATION_FILE_KEY`). The `blocks/` organisms orient on it; Design-Punk 3e/Phase 4 are shelved.
- `Agentport/Design-Punk-Roadmap.md` / `Agentport/Sketch-Roadmap.md` — phase + decision logs (Figma IDs).
- `handoff-component-port-open.md` — **resume doc** for the code strand: open items + the
  consolidated skill findings from the port runs. Component locations/status live in the
  components-reference catalog below.
- `design-docs/design-system/tokens-reference.md` — the machine-readable token crosswalk; data source for
  `/shadcn-component-port` + `/component-sync`.
- `design-docs/design-system/components-reference.md` — the machine-readable **component catalog**:
  which components are ported + their status, and where each lives in Figma (set/node IDs) and code
  (folder/exports/barrel). Read first to locate an existing component before a port/sync.

## Figma

- **File:** "Agentport DS", fileKey `FIGMA_FILE_KEY` (design-system / token work).
  The exploration file "Agentport" (`FIGMA_EXPLORATION_FILE_KEY`) is referenced in the handoffs.
- **Figma Plugin MCP only.** Use Figma Console MCP only when explicitly requested.
- **Never detach** instances without an explicit user request.
- Use components through their intended APIs: **Slots**, **Properties** (text/variant/boolean),
  **Auto Layout**. No structural changes to instances (no child add/remove except via slots).


## Commit Style

`<type>(<scope>): <description>` — always **English**, no `Co-Authored-By` trailer.

| Type       | Usage                                   |
|------------|-----------------------------------------|
| `feat`     | New design artefact, component, feature |
| `fix`      | Correct a wrong value / reference       |
| `refine`   | Improve, tweak, adjust existing work    |
| `refactor` | Restructure (move, rename, split)       |
| `docs`     | README, handoff, roadmap, notes         |
| `chore`    | Skills, config, tooling                 |

Scopes: `(figma)` = Figma only, `(tokens)`, or the app/lib name; omit = general.

## Branch Workflow

- **Never commit directly to `master`.** Do the work on a feature branch named `<type>/<topic>`
  (e.g. `feat/shadcn-kbd-port`, `fix/font-loading`) — same `<type>` vocabulary as commits.
- **Integrate via fast-forward.** When done, `git checkout master && git merge --ff-only <branch>` —
  keeps history linear, no merge commit. A rebase is a no-op while `master` hasn't diverged (it usually
  hasn't in this solo repo), so prefer the fast-forward; only rebase if `master` actually moved ahead.
- **Push / merge only when the user asks.** Branching and local commits are fine to do proactively;
  pushing and integrating into `master` are not.

## Skills

Installed under `.claude/skills/` (project-local).

**Figma Design:**
- `/sketch-jammer` — low-fi structural sketch of a component/composition/flow (2–3 anatomies).
- `/design-punk` — bold hi-fi visual redesign of one existing component (fights AI design slop).
- `/creative-spark` — break out of median/safe options when an exploration is drifting.
- `/sketch-rules` — resolves Sketching-System library entities for `/sketch-jammer`.
- `/slop-check` — audit a Figma node for generic AI-design tells before handoff.

**Design → Code:**
- `/shadcn-component-port` — **initial** port of one shadcn component into the Agentport DS: read its
  anatomy (shadcn MCP / `ui:add`), build a token-bound Figma component set, write the code on the DS
  utility vocabulary. First-time creation only.
- `/component-sync` — reconcile an **already-built** component after a Figma change: read the live
  per-variant token bindings, diff against the code, apply the delta (**Figma → code**, read-only on
  Figma). Source-agnostic (not shadcn-bound).
- Both share the data source `design-docs/design-system/tokens-reference.md`.

**Figma helpers:**
- `/figma-status` — check Figma Desktop + Plugin MCP connection.
- `/figma-clone-sibling` — clone a node into a permanent sibling Section.
- `/figma-create-section` — create figma section. Canonical Section wrapper. 
- `/figma-verify` — deterministic pre-handoff check (icons are vectors, no clipping/overlap).

**General utils:**
- `/grill-me` — interview-style stress-test of a plan or design before committing.
- `/handoff` — freeze the session into a resume doc.
- `/skill-feedback` — toggle on **before a run** to capture skill-improvement feedback (gaps + candidate
  fixes) into that run's `skill-feedback.md` as findings surface. Feedback only, not domain notes.
- `/react-coach` — React coaching mode (mental models · patterns · ecosystem · architecture) for an
  Angular/Vue dev learning React; explains/mentors, not for quick code-only asks.

**Writing/editing skills:** follow the rules in [`.claude/skills/CLAUDE.md`](.claude/skills/CLAUDE.md)

> **Always run design agents via the skill — never spawn the agent ad-hoc.** Run every
> Design-Punk / Sketch-Jammer job through `/design-punk` / `/sketch-jammer` and
> follow its steps; don't spawn the `design-punk`/`sketch-jammer` agent directly
> via the Agent tool.
