# Component Port — textarea (2026-06-09)

shadcn `textarea` (radix-nova) → Agentport DS. Port #1 of 3 in the Command chain
(Textarea → InputGroup → Command). Sibling of the already-ported Input — same
field tokens + state language, taller box. Initial port (Figma + code).

## Figma IDs (DS file nQSNLASjuLvgTh3we8Dp4s · page "Shadcn Components" 3126:2)

| node | id |
|---|---|
| Section "Textarea" | `3487:674` (headline `3487:675`) |
| `.Textarea` set | `3488:684` — prop: `state` (default/focus/filled/disabled/invalid) |
| · state=default / focus / filled / disabled / invalid | `3488:674` / `:676` / `:678` / `:680` / `:682` |

Variables (reused from the .Input port): input-background `3108:2` · input(border) `3038:5`
· foreground `3037:3` · input-placeholder `3043:3` · ring `3038:6` · destructive ⚠ `3038:3`
· radius-lg `3073:4` · space-md `3070:6`. Text style: Label `S:4e034695…`.

## T3 — Translation mapping (radix-nova stock → DS)

nova: `flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base ... md:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:...`

| stock | DS | why |
|---|---|---|
| bg-transparent | bg-input-background | DS fields are opaque, recognisability carried by the border (token `use`) — mirrors Input |
| text-base / md:text-sm | text-label | Label format (Medium 14) = the DS form-control text, same as Input/Button (§4); drop responsive md: |
| px-2.5 (10) | px-md (8) | px-value map (§6); matches Input's horizontal padding |
| py-2 (8) | py-md (8) | px-value map (8→md) |
| rounded-lg | rounded-lg | DS radius-lg 8px (fields/controls) |
| border border-input | border border-input | form-control border (token `use`) |
| placeholder:text-muted-foreground | placeholder:text-input-placeholder | dedicated DS field-placeholder token (field family, not muted) |
| focus-visible:ring-3 | focus-visible:ring-[3px] | ring-3 = ring-[3px]; + border-ring + ring/50 — mirrors Input focus |
| disabled:bg-input/50 + opacity-50 | disabled:opacity-50 (+ pointer-events-none, cursor) | DS disabled = opacity dim only; drop the bg shift (nova's dark-leaning treatment) — mirrors Input |
| aria-invalid:border-destructive ring-destructive/20 | same | destructive ⚠ placeholder token (invalid border + ring) — mirrors Input |
| min-h-16 (64) | min-h-16 | control geometry stays numeric |
| field-sizing-content | field-sizing-content | structural (auto-grow) — kept, like breadcrumb's wrap-break-word |
| flex | (dropped) | textarea is block; Input has no flex either — parity |
| dark: variants | (dropped) | single light mode |
| + selection:bg-primary/text-primary-foreground | added | DS field text-selection convention (parity with Input) |

Figma vertical alignment: textarea text top-left → member `counterAxisAlignItems = MIN`
(Input is CENTER for single-line). Text child FILLs width, HUGs height (multi-line, no truncation —
Input truncates with ENDING).

## Verify / Gate

- `/figma-verify 3488:684` → **CLEAN** (no text-icons, no clipping/overlap, padding symmetric md/md).
- Gate: `nx typecheck` ✅ · `nx test` ✅ 22/22 (4 new textarea specs; text-label survives twMerge) ·
  `nx lint` ✅ (only pre-existing .storybook/main.ts `any` warning).

## Code

`libs/ui/src/components/ui/textarea/` (tsx + index barrel + stories + spec); re-exported in
`libs/ui/src/index.ts`. No new deps; no CVA (single element, state axis is pseudo-class-driven like Input).

## Open items
- `destructive` is still a ⚠ placeholder token (stock hex) — invalid state inherits that.
- Next: InputGroup (#2), which wraps Input + Textarea + Button. Then Command (#3).

## Status: DONE — Figma CLEAN, code gate green.
