# Component-Port · Dialog (2026-06-10)

Initial port of the shadcn **radix-nova dialog** into the Agentport DS — composite procedure
(composites.md), Figma + code + new token. Gate green (39 tests), /figma-verify CLEAN,
done-test over 4 reproduced example instances.

## Anatomy / exposure surface

10 code parts: `Dialog/Trigger/Portal/Close` (behavioural, no rendering) + `Overlay`,
`Content` (showCloseButton prop, nests ghost icon-sm Button + X), `Header`, `Footer`
(showCloseButton prop, tinted band with bleed), `Title`, `Description`. No CVA.

Exposure model per variation point (composites.md §1):

| Variation point | Mechanism | Where |
|---|---|---|
| Title / description | Text props `title#`/`description#` | `.Dialog` |
| X-close on/off | Boolean `showCloseButton#` (visibility of the nested ghost `.Button` instance) | `.Dialog` |
| Footer on/off | Boolean `showFooter#` (visibility of the footer slot) | `.Dialog` |
| Body content (open, n children) | **Slot** `body#`, built empty; `showBody#` boolean on wrapper (see findings) | `.Dialog` |
| Footer content | **Slot** `footer#` with **default `.Dialog/Footer` instance** (user decision) | `.Dialog` |
| Footer actions (n buttons) | **Slot** `actions#` in `.Dialog/Footer`, default = Cancel (outline) + Save (default) | `.Dialog/Footer` |
| Scrim | own component `.Dialog/Overlay` (user decision), not part of the panel composition | — |

## User decisions (T2.7)

1. **Scrim = own `.Dialog/Overlay` component**; `.Dialog` stays a pure panel.
2. **New semantic token `scrim`** instead of dead `bg-black/10` (details: token-analysis-color.md batch 6).
3. **Footer built in permanently** (boolean) **but instantiated by default as its own `.Dialog/Footer` component
   in the footer slot** — band styling guaranteed, actions editable, component swappable/reusable.
4. **Title = `text-title`** (18/600; nova 16/500 has no DS step; use = "section title").

## T3 — Mapping (stock → DS)

| Part | Stock (nova) | DS | Why |
|---|---|---|---|
| Overlay | `bg-black/10` | `bg-scrim` | Core colours dead; **new token** (neutral/900 @10%, alpha in the token) |
| Overlay | `supports-backdrop-filter:backdrop-blur-xs` | keep | Blur namespace not reset |
| Content | `gap-4` / `p-4` | `gap-xl` / `p-xl` | 16px → space-xl (mapping by px value) |
| Content | `bg-popover text-popover-foreground` | `bg-overlay text-overlay-foreground` | overlay = preferred name; popover only a legacy alias |
| Content | `text-sm` | `text-body` | dead font-size; body default of the app |
| Content | `ring-1 ring-foreground/10` | `border` + `shadow-elevation` | DS overlay depth (like Command palette): real edge instead of hairline ring, elevation carries meaning |
| Content | `rounded-xl`, `max-w-*`, `top-2 right-2` | keep | radius-xl "large surfaces/windows"; geometry numeric |
| Header | `gap-2` | `gap-md` | 8px |
| Footer | `-mx-4 -mb-4 p-4` | `-mx-xl -mb-xl p-xl` | Bleed must mirror the panel padding (xl) |
| Footer | `gap-2` | `gap-md` | 8px |
| Footer | `bg-muted/50`, `border-t`, `rounded-b-xl` | keep | muted.use = "bands"; opacity modifier on a DS token is valid |
| Title | `text-base leading-none font-medium` | `text-title` | all three dead; format carries size+weight+LH |
| Description | `text-sm text-muted-foreground` | `text-body text-muted-foreground` | secondary text |
| Description | `*:[a]:underline …` link styling | keep | valid namespaces |

## Figma — built assets (Section "Dialog" `3589:788`, page `3126:2`)

- `.Dialog` (composition) `3592:794` — panel 384 fixed × HUG; fills→`overlay`, stroke→`border` (1, INSIDE),
  radius→`radius-xl` (clip), effect style **Elevation**. Structure: `content` `3592:795` (p/gap→`space-xl`)
  → [`header` `3592:796` (gap→`space-md`; `title` `3592:797` style **Title** + `overlay-foreground`;
  `description` `3592:798` style **Body** + `muted-foreground`), `body-region` (wrapper, visible↔`showBody#3606:0`)
  → `body` **slot** `3609:890` (empty)] · `footer` **slot** `3593:795` (visible↔`showFooter#3593:5`,
  default = `.Dialog/Footer` instance `3593:796`) · `close` `3593:806` (ghost icon-sm `.Button` instance,
  ABSOLUTE 348/8, icon via swapComponent→`.Dialog/Icon/Close`; visible↔`showCloseButton#3593:4`).
  Props: `title#3593:2` · `description#3593:3` · `showCloseButton#3593:4` · `showFooter#3593:5` ·
  `showBody#3606:0` · slots `footer#3593:1`, `body#3609:0`.
