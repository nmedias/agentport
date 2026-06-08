---
name: component-sync
description: "Reconcile an already-built DS component with its Figma component set after a Figma change — read the live per-variant token bindings, diff against the current code's DS utilities, and apply the delta (Figma → code). Trigger when a component already exists in libs/ui AND its Figma set changed (a swapped text style, recoloured state, adjusted radius/padding) and the code must catch up. Not first-time creation (use /shadcn-component-port) and not visual redesign (/design-punk)."
---

# Component Sync (Figma → Code)

Reconcile one **already-built** component with its Figma set: read the live token bindings per
variant, diff against the code, apply **only the delta**. Figma → code only, token-faithful.
**Source-agnostic** — works for any DS component, not just shadcn ports.

## Input / Output

```
in   component: name of an existing component — needs BOTH components/ui/<name>/ AND a Figma set .<Component>   REQUIRED
out  code delta on <name>.tsx (+ stories/spec); notes  agent-runs/component-sync/<date>-<component>/notes.md
```

No Figma set yet, or no code yet → wrong skill (first-time build → `/shadcn-component-port`).

## Data source

`design-docs/design-system/tokens-reference.md` — Figma var ↔ CSS var ↔ utility ↔ value ↔
`use`/`avoid`; §6 = stock→DS translation, §7 = auto-layout → utilities. Don't duplicate values here.

## Figma rules

Plugin MCP only (`mcp__plugin_figma_figma__*`); load `/figma:figma-use` before any `use_figma`.
**Read-only** — never write to Figma (a push is out of scope). File `FIGMA_FILE_KEY` (`config.json`).

## Process

```
S1 Locate   resolve the set .<Component> by NAME + the code file components/ui/<name>/<name>.tsx
S2 Read     live per-member bindings/values (snippets/read-set-values.js): fills/strokes/text-style/radius/padding/effect/opacity/auto-layout
S3 Diff     bound var → DS utility (§6 crosswalk, authoritative); use/avoid only for raw/wrong bindings → delta list
S4 Apply    edit the code to the delta only (+ stories/spec if a variant/state was added/removed); token-faithful
S5 Gate     nx test|typecheck|lint @agentport/ui green; DS typo class survives markup; storybook MCP up (:6006) → preview-stories, surface URLs
S6 Notes    delta + DEVIATIONS (code ≠ Figma binding) + auto-layout/variant changes → agent-runs notes.md
```

### S1 — Locate

- Figma: resolve the set **by name** — `search_design_system` for `.<Component>`, or read the
  components page (`config.json` `figma.pageId`) and match the `COMPONENT_SET` named `.<Component>`.
  Capture its node id for S2.
- Code: `libs/ui/src/components/ui/<name>/<name>.tsx` (the edit target) + its `.stories.tsx` / `.spec.tsx`.

### S2 — Read live values

Fill the snippet's `PAGE_ID` (`config.json` `figma.pageId`) + `SET_ID` (S1), then run
`snippets/read-set-values.js` (read-only). Per member: name, fills/strokes (+ bound variable
name), text node's text-style + fill, bound radius/padding, effects (focus/invalid rings), opacity,
w/h, **and auto-layout** — `layoutMode`, flex props (`itemSpacing` + bound var,
`primary/counterAxisAlignItems`) or grid props (`gridRow/ColumnCount`, `gridRow/ColumnGap`),
`layoutSizingH/V`. The **bound variable name is the authoritative token** (S3). This is the current
Figma truth.

### S3 — Diff

Translate each member's live values to DS utilities, compare to the code's class strings, list **only
what differs**. Two tiers, in order:

1. **Bound variable = authoritative.** Map its name 1:1 to the DS utility via the **§6–§7 crosswalk**
   (Figma var/property ↔ utility) — no role judgement, the binding is the answer. Applies to every bound
   property class (colour token, text-style, radius/padding/gap, auto-layout): a changed/re-bound
   value ⇒ the corresponding utility swap; an added/removed member ⇒ a variant change. The concrete
   mappings live in §6 — don't restate them here.
2. **`use`/`avoid` only on a defect.** Raw value (no bound token) ⇒ pick by role (§6). Binding that is
   semantically wrong (designer error) ⇒ flag it, don't silently propagate. Never re-judge a correct
   binding.

Ignore Figma-only helper layers.

### S4 — Apply

Edit `<name>.tsx` to the delta, token-faithful — **no opportunistic rewrites**. If the set gained/lost
a variant or state, mirror it in `.stories.tsx` (+ a `.spec.tsx` guard if relevant). Keep the
structure; change only what the diff demands.

### S5 — Gate

`npx nx test|typecheck|lint @agentport/ui` green; confirm the DS typography class still survives the
rendered markup (twMerge drops it otherwise). If the `storybook` MCP is up (:6006), `preview-stories`
and surface every URL to the user for visual confirmation.

### S6 — Notes

`agent-runs/component-sync/<date>-<component>/notes.md`: the applied delta (per member: Figma value →
code utility), gate state, preview URLs. **Deviations — prominent, the actionable part:** every place
the code does **not** match the literal Figma binding — a **raw value** tokenised by role (Figma has no
token → it should get one), or a **binding judged wrong** that was flagged, not propagated. Table:
`member · property · Figma says ↔ code uses · why`. Record **auto-layout** (layoutMode/align/gap/sizing)
and **variant** add/remove/restructure the same way, so the design-side fixes are auditable. A
delta-free, deviation-free run → one-line note is fine.

## Red flags

| Trap | Reality |
|---|---|
| Write the change back into Figma | Out of scope — sync is **Figma → code** only. A push/redesign is `/shadcn-component-port` or `/design-punk`. |
| Rewrite beyond the delta | Apply only what differs; opportunistic refactors hide the real change and risk regressions. |
| Re-judge a correct binding by `use`/`avoid` | A **bound** var is authoritative — map it 1:1 (§6 crosswalk). Role-picking is only for a **raw/unbound** value or to flag a wrong binding. |

## Boundaries

- One component per run, **Figma → code only**. First-time build → `/shadcn-component-port`; visual
  redesign → `/design-punk`; code → Figma push is out of scope.
- Token-faithful: change only what the Figma delta demands.
