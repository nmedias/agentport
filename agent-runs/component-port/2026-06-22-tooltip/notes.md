# Port Notes — Tooltip (2026-06-22)

Branch: `feat/shadcn-tooltip-port` · Subject: `tooltip` · Baseline: radix-nova.

## T1 — Setup
- `cn()` (libs/ui/src/lib/utils.ts) already registers text-format / named-spacing / corner / shadow
  twMerge groups. Tooltip uses `text-format-*`, `corner-*`, `shadow-elevation`, named spacing, DS
  colours → all covered. No new at-risk family. ✔

## T2 — Anatomy
Source: `@shadcn/tooltip` (registry:ui), landed via `ui:add` → moved to `tooltip/tooltip.tsx` + barrel.
- 4 exports: `TooltipProvider` · `Tooltip` (Root) · `TooltipTrigger` · `TooltipContent` (+ internal
  `TooltipPrimitive.Arrow` rendered inside Content). All from the `radix-ui` umbrella
  (`import { Tooltip as TooltipPrimitive } from 'radix-ui'`) — full primitive → keep umbrella (finding B13;
  `radix-ui` is a declared dep of libs/ui, matches Select/Dialog convention).
- **No CVA.** Provider/Root/Trigger = behavioural wrappers, no visual styling. Only `TooltipContent`
  + its `Arrow` carry classes. Single raised content surface. → Figma axis = **content** (one content
  member + arrow), no variant/size/state axis (the tooltip has only the open visual; closed = unmounted).
- **No icons** in source (no lucide → no remix swap needed). The `**:data-[slot=kbd]` selectors only
  re-style a NESTED Kbd; they import nothing.
- NOT a surface-less multi-part composite (no several independently-composed data-slot parts) — closer to
  Badge/Kbd: one styled surface. So standard T2–T7, not the composites.md path.

Stock class strings:
- `TooltipContent`: `z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin)
  items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background
  has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:{relative,isolate,z-50,rounded-sm}` + the
  `data-[side=*]:slide-in-*` / `data-[state=*]:animate-*` / `data-open|closed:*` animation utilities.
- `Arrow`: `z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground`.

## T3 — Translate (mapping table)

