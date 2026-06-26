# Skill feedback — component-port (2026-06-26-item)

Task: initial port of the shadcn `item` 10-part composite (Figma + code). User review of the Figma build
surfaced 5 issues; 2 are skill-process gaps that caused defects, 2 are minor codify points.

## A — gap caused a defect (priority)

### /shadcn-component-port (T3 recon) · also /figma-build-rules (recon.js)

**1 · Recon needle list omits the core `ink`/`foreground` + `surface` tokens → default-coloured elements fall back to raw hex (UNBOUND)**

| Field | Value |
|---|---|
| Why A | User-found defect: "einige elemente haben keine tokens siehe title." The Item title's text colour and the default media icon's fill were set to a raw hex (`#0d1217`), not bound to a DS variable — while *adjacent* elements (description, chevron) were correctly bound to `muted-ink`. |
| Gap | The recon step pulls the variables to bind, but the needle list is author-chosen and naturally gravitates to the "interesting" tokens (muted / accent / border / ring / primary). The **default full-strength foreground** (`Base/ink`) is the colour of the most common element (body title text, default icons) yet is the easiest to forget — there's no rule that the recon MUST always include the core `ink`/`foreground`, `surface`/`background`, and `card` tokens. Without the var id in hand, the build falls back to a raw colour and the binding is silently lost (looks right on screen, fails the token-faithful contract). |
| Verified | `get` on the title node (`4496:2472`): `fills[0].boundVariables = {}`, `color = {0.05,0.07,0.09}` (raw). `Base/ink` exists as `VariableID:3037:3` — it was simply never reconned (needles were `muted-ink/accent/border/ring/primary` only). Same raw fill on the default media icon. |
| Candidate fix | Recon (T3 / recon.js) must ALWAYS include the core foreground/surface tokens in the needle list — at minimum `ink`/`foreground`, `surface`/`background`, `card`(-fill/-ink) — even when the component "looks like it only uses muted/accent". Add a checklist line to T3: *every text node and every default icon needs a bound colour; the default is `ink`, not a raw hex.* A post-build guard (the verify triad) could also flag any TEXT/VECTOR fill with `boundVariables == {}` as a likely missed binding. |
| Status | open |

### /figma-build-rules (§Composites · §Mechanism)

**2 · A built part-component must be (a) NESTED as the parent slot's default AND (b) own its variable content as a SLOT — neither was enforced**

| Field | Value |
|---|---|
| Why A | Two user-found defects from one root: (#1) "warum wurde item media nicht als component benutzt?" — the Item `media` slot's default was a raw icon frame, not an instance of the `.ItemMedia` component I had built. (#5) "bei item media kann das icon/image nicht gewechselt werden" — the `.ItemMedia` set has only a `variant` prop, no slot, so its glyph/image are baked and un-swappable. |
| Gap | §Composites says "code composes an already-built component X → Figma nests an instance of X (never re-clothe)" and §Slots says swappable content = a slot — but neither rule is stated as a COMPOSITE-COMPLETENESS check that bites at build time: (a) when a part-component (`ItemMedia`) exists, the parent's corresponding slot DEFAULT must be an *instance* of it, not a re-clothed copy; (b) that part-component's own variable content (the glyph/image) must itself be a slot, or the part is a dead-end (can't be filled). Building the part-set and the parent-slot independently makes it easy to leave both disconnected — the part renders, the parent renders, nothing flags that they don't compose. |
| Verified | media slot (`master.findOne('media')`) child = `{type:FRAME, name:icon}` (raw, not an INSTANCE). `.ItemMedia` set (`4500:2477`) `componentPropertyDefinitions` = `["variant"]` only — no SLOT/INSTANCE_SWAP, so content is non-fillable. |
| Candidate fix | §Composites completeness rule: **for every part that is itself a built component X, (a) the parent's X-region slot DEFAULT = a nested instance of X (set its representative variant), never a re-clothed primitive; (b) X's own open/variable content (icon glyph, image, avatar) = a SLOT on X.** Add to the Done-Test: "can the user swap the part's content from controls?" — if X has no slot/swap for its variable content, the surface is incomplete. Verify structurally (which main is nested in the slot), not by screenshot. |
| Status | open |

## B — minor / reinforces an existing rule (codify · deferred)

### /figma-build-rules (§Interaction states · Red flags)

**3 · The focus ring is a per-component LITERAL drop-shadow — applying a named/generic effect style is a trap**

| Field | Value |
|---|---|
| Why B | User-found defect (#3) but against an EXISTING rule, not a new gap: "der focus state ist nicht richtig abgebildet." I applied the file's generic `Glow` effect style to the focus example, which turned out to be a cyan `#009fe3@50%` blur (radius 4, spread 0, showBehind true) — not the focus ring (`ring-ring/50` = slate `#4a5562@50%`, spread 3, showBehind false). §Interaction states already says "Copy the glow effect verbatim from an existing focus template, don't reconstruct" and "never bind the effect colour to a variable." |
| Gap | The rule exists but doesn't warn about the specific trap: a file may ship a NAMED effect style called `Glow`/`Focus` that is NOT the component focus ring — applying it *feels* correct (it's literally named "Glow") but is the wrong colour/spread/flag. |
| Verified | `getLocalEffectStylesAsync` → `Glow` = `DROP_SHADOW radius4 spread0 color{0,0.62,0.89,a:0.5} showBehind:true`. Button catalog documents the correct focus ring as raw `#4a5562@50%`, spread 3. |
| Candidate fix | Red-flag / common-rationalisation row: "A named `Glow`/`Focus` effect style ≠ the component focus ring — don't apply it. The focus ring is a per-component LITERAL drop-shadow (spread = the `ring-[Npx]` width, colour = the ring token's hex at the `/NN` alpha, `showShadowBehindNode:false` on fill-less nodes). Copy it from a verified sibling focus member (Button/Select), never from a same-named style." |
| Status | open |

### /figma-build-rules (§Composites)

**4 · Which structural-only container parts become Figma components is unspecified**

| Field | Value |
|---|---|
| Why B | User-found inconsistency (#4): "item group ist keine component. warum." I built `Item` + `ItemMedia` as components but used a plain frame for `ItemGroup` in the example. ItemGroup is a real named part (role=list, responsive gap) but is layout-only and its `has-data-[size]` responsive gap can't be expressed in Figma. |
| Gap | §Composites lists the part mechanisms (slot / swap / variant / nested instance) but doesn't say whether a layout-only container part (group/header/footer wrapper with no surface and no tokens beyond gap) should be its OWN component or just a frame in the usage examples. This leaves an inconsistency: some parts become components, structural wrappers don't, with no stated rule. |
| Verified | The example "ItemGroup" is a `FRAME`, not a COMPONENT/instance. ItemGroup's code logic (`gap-xl / has-data-[size=sm]:gap-lg / has-data-[size=xs]:gap-md`) has no Figma equivalent (no conditional gap). |
| Candidate fix | §Composites note: a layout-only container part (no surface, no per-variant tokens, behaviour Figma can't express) MAY be a simple component (auto-layout + gap + an items slot) for catalog completeness/consistency, or a documented frame in the usage examples — but pick one rule per build and state it. If the parent set + a media-style part are components, prefer making the named container parts components too (consistency) unless they carry zero reusable structure. |
| Status | open |
