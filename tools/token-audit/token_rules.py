"""T7 — per-token word bans for the role text of the doc-section token column.

READ THIS TABLE IN REVIEW. It is deliberately a separate, commented module: the gate can only ever
check *structure*, never meaning. Every rule here encodes one sentence from
`design-docs/design-system/tokens-reference.md` (`## Rules`, the token's `use`, or the §6 migration
table `color_renames`) as a machine-checkable word ban on the ROLE TEXT that `doc-overrides.json`
gives a token in one section. Whether a role text is genuinely *speaking* stays reviewer work.

Each rule is a dict:
    token   the canonical token whose role text is being checked (exact match)
    forbid  list of lowercase words / phrases that must NOT appear in that role text
    why     the sentence in tokens-reference the ban comes from — quoted, so a reviewer can verify
            the ban instead of trusting it
    allow   substrings that neutralise a hit (checked first) — used where the banned word is legal
            as an explicit token reference, e.g. "muted-fill" contains "muted"
    forbid_re  optional; list of (regex, human label) for bans that need context rather than a word,
            e.g. `ring` may say "border" only inside the phrase "focus border"

Two of the rules are GENERATED rather than listed, because they hold for a whole family and a listed
table would rot the moment a token is added:

  * pair_rule   — for every `<x>-ink` token: its role text may not name a surface token other than
                  its own `<x>-fill` partner. Source: "`-ink` = text / icon on exactly one `-fill`"
                  (## Rules, Naming) plus every `<x>-ink` `use` sentence ("Text / icon on <x>-fill
                  only."). This is what would have caught the August finding "muted-ink as generic
                  secondary text": `muted-ink`'s role may not mention `card-fill`, `surface`, … —
                  de-emphasised text on any *other* surface is `muted`, not `muted-ink`.
  * standalone  — the standalone colours have no surface partner, so their role text may not describe
                  them as a surface. Source: "Standalone colours (`ink`, `primary`, `muted`,
                  `brand-ink`) have no surface partner: scope `SHAPE_FILL` + text, **no** `FRAME_FILL`
                  … never as a container surface."
"""

# --- vocabulary ---------------------------------------------------------------------------------

#: `## Rules` → "Group words (primary, secondary, accent, brand, muted, inverse) are never used as
#: adjectives in another token's description — only as explicit references ("use accent-fill")."
#: Enforced in T5, not here: the gate allows a group word inside the role of a token that BELONGS to
#: that group (secondary-fill may say "secondary"), and bans it everywhere else.
GROUP_WORDS = ["primary", "secondary", "accent", "brand", "muted", "inverse"]

#: The three words that turn a role text into a surface claim. `## Rules` phrases the ban as
#: "never as a container surface"; these are the words a role text realistically uses for it.
SURFACE_WORDS = ["surface", "background", "container"]

#: Standalone colours — no `-fill` partner, SHAPE_FILL + TEXT_FILL only (## Rules, Naming).
STANDALONE = ["ink", "muted", "primary", "brand-ink"]

#: Words that name *a* surface generically. Used by the generated pair rule together with the
#: concrete `-fill` token names taken from tokens-reference.
GENERIC_SURFACE = ["any surface", "other surfaces", "every surface", "all surfaces"]


