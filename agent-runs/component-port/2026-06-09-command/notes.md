# Component Port — command (2026-06-09)

shadcn `command` (cmdk) → Agentport DS. Multi-part composite. Initial port (Figma + code).

## Composite decisions (T2 ask)

- **Scope:** *Full inline palette* — build Command (composition) + CommandInput + CommandItem
  (state axis) + CommandSeparator + CommandEmpty + group heading as token-bound Figma. **Skip
  CommandDialog** — needs Dialog, not yet in DS → keep in code as a thin wrapper, flag the dep.
- **Composition** = a real reusable component `.Command` nesting Input + Item instances, list body
  in a **Slot**.
- **CommandItem** = the only state-bearing part → set on axis `state = default | selected | disabled`.
  Leading **icon slot** (instance-swap, Remix default) + trailing **shortcut slot** that drops the
  existing **`.kbd`** component.
- **Group heading** → `text-eyebrow` (DS has no 12px sans; eyebrow gives the Agentport mono-micro look).
- **Selected tint** → `accent` as a **state-layer** Surface driven by appearance/layer opacity
  (not fill- nor node-opacity), text → `accent-foreground`.

## Figma IDs (DS file FIGMA_FILE_KEY · page "Shadcn Components" 3126:2)

Reuse: `.Kbd` set `3217:308` (member content=text `3217:302`).

Variables (semantic):
- popover `3077:2` · popover-foreground `3077:3` · foreground `3037:3` · muted-foreground `3037:13`
- accent `3037:14` · accent-foreground `3038:2` · border `3038:4` · input-placeholder `3043:3`
- input-background `3108:2`

Spacing (semantic-dimension): 2xs `3070:3` · xs `3070:4` · sm `3070:5` · md `3070:6` · lg `3070:8`
· xl `3070:9` · 2xl `3070:10`
Radius: sm `3073:2` · md `3073:3` · lg `3073:4`

Text styles: Label `S:4e034695…` · Eyebrow `S:c91d21e4…` · Body `S:7e1bf8f1…` · Input `S:ee295ec6…`
· Kbd `S:ff0c9862…`

## T3 — Translation mapping (stock → DS)

### Command (root) — `flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground`
| stock | DS | why |
|---|---|---|
| flex flex-col | VERTICAL auto-layout | — |
| overflow-hidden | clipsContent | — |
| rounded-md | rounded-md (radius-md 6) | container radius |
| bg-popover | bg-popover (=overlay alias) | overlay surface for Command/Menu (token `use`) |
| text-popover-foreground | text-popover-foreground | paired text on overlay |

### CommandInput wrapper — `flex h-9 items-center gap-2 border-b px-3` + icon `size-4 opacity-50` + input `h-10 w-full bg-transparent py-3 text-sm placeholder:text-muted-foreground`
| stock | DS | why |
|---|---|---|
| gap-2 (8) | gap-md | px-value map |
| px-3 (12) | px-lg | px-value map |
| border-b | border-b border-border | standard divider |
| h-9 wrapper | **h-11 (44)** | text-input is mono-18 → 36 clips; 44 fits (dialog uses h-12) ⚠ deviation |
| icon size-4 opacity-50 | size-4, text-muted-foreground | DS subtle-icon token replaces inherited@50% ⚠ |
| input text-sm | **text-input** (mono 18) | §4: text-input = "Command-/Eingabe-Text" — the signature |
| placeholder:text-muted-foreground | text-input-placeholder | DS field placeholder token (field family) ⚠ |

### CommandItem — `flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none data-[disabled]:opacity-50 data-[selected]:bg-accent data-[selected]:text-accent-foreground` + svg `size-4 text-muted-foreground`
| stock | DS | why |
|---|---|---|
| gap-2 (8) | gap-md | px-value |
| px-2 (8) / py-1.5 (6) | px-md / py-sm | px-value |
| rounded-sm (4) | rounded-sm | small control radius |
| text-sm | text-label | menu-item label = label format (§4) |
| data-[selected]:bg-accent | accent state-layer (appearance opacity) | selection tint; accent `use` = Selektions-/Aktiv-Tint |
| data-[selected]:text-accent-foreground | text-accent-foreground | readable cyan-on-tint (≈5:1); NOT primary |
| svg size-4 text-muted-foreground | size-4, muted-foreground | subtle icon |
| data-[disabled]:opacity-50 | node opacity 0.5 | dim incl. text (correct for disabled) |

### CommandGroup — `p-1 text-foreground` + heading `px-2 py-1.5 text-xs font-medium text-muted-foreground`
| stock | DS | why |
|---|---|---|
| p-1 (4) | p-xs | px-value |
| text-foreground | text-foreground | — |
| heading px-2/py-1.5 | px-md / py-sm | px-value |
| heading text-xs font-medium | **text-eyebrow** | no 12px sans; eyebrow = mono micro-label |
| heading text-muted-foreground | text-muted-foreground | — |

