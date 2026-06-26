# Component Port — item (shadcn → Figma → Code)

| | |
|---|---|
| **Component** | `item` (10-part composite) |
| **Date** | 2026-06-26 |
| **Branch** | `feat/shadcn-item-port` |
| **Source** | `@shadcn` · item · style `radix-nova` (registryDependencies: `separator`) |
| **Skill** | `/shadcn-component-port` (+ `/component-sync` refs `composites.md`, `/figma-build-rules`, `/storybook-rules`, `/docgen-props`, `/figma-verify`) |
| **Gate** | green — `npx nx test|typecheck|lint @agentport/ui` (300/300, lint 0-err, typecheck ✓) |

Use-case driver: `item` is the substrate for the explorer **NavListItem** (record-type list,
`/shadcn-component-analysis/explorer.md`). Generic list-row → Root-Barrel primitive (not a block).

## Composition decisions (composite-ask, T2.7)

- **Full 10-part family** ported (user choice over a 6-part subset) — Header/Footer/Group/Separator are
  thin structural divs, kept for shadcn parity + generic reuse.
- **Selection stays a call-site/block concern (Option A)** — `Item` is stock-faithful (no `selected`
  prop). The `ListNavigator` block applies `aria-current` + the DS accent tint. Contrast `SelectItem`,
  which has a `selected` axis only because Radix gives it an intrinsic selected state; generic `Item`
  deliberately does not.
- **hover / focus are link-only by design** — `[a]:hover:bg-muted-fill` is gated to `<a>`; the
  `focus-visible` ring class is always present but a bare `<div>` isn't focusable → both states only
  manifest on the `asChild` link form. Documented, not invented.

## Dependency audit (composite)

`ui:add item` wrote **flat** `separator.tsx` (stock) + `item.tsx`. `separator` is already a DS folder →
the flat stock copy **shadows** the folder (`<dep>.tsx` beats `<dep>/` in resolution; typecheck stays
green on a lie). **Deleted the flat `separator.tsx`**; `item.tsx`'s `@/components/ui/separator` import
now resolves to the folder barrel. `radix-ui` (Slot) already installed. No lucide icons in the source.

## T3 — stock → DS mapping (the why)

| Part | Stock | DS | Why |
|---|---|---|---|
| Item base | `rounded-lg` | `corner-lg` | rounded-* dead (radius vocab = corner-*); lg = 8px exact |
| Item base | `text-sm` | `text-format-body` | font-size dead; neutral row default (14/400) — title/desc override |
| Item base | `[a]:hover:bg-muted` | `[a]:hover:bg-muted-fill` | colour-rename (§6); link-gated hover |
| Item base | `focus-visible:border-ring ring-[3px] ring-ring/50` | **unchanged** | already DS vocab (= badge/button/input/select) |
| Item muted | `bg-muted/50` | `bg-muted-fill/50` | colour-rename + opacity modifier |
| Item size default/sm | `gap-2.5 px-3 py-2.5` (10/12/10) | `gap-lg px-lg py-lg` (12) | **10px is off-grid** — no DS step at 10; snapped to lg. House snaps (no `2.5`/`[10px]` anywhere in the lib; CommandItem/SelectItem all use named steps). Chose lg (12) over md (8) to keep a comfortable default row + a full-step gap vs xs |
| Item size xs | `gap-2 px-2.5 py-2` (8/10/8) | `gap-md px-md py-md` (8) | gap/py = 8 exact (md); px-2.5(10) snapped down to md(8) |
| ItemGroup | `gap-4 / sm:gap-2.5 / xs:gap-2` | `gap-xl / sm:gap-lg / xs:gap-md` | 16=xl exact; 10→lg; 8=md exact |
| ItemMedia | `gap-2` · image `rounded-sm` | `gap-md` · `corner-sm` | 8=md; rounded-sm→corner-sm (4px) |
| ItemContent | `gap-1` | `gap-xs` | 4=xs exact |
| ItemTitle | `text-sm leading-snug font-medium` | `text-format-label` | 14/500 → label (closest role: list-row title as a label-weight text) |
| ItemDescription | `text-sm leading-normal font-normal text-muted-foreground` | `text-format-body text-muted-ink` | 14/400 → body; colour-rename |
| ItemDescription | `group-data-[size=xs]/item:text-xs` | **dropped** | text-xs (12px) is dead AND there's no smaller sans format (smallest sans = 14). Dropped (dead anyway); xs description stays at body size. ⚠ logged |
| ItemTitle/Actions/Header/Footer | `gap-2` · Separator `my-2` | `gap-md` · `my-md` | 8=md |
| ItemDescription link | `[&>a:hover]:text-primary` | **unchanged** | sanctioned link colour (= badge/button `link`, field.tsx verbatim) |
| `in-data-[slot=dropdown-menu-content]:p-0` (xs) | **kept verbatim** | dropdown-menu un-ported; harmless dead selector, auto-activates if ported later (shadcn parity) |

