---
name: ds-usage
description: "Use when building or changing UI that consumes the DS library `@agentport/ui` — a screen, form, dialog, settings section, list, status display or any JSX that renders controls — before writing the markup. Not for porting or syncing a DS component itself (/shadcn-component-port, /component-sync)."
---

# DS Usage (build UI from the DS)

Build every UI need from the DS: map need → DS entry by **purpose**, then copy the entry's own
composition. The references are the source of truth; this skill is only the lookup order.

## Sources

| Question | Source |
|---|---|
| Which component serves this purpose? Which names exist? | `design-docs/design-system/components-reference.md` — per entry `description` (purpose) + `code.exports` (importable names) |
| How is it composed, which props? | the story files listed in the entry's `code.stories` (`libs/ui/src/components/ui/<name>/`) |
| Which colour / typography / spacing / radius utility? | `design-docs/design-system/tokens-reference.md` |

## Procedure

```
1. decompose  → list the UI needs: each control, its adornments (leading/trailing icon, inline
                action, text), each container/region, each feedback or status element
2. map        → per need: search the reference's description fields for the ROLE, not for a
                component name you expect → candidate entry
3. compose    → open the candidate's stories; copy the composition (part nesting, labelling,
                props) — before any styling lookup
4. style      → only what the composition leaves open, only utilities from the token reference
5. no entry   → compose from DS parts + token utilities; name the gap in your reply
6. check      → every import from @agentport/ui ∈ some entry's code.exports
                every need from step 1 → an entry, or reported as a gap
```

## Common mistakes

| Mistake | Instead |
|---|---|
| Styling lookup first, component lookup later (or never) | Steps 2–3 before step 4 |
| Searching for a name the component "usually" has in other libraries | Search the purpose; import only names in `code.exports` |
| A native element + custom CSS for an adornment inside a field | Map the adornment as its own need (step 1) — the reference usually has a composition for it |
| Arbitrary values (`[12px]`) or inline `style` | Token utilities; a missing token is a gap to report |
