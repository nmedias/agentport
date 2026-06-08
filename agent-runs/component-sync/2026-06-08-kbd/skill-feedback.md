# Skill feedback — `/component-sync` (run: 2026-06-08 kbd)

## 1. S2 — read snippet hardcodes the wrong page name

**Gap:** `snippets/read-set-values.js` locates the page with
`figma.root.children.find((p) => p.name === 'Components')`, but this DS file's components page is named
**`Shadcn Components`** (`config.json` `componentsPage: "Shadcn Components"`, pageId `3126:2`). So `page`
is `undefined` → `setCurrentPageAsync(undefined)` throws before any value is read. The snippet's
hardcoded name is also out of sync with the skill's own `config.json`.

**Verified:** recon earlier this session returned pages
`["✦✦✦✦ Final ✦✦✦✦", "----", "Shadcn Components"]` — no page named exactly `Components`.

**Root cause (two-fold):** (a) `config.json` `componentsPage` was **outdated** (`"Components"` — the page
is `"Shadcn Components"`) and had no `pageId`; (b) the config was **never applied** — the snippet
hardcoded the page-name literal and didn't read config, despite `config._doc` claiming "the SKILL and
snippets reference these". So a decorative, drifting config + a hardcoded literal.

**Fix applied (user-directed, this run):**
- `config.json`: `componentsPage` → `"Shadcn Components"`, added `pageId: "3126-2"`; comment now says
  resolve by pageId + fill the snippet's PAGE_ID from it.
- `snippets/read-set-values.js`: replaced `find(p => p.name === 'Components')` with a `PAGE_ID`
  placeholder resolved via `getNodeByIdAsync` — by **id**, not a drifting name literal.
- `SKILL.md`: S1 resolves the page via `config.json figma.pageId`; S2 says fill `PAGE_ID`+`SET_ID`
  before running.

**General rule for the skill:** snippets carry placeholders the agent fills from `config.json`
(pattern already used by `/shadcn-component-port`'s build snippet) — never a hardcoded page-name literal.

**Status:** ✅ fixed in `/component-sync` (config + snippet + SKILL.md). Verified live this run: page
resolved by `pageId 3126-2`, the S2 read succeeded. Pending commit.

## 2. S2 — read snippet ignores slot content and `minWidth`

**Gap:** `read-set-values.js` reads `m.fills`, the text node, padding/radius/effects/w-h — but **not**:
- **Slot content.** For a slot-based variant (here `content=icon`), the visible colour lives on the
  **VECTOR inside the `SLOT`** (`Inverse/inverse-foreground`), not on the member fill or a text node.
  The snippet has no `SLOT` handling, so it returns `text: null` and misses the icon's bound colour
  entirely → a re-coloured icon would be an undetected delta. Had to add slot+inner-vector reading by
  hand this run.
- **`minWidth`.** The snippet reads `w/h` (the hugged width), not `minWidth`. For controls whose size
  is carried by a min-width (kbd `min-w-5`), a changed `minWidth` is invisible to the diff.

**Verified:** for `content=icon`, the stock snippet fields would yield `fill` = member (inverse) and
`text` = null — the icon colour (`Inverse/inverse-foreground`, read off the slot's vector) appears
nowhere. Confirmed by the S2 read where the slot block had to be added to surface `vecFillVar`.

**Fix applied (this run):** the snippet now reads, per member, the **SLOT** (geometry + sizing) and its
default child **generically by type** — VECTOR → bound fill var, INSTANCE → mainComponent, TEXT →
text-style/fill (not hardcoded to a vector, so an icon *instance* or text in a slot is also caught) —
plus `minWidth`/`minHeight`.

**Verified (live, kbd set):** `content=icon` now surfaces `slot.content = { type: VECTOR, fillVar:
"Inverse/inverse-foreground" }` and `minW: 20` — the previously-invisible icon-colour binding is read.

**Status:** ✅ fixed in `/component-sync` (`snippets/read-set-values.js`). Pending commit.

