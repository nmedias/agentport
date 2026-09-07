#!/usr/bin/env python3
"""Deterministic audit of the TOKEN column of the doc sections (Agentport DS).

usage: check.py --all [--only Button,Badge] [--figma dumps/figma.json] [--code dumps/code.json]
                      [--catalog <components-reference.md>] [--tokens <tokens-reference.md>]
                      [--overrides <doc-overrides.json>] [--quiet-info]

exit 0 = all PASS, 1 = at least one FAIL. One line per check:
    PASS|FAIL <Section> <check-id> <detail>      counted, FAIL sets the exit code
    WARN      <Section> <check-id> <detail>      reviewer decision, never fails the gate
    INFO      <Section> <check-id> <detail>      context for the reviewer (the `use` sentences)

THREE SOURCES, THREE JOBS (rule of 2026-09-04, agent-runs/token-column-audit/2026-09-04/goal.md):
  * the Figma SET says what the component BINDS  -> the target set of chips (T1). The only truth for
    it; never check the column against tokens-reference instead, that yields complete but wrong columns.
  * the CODE (libs/ui DS utilities) says what is USED -> counter-check (T2). The utility->token
    mapping comes from tokens-reference, never from a hand-kept list here.
  * tokens-reference says what EXISTS and what a token generically means -> canonical names (T3),
    the structural pair rule (T6), the per-token word bans (T7, table in token_rules.py) and the
    `use` sentence the reviewer reads next to the role text (INFO).

THIS SCRIPT IS SHARED AND READ-ONLY FOR WORKERS. A worker fixes Figma / doc-overrides, never the gate.
"""
import argparse
import json
import os
import re
import sys

import yaml

import token_rules

HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
AGENTPORT = os.environ.get('AGENTPORT', REPO_ROOT)

ap = argparse.ArgumentParser()
ap.add_argument('--all', action='store_true', help='check every section in the catalog')
ap.add_argument('--only', default=None, help='comma-separated section names')
ap.add_argument('--figma', default=os.path.join(HERE, 'dumps/figma.json'))
ap.add_argument('--code', default=os.path.join(HERE, 'dumps/code.json'))
ap.add_argument('--catalog', default=os.path.join(AGENTPORT, 'design-docs/design-system/components-reference.md'))
ap.add_argument('--tokens', default=os.path.join(AGENTPORT, 'design-docs/design-system/tokens-reference.md'))
ap.add_argument('--overrides', default=os.path.join(REPO_ROOT, 'tools/figma-doc/doc-overrides.json'))
ap.add_argument('--quiet-info', action='store_true', help='suppress the INFO use-sentence lines')
a = ap.parse_args()
if not a.all and not a.only:
    ap.error('nothing to do — pass --all or --only <Section,…>')

fails = 0
counts = {}


def out(ok, sec, cid, detail=''):
    global fails
    counts.setdefault(cid, {'PASS': 0, 'FAIL': 0})
    counts[cid]['PASS' if ok else 'FAIL'] += 1
    if not ok:
        fails += 1
    # `detail` states the DEFECT, so printing it on a PASS line reads as a false alarm — FAIL only.
    print('FAIL', sec, cid, detail) if not ok else print('PASS', sec, cid)


def warn(sec, cid, detail=''):
    counts.setdefault(cid, {'WARN': 0})
    counts[cid]['WARN'] = counts[cid].get('WARN', 0) + 1
    print('WARN', sec, cid, detail)


def info(sec, cid, detail=''):
    if not a.quiet_info:
        print('INFO', sec, cid, detail)


# =================================================================================================
# tokens-reference.md — the canonical token list, the utility->token map, the `use` sentences
# =================================================================================================
def yaml_blocks(text):
    for m in re.finditer(r'```yaml\n([\s\S]*?)```', text):
        try:
            yield yaml.safe_load(m.group(1))
        except Exception:
            continue


