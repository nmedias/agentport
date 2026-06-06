---
name: component-sync
description: "Reconcile an already-built DS component with its Figma component set after a Figma change — read the live per-variant token bindings, diff against the current code's DS utilities, and apply the delta (Figma → code). Trigger when a component already exists in libs/ui AND its Figma set changed (a swapped text style, recoloured state, adjusted radius/padding) and the code must catch up. Not first-time creation (use /shadcn-component-port) and not visual redesign (/design-punk)."
---

# Component Sync (Figma → Code)

Reconcile one **already-built** component with its Figma set: read the live token bindings per
variant, diff against the code, apply **only the delta**. Figma → code only, token-faithful.
**Source-agnostic** — works for any DS component, not just shadcn ports.

## Input

```
component: name of an existing component — needs BOTH components/ui/<name>/ AND a Figma set .<Component>   REQUIRED
```

No Figma set yet, or no code yet → wrong skill (first-time build → `/shadcn-component-port`).

## Data source

`design-docs/design-system/tokens-reference.md` — Figma var ↔ CSS var ↔ utility ↔ value ↔
`use`/`avoid`; §6 = the translation rules. Don't duplicate values here.

## Figma rules

Plugin MCP only (`mcp__plugin_figma_figma__*`); load `/figma:figma-use` before any `use_figma`.
**Read-only** — never write to Figma (a push is out of scope). File `FIGMA_FILE_KEY` (`config.json`).

## Process

```
S1 Locate   resolve the set .<Component> by NAME + the code file components/ui/<name>/<name>.tsx
S2 Read     live per-member bindings/values (snippets/read-set-values.js): fills/strokes/text-style/radius/padding/effect/opacity
S3 Diff     map live values → DS utilities (tokens-reference §6), compare to the current class strings → delta list
S4 Apply    edit the code to the delta only (+ stories/spec if a variant/state was added/removed); token-faithful
S5 Gate     nx test|typecheck|lint @agentport/ui green; DS typo class survives markup; storybook MCP up (:6006) → preview-stories, surface URLs
```

### S1 — Locate

- Figma: resolve the set **by name** — `search_design_system` for `.<Component>`, or read the
  `Components` page and match the `COMPONENT_SET` named `.<Component>`. Capture its node id for S2.
- Code: `libs/ui/src/components/ui/<name>/<name>.tsx` (the edit target) + its `.stories.tsx` / `.spec.tsx`.

### S2 — Read live values

Run `snippets/read-set-values.js` (read-only). Per member: name, fills/strokes (+ bound variable
name), the text node's text-style + fill, bound radius/padding, effects (focus/invalid rings), node
opacity, w/h. This is the current Figma truth.

### S3 — Diff

Translate each member's live values back to DS utilities via §6 — **token by `use`/`avoid`, not
value-match** — and compare against the matching class strings in the code. List **only what differs**:
e.g. text-style Label↔Body ⇒ `text-label`↔`text-body`, a re-bound stroke ⇒ `border-*` swap, changed
radius/padding ⇒ `rounded-*`/`p-*` step, added state ⇒ new variant. Ignore Figma-only helper layers.

### S4 — Apply

Edit `<name>.tsx` to the delta, token-faithful — **no opportunistic rewrites**. If the set gained/lost
a variant or state, mirror it in `.stories.tsx` (+ a `.spec.tsx` guard if relevant). Keep the
structure; change only what the diff demands.

### S5 — Gate

`npx nx test|typecheck|lint @agentport/ui` green; confirm the DS typography class still survives the
rendered markup (twMerge drops it otherwise). If the `storybook` MCP is up (:6006), `preview-stories`
and surface every URL to the user for visual confirmation.

## Red flags

| Trap | Reality |
|---|---|
| Write the change back into Figma | Out of scope — sync is **Figma → code** only. A push/redesign is `/shadcn-component-port` or `/design-punk`. |
| Rewrite beyond the delta | Apply only what differs; opportunistic refactors hide the real change and risk regressions. |
| Match a value, ignore the role | Re-pick by the new binding's `use`/`avoid` (§6) — a same-value token can mean a different role. |

## Boundaries

- One component per run, **Figma → code only**. First-time build → `/shadcn-component-port`; visual
  redesign → `/design-punk`; code → Figma push is out of scope.
- Token-faithful: change only what the Figma delta demands.