cn() T1: no new at-risk utility family introduced (corner/text-format/named-spacing/shadow already
registered in `utils.ts`).

## Figma build (T4/T5) — `Shadcn Components` page (3126:2)

Section **Item** `4494:2471` (headline `4494:2472`).

- **`.Item` set** `4498:2551` — `variant`[default·outline·muted] × `size`[default·sm·xs] = **9 members**.
  Props: `media#4498:0` (SLOT, default check-circle icon), `actions#4498:1` (SLOT, default chevron),
  `title#4499:0` (TEXT `{Title}`), `description#4499:10` (TEXT `{Description}`).
  Members: default/default `4498:2491`, default/sm `4498:2501`, default/xs `4498:2511`, outline/default
  `4495:2471` (master), outline/sm `4498:2471`, outline/xs `4498:2481`, muted/default `4498:2521`,
  muted/sm `4498:2531`, muted/xs `4498:2541`. 3×3 wrapped grid, variant-major.
- **`.ItemMedia` set** `4500:2477` — `variant`[default·icon·image] (3 members).
- **Usage Examples** group `4501:2471` — **Type list** block `4501:2472` (3 muted instances driven by
  the TEXT props: invoice/contract/document) + **States** block `4502:2498` (base `4502:2502` / hover
  `4502:2523` muted-fill override / focus `4502:2544` ring+Glow / selected `4502:2565` accent-fill +
  accent-ink title, the call-site contract).

**Scoping decision (state axis):** `variant × size = 9` set members, NOT a 27-member `variant×size×state`
matrix. The state delta (hover tint, focus ring) is **uniform** across variant×size → 18 of 27 would be
redundant. The interaction states (base/hover/focus/selected) are reproduced in the **Usage-Examples
States block** (mirrors the `AllStates` story 1:1), which is faithful (states are uniform call-site/link
overlays, not designed per-variant-per-size) and non-redundant. The two genuine design axes are the set.

**Vars bound:** muted-fill `3037:12`, muted-ink `3037:13`, accent-fill `3037:14`, accent-ink `3038:2`,
border `3038:4`, ring `3038:6` · space-xs `3070:4`, space-md `3070:6`, space-lg `3070:8`, corner-sm
`3073:2`, corner-lg `3073:4`. Styles: Label `S:4e034695…b266f0`, Body `S:7e1bf8f1…2911fb`. Effect: Glow
`S:768ea662…1005fa7` (focus state).

**Verify triad:** controls-live ✅ (every variant/size drives; title/desc text props take; media+actions
slots present on all members) · **figma-verify CLEAN** ✅ (0 flags — 40 text all typography, 33 icons all
real vectors, no clipped/overlap/pad-asym) · examples reproduced as permanent instances ✅.

## Example inventory (doc usage-examples → stories)