class TokenRef:
    """Everything the gate needs from tokens-reference.md, parsed — never hard-coded."""

    #: The two Effect Styles of §5. `shadow-glow`/`shadow-elevation` are the CSS/utility names, the
    #: Figma styles (and therefore the chips) are `effect:Glow` / `effect:Elevation` (§5 effects_model).
    EFFECT_STYLE = {'shadow-glow': 'effect:Glow', 'shadow-elevation': 'effect:Elevation'}

    #: §3 space_utilities.families + negatives — the YAML lists p-/gap- as representatives only.
    SPACE_PREFIXES = ['gap', 'gap-x', 'gap-y', 'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
                      'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
                      'top', 'right', 'bottom', 'left', 'inset', 'inset-x', 'inset-y']
    #: §2 corner_utilities — all / sides / corners.
    CORNER_PREFIXES = ['corner', 'corner-t', 'corner-r', 'corner-b', 'corner-l',
                       'corner-tl', 'corner-tr', 'corner-br', 'corner-bl']

    def __init__(self, path):
        text = open(path).read()
        self.entries = {}       # token -> dict(use, note, utilities, kind)
        self.chips = set()      # every legal chip name (colour/dimension tokens + text:/effect: styles)
        self.utility = {}       # utility class -> chip name
        self.space_steps = []
        self.corner_steps = []
        text_styles = []
        for block in yaml_blocks(text):
            if isinstance(block, dict):
                for key in ('typo_format',):
                    if key in block and isinstance(block[key], dict):
                        raw = block[key].get('text_styles', '')
                        text_styles = [s.strip() for s in str(raw).split('—')[0].split('·') if s.strip()]
                continue
            if not isinstance(block, list):
                continue
            for e in block:
                if not isinstance(e, dict) or 'token' not in e:
                    continue
                tok = str(e['token'])
                utils = [str(u) for u in (e.get('utilities') or [])]
                kind = ('typo' if any(u.startswith('text-format-') for u in utils)
                        else 'effect' if any(u.startswith('shadow-') for u in utils)
                        else 'corner' if tok.startswith('corner-')
                        else 'space' if tok.startswith('space-')
                        else 'color')
                self.entries[tok] = {'use': e.get('use'), 'note': e.get('note'), 'utilities': utils, 'kind': kind}
                if kind == 'corner':
                    self.corner_steps.append(tok.split('-', 1)[1])
                if kind == 'space':
                    self.space_steps.append(tok.split('-', 1)[1])

        # --- chip vocabulary -----------------------------------------------------------------------
        for tok, e in self.entries.items():
            if e['kind'] in ('color', 'corner', 'space'):
                self.chips.add(tok)
                for u in e['utilities']:
                    self.utility[u] = tok
            elif e['kind'] == 'effect':
                chip = self.EFFECT_STYLE.get(tok)
                if chip:
                    self.chips.add(chip)
                    for u in e['utilities']:
                        self.utility[u] = chip

        # --- text styles: `text-format-<format>` -> `text:<Style name>` -----------------------------
        # The style names come from §4 typo_format.text_styles; a format is matched to its style by
        # normalising the style name ("Label/md" -> "label-md", "Heading-sm" -> "heading-sm").
        norm = {s.lower().replace('/', '-'): s for s in text_styles}
        for tok, e in self.entries.items():
            if e['kind'] != 'typo':
                continue
            style = norm.get(tok.lower())
            if not style:
                continue
            chip = 'text:' + style
            self.chips.add(chip)
            for u in e['utilities']:
                self.utility[u] = chip

        # --- generated utility families (§2 corner_utilities / §3 space_utilities) -------------------
        for step in self.space_steps:
            for pre in self.SPACE_PREFIXES:
                self.utility[f'{pre}-{step}'] = f'space-{step}'
                self.utility[f'-{pre}-{step}'] = f'space-{step}'
        for step in self.corner_steps:
            for pre in self.CORNER_PREFIXES:
                self.utility[f'{pre}-{step}'] = f'corner-{step}'

    def use(self, chip):
        if chip in self.entries:
            return self.entries[chip].get('use')
        if chip.startswith('text:'):
            key = chip[len('text:'):].lower().replace('/', '-')
            if key in self.entries:
                return self.entries[key].get('use')
        if chip.startswith('effect:'):
            for tok, c in self.EFFECT_STYLE.items():
                if c == chip:
                    return self.entries.get(tok, {}).get('use')
        return None


