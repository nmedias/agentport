# /component-sync — skill feedback (run: 2026-06-12 radio-group)

Feedback on the component-sync SKILL itself (gaps + candidate fixes), captured on the spot. Not domain notes.

## 1. S2 read snippet doesn't cover a child ELLIPSE dot / non-VECTOR indicator
- **Gap:** `snippets/read-set-values.js` reads the member's own fill/stroke + a SLOT child (vector/instance/text),
  but the RadioGroup's inner dot is a plain **ELLIPSE child** (not in a slot, not a vector). The snippet would
  miss its fill binding entirely → the checked-invalid dot re-tint (`destructive-foreground`) would be invisible.
- **Impact:** had to hand-roll a variant of the snippet to `findAll(type==='ELLIPSE')` and read each dot's
  fill/radius/stroke. Any control with a non-slotted decorative child (radio dot, switch thumb-as-ellipse,
  indicator shapes) has the same blind spot.
- **Candidate fix:** broaden the snippet to also walk direct non-slot children that carry a bound fill
  (ELLIPSE / RECTANGLE / VECTOR not already captured), or add a generic "indicator children" pass:
  `m.findAll(n => ['ELLIPSE','RECTANGLE','VECTOR'].includes(n.type))` → report each one's fill var.

## 2. Member fill (surface) easy to overlook when code has no base fill
- **Gap:** the skill's S3 framing leans on "changed/re-bound value ⇒ utility swap", but a binding that is
  **newly present in Figma yet absent in code** (here: default `Input/input-background` fill — code circle was
  transparent) is an *addition*, not a swap. The crosswalk handles it, but the S3 prose only names swap /
  add-remove-variant; an "added property binding (was unstyled in code)" case would be worth calling out
  explicitly so it isn't read as "no change because the code never had a fill class".

## 3. use_figma tool now requires fileKey + description args
- **Minor / environment:** `mcp__plugin_figma_figma__use_figma` rejected the call twice until I passed both
  `fileKey` and a `description` (both required by the current tool schema). The SKILL's S2 ("run the snippet")
  and the snippet header don't mention these wrapper args. Worth a one-line note in S2 or the snippet header:
  "pass fileKey (config.json) + a short description to the use_figma tool wrapper."
