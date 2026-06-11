# Component Port — CommandDialog re-add (command/) · 2026-06-11

Follow-up to the Command port (2026-06-10, deferred sub-part) and the Dialog port (2026-06-10).
Code-only re-add per handoff-composite-port.md: function + export + story + spec in
`libs/ui/src/components/ui/command/`. **No Figma work** (Figma writes only on explicit Ansage; the
`.Command` composition keeps "no whole-level variant"). Skill-feedback ON (`skill-feedback.md`,
3 findings).

## Source

- nova `r/styles/radix-nova/command.json`: CommandDialog = sr-only `DialogHeader` (outside
  `DialogContent` — upstream pattern, a11y ids resolve document-wide) + `DialogContent
  top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0`, `showCloseButton=false` default.
- **nova quirk:** nova renders `{children}` bare (no `<Command>` wrapper) — that breaks the
  canonical doc usage (palette parts as direct children). new-york-v4 wraps. → wrapped
  (deviation noted in code comment; skill-feedback #1).

## Token mapping (nova → DS)

| nova | DS | why |
|---|---|---|
| `rounded-xl!` on DialogContent | *(dropped)* | DialogContent is already `corner-xl` |
| `top-1/3 translate-y-0 overflow-hidden p-0` | unchanged | geometry stays numeric; `p-0` collapses `p-xl` via named-spacing twMerge extension |
| *(implicit: Command frame inside panel)* | inner `<Command className="border-0 shadow-none">` | DS Command owns `border + shadow-elevation` (deliberate deviation from frameless nova root); inside the dialog the panel owns the frame. `border`→`border-0` merges; shadow-none/-elevation do NOT merge (twMerge gap, skill-feedback #3) — inner shadow is clipped by `overflow-hidden` either way |
| CommandItem `in-data-[slot=dialog-content]:rounded-lg!` | `in-data-[slot=dialog-content]:corner-lg!` | re-added (was dropped only because Dialog was deferred); DS corner scale |

## Story (T2.5)

- `InDialog` = the `command-dialog` doc example. **Adaptation:** the demo's global ⌘J
  `document.addEventListener` can't live in a story (stories tsconfig has no DOM lib — whole file,
  not just play functions; skill-feedback #2) → DS `Button` trigger + `Kbd ⌘J` keycap hint;
  starts open (`useState(true)`), Esc/overlay close, button re-opens.
- No play function — portal renders outside the canvas and the manual trigger has no ARIA
  reflection; consistent with the file's "visual showcases, controls disabled" convention.
- Header comment's "dialog example is skipped" note removed.

## Spec (T6)

3 new tests (command.spec.tsx → 8, suite 42/42 green):
1. palette inside open dialog + `aria-labelledby`/`aria-describedby` wired to the sr-only header,
2. panel re-shape (`p-0` not `p-xl`, `top-1/3` not `top-1/2`) + inner frame shed
   (`border-0` present, `border` gone — twMerge guards),
3. cmdk filtering works inside the dialog portal (jsdom, existing polyfills).

## Code delta

- `command.tsx`: dialog imports · `CommandDialog` function (defaults: title "Command Palette",
  description "Search for a command to run…", `showCloseButton=false`) · export · item radius
  re-add · header + deferred comments resolved.
- `command.stories.tsx`: `InDialog` story + imports (`Button`, `Kbd`, `useState`).
- `command.spec.tsx`: `DialogPalette` fixture + `CommandDialog` describe block.

## Gate

`npm run check` green: typecheck ✓ · lint 0 errors (1 pre-existing `.storybook/main.ts` warning) ·
tests 42/42 ✓. Previews:
- http://localhost:6006/?path=/story/ui-command--in-dialog
- http://localhost:6006/?path=/story/ui-command--default

## Catalog

`components-reference.md`: Command entry (exports + notes un-deferred, CommandDialog = code-only),
Dialog entry note + status_note + Pending/Removed resolved.
