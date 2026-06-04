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
1. Design exploration in Figma   /sketch-jammer (structure) → /design-punk (visual language)
2. Token consolidation in Figma  free Design-Punk designs → Variables: Primitives + Semantics
3. Code in the Nx monorepo       shadcn init → globals.css ← Figma semantics → build components
```

## Stack

- **Scope: frontend UI only** — React + shadcn/ui + Tailwind. No Tauri/Rust, no backend, no live
  data integration; build UI states against mock/static data.
- **Nx monorepo** — `apps/*` + `libs/*` workspaces (currently empty; scaffold as needed).
- **shadcn/ui** (Radix + Tailwind) — the component base, **not a ceiling**: the Agentport's
  signature moves go beyond stock shadcn. Custom components build on the **same tokens**.
- Tooling: React, TypeScript, tsx, Changesets.


## shadcn Gotchas

- `npx shadcn add <component>` re-imports components under their **original names** (no auto-rename).
  Apply a one-time find&replace, or use an alias for new components — decide once and stay consistent.
- shadcn/ui has **no** official Figma kit with Variables — the Figma token system is built manually.


## Repo Structure / Key Files

```
apps/        Nx applications (empty)
libs/        Nx libraries (empty)
Agentport/     Brief + roadmaps + design direction
agent-runs/  Sketch / Design-Punk run notes (per chosen direction + rationale)
```

- `handoff-agentport-design-visual.md` — **current resume doc** for the design strand (Design-Punk
  phase state, chosen directions, Figma node IDs, locked language). Read first to continue design.
- `handoff-agentport-design.md` — earlier handoff (Sketch → Hi-Fi; full sketch inventory).
- `Agentport/Design-Punk-Roadmap.md` / `Agentport/Sketch-Roadmap.md` — phase + decision logs (Figma IDs).

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

## Skills

Installed under `.claude/skills/` (project-local).

**Figma Design:**
- `/sketch-jammer` — low-fi structural sketch of a component/composition/flow (2–3 anatomies).
- `/design-punk` — bold hi-fi visual redesign of one existing component (fights AI design slop).
- `/creative-spark` — break out of median/safe options when an exploration is drifting.
- `/sketch-rules` — resolves Sketching-System library entities for `/sketch-jammer`.
- `/slop-check` — audit a Figma node for generic AI-design tells before handoff.

**Figma helpers:**
- `/figma-status` — check Figma Desktop + Plugin MCP connection.
- `/figma-clone-sibling` — clone a node into a permanent sibling Section.
- `/figma-create-section` — internal sub-skill: canonical Section wrapper. Not user-invocable.
- `/figma-verify` — deterministic pre-handoff check (icons are vectors, no clipping/overlap).

**General utils:**
- `/grill-me` — interview-style stress-test of a plan or design before committing.
- `/handoff` — freeze the session into a resume doc.

**Writing/editing skills:** follow the rules in [`.claude/skills/CLAUDE.md`](.claude/skills/CLAUDE.md)

> **Always run design agents via the skill — never spawn the agent ad-hoc.** Run every
> Design-Punk / Sketch-Jammer job through `/design-punk` / `/sketch-jammer` and
> follow its steps; don't spawn the `design-punk`/`sketch-jammer` agent directly
> via the Agent tool.