- `.Dialog/Footer` `3591:788` — band: fill→`muted` @50% paint opacity, strokeTop→`border`,
  rounded-b→`radius-xl`, p→`space-xl`, justify-end; `actions` **slot** `3591:789` (gap→`space-md`),
  default = Cancel (outline `3591:790`) + Save changes (default `3591:794`) as real `.Button` instances.
- `.Dialog/Overlay` `3590:791` — fill→**`scrim`** (`VariableID:3588:2`), effect BACKGROUND_BLUR 4
  (= `backdrop-blur-xs`), 480×360 resizable.
- `.Dialog/Icon/Close` `3590:790` — 16×16, RiCloseLine vector, fill→`foreground`.
- **Example instances (done-test):** `dialog-demo` `3595:807` (props only; footer default = Cancel+Save)
  · `scrollable-content` `3595:829` (showBody, body slot filled, showFooter=false)
  · `sticky-footer` `3598:840` (body + actions rebuilt to a single Close)
  · `no-close-button` `3603:858` (showCloseButton=false, close-only footer)
  · `dialog-on-overlay` `3604:888` (presentation: auto-layout frame, overlay ABSOLUTE inset-0,
  panel centred in-flow — the overlay is deliberately NOT part of the composition).
- Variables used: overlay `3037:6` · overlay-foreground `3037:7` · muted `3037:12` ·
  muted-foreground `3037:13` · foreground `3037:3` · border `3038:4` · radius-xl `3073:5` ·
  space-md `3070:6` · space-xl `3070:9` · **scrim `3588:2` (new)**.

## Example inventory (T2.5/T5)

| Doc example (radix-base dialog-example) | Status |
|---|---|
| With Form | **adapted** → story `Default`: structure (header + 2-action footer Cancel/Save) kept, Field/FieldGroup/FieldLabel rows removed (**un-ported, skipped**) |
| Scrollable Content | **kept-distinct** → story `ScrollableContent` + Figma example |
| With Sticky Footer | **kept-distinct** → story `StickyFooter` + Figma example |
| No Close Button | **kept-distinct** → story `NoCloseButton` + Figma example |
| Chat Settings | **skipped-missing-dep** (Tabs, Select, NativeSelect, Switch, Checkbox, Field, Tooltip un-ported) |
| (old new-york `dialog-demo`) | dedupe: = With Form with Label/Input instead of Field — same structure |

## Code

- `libs/ui/src/components/ui/dialog/` — `dialog.tsx` + `.stories.tsx` (4 stories) + `.spec.tsx`
  (7 tests incl. typo/token survival) + barrel; root barrel export added.
- Deps: `radix-ui` (Dialog primitive, present), `@remixicon/react` (RiCloseLine), Button (nested).
  `ui:add` wrote a flat `button.tsx` → **deleted** (shadowing trap); `IconPlaceholder`→`lucide-react`
  → swapped to Remix in T2 (Command finding #1 reproduced).
- jsdom: no new polyfills needed (Radix Dialog renders with the existing setup).
- Gate: `npm run check` green (lint + test 39 + typecheck). Stories tsconfig has **no DOM lib** →
  write play functions without `document`/DOM globals (assert via the trigger's `aria-expanded`).
- Previews: `http://localhost:6006/?path=/story/ui-dialog--default` · `…--scrollable-content` ·
  `…--sticky-footer` · `…--no-close-button`

## Findings (Figma mechanics — details in skill-feedback.md)

1. **Never bind visibility directly on a SLOT:** `componentPropertyReferences={visible}` (+ `visible=false`)
   on a SLOT node **degrades it to a FRAME** — slot behaviour gone, instance slot contents discarded
   (ex2/ex3 had to be refilled). Fix: a wrapper FRAME (`body-region`) carries the boolean, the SLOT
   stays untouched inside it.
2. **An empty slot has an unreliable default height** (~100px despite HUG) → body-less dialogs got slack;
   the `showBody` boolean (default false) hides the region → default panel tight, identical to the code.
3. **Slot defaults in instances:** readable; `remove()` works, but **every structural mutation invalidates
   all held refs** — re-resolve per operation; deeply nested defaults (Footer→Actions) partly need
   **separate use_figma calls** (an in-call re-resolve is not enough). The direct slot-default
   **instance** child itself (Footer in `footer#`) is **not removable**
   ("Removing this node is not allowed") — covered via the `showFooter` boolean.
4. **Match the icon-swap target exactly** (`mc.name === '.Button Icon'`), never `/icon/i` — `size=icon-sm`
   (Base member) collides.

## /figma-verify

CLEAN (own flags 0). 10 inherited `state-layer` flags inside `.Button/Base` (Button-internal
anatomy, validated in the Button port, out of scope). Hints deliberate: footer band edge-flush (bleed),
overlay edge-flush (scrim), padding symmetric everywhere.

## Open

- **Un-defer CommandDialog** (separate step): re-add function + export + story in `command/` —
  Dialog exists now. Catalog note updated.
- `destructive` remains a ⚠ placeholder (not used here).
- On a change to `neutral/900`, update the scrim value in Figma manually (raw RGBA, no alias possible).
