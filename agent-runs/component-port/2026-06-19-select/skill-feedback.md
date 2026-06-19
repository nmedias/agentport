# Skill-Feedback — Select-Port (2026-06-19)

Run: `/shadcn-component-port select` (Composite). Figma = Background-Agent `figma-select-build`, Code = main parallel.
Findings = Skill-Lücken + Kandidaten-Fixes. **Nicht mid-run angewandt** (Memory `skill-writing-style`). User reviewt.

## Figma-Build (figma-build.md / composites.md / snippets) — vom Background-Agent

**A. Slot-Merge passiert zur `combineAsVariants`-Zeit, NICHT danach.** *(verified: Instanz exponierte 6 un-merged
`leadingIcon#…`-Props)* — `§Slots` sagt „named consistently so it merges to ONE set-level SLOT property", aber nicht
WANN. `createSlot()` auf jedem Member eines BEREITS kombinierten Sets → N separate gleichnamige Props (kaputte
Instanz-API). Fix: Slots auf den **standalone Comps VOR `combineAsVariants`** bauen. Explizite Zeile in
`§Slots` / `§Variant set assembly`. *(= Deviation D3 dieses Runs: erst post-combine gebaut → gelöscht + neu.)*

**B. `member.x = section.x + N` DOPPEL-OFFSETet.** *(verified: content bei abs x≈21000 für Section bei x≈10600)* —
sharpens **#16**: Section-Kinder nehmen section-RELATIVE x/y (Headline liegt bei 80,80). Der Reflex `set.x = section.x + 80`
rendert bei `section.x + (section.x + 80)`. Fix: konkretes WRONG/RIGHT in `composites.md` + `build-variant-set.js` —
Kind-Koords sind **reine Offsets vom Section-Ursprung**, NIE `section.x` addieren.

**C. Sections wachsen NICHT automatisch mit den Kindern** — nach dem Positionieren `resizeWithoutConstraints` (hug),
sonst bleibt die Section headline-groß. Paart mit B. Gehört an die Section-Invariante in `figma-build.md`.

**D. Instanz-Slot-Default-Removal ist strikt EINS pro `use_figma`-Call** *(sharpens #48)* — selbst mit Re-Fetch per
stabiler ID wirft das ZWEITE `slot.children[0].remove()` im selben Tick „node not found". Eine guarded while-Schleife
funktioniert in EINEM Call NICHT — jedes Default-Kind braucht einen eigenen Round-Trip (3 Calls, um 3 Defaults zu leeren).
`§Slots` „Filling a slot in an instance" entsprechend verschärfen.

## Code-Seite (SKILL.md / composites.md / docgen-props / storybook-rules) — main

**E. `radix-ui`-Umbrella-Import für volle Primitives BEHALTEN — Finding #3 enger fassen.** Finding #3
(„Radix-Umbrella → per-primitive") galt dem **Breadcrumb-`Slot`-aus-`radix-ui`-Fall**. Für ein volles Primitive
(`Select`, `Dialog`) ist `import { Select as SelectPrimitive } from 'radix-ui'` die Projekt-Konvention (Dialog identisch)
und `radix-ui` eine **deklarierte** Dep. Composite-Dep-Audit (§2 T2) sollte unterscheiden: voll-Primitive-Umbrella behalten,
nur einzelne Sub-Imports (`Slot`) auf per-primitive umstellen.

**F. Composite-Doc-Prop über Root + Sub-Part → `meta.component` + `subcomponents`.** *(storybook-rules/docgen-props-Lücke)*
— Select hat dokumentierbare Props auf ZWEI Teilen: Root (`Select`: value/open/…) + Trigger (`SelectTrigger`: size). Die
Autodocs-ArgsTable zieht nur `meta.component`. Lösung: `component: Select` + `meta.subcomponents = { SelectTrigger }` →
zweite ArgsTable; der Sub-Part-Control (`size`) lebt als **Story-lokaler** arg auf Default (er erreicht den meta.component
nicht). Regel für `/storybook-rules` (Composite mit Prop-Split) + `/docgen-props` (Sub-Part annotieren, dann subcomponents).

**G. Radix Select braucht KEINEN jsdom-Polyfill, wenn die Specs nur „closed" rendern.** SelectContent liegt im Portal
(mountet erst on-open) → ein Spec, der nur Trigger/Root rendert, läuft ohne `scrollIntoView`/`hasPointerCapture`. Den
Open-Pfad (Dropdown) übers Chromium-Storybook-Projekt (play) abdecken. `§T6 Headless lib` könnte die „closed-render-spec
vermeidet den Polyfill"-Heuristik nennen.

## Build-Deviations (Domain, fürs Protokoll — nicht Skill)

- **D1** SelectItem-Check = Figma trailing Layout-Vektor (`pr-md`/`right-2`); Code = `absolute right-md` + `pr-3xl`-Clearance
  (shadcn-Idiom). Visuell äquivalent → für `/component-sync` als bekannte Struktur-Divergenz markiert, KEIN Token-Delta.
- **D2** SelectItem-Padding `pl-sm`(6)/`pr-md`(8) asymmetrisch (einziger verify-Hint) — gewollt.
- **D4** SelectLabel inline komponiert (kein eigenes Set) — Brief listet es als layer-3 slot content.