### CommandSeparator — `-mx-1 h-px bg-border`
| stock | DS | why |
|---|---|---|
| h-px | h-px (1) | hairline |
| bg-border | bg-border | standard divider |
| -mx-1 | bleed full width | negative margin bleeds the list p-1 inset |

### CommandEmpty — `py-6 text-center text-sm`
| stock | DS | why |
|---|---|---|
| py-6 (24) | py-2xl | px-value |
| text-sm | text-body | body copy, centered |
| (inherited fg) | text-muted-foreground | empty state reads muted ⚠ (stock leaves fg) |

### CommandShortcut — `ml-auto text-xs tracking-widest text-muted-foreground`
→ **replaced by `<Kbd>`** (text-kbd, inverted keycap). ⚠ DS upgrade from stock muted text; chosen
in the T2 ask (reuse the ported kbd). `ml-auto` push preserved.

## Flags
- `bg-popover`/`secondary`/`destructive` etc. not used here. No ⚠ placeholder tokens in this port.
- CommandDialog kept in code, **Dialog dependency** not ported (flag in T6).

## T4 — Figma build (page "Shadcn Components" 3126:2, Section "Command" 3430:309)

| node | id |
|---|---|
| Section "Command" | `3430:309` (headline `3430:310`) |
| `.CommandItem` set | `3434:325` — props: `state` (default/selected/disabled), `icon#3434:0` SLOT, `shortcut#3434:1` SLOT |
| · state=default / selected / disabled | `3433:309` / `3434:310` / `3434:318` |
| `.CommandInput` | `3435:312` |
| `.CommandSeparator` | `3436:312` |
| `.CommandEmpty` | `3436:313` |
| `.Command` composition | `3437:312` (list SLOT `3437:317`, nests CommandInput + items + separator) |

Reused `.Kbd` content=text `3217:302` inside the CommandItem shortcut slot.

**Selected state-layer:** a Rectangle child (`state-layer`), `layoutPositioning=ABSOLUTE`,
constraints STRETCH/STRETCH, fill bound to `accent`, **layer opacity** the knob (set 1.0 = full
accent = opaque `bg-accent` parity; bindable-opacity mechanism per the T2 decision). Content sits
opaque on top; selected label → accent-foreground.

**T4b exercise:** state switches across all 3 values (opacity 1/1/0.5; state-layer present only on
selected); both slot props resolve. ✅
**T5 /figma-verify `3430:309`:** **CLEAN** — 8 VECTOR icons (no text-glyph icons), no clipping, no
overlap, padding symmetric.

## T6 — Code (`libs/ui/src/components/ui/command/`)

`command.tsx` (+ `index.ts` barrel, `.stories.tsx`, `.spec.tsx`); re-exported in `libs/ui/src/index.ts`.
Icons `@remixicon/react`; shortcut reuses `Kbd`. Built per the T3 table.

**CommandDialog DEFERRED** — `ui:add` also wrote `dialog.tsx` importing `lucide-react` (not a project
dep) and Dialog is not a DS component. Shipped only the inline palette (what the Figma build covers);
deleted the stray `dialog.tsx`. Add CommandDialog once Dialog is ported. (See skill-feedback #1.)

**Test infra:** cmdk needs `ResizeObserver`/`scrollIntoView`, absent in jsdom → added
`libs/ui/src/test-setup.ts` (polyfills) wired via `test.setupFiles` in `vite.config.mts`. One-time
per-lib. (See skill-feedback #2.)

**Gate:** `nx typecheck` ✅ · `nx test` ✅ 22/22 · `nx lint` ✅ (only pre-existing `.storybook/main.ts`
`any` warning). DS typo classes confirmed surviving in markup (spec asserts `text-input`,
`text-label`, `text-eyebrow`, `text-kbd`).

**Preview stories:**
- Default — http://localhost:6006/?path=/story/ui-command--default
- WithDisabledItem — http://localhost:6006/?path=/story/ui-command--with-disabled-item
- EmptyState — http://localhost:6006/?path=/story/ui-command--empty-state
- Filtering — http://localhost:6006/?path=/story/ui-command--filtering

## Open items
- **CommandDialog + Dialog** — deferred; port Dialog, then wrap Command.
- Composition kbd shortcuts show the kbd default ("Ctrl"); fine as slot demo — consumer overrides.
- No ⚠ placeholder tokens used. Selected tint opacity knob left at 1.0 (full accent).

## Status: DONE — Figma CLEAN, code gate green, CommandDialog deferred.
