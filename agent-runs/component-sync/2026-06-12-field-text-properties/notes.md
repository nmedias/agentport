# Sync note — Text-Property naming convention applied to the `.Field` family

**Date:** 2026-06-12
**Branch:** `refine/text-property-convention` (Figma-only edit; repo edits left uncommitted for review)
**File:** Agentport DS — `FIGMA_FILE_KEY`
**Access:** Figma Plugin MCP only (Console MCP was disconnected — not needed; task is Plugin-only).

## The convention (user directive — applies always; here to `.Field`)

Every Figma **TEXT component property** (and any children-driving text default) must follow:
- **Name = semantic/speaking** (`label`, `description`, `error`, `legend`, …) — **never** the generic `text`.
- **Value (default text) wrapped in curly brackets**: `{Label}` — semantic name, Capitalized.
- **Children-driven** (the text *is* the component's content, e.g. `.Label`): name gets a **`(children)` suffix** → `label (children)`, value `{Label}`.
- **Non-children** (a standalone TEXT property inside a larger component): name = semantic, value `{Semantic}`.
- **SLOT properties are NOT text properties** → never renamed by this convention (already semantic: label/control/description/error/legend). Slot text *defaults* (a plain TEXT node inside a slot, with empty `componentPropertyReferences`) are slot defaults, **not exposed TEXT properties** → left untouched.

## Headline result

**The convention was already fully satisfied across the entire `.Field` family — no rename was required.**
`.Label` had already been converted to `label (children)` / `{Label}` during its 2026-06-12 revision (predates this run). The other three components expose **no TEXT component properties at all** (only SLOTs + BOOLEAN + VARIANT). The run was therefore a verification + documentation pass, not an edit pass. The catalog had one stale line (`.Label` still listed as `text#3735:0`) — that was corrected.

## Per-component findings

### `.Label` — set `3735:1024`  ✅ already compliant
- **TEXT property:** `label (children)#3735:0`, type TEXT, defaultValue `{Label}`.
  - Text node `3734:1023` (default member `3734:1022`): node name `{Label}`, characters `{Label}`, bound via `componentPropertyReferences.characters = "label (children)#3735:0"`. Binding holds.
  - Disabled member `3735:1022` shares the same prop key.
- **Convention check:** name `label (children)` (children-suffix ✓, semantic ✓), value `{Label}` (curly + Capitalized ✓). The Label's text IS its children → `(children)` suffix is correct. **Matches the user's children example verbatim.**
- **No rename performed** — already correct (the brief's premise that it was still `text#3735:0` was stale).
- Verified by instantiating the default member: panel showed `label (children)#3735:0` → TEXT → `{Label}`. Test instance deleted.

### `.Field` — set `3716:1020`  ✅ no TEXT property (slots only)
- `componentPropertyDefinitions`: `label#3716:0` (SLOT), `control#3716:1` (SLOT), `description#3716:2` (SLOT), `error#3716:3` (SLOT), `Show description#3692:15` (BOOL), `Show error#3692:20` (BOOL), `orientation` (VARIANT), `invalid` (VARIANT). **Zero TEXT properties.**
- Slot text defaults inspected — all `componentPropertyReferences: {}` (slot defaults, not exposed TEXT props):
  - `description` slot default: plain TEXT "Choose a unique username." (`3712:1023`) → **slot default → left untouched** (slots ≠ text properties).
  - `error` slot default (invalid member `3713:1017`): plain TEXT "Enter a valid email address." (`3713:1026`) → **slot default → left untouched.**
  - `label` slot default = nested **`.Label` INSTANCE**; its visible text binds to the Label's own `label (children)` prop, not a Field-level property → nothing to rename here.
  - `control` slot default = nested **Input** instance.
- **Result:** nothing to apply. The convention reaches the label text transitively through the nested `.Label` (already compliant).

### `.FieldSet` — component `3739:1026`  ✅ no TEXT property (slots only)
- `componentPropertyDefinitions`: `legend#3741:0` (SLOT), `Slot#3692:26` (SLOT = the children/content slot holding the nested Fields). **Zero TEXT properties.**
- `legend` slot default: plain TEXT "Address" (`3741:1027`), `componentPropertyReferences: {}` → **slot default (Title text, text-format-title by role), NOT an exposed TEXT property → left untouched.** (Build history note: a redundant TEXT legend prop was already removed during the FieldSet build, leaving only the legend SLOT — finding #28.)
- All other texts are inside nested `.Label`/`Input` instances or `description` slot defaults.
- **Result:** nothing to apply (legend is a slot, per the directive's explicit carve-out).

### `.FieldGroup` — component `3742:1044`  ✅ no TEXT property (slots only) — as predicted
- `componentPropertyDefinitions`: `Slot#3692:25` (SLOT = children/content slot). **Zero TEXT properties.**
- All texts live inside nested `.Field` → `.Label`/`Input` instances. No FieldGroup-level text.
- **Result:** nothing to apply (brief's "likely no text property — verify" confirmed).

## What was renamed

Nothing. No `editComponentProperty` was called — no TEXT property needed renaming. `.Label` was already on the convention; the rest carry no TEXT properties.

## What was left untouched + why

| Node | Item | Why left |
|---|---|---|
| `.Field` `3716:1020` | label/control/description/error SLOT props | SLOTs ≠ text properties (already semantic) |
| `.Field` | description slot default "Choose a unique username." (`3712:1023`) | Slot default (`ref: {}`), not an exposed TEXT property |
| `.Field` | error slot default "Enter a valid email address." (`3713:1026`) | Slot default, not an exposed TEXT property |
| `.FieldSet` `3739:1026` | legend SLOT + its "Address" Title default (`3741:1027`) | SLOT + slot default, not a TEXT property |
| `.FieldSet` | `Slot#3692:26` (children content slot) | SLOT |
| `.FieldGroup` `3742:1044` | `Slot#3692:25` (children content slot) | SLOT |

## /figma-verify

CLEAN on all four sets — 0 FLAGs (no text-as-icon glyphs, no clipped children, no non-auto-layout sibling overlaps). No structural change was made; this confirms the family is intact.

## Verification instances

- `.Label` default → instance `3759:2`: panel `label (children)#3735:0` = TEXT `{Label}`, state=default. Deleted.
- `.Field` default → instance `3759:4`: 4 SLOT props + 2 BOOL + 2 VARIANT, no TEXT prop. Deleted.

## Doc updates

- `design-docs/design-system/components-reference.md` — `.Label` `props` line corrected from stale `text#3735:0 (TEXT, default 'Label')` → `label (children)#3735:0 (TEXT, default '{Label}' — Text-Property-Konvention 2026-06-12 …)`.
- This sync note.

## Forks / blockers

- **None.** No blockers; Figma connected.
- **Note for the broader backlog sweep:** the convention is a global rule. When other (non-Field) components are swept, the same two-class test applies — (a) is it a set-level TEXT `componentPropertyDefinition` (rename → semantic + `{…}`, add `(children)` iff the text is the component's content); (b) a plain TEXT node inside a SLOT with empty `componentPropertyReferences` is a slot default, NOT a property → leave it. SLOT/BOOL/VARIANT props are never touched.
