# Skill Feedback — /component-sync (run: 2026-06-12 Switch sync)

Capture-on-the-spot feedback for improving the `/component-sync` skill. Feedback only — not domain
notes (those live in `notes.md`). One agent in a 3-way concurrent read-only batch (Switch).

## Finding 1 — No explicit "no-delta / premise-mismatch" branch in the skill

**Gap.** The prompt asserted the user "made token adjustments" to `.Switch`, but the live S2 read
came back byte-for-byte identical to the original port bindings — zero delta. The SKILL covers the
happy path (S3 produces a delta → S4 applies it) and mentions "A delta-free, deviation-free run → one-line
note is fine" (S6), but gives no guidance for the case where the *stated reason for the sync does not
match Figma*. An agent that trusts the prompt's premise over the read could hallucinate a change to
"satisfy" the task (exactly the `/component-sync` red flag "Rewrite beyond the delta").

**Why it bit here.** The instinct to "find the adjustment the user mentioned" pulls against the
token-faithful rule. The skill's own red-flag table is the correct answer, but it's framed as
"don't over-rewrite," not "the read overrides the prompt's claimed reason."

**Candidate fix.** Add one line to S3 (or the Red-flags table): *"The live Figma read is the only
source of the delta — if it matches the code, the delta is empty even when the task description claims
a change was made. Report no-delta; do not synthesize an edit to match the prompt's premise. Re-read
once to rule out a stale/ wrong-node read before concluding no-delta."* This makes the empty-delta
outcome a first-class, expected result rather than a surprise.

## Finding 2 — `read-set-values.js` assumes a TEXT/SLOT-bearing member; Switch is geometry-only with a moving child

**Gap.** The shipped `snippets/read-set-values.js` reads the **member fill/stroke/radius** plus a
TEXT node, a SLOT, and per-member auto-layout — the shape of a Badge/Input/Field member. A Switch
member has **no text, no slot, no auto-layout**; its salient second element is the **thumb** (a child
ELLIPSE that carries its own fill + radius + must be diffed separately). Running the snippet verbatim
would read only the track and silently miss the thumb binding (`background` 3037:2) — a real
per-member token that must be reconciled.

**Why it bit here.** I had to hand-adapt the snippet (add a `thumb = kids.find(ELLIPSE|RECT|FRAME)`
branch reading `thumb.fills` / `thumb.cornerRadius` / `thumb.effects`). The generic SLOT-content
reader in the snippet (vector/instance/text) does not cover "a second painted sub-element that is part
of the control anatomy" (thumb, radio dot, checkbox indicator-box-vs-glyph).

**Candidate fix.** Either (a) note in S2 that for two-part controls (switch thumb, radio dot, slider
handle) the agent must read the moving/indicator child's fill+radius+effects in addition to the root,
and the snippet is a starting point to extend; or (b) generalize the snippet to also dump direct
painted children (non-text, non-slot) with their own fill/stroke/radius var bindings. (b) is the more
robust fix since checkbox/radio/switch are now all in the DS and all have this shape.

## Finding 3 — A bound binding the code expresses differently is a DELTA, not a "deviation" to preserve

**Gap.** The sync read the invalid track **fill** bound to `destructive ⚠` while the code kept
`bg-input`/`bg-primary` + an additive border/glow, and logged it in the Deviations table as an
acceptable *pre-existing modelling deviation* ("faithful to the role, not the literal full-fill") —
then concluded NO DELTA. That is exactly the skill's red flag *"re-judge a correct binding by
use/avoid."* A **bound** variable on a property the code renders differently is a tier-1 delta that
must be propagated; "deviation" status (S3 tier 2 / S6) is only for a **raw/unbound** value tokenised
by role, or a binding **flagged as a designer error** — never a license to NOT apply a live bound
value because the code's current expression seems reasonable. The user then reported the visible bug
(checked-invalid switch stayed cyan), confirming the binding should have been applied.

**Verified.** Live read: `default/invalid` + `sm/invalid` track fill = `destructive ⚠` (3038:3),
bound. Code: `data-checked:bg-primary`/`data-unchecked:bg-input` (no destructive fill) → on
checked-invalid the cyan fill won. Orchestrator applied `aria-invalid:data-checked:bg-destructive` +
`aria-invalid:data-unchecked:bg-destructive`; gate green; visual now matches Figma.

**Candidate fix.** Tighten S3 + the Red-flags table: *"If a property is **bound** in Figma but the
code renders it with a different utility, that IS the delta — apply it (tier 1, map 1:1). Do NOT file
it under Deviations to avoid changing the code; Deviations are only raw/unbound values picked by role
or bindings flagged as designer errors. 'The code's current treatment is role-faithful' is not a
reason to skip propagating a live bound value."* Pairs with Finding 1: an empty delta requires that
every bound property already matches the code — a bound property the code expresses differently is
**not** an empty delta.
