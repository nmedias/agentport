# Slider — shadcn → Agentport DS port (2026-06-22)

Branch `feat/shadcn-slider-port`. Skill `/shadcn-component-port` (+ `/figma-build-rules` for the build).
Figma Plugin MCP only. Unblocks the `field-slider` example the Field port skipped (2026-06-12).

## Anatomy (radix-nova source, landed via `ui:add`)

Radix Slider primitive, **no CVA** (sibling of Switch/Checkbox/Radio — geometry + state, not variants).
Parts: `Slider.Root` (data-slot=slider) › `Slider.Track` (rail) › `Slider.Range` (fill) + N×`Slider.Thumb`
(one per value; 2 values = range). Import = `radix-ui` umbrella (full primitive, declared dep, Dialog/Switch convention).

- **Axes (state space, no CVA):** `orientation` [horizontal, vertical] (real `data-orientation`, flips layout)
  × interaction `state` [default, focus, disabled]. focus = hover = active (all → the 3px ring). **No invalid**
  state (stock slider has none). disabled = `data-disabled:opacity-50` on Root (dims whole control).
- **Thumb count = data** (`value.length`) → Figma models it as a **`thumbs` [single, range]** axis (user-chosen
  12-member scope) — a **Figma-only fork** (no code prop; range = pass two values). See skill-feedback #1.

## T3 mapping table (stock nova → DS)