# --- utility class -> chip ------------------------------------------------------------------------
def base_utility(cls):
    """Strip Tailwind variants, `!`, and the opacity modifier — `hover:bg-primary-fill/90` -> `bg-primary-fill`.

    Variants are stripped by finding the last `:` that is NOT inside brackets, so arbitrary values
    (`ring-[3px]`) and data-attribute variants (`data-[state=open]:`) both survive intact.
    """
    s = cls.lstrip('!')
    depth, cut = 0, -1
    for i, ch in enumerate(s):
        if ch in '[(':
            depth += 1
        elif ch in '])':
            depth -= 1
        elif ch == ':' and depth == 0:
            cut = i
    s = s[cut + 1:]
    s = re.sub(r'/(\d+|\[[^\]]*\])$', '', s)   # opacity modifier: bg-primary-fill/90, ring-ring/50
    return s


def code_chips(classes, ref):
    """The chips a set of utility classes implies, plus the classes that mapped to nothing."""
    hit, miss = {}, []
    for c in classes:
        b = base_utility(c)
        chip = ref.utility.get(b)
        if chip:
            hit.setdefault(chip, []).append(c)
        else:
            miss.append(b)
    return hit, miss


# =================================================================================================
# inputs
# =================================================================================================
ref = TokenRef(a.tokens)
figma = json.load(open(a.figma))
code = json.load(open(a.code))
decls = code.get('decls', code)
overrides = json.load(open(a.overrides))

cat_text = open(a.catalog).read()
catalog = None
for block in yaml_blocks(cat_text):
    if isinstance(block, list):
        catalog = block
entries = {e['name']: e for e in (catalog or []) if isinstance(e, dict) and 'name' in e}
COMPONENT_NAMES = sorted(entries, key=len, reverse=True)

sections = sorted(entries)
if a.only:
    wanted = [s.strip() for s in a.only.split(',')]
    sections = [s for s in wanted]

#: `_fields` is the schema documentation of doc-overrides itself, not a component — its 340 `roles`
#: are field descriptions. `_readme` likewise. Never treat them as sections.
NON_SECTION = {'_fields', '_readme'}

#: T8 is sharp once the `unroled` criterion is written down. It lives in doc-overrides as
#: `_fields.unroled` (the field dictionary) — `_readme` is accepted as a fallback location. Without it
#: bare chips are only reported as WARN.
#:
#: The criterion (user decision 2026-09-04), and how each of its five rules is checked:
#:   1. only scale tokens may be bare (space-* / corner-* / text:*)    -> T8-bare-family
#:   2. every colour / effect / opacity token the SET binds gets a role, or is not a chip
#:                                                                     -> T8-bare-family (a bare
#:      colour chip fails) together with T1-missing (a bound colour with no chip at all)
#:   3. tokens that reach the set only through a nested member instance are not chips
#:                                                                     -> T8-member-token, from the
#:      dump's provenance (`mvars` / `mstyles`); the same provenance keeps T1-missing off them.
#:      Exception: `<Section>.ownMembers` (doc-overrides) names nested components that are part of
#:      this component's anatomy — their tokens are adopted as own (INFO T8-own-member).
#:   4. truth set = the component set, not the section                 -> T1-dead / T1-missing
#:   5. `unroled` may be empty or absent                               -> no check fires
UNROLED_RULE = None
for holder in (overrides.get('_fields'), overrides.get('_readme')):
    if isinstance(holder, dict):
        for k, v in holder.items():
            if 'unroled' in k.lower() and UNROLED_RULE is None:
                UNROLED_RULE = str(v)
    elif isinstance(holder, str) and 'unroled' in holder.lower() and UNROLED_RULE is None:
        UNROLED_RULE = holder

#: Rule 1 of the criterion — the families a bare chip may belong to. Their meaning is the reference's,
#: not the component's, which is why they need no per-section role.
SCALE_PREFIXES = ('space-', 'corner-', 'text:')


# =================================================================================================
# checks
# =================================================================================================
def mask_tokens(text, chips):
    """Blank out every explicit token reference so a group word can be tested as a bare adjective."""
    masked = text
    for t in sorted(chips, key=len, reverse=True):
        masked = re.sub(re.escape(t), ' ', masked, flags=re.I)
    return masked