**Surface decision:** stock tooltip is an INVERTED dark chip (`bg-foreground` dark surface +
`text-background` light text) — a deliberate stock contrast against popover/dialog. The DS has no
inverted-tooltip token; the role-correct DS choice is the consolidated **raised-overlay surface**
`dialog-fill` (light) + `dialog-ink`, matching Dialog/Command (`bg-dialog-fill + border +
shadow-elevation`). Per §6 rename `bg-popover/bg-overlay → bg-dialog-fill`,
`text-popover-foreground → text-dialog-ink`. This makes tooltip a LIGHT raised chip (DS deviation from
stock's dark chip — recorded). Add `border` (raised edge) + `shadow-elevation` (depth) which stock
tooltip lacks but every DS raised surface carries.

| Stock (TooltipContent)      | DS utility            | Why (use/avoid) |
|-----------------------------|-----------------------|-----------------|
| `bg-foreground` (dark surf) | `bg-dialog-fill`      | raised overlay surface role (dialog-fill = Dialog/Popover/Command/Menu). NOT bg-ink (no FRAME_FILL; that's a shape fill). |
| `text-background` (light)   | `text-dialog-ink`     | ink-on-raised-surface; pairs with dialog-fill. |
| *(none)*                    | `border`              | DS raised surfaces carry a 1px base edge (Dialog/Command do). |
| *(none)*                    | `shadow-elevation`    | depth of a raised overlay (DS shadow; stock tooltip is flat, DS raised = elevation). |
| `rounded-md`                | `corner-md`           | 6px, mid container radius. rounded-* dead (§2). |
| `text-xs`                   | `text-format-label`   | no 12px sans rung (B21/B23); role = a short UI label/caption → text-format-label (14/500), +2px snap accepted. NOT body (that's flowing prose); the tooltip is a terse label. |
| `gap-1.5` (6px)             | `gap-sm`              | §6 px-map gap-1.5(6)→gap-sm. |
| `px-3` (12px)               | `px-lg`               | §6 px-map px-3(12)→px-lg. |
| `py-1.5` (6px)              | `py-sm`               | §6 px-map py-1.5(6)→py-sm. |
| `has-data-[slot=kbd]:pr-1.5`| `has-data-[slot=kbd]:pr-sm` | same px-map (6→sm); tightens right pad when a Kbd trails. |
| `**:data-[slot=kbd]:rounded-sm` | `**:data-[slot=kbd]:corner-sm` | nested-Kbd radius → corner-sm (4px). |
| `z-50`, `w-fit`, `max-w-xs`, `inline-flex`, `items-center`, `origin-(--radix-…)`, `**:data-[slot=kbd]:{relative,isolate,z-50}`, all `data-[side]/data-[state]/animate` | **kept verbatim** | geometry / Radix transform-origin / layering / animation — not token-bound (§6 keep_valid). |

| Stock (Arrow)               | DS utility            | Why |
|-----------------------------|-----------------------|-----|
| `bg-foreground fill-foreground` | `bg-dialog-fill fill-dialog-fill` | arrow inherits the content fill (raised surface). |
| `size-2.5`, `translate-y-…`, `rotate-45`, `rounded-[2px]`, `z-50` | **kept verbatim** | geometry (numeric arbitrary radius stays; it's the diamond corner, not a container). |

**Kbd-in-tooltip open item:** `kbd.tsx` carries `in-data-[slot=tooltip-content]:bg-surface/20
text-ink` — tuned for an INVERTED (dark) tooltip (faint white tint + dark text). On the chosen LIGHT
`dialog-fill` surface that override reads near-invisible (white-on-white-ish). Out of scope to edit Kbd
in a tooltip port → flagged as open item + finding; WithKbd story renders the Kbd as-is.

## T4 — Figma BUILT (lock held 16:08→16:18, ~10min; lock had rotated popover→toggle-group, won via atomic acquire-loop)
Recon IDs (collections `semantic` / `semantic-dimension`):
- dialog-fill `VariableID:3037:6` · dialog-ink `VariableID:3037:7` · border `VariableID:3038:4`
- corner-md `VariableID:3073:3` · space-lg `VariableID:3070:8` · space-sm `VariableID:3070:5`
- text style Label `S:4e034695df7aacfcebc7042471b1b11284b266f0,` · effect Elevation `S:92c2d7acdbd9a927e19bec091e19cef343c66b42,`
- page Components `3126:2`.

Built nodes:
- Section "Tooltip" `4381:2356` (headline `4381:2357`) via /figma-create-section, auto-placed x=14704.
- COMPONENT "Tooltip" `4382:2356` — HORIZONTAL auto-layout chip, `clipsContent=false`. Bindings:
  fill→dialog-fill, stroke→border (1px), 4× corner→corner-md, paddingLeft/Right→space-lg,
  paddingTop/Bottom→space-sm, itemSpacing→space-sm, effectStyle→Elevation.
- **content SLOT** `4384:2356` (set-level prop `content#4384:0`), `{Label}` text default (Label style,
  dialog-ink). **DESIGN REFINEMENT vs the T3 plan:** modelled the content region as a SLOT, not a single
  TEXT property — the code's `children` is open/variably-many (text, OR text + Kbd), so per
  /figma-build-rules §Mechanism "open, variably-many children → Slot". A bare TEXT prop couldn't host the
  WithKbd composition (Done-Test). Faithful code↔Figma: both = a free children region.
- arrow RECT `4382:2358` — 10×10, corner 2px, fill→dialog-fill, rotated -45° (diamond),
  `layoutPositioning=ABSOLUTE`, bottom-center, half-overlapping the bottom edge (the pointer).

## T5 — Verify — CLEAN
- **Controls-live PASS:** instantiated the component, drove the `content` slot, read back "Add to library". ✓
- **/figma-verify CLEAN:** 0 text-as-icon · 0 clipped · 0 overlap · 0 padding-asymmetry (tree-walk on
  component + usage group). Arrow-on-chip overlap is by-design (absolute child of an AL frame → skipped per
  verify Step 4, like Slider thumb-on-track C3). The WithKbd "⌘S" is 2 chars (⌘+S, not a lone always-icon
  glyph) AND is the Kbd component's own faithful content → not flagged.
- **Permanent Usage-Examples group** `4385:2366` (reproduced from controls only — Done-Test held):
  - Default `4385:2370` — slot = "Add to library".
  - WithKbd `4385:2382` — slot = "Save changes" + nested real `.Kbd` instance `4385:2390` (⌘S,
    high-emphasis). Real instance (token+component propagation), not re-clothed.
- Screenshot eyeballed: light raised chip + down diamond arrow + elevation; both example chips correct.
- Lock RELEASED 16:18:44 immediately after verify, before this T7 doc work.

**Scope note:** Placement (4 sides) + IconTrigger stories don't change the CHIP surface (placement =
positioning; icon-trigger = the trigger element, not the content) → 2 distinct chip examples in Figma
(Default + WithKbd) cover the surface; the other two are code-story-only compositions.

## T6 — Code + Gate
Rewrote `tooltip.tsx` on DS utilities per the T3 table + docgen-annotated:
- `TooltipProps` (Root): Omit+re-declare `open`/`defaultOpen`/`onOpenChange`/`delayDuration` with JSDoc.
- `TooltipContentProps`: Omit+re-declare the placement API `side`/`sideOffset`/`align`/`alignOffset`.
- Provider/Trigger stay pass-through (no curated own-props). `radix-ui` umbrella kept (B13).
- Re-exported folder in `libs/ui/src/index.ts` (after textarea, alpha order).
- Icon-trigger story uses the DS Button `icon` boolean + required `aria-label` (NOT `size="icon"`;
  the DS Button types size-`icon` only via the `icon` modifier + a type-level accessible-name contract).

**Gate (tooltip-scoped) — GREEN:**
- typecheck @agentport/ui ✓
- lint @agentport/ui ✓ (0 errors in tooltip files; the 46 repo-wide warnings are pre-existing, none in tooltip)
- test @agentport/ui: `tooltip.spec.tsx` 4/4 ✓ (jsdom, closed path) + `tooltip.stories.tsx` 4/4 ✓
  (Chromium + axe, incl. the hover→open play + the icon-trigger a11y story).

**ENV blocker (NOT my code):** the shared parent dir holds two sibling worktrees under
`.claude/worktrees/` (popover-port, toggle-group-port) → Nx saw duplicate `@agentport/ui`/`agentport`
projects ("defined in multiple locations") and refused to build the project graph. Fixed with an
UNTRACKED `.nxignore` (`.claude/worktrees`) + `nx reset` — not committed (env fix, not part of the port).
Additionally the sibling **popover** agent's UNTRACKED files (`libs/ui/src/components/ui/popover/*`) sit
in this shared `libs/ui` working tree, so the full `nx test` shows 3 popover-story failures
(axe `aria-dialog-name`) — those are the popover agent's, not tooltip's. My commit stages only tooltip paths.

## T7 — Example inventory + findings
Example inventory (doc usage-examples → stories):
- `tooltip-demo` (Button trigger + "Add to library") → **Default** (kept; the canonical playground + play).
- Side/placement options (doc shows side/align) → **Placement** (kept-distinct; 4 sides at once).
- Kbd-in-tooltip shortcut hint (doc pattern) → **WithKbd** (kept-distinct; Kbd is ported).
- Icon-only trigger a11y (doc note: trigger needs own name) → **IconTrigger** (DS-authored; proves the
  trigger-named/content-describes contract).
- No skipped examples (no un-ported deps; Button + Kbd both ported).
- No separate States gallery: tooltip is display-only with no pseudo-state axis (only open vs unmounted);
  per /storybook-rules a display-only component's gallery axis = content/placement → folded into Placement.

Findings: see skill-feedback.md (2 B-class codify, 1 confirming B20 evidence, + the env/Nx collision C5).

## T7 — Catalog + git
- **Catalog**: written as `catalog-entry.yaml` in this run dir (NOT merged into `components-reference.md`
  directly) — per team-lead instruction, because this worktree IS the shared main tree and popover-port
  edits the same catalog/`index.ts`; the lead merges both during consolidation.
- **Git**: NO commit, NO `git add` — per team-lead (shared-tree topology owned by the lead). The tooltip
  files + the `index.ts` tooltip-export edit are left in place, untracked/unstaged, for the lead to
  consolidate into a clean tooltip commit. `.nxignore` stays untracked (env fix).
- **Final gate (tooltip-scoped) GREEN**: typecheck ✓ · lint ✓ (0 errors in tooltip) · test ✓
  (tooltip.spec 4/4 jsdom + tooltip.stories 4/4 Chromium+axe; full lib run 268/268 passing).

## DONE
Code port + stories + spec + docgen + Figma set + usage-examples + verify all complete and green.
Only the lead-owned git consolidation remains (intentionally not done here).