| part | stock (nova) | DS | why |
|---|---|---|---|
| Root layout/behaviour | `relative flex w-full touch-none items-center select-none` | unchanged | layout/behaviour, no token. |
| Root disabled | `data-disabled:opacity-50` | unchanged | whole-control dim; matches Figma disabled member opacity. |
| Root vertical | `data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col` | unchanged (numeric) | geometry; `min-h-40`=160px kept numeric (control geometry ≠ spacing token, §6). |
| Track radius | `rounded-full` | `corner-full` | DS radius vocab; all `rounded-*` dead (§2). |
| Track rail fill | `bg-muted` | `bg-input-fill-high` | **muted-fill (#f9fcfd) ~invisible on white** → Switch precedent: an off/empty control track that must read on white = `input-fill-high` (ink/400 ≥3:1). Role over name (B16). |
| Track size | `data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1` | unchanged (numeric) | thin rail geometry (4px). |
| Range fill | `bg-primary` | `bg-primary-fill` | **DS "active/on surface" = primary-fill (dark navy deep/900)**, not cyan `primary` — matches Switch checked track + Checkbox box + Radio dot bg. Alt `bg-primary` (cyan, SHAPE_FILL marker) noted, family-consistency wins. |
| Range layout | `absolute select-none data-horizontal:h-full data-vertical:w-full` | unchanged | geometry/behaviour. |
| Thumb size/shape | `size-3 shrink-0 rounded-full` | `size-3 shrink-0 corner-full` | 12px knob (nova density); `rounded-full`→`corner-full`. |
| Thumb border | `border border-ring` | `border border-input-border` | `ring` role = focus-indicator (off-role as a static border); `input-border` = form-control border → matches Checkbox/Radio/Input resting border. |
| Thumb fill | `bg-white` | `bg-surface` | white knob; matches Switch thumb (`bg-surface`). (`background-fixed` is the purest knob token — deferred to sibling consistency.) |
| Thumb focus ring | `ring-ring/50 … hover:ring-3 focus-visible:ring-3 active:ring-3` | `ring-ring/50 … hover:ring-[3px] focus-visible:ring-[3px] active:ring-[3px]` | `ring-N`→`ring-[Npx]` sibling convention (B15); `ring-ring/50` = Input-family focus glow. |
| Thumb misc | `relative transition-[color,box-shadow] select-none after:absolute after:-inset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50` | unchanged | hit-area + behaviour; `-inset-2` numeric. |

Geometry kept numeric (§6): `size-3`, `h-1`/`w-1`, `min-h-40`, `after:-inset-2`, `w-full`.
No icons (no lucide→remix swap). No `dark:` in nova source. No invalid/aria-invalid.

## Token / variable IDs (for Figma binding, T4)
| binding | DS token | VariableID |
|---|---|---|
| rail fill | input-fill-high | `VariableID:4197:9645` |
| range fill | primary-fill | `VariableID:3037:8` |
| thumb border | input-border | `VariableID:4197:9644` |
| thumb fill | surface | `VariableID:3037:2` |
| corner-full (track/range/thumb) | corner-full | `VariableID:3073:6` |
| focus ring colour | ring @50% — **literal** DROP_SHADOW (glow recipe, NOT bound; binding drops the /50) | — |

Focus glow = verbatim from `.Input` focus member `3176:305`: `DROP_SHADOW radius:0 spread:3 offset 0,0 color{r:.29,g:.333,b:.384,a:.5} sbn:false` (ring=ink/800 @50%). Applied to each thumb on the focus members; member `clipsContent=false` so the ring shows.

## Figma build (Page "Components" 3126:2)

- **Section:** `Slider` `4348:2225` (headline `4348:2226`).
- **Set:** `Slider` `4351:2225` — **12 members**, 3 axes `orientation [horizontal, vertical] × thumbs [single, range] × state [default, focus, disabled]`. Laid out as a 4-row (orientation×thumbs) × 3-col (state) manual grid (mixed member sizes — horizontal 200×12, vertical 12×160 — don't wrap cleanly, so positioned explicitly; set `layoutMode=NONE`).

| member | id | | member | id |
|---|---|---|---|---|
| h/single/default | `4350:2225` | | v/single/default | `4350:2252` |
| h/single/focus | `4350:2229` | | v/single/focus | `4350:2256` |
| h/single/disabled | `4350:2233` | | v/single/disabled | `4350:2260` |
| h/range/default | `4350:2237` | | v/range/default | `4350:2264` |
| h/range/focus | `4350:2242` | | v/range/focus | `4350:2269` |
| h/range/disabled | `4350:2247` | | v/range/disabled | `4350:2274` |

- **Anatomy per member:** Root (COMPONENT, `layoutMode=NONE`, `clipsContent=false`, no fill) › Track (FRAME, `clipsContent=true`, bg input-fill-high, corner-full; 200×4 horiz / 4×160 vert) › Range (RECT child of Track, bg primary-fill, corner-full; horiz fills 0→thumb, vert fills bottom→thumb, range fills between thumbs) + 1–2 Thumb (RECT, 12×12, surface fill, input-border 1px INSIDE, corner-full; focus → glow effect). disabled → Root `opacity=0.5`.
- **`thumbs` axis = Figma-only fork** — code has no `thumbs` prop (range = pass two `value`s). Like `Field.controlPosition`: do NOT sync back as a CVA. (skill-feedback #1.)
- **No invalid axis** — stock slider has no invalid state.

### Usage-Examples group `4354:2225` (permanent, below the set)
| example | instance | composition |
|---|---|---|
| Default | `4354:2228` | h/single/default |
| Range | `4354:2234` | h/range/default |
| Vertical | `4354:2244` | v/single/default |
| Disabled | `4354:2253` | h/single/disabled |
| Field Slider | Field inst `4355:2238` | real `.Field` (vertical) — label="Price Range", control slot = range-slider instance `4356:2249`, description wrapped |

### Verify (T5)
- **Controls-live:** PASS — all 3 axes (orientation/thumbs/state) drive on an instance + read back; probe removed.
- **figma-verify `4351:2225`:** 0 text-as-icon · 0 clipped children · 0 padding asymmetry. 18 sibling overlaps = **all Track↔Thumb** (a thumb sits on its rail — the defining geometry of a slider, by design). CLEAN-by-design. (skill-feedback #3 — verify flags intentional handle-on-rail overlap.)
- **Reproduces stories:** 5 permanent example instances, each from controls/real instances (FieldSlider nests a real Field + slider in the control slot). Done-Test ✓ — every story rebuildable from controls.

## Example inventory (T2.5)
Source: shadcn registry — only 2 distinct slider examples exist (`slider-demo`, `field-slider`); the `sidebar-*`/`signup-*` blocks matched on text only (no Slider) → ignored.

| example | disposition | reason |
|---|---|---|
| `slider-demo` | KEPT → story `Default` | single thumb, defaultValue [50]. |
| `field-slider` | KEPT → stories `FieldSlider` + `Range` | range slider `[200,800]` composed in a `Field` (Field ported ✓). **Unblocks the Field port's skipped `field-slider`.** `Range` = the standalone 2-thumb form derived from it. |
| — | DS-authored | `Vertical` (orientation=vertical), `Disabled`, `AllStates` gallery (maps the Figma state matrix). |

Skipped: none. No un-ported deps.

## a11y note (T6)
`role="slider"` is on the **thumb**, not the Root → the component forwards `aria-label`/`aria-labelledby` to each thumb (a range reuses the one name). Without this, axe `aria-input-field-name` fails (gate red — skill-feedback #2).

## Gate state
`npm run check` — **GREEN** (after one flaky-nx typecheck retry). lint 0 errors (no slider warnings) · typecheck ✓ · test 260 pass (5 slider jsdom specs + 6 slider stories in Chromium + axe). No new jsdom polyfill (ResizeObserver/scrollIntoView already in test-setup.ts).

## Preview URLs (Storybook :6006)
- Default — http://localhost:6006/?path=/story/ui-slider--default
- Range — http://localhost:6006/?path=/story/ui-slider--range
- Vertical — http://localhost:6006/?path=/story/ui-slider--vertical
- Disabled — http://localhost:6006/?path=/story/ui-slider--disabled
- Field Slider — http://localhost:6006/?path=/story/ui-slider--field-slider
- All States — http://localhost:6006/?path=/story/ui-slider--all-states

## Open items
1. **⚠ tokens** — none bound (slider uses only finalized tokens: input-fill-high, primary-fill, input-border, surface, corner-full, ring).
2. **`thumbs` Figma-only fork** — code derives thumb count from `value.length`; don't `/component-sync` it back as a prop.
3. **Range a11y** — both thumbs share the one `aria-label`; a future enhancement could distinguish (e.g. "… minimum"/"… maximum") via per-thumb labels (needs API). Optional.
4. **Static slider doesn't fluidly resize** — Root is `layoutMode=NONE` (thumbs at fixed px), so an instance can't be widened and keep proportional thumb positions; value position is representative. Accepted for a static Figma model.
5. Git: changes on `feat/shadcn-slider-port` (commit per instructions).