# --- the explicit table -------------------------------------------------------------------------
#: Bans that do not follow from a family pattern. Keep this list short and quote the source.
WORD_BANS = [
    {
        "token": "muted",
        "forbid": SURFACE_WORDS,
        "allow": ["muted-fill"],
        "why": "use: 'De-emphasised text, icon or marker on surfaces other than muted-fill … "
               "Shape fill only — no frame fill (surfaces use muted-fill).' — the role of `muted` is "
               "text/marker; a surface role belongs to muted-fill.",
    },
    {
        "token": "primary",
        "forbid": SURFACE_WORDS,
        "allow": ["primary-fill"],
        "why": "use: 'Emphasis colour for interactive text and glyphs … Shape fill only — no frame "
               "fill (surfaces use primary-fill).' — §6 color_renames repeats it: bg-primary as a "
               "container surface is bg-primary-fill.",
    },
    {
        "token": "ink",
        "forbid": SURFACE_WORDS,
        "allow": ["inverse-fill"],
        "why": "use: 'Default text / icon colour. Shape fill only — no frame fill (dark surfaces use "
               "inverse-fill).'",
    },
    {
        "token": "brand-ink",
        "forbid": SURFACE_WORDS,
        "allow": ["brand-fill"],
        "why": "use: 'Signal-blue text, icon or marker on brand-fill only … Shape fill only — no "
               "frame fill.'",
    },
    {
        "token": "accent-fill",
        "forbid": ["action"],
        "allow": ["secondary-fill", "primary-fill"],
        "why": "use: 'Tint that marks state … Not an action surface (that is secondary-fill / "
               "primary-fill).' — calling accent-fill an action surface inverts the token.",
    },
    {
        "token": "accent-border",
        "forbid": ["focus"],
        "allow": [],
        "why": "use: 'Edge of an accent-fill area … Not a focus ring (use ring).'",
    },
    {
        # 2026-09-04: the old ban forbade the word "border" outright and failed seven role texts that
        # read "focus border + ring/50". The DS decided the Figma reality wins — the focused control
        # really is drawn as a ring-bound border — so tokens-reference now names the focus border as
        # the legitimate use (agentport 6354abe). What stays banned is the CONFUSION the sentence
        # delimits against: ring as a resting edge, or as a selection edge.
        "token": "ring",
        "forbid": ["selection", "selected", "resting", "divider", "outline variant"],
        "forbid_re": [
            # "border" is only allowed as part of the focus border; a bare / resting "border" is not
            (r"(?<!focus[ -])(?<!keyboard[ -])\bborders?\b", "border (not qualified as the focus border)"),
        ],
        "allow": ["border-ring", "input-border", "accent-border", "border-emphasis", "border-strong"],
        "why": "use: 'Keyboard-focus indicator on light surfaces - drawn as the focus border of the "
               "control plus its ring/50 outline ... Only for focus: the resting edge stays border or "
               "input-border, the selected / active edge is accent-border.'",
    },
    {
        "token": "brand-fill",
        "forbid": ["chrome", "functional"],
        "allow": ["inverse-fill"],
        "why": "use: 'Dark surface reserved for brand moments … Not for functional dark chrome (use "
               "inverse-fill).'",
    },
    {
        "token": "inverse-fill",
        "forbid": ["brand"],
        "allow": ["brand-fill"],
        "why": "use: 'Dark functional surface … Not for brand moments (use brand-fill).'",
    },
    {
        "token": "destructive",
        "forbid": ["warning"],
        "allow": [],
        "why": "use: 'Colour of irreversible actions and errors … Not for warnings (no token yet).'",
    },
    {
        "token": "dialog-fill",
        "forbid": ["in-flow", "in flow"],
        "allow": ["card-fill"],
        "why": "use: 'Surface of anything floating above the layout … For in-flow panels use card-fill.'",
    },
    {
        "token": "card-fill",
        "forbid": ["floating"],
        "allow": ["dialog-fill"],
        "why": "use: 'Raised / secondary panel surface.' — floating surfaces are dialog-fill "
               "(dialog-fill use: 'For in-flow panels use card-fill').",
    },
    {
        "token": "input-ink-placeholder",
        "forbid": ["helper", "value"],
        "allow": [],
        "why": "use: 'Placeholder / hint text inside a field. The entered value uses ink; helper text "
               "outside the field uses muted.'",
    },
    {
        "token": "input-fill-high",
        "forbid": ["filled", "on state", "checked"],
        "allow": ["primary-fill"],
        "why": "use: 'Resting track of a range or toggle control (the unfilled part). The filled / on "
               "part is primary-fill.'",
    },
    {
        "token": "border",
        "forbid": ["strongest", "dominant"],
        "allow": ["border-strong"],
        "why": "use: 'Default edge … Start here; step up only when a line must read stronger.' — the "
               "dominant line is border-strong.",
    },
    {
        "token": "shadow-glow",
        "forbid": ["depth", "elevation"],
        "allow": ["shadow-elevation"],
        "why": "use: 'Halo on an emphasised marker … Not a depth cue.'",
    },
    {
        "token": "scrim",
        "forbid": ["opacity"],
        "allow": ["scrim-opacity"],
        "why": "note: 'No opacity modifier on top of bg-scrim — the strength is already composed.'",
    },
]


def pair_rule(token, all_tokens):
    """Generated ban for a `<x>-ink` token: no surface other than its own `<x>-fill` partner.

    Returns None when `token` is not an `-ink` token whose `-fill` partner exists (standalone inks
    like `ink` / `brand-ink` are covered by the explicit table above).
    """
    if not token.endswith("-ink"):
        return None
    partner = token[: -len("-ink")] + "-fill"
    if partner not in all_tokens:
        return None
    others = sorted(
        t for t in all_tokens
        if t != partner and (t.endswith("-fill") or t in ("surface", "scrim"))
    )
    return {
        "token": token,
        "forbid": others + GENERIC_SURFACE,
        "allow": [partner],
        "why": f"`-ink` = text / icon on exactly one `-fill` (## Rules, Naming); {token} pairs with "
               f"{partner} only — a role naming another surface means the wrong token is bound.",
    }


def rules_for(token, all_tokens):
    """All T7 rules that apply to `token`: the generated pair rule plus every explicit entry."""
    out = []
    pr = pair_rule(token, all_tokens)
    if pr:
        out.append(pr)
    for r in WORD_BANS:
        if r["token"] == token:
            out.append(r)
    return out