| Doc example | Disposition |
|---|---|
| Basic | kept → `Default` playground (icon media + content + action button) |
| Action (Button + Badge) | kept → `WithActions` |
| Variants (default/outline/muted) | kept → `Variants` gallery |
| Size (default/sm/xs) | kept → `Sizes` gallery |
| Icon | folded into `Default` / `WithActions` (ItemMedia variant=icon) |
| **Avatar** | **SKIPPED** — `Avatar` component not ported (skip-rule). `image` variant covers the thumbnail case without it |
| Image | kept → `WithImage` (plain `<img>`, no Avatar dep) |
| Group | kept → `Group` (ItemGroup + ItemSeparator; role=listitem at call site) |
| Header | kept → `WithHeaderFooter` (covers ItemHeader + ItemFooter) |
| Link | kept → `Link` (asChild `<a>`; carries the play test — Item's only interactive form) |
| **Dropdown** | **SKIPPED** — `dropdown-menu` not ported (skip-rule) |
| — | added `AllStates` (interaction-state gallery via pseudo-states addon; not a doc example) |

Story files: `item.stories.tsx` (UI/Item) + `item-media.stories.tsx` (UI/Item/ItemMedia, per-API-part
page — only Item + ItemMedia have curated props; the 8 prop-less pass-throughs are documented via the
usage stories). a11y fix: `ItemGroup role="list"` requires `role="listitem"` children at the call site
(axe `aria-required-children`) — applied in the `Group` story.

Preview: `ui-item--default` · `ui-item--all-states` · `ui-item--group` · `ui-item-itemmedia--default`
· `ui-item-itemmedia--kinds` (http://localhost:6006).

## Open items

- ⚠ **xs description size**: stock `group-data-[size=xs]:text-xs` (12px) dropped — no sub-14 sans format
  in the DS. xs descriptions render at body (14px). Revisit if a smaller sans rung is ever added.
- `in-data-[slot=dropdown-menu-content]:p-0` kept verbatim — dead until `dropdown-menu` is ported.
- `ItemMedia` `image` variant in Figma uses a flat gray placeholder (no image bytes); `default` member
  uses a mono `IN` placeholder.
- State axis is examples-only by design (see scoping decision) — extend `.Item` to a 27-member
  `variant×size×state` matrix only if the redundancy is later wanted.

## Review fixes (2026-06-26, user review)

User review of the Figma build found 5 issues — all confirmed real defects/inconsistencies from rushing
T4. Skill-process gaps logged in `skill-feedback.md` (A1 recon ink-tokens, A2 composite part nesting +
slot; B3 focus-glow trap, B4 container-component scoping). Fixes applied:

1. **ItemMedia nested** — each Item member's `media` slot default is now a nested `.ItemMedia` instance
   (variant=icon), not a raw icon frame (was re-clothed instead of nesting the built component).
2. **Title + default icon bound to `ink`** — recon had omitted `Base/ink` (`3037:3`), so the title text
   colour + default icon fill were raw hex. Bound all 9 member titles + the ItemMedia icon default to ink.
3. **Focus ring corrected** — the States/Focus example used the generic `Glow` effect style (cyan
   `#009fe3@50%`, spread 0) — wrong. Replaced with the verified `ring-ring/50` 3px DROP_SHADOW (slate
   `#4a5562@50%`, spread 3, showShadowBehindNode false) copied verbatim from the Select focus member
   (`4308:2001`).
4. **ItemGroup is now a component** (`4511:2575`, `items#4511:0` slot) — was a plain frame in the example.
   Layout-only (the responsive `has-data-[size]` gap can't be expressed in Figma; gap-xl fixed).
5. **ItemMedia content is swappable** — rebuilt `.ItemMedia` (`4508:2544`) with a `content#4508:3` SLOT
   per member (was a baked glyph/image with no slot). Old slot-less set `4500:2477` deleted.

Re-verified: **figma-verify CLEAN** (0 flags). 7 remaining unbound text fills = example
scaffolding (headline + captions), not component surfaces — consistent with sibling sections.