for sec in sections:
    if sec in NON_SECTION:
        continue
    entry = entries.get(sec)
    if entry is None:
        out(False, sec, 'T0-catalog', 'no catalog entry with this name')
        continue
    fdump = figma.get(sec)
    if not fdump:
        out(False, sec, 'T0-figma-dump', 'section missing in the figma dump')
        continue
    out(bool(fdump.get('col')), sec, 'T0-column', 'no `tokens` frame in the meta well')
    if not fdump.get('col'):
        continue

    # ---- the three sources ----------------------------------------------------------------------
    # figma-dump.js emits a compact shape (see its header): roled/bare/other are tuples, `vars` are
    # the leaf names of the bound semantic variables, `off` the bindings from other collections.
    for oc in sorted(set(fdump.get('off') or [])):
        warn(sec, 'T1-off-collection', f'bound variable outside the semantic collections: {oc}')
    # `bound` = what the section's OWN components bind. `member` = what only a nested instance of a
    # DS component living outside the section drags in (criterion rule 3) — bound, but not a chip.
    # Since the second user decision of 2026-09-04 the dump walk STOPS at a foreign instance, so own
    # vs member is structural (the earlier "own binding wins" tie-break rested on a walk that credited
    # the placed instance's subtree to the section — Tooltip "owned" its trigger Button's primary-fill).
    # The editorial exception is `DOC.<Section>.ownMembers`: member tokens whose provenance chain
    # (`mby`, "Field>Checkbox") contains a listed component count as OWN — ChoiceCard lists its
    # controls and keeps the "nested control" roles; the overlays list nothing and lose the Button.
    bound = set(fdump.get('vars') or []) | set(fdump.get('styles') or [])
    member = (set(fdump.get('mvars') or []) | set(fdump.get('mstyles') or [])) - bound
    msrc = fdump.get('msrc') or []
    own_members = set((overrides.get(sec) or {}).get('ownMembers') or [])
    mby = fdump.get('mby') or {}
    adopted = set()
    if own_members:
        for t in sorted(member):
            chains = mby.get(t) or []
            if any(part in own_members for ch in chains for part in ch.split('>')):
                adopted.add(t)
        bound |= adopted
        member -= adopted
        for t in sorted(adopted):
            info(sec, 'T8-own-member', f'"{t}" adopted as own via ownMembers {sorted(own_members)} (chains {mby.get(t)})')
    unknown_members = sorted(m for m in own_members if not any(m in ch.split('>') for chs in mby.values() for ch in chs) and not any(m == s for s in msrc))
    if own_members:
        out(not unknown_members, sec, 'T8-own-member-stale', f'ownMembers names no nested member of this set: {unknown_members}')

    roled = [{'id': r[0], 'token': r[1], 'role': (r[2] or ''), 'showRole': r[3], 'parent': r[4]}
             for r in fdump.get('roled') or []]
    bare = [{'id': c[0], 'token': c[1], 'showRole': c[2], 'parent': c[3]} for c in fdump.get('bare') or []]
    chips = [c['token'] for c in roled] + [c['token'] for c in bare]
    doc_roles = (overrides.get(sec) or {}).get('roles') or {}
    out(bool(fdump.get('unroled')) or not bare, sec, 'T0-unroled-frame', 'bare chips but no `unroled` frame')

    exports = (entry.get('code') or {}).get('exports') or []
    classes, missing_decls = set(), []
    for ex in exports:
        d = decls.get(ex)
        if d:
            classes.update(d['classes'])
        else:
            missing_decls.append(ex)
    out(not missing_decls, sec, 'T0-code-export', f'catalog exports without a code declaration: {missing_decls}')
    used, _unmapped = code_chips(classes, ref)

    # `eyebrow` is the column's own heading instance — expected chrome, not a stray node.
    for extra in fdump.get('other') or []:
        if extra and extra[0] != 'eyebrow':
            warn(sec, 'T0-stray-node', f'unexpected node in the token column: {extra}')

    # ---- T1 chips == bound tokens of the set -----------------------------------------------------
    dupes = sorted({c for c in chips if chips.count(c) > 1})
    out(not dupes, sec, 'T1-duplicate', f'chip shown more than once: {dupes}')
    for c in sorted(set(chips)):
        # a member-only chip is bound, just not by this component — that is T8-member-token, not T1
        out(c in bound or c in member, sec, 'T1-dead', f'chip "{c}" is not bound anywhere in the section\'s components')
    for b in sorted(bound):
        out(b in chips, sec, 'T1-missing', f'bound token "{b}" has no chip')

    # ---- T2 code counter-check -------------------------------------------------------------------
    # DOCUMENTED DIVERGENCE (controller decision 2026-09-04, token round): a token the code paints
    # but the Figma SET does not bind (Badge hover `muted-fill`, Input `selection:bg-primary-fill`,
    # Button's raw-hex focus) can never be a chip — a chip needs a binding (T1-dead) and workers
    # never edit the sets. The catalog carries it as `figma.code_only_tokens: [{token, code, why}]`
    # (schema field, same spirit as `divergences`: a code <-> Figma difference that is NOT a delta
    # for /component-sync). T2-code-missing accepts a listed token; T2-stale-divergence keeps the
    # list honest — an entry whose token the code no longer uses, or that the set DOES bind, or
    # that is shown as a chip anyway, or that has no `why`, fails.
    divergent = {}
    for d in ((entry.get('figma') or {}).get('code_only_tokens') or []):
        if isinstance(d, dict) and d.get('token'):
            divergent[d['token']] = d
    for c in sorted(used):
        ok = c in chips or c in divergent
        out(ok, sec, 'T2-code-missing', f'code uses "{c}" ({", ".join(sorted(set(used[c])))}) but no chip shows it')
        if ok and c not in chips:
            info(sec, 'T2-divergence', f'"{c}" documented code-only: {divergent[c].get("why", "")}')
    for t, d in sorted(divergent.items()):
        why = str(d.get('why') or '').strip()
        code_ref = str(d.get('code') or '').strip()
        problems = []
        if t not in used:
            problems.append('code does not use it (drop the entry)')
        if t in bound:
            problems.append('the set binds it — make it a chip, not a divergence')
        if t in chips:
            problems.append('it is shown as a chip anyway')
        if not why:
            problems.append('no `why`')
        if code_ref and t in used and not any(code_ref in u or u in code_ref for u in used[t]):
            problems.append(f'`code` "{code_ref}" matches none of {sorted(set(used[t]))}')
        out(not problems, sec, 'T2-stale-divergence', f'code_only_tokens "{t}": ' + '; '.join(problems))
    for c in sorted(set(chips) - set(used)):
        warn(sec, 'T2-figma-only', f'chip "{c}" has no DS utility in {exports or "(no exports)"} — Figma-only binding? reviewer decides')

    # ---- T3 canonical names ----------------------------------------------------------------------
    for c in sorted(set(chips)):
        out(c in ref.chips, sec, 'T3-canonical', f'chip "{c}" is not a token in tokens-reference (typo, or a pre-rework name)')

    # ---- T4 roles: `token row` <-> DOC.roles ------------------------------------------------------
    for r in roled:
        t = r['token']
        out(t in doc_roles, sec, 'T4-role-source', f'"{t}" is a token row but has no DOC.roles entry')
        if t in doc_roles:
            out(r['role'] == doc_roles[t], sec, 'T4-role-text',
                f'"{t}": Figma "{r["role"]}" != doc-overrides "{doc_roles[t]}"')
        out(str(r['showRole']).lower() == 'true', sec, 'T4-showRole', f'"{t}": token row with showRole={r["showRole"]}')
        out(bool(r['role'].strip()), sec, 'T4-role-empty', f'"{t}": token row with an empty role')
    for c in bare:
        out(c['token'] not in doc_roles, sec, 'T4-bare-roled',
            f'"{c["token"]}" is a bare chip but doc-overrides gives it the role "{doc_roles.get(c["token"])}"')
        out(str(c['showRole']).lower() == 'false', sec, 'T4-showRole', f'"{c["token"]}": bare chip with showRole={c["showRole"]}')
        out(c['parent'] == 'unroled', sec, 'T4-unroled-frame', f'"{c["token"]}": bare chip sits in "{c["parent"]}", not in the `unroled` frame')
    for t in doc_roles:
        out(t in chips, sec, 'T4-dead-role', f'doc-overrides gives "{t}" a role but the section shows no such chip')

    # ---- T5 formal rules on the role text (## Rules) ----------------------------------------------
    for r in roled:
        t, txt = r['token'], r['role'].strip()
        if not txt:
            continue
        out(not re.search(r'[.!?]\s+\S', txt), sec, 'T5-one-sentence', f'"{t}": role is more than one sentence — "{txt}"')
        hits = [n for n in COMPONENT_NAMES if re.search(r'(?<![A-Za-z])' + re.escape(n) + r'(?![A-Za-z])', txt)]
        hits += [n for n in (re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', x).lower() for x in COMPONENT_NAMES)
                 if '-' in n and re.search(r'\b' + re.escape(n) + r'\b', txt, re.I)]
        out(not hits, sec, 'T5-component-name', f'"{t}": role names a component ({sorted(set(hits))}) — roles are phrased semantically')
        masked = mask_tokens(txt, ref.chips)
        own = set(t.split('-'))
        bad = [g for g in token_rules.GROUP_WORDS if g not in own and re.search(r'\b' + g + r'\b', masked, re.I)]
        out(not bad, sec, 'T5-group-word', f'"{t}": group word{"s" if len(bad) > 1 else ""} {bad} used as an adjective — only as an explicit token reference')

    # ---- T6 pair rule: an `-ink` chip needs its `-fill` partner bound -----------------------------
    for c in sorted(set(chips)):
        if not c.endswith('-ink'):
            continue
        partner = c[: -len('-ink')] + '-fill'
        if partner not in ref.chips:
            continue     # standalone ink (ink, brand-ink) — no surface partner by design
        out(partner in bound, sec, 'T6-pair', f'"{c}" is shown but its partner "{partner}" is not bound in the section')

    # ---- T7 per-token word bans (table: token_rules.py) ------------------------------------------
    for r in roled:
        t, txt = r['token'], r['role'].strip().lower()
        if not txt:
            continue
        for rule in token_rules.rules_for(t, ref.chips):
            allowed = txt
            for al in rule.get('allow', []):
                allowed = allowed.replace(al.lower(), ' ')
            hits = [w for w in rule['forbid'] if re.search(r'(?<![a-z0-9-])' + re.escape(w.lower()) + r'(?![a-z0-9-])', allowed)]
            # `forbid_re` (optional): a rule that needs context, e.g. "border" is legal for `ring`
            # only inside the phrase "focus border". Each entry is (pattern, human label).
            hits += [label for pat, label in rule.get('forbid_re', []) if re.search(pat, allowed)]
            out(not hits, sec, 'T7-word-ban', f'"{t}": role says {hits} — {rule["why"]}')

    # ---- T8 the `unroled` criterion (doc-overrides `_fields.unroled`) -----------------------------
    if UNROLED_RULE is None:
        if bare:
            warn(sec, 'T8-unroled', f'{len(bare)} bare chip(s), no criterion in doc-overrides `_fields.unroled` / `_readme`: {[c["token"] for c in bare]}')
    else:
        # rule 1 + 2: a bare chip must be a scale token; a colour / effect / opacity chip needs a role
        for c in bare:
            t = c['token'] or ''
            # only judge chips the set really binds — a chip that is dead or member-only is already
            # reported by T1-dead / T8-member-token, and removing it settles the family question too
            if t not in bound:
                continue
            out(t.startswith(SCALE_PREFIXES), sec, 'T8-bare-family',
                f'"{t}" is bare but not a scale token — only space-* / corner-* / text:* may sit in `unroled`, '
                f'every colour / effect / opacity token the set binds needs a role')
        # rule 3: member-only tokens are documented in the member's own section, not here
        for c in sorted(set(chips)):
            out(c not in member, sec, 'T8-member-token',
                f'"{c}" reaches this set only through a nested {" / ".join(msrc) or "member"} instance — '
                f'not a chip here; it is documented in the member\'s own section')
        # rule 5: an empty or absent `unroled` is fine (Separator) — nothing to assert

    # ---- INFO: the generic `use` sentence next to the section role --------------------------------
    for r in roled:
        u = ref.use(r['token'])
        info(sec, 'use', f'{r["token"]}: role "{r["role"]}" || use "{u}"')

print()
print('--- per check -----------------------------------------------------------------')
for cid in sorted(counts):
    c = counts[cid]
    print(f'  {cid:22} PASS {c.get("PASS", 0):5}  FAIL {c.get("FAIL", 0):5}  WARN {c.get("WARN", 0):5}')
print()
print('ALL PASS' if fails == 0 else f'{fails} FAIL')
sys.exit(1 if fails else 0)
