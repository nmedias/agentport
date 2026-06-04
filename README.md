# agentport

Workspace for the **Agentport redesign** — a fresh Nx monorepo plus the Figma design
artefacts, run notes, and handoffs for the redesign work. See [`CLAUDE.md`](./CLAUDE.md) for
the working setup, design workflow, and key files.

## Structure

```
apps/        Nx applications (empty — add as needed)
libs/        Nx libraries (empty — add as needed)
Agentport/     Redesign roadmaps + design direction
agent-runs/  Sketch / Design-Punk run notes
```

> The B2B design-system specs and docs site (Astro + Starlight) live in the separate
> [`<owner>/design-system`](https://github.com/<owner>/design-system) repo.

## Getting Started

```bash
npm install
npx nx show projects   # currently empty — scaffold an app/lib to begin
```

## Tech Stack

- **Nx** — Monorepo management
- **Changesets** — Versioning (configured under `.changeset/`)
- **Figma** — Design implementation (Plugin MCP)
