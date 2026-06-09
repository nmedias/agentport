# Component Port — command (radix-nova re-port, 2026-06-09)

shadcn `command` (cmdk) → Agentport DS. Port #3 of 3 (Textarea → InputGroup → **Command**).
The new-york command port (0602bb3) was removed (0d81650) for a clean nova re-add. Deps: InputGroup
(#2, this chain), Kbd ✓. Initial port (Figma + code).

## Decisions (user-confirmed)
- **CommandInput built on InputGroup + InputGroupAddon** (now ported). Full InputGroup chain chosen
  over standalone (pulled Textarea#1 + InputGroup#2 first).
- **Checkable checkmark INCLUDED** — nova's trailing RiCheckLine (shows on data-[checked=true], hides
  when a shortcut is present).
- **Selection = DS accent-cyan** (bg-accent / text-accent-foreground), NOT nova's neutral bg-muted
  (§1 two-cyan model; same as Button hover). Locked DS convention.
- Established DS conventions applied: CommandShortcut = ported **Kbd**; input text = **text-input**
  (mono-18 §4); group heading = **text-eyebrow**; CommandEmpty muted.
- **CommandDialog DEFERRED** — needs Dialog (unported). Not exported; add once Dialog lands.

## Figma IDs (DS file FIGMA_FILE_KEY · page "Shadcn Components" 3126:2 · Section "Command" 3497:686)

| node | id |
|---|---|
| Section "Command" | `3497:686` (headline `3497:687`) |
| `.CommandItem` set | `3498:722` — props `state` (default/selected/disabled) × `trailing` (shortcut/check), 6 members |
| · default+shortcut / default+check | `3498:686` / `3498:692` |
| · selected+shortcut / selected+check | `3498:698` / `3498:704` |
| · disabled+shortcut / disabled+check | `3498:710` / `3498:716` |
| `.CommandInput` | `3499:689` (InputGroup-style: bg-input-background, border-input@30%, h-10, mono text-input) |
| `.CommandSeparator` | `3499:693` (1px bg-border) |
| `.CommandEmpty` | `3499:695` (centered muted Body) |
| `.Command` composition | `3500:689` (list `3500:694`) — palette nesting CommandInput + headings + CommandItem/Separator instances |

Reused: `.Kbd` content=text emphasis=high `3217:302` (shortcut). Vars: popover (resolved by name)
· popover-foreground `3077:3` · accent `3037:14` · accent-foreground `3038:2` · foreground `3037:3`
· muted-foreground `3037:13` · border `3038:4` · input(border) `3038:5` · input-background `3108:2`
· input-placeholder `3043:3` · radius-xl `3073:5` · radius-sm `3073:2` · radius-lg `3073:4`
· space-xs `3070:4` · space-sm `3070:5` · space-md `3070:6` · space-2xl `3070:10`.
Text styles: Label `S:4e034695…` · Eyebrow `S:c91d21e4…` · Body `S:7e1bf8f1…` · Input `S:ee295ec6…`.

## T3 — Translation mapping (radix-nova stock → DS)

| part / stock | DS | why |
|---|---|---|
| **Command root** rounded-xl! bg-popover p-1 text-popover-foreground | rounded-xl bg-popover p-xs text-popover-foreground | overlay surface; p-1(4)→p-xs; drop `!` |
| **CommandInput** `<InputGroup h-8! border-input/30 bg-input/30>` + Addon search | `<InputGroup className="h-10 border-input/30">` + InputGroupAddon(inline-start) RiSearchLine | built on the ported InputGroup; h-10 so mono-18 fits; keep DS bg-input-background default |
| CommandInput control `text-sm` | **text-input** (mono-18) + data-slot=input-group-control + borderless | DS "Command-/Eingabe-Text" signature (§4); marker drives the group focus ring |
| **CommandList** no-scrollbar max-h-72 scroll-py-1 | same | no-scrollbar (globals); max-h-72/scroll-py-1 numeric geometry |
| **CommandEmpty** py-6 text-sm | py-2xl text-body text-muted-foreground | py-6(24)→py-2xl; empty reads muted (DS) |
| **CommandGroup** p-1 + heading px-2 py-1.5 text-xs font-medium | p-xs + heading px-md py-sm **text-eyebrow** text-muted-foreground | px-value; no 12px sans → eyebrow mono micro-label |
| **CommandSeparator** -mx-1 h-px bg-border | same | bleeds the list p-xs inset |
| **CommandItem** gap-2 px-2 py-1.5 rounded-sm text-sm | gap-md px-md py-sm rounded-sm **text-label** | px-value; menu-item label format |
| CommandItem `data-selected:bg-muted text-foreground` | **data-[selected=true]:bg-accent text-accent-foreground** | DS cyan selection (overrides nova neutral); icons → accent-foreground when selected, else muted-foreground |
| CommandItem checkmark RiCheckLine ml-auto opacity-0 group-has-[shortcut]:hidden group-data-[checked]:opacity-100 | kept (data-[checked=true] explicit form) | nova checkable affordance, included per decision |
| CommandItem `in-data-[slot=dialog-content]:rounded-lg!` | in-data-[slot=dialog-content]:rounded-lg | inert until Dialog/CommandDialog lands; kept forward-compatible |
| **CommandShortcut** span text-xs muted | ported **Kbd** + data-slot=command-shortcut | DS upgrade (inverted keycap); data-slot lets the checkmark hide itself |

## Verify / Gate
- `/figma-verify` (composition 3500:689 + item set 3498:722) → **CLEAN**. Icons are VECTORs
  (search/check via createNodeFromSvg); Kbd "Ctrl" is a keycap label, not an icon glyph; all
  auto-layout; padding symmetric. HINT acknowledged: bg-popover (white) on the white section — it is
  the overlay surface (sits over content in-app).
- Gate: `nx typecheck` ✅ · `nx test` ✅ 32/32 (5 new command specs) · `nx lint` ✅ (pre-existing warning only).
- **App-build CSS check** (apps/agentport/dist): emitted — text-eyebrow, text-input, no-scrollbar,
  rounded-xl, bg-popover, bg-accent, text-accent-foreground, scroll-py-1, and the group machinery
  `.group-has-data-[slot=command-shortcut]/command-item:hidden:…:has([data-slot=command-shortcut])`
  + `group-data-[checked=true]` + `in-data-[slot=dialog-content]`.
- cmdk jsdom polyfills (ResizeObserver/scrollIntoView) — `libs/ui/src/test-setup.ts` already wired
  (from the prior command run); 32/32 green, no ReferenceError.

## Code
`libs/ui/src/components/ui/command/` (tsx + index + stories + spec); re-exported in `libs/ui/src/index.ts`.
Exports: Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut,
CommandSeparator. Icons `@remixicon/react`; shortcut reuses Kbd; input on InputGroup.

**Preview stories (Storybook :6006):**
- Default — http://localhost:6006/?path=/story/ui-command--default
- EmptyState — http://localhost:6006/?path=/story/ui-command--empty-state
- CheckableItems — http://localhost:6006/?path=/story/ui-command--checkable-items

## Open items
- **CommandDialog + Dialog** — deferred; port Dialog, then wrap Command (CommandItem already carries the
  `in-data-[slot=dialog-content]:rounded-lg` forward-compat hook).
- `destructive` ⚠ placeholder unused here. accent selection opaque (bg-accent, no opacity knob).
- Composition list is a populated frame (readable demo), not an empty Figma Slot — code list is cmdk children.

## Status: DONE — Figma CLEAN, code gate green, CSS variants verified, stories previewed.

## Code→Figma value audit (2026-06-09, post-port)

Re-read every set vs code; fixed drift in Figma:
- **.CommandInput** (3499:689): stroke opacity 1 → **0.3** (code `border-input/30`); `itemSpacing`
  space-md → **space-sm** (the input's `pl-sm` icon→text nudge); `paddingRight` space-md → **0**
  (no trailing addon → code group has no right padding).
- **.Command composition** (3500:689): root `itemSpacing` space-xs → **0** (code root is `p-xs`, no gap);
  wrapped the CommandInput instance in a `command-input-wrapper` frame (pl/pr/pt=space-xs, pb=0) and added
  `p-xs` to the list frame — mirrors the code's `<div p-xs pb-0>` input wrapper + `CommandGroup p-xs` inset.
- **.CommandItem, .CommandEmpty, .CommandSeparator**: already matched code — no change.

## Code→Figma value audit — round 2 (pixel-deep, nested nodes)

Walked the full composition tree at raw px:
- **Composition → CommandInput instance**: had collapsed to h=23 (FILL in a HUG wrapper); set sizeV FIXED
  **h=40** (h-10) so the search field keeps its height.
- **Composition list restructured** to mirror code exactly: removed the flat `p-xs` list padding; wrapped
  [heading + 3 items] and [heading + 1 item] into two **CommandGroup frames (p-xs each)**, with the
  CommandSeparator between them at CommandList level. This restores the 8px around the separator (group
  pb+pt) and makes the separator (w=352) bleed past the item inset (344) — the code's `-mx-1`.
- .CommandInput standalone, .CommandItem, headings, Kbd: confirmed exact (pl8/gap6; px8/py6/gap8; px8/py6).
