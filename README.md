# agentport

Workspace for the **Agentport redesign** — an Nx monorepo delivering the **frontend UI layer**
(React + shadcn/ui + Tailwind) alongside the Figma design artefacts, run notes, and handoffs.

Scope is **UI only**: no Tauri shell, no backend, no live data — states are built against mock/static
data. See [`CLAUDE.md`](./CLAUDE.md) for the full product context, design pipeline, and key files.

## Structure

```
apps/
  agentport/        React + Vite app — harness that composes UI states (port 4200)
libs/
  ui/             @agentport/ui — shadcn primitives + Agentport signature components
                  ├─ src/components/ui/   shadcn components (e.g. button)
                  ├─ src/styles/globals.css   Tailwind v4 + the design-token layer
                  ├─ src/lib/utils.ts     cn() helper
                  └─ .storybook/          component states in isolation (+ browser story tests)
Agentport/          Redesign roadmaps + design direction
agent-runs/       Sketch / Design-Punk run notes
tools/            shoot-stories.mjs — Playwright screenshots of running Storybook (visual verify)
components.json   shadcn config (monorepo: @/ → libs/ui/src)
```

Two projects: `agentport` (app) and `@agentport/ui` (lib). The app consumes the lib through its public
API `@agentport/ui`; shadcn internals use the `@/` alias (→ `libs/ui/src`).

## Getting Started

```bash
npm install
npm run dev          # start the app at http://localhost:4200
npm run storybook    # browse components in isolation
```

## Scripts

| Script                     | What it runs                                                         |
|----------------------------|----------------------------------------------------------------------|
| `npm run dev`              | App dev server (`nx dev agentport`, port 4200)                         |
| `npm run build`            | App production build                                                 |
| `npm run preview`          | Preview the production build locally                                 |
| `npm test`                 | All tests — jsdom unit + browser story tests (`nx run-many -t test`) |
| `npm run test:unit`        | Unit specs only, jsdom (`@agentport/ui` Vitest project)               |
| `npm run test:stories`     | Storybook stories as browser tests (Playwright/Chromium)             |
| `npm run lint`             | Lint all projects                                                    |
| `npm run typecheck`        | TypeScript typecheck all projects                                    |
| `npm run check`            | lint + test + typecheck (the CI gate)                                |
| `npm run storybook`        | Storybook dev server for `@agentport/ui`                              |
| `npm run build-storybook`  | Build Storybook static site                                          |
| `npm run shoot -- <id>`    | Screenshot a story from running Storybook (visual check)             |
| `npm run ui:add -- <name>` | Add a shadcn component into `libs/ui`                                |
| `npm run graph`            | Open the Nx project graph                                            |
| `npm run sync`             | Sync tsconfig project references                                     |
| `npm run reset`            | Reset the Nx cache / daemon                                          |

You can always call Nx directly: `npx nx <target> <project>` (e.g. `npx nx test @agentport/ui`).

## Adding shadcn components

```bash
npm run ui:add -- button input dialog
```

Components land in `libs/ui/src/components/ui/`. shadcn does **not** re-export them — add the export to
`libs/ui/src/index.ts` so the app can import from `@agentport/ui`. (shadcn re-imports under original
names; see the gotchas in [`CLAUDE.md`](./CLAUDE.md).)


## Tech Stack

- **Nx** — monorepo management (targets inferred from plugins in `nx.json`)
- **React 19 + Vite** — app and lib bundling
- **Tailwind v4** — CSS-first, tokens via `@theme` in `globals.css`
- **shadcn/ui** — component base (Radix + Tailwind)
- **Storybook** — component states in isolation (on `@agentport/ui`); stories double as browser tests
- **Vitest** — two projects: unit specs (jsdom) + Storybook stories as browser tests (`@storybook/addon-vitest`)
- **Playwright** — browser engine for the story tests + `npm run shoot` screenshots (visual verification)
- **addon-a11y** — axe accessibility checks on every story (currently `test: 'todo'` — reports, doesn't fail)
- **Changesets** — versioning (CLI installed; run `npx changeset init` to set up)
- **Figma** — design source (Plugin MCP)
