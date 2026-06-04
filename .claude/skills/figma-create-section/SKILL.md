---
name: figma-create-section
description: "Internal sub-skill — creates the canonical DS Section wrapper (white Section + Headline, no inner frame) on a target page. Called by the sketch-jammer agent (one section per direction) and other skills needing a labeled build container. Fixed values live in config.json. Returns sectionId + headlineId. Caller appends its build as section children below the headline. Not user-invocable directly."
user-invocable: false
---

# Figma Create Section

Create the one canonical Section wrapper every DS build sits in: a white Section (12px corner radius) with a Headline as a direct child, inset 80px from the top-left. A Figma Section supports fill + cornerRadius but has no padding and no auto-layout — so there is no inner frame; the headline is positioned directly. The caller appends its build as further section children, below the headline, and resizes the section to fit.

All visual values are FIXED and live in `config.json` — that file is the single source of truth. The snippet has a `{{placeholder}}` for every value; this skill reads config.json and substitutes them at call time. Never inline or change values in the snippet.

**Banned:** All `figma-console` tools. Plugin MCP only.
**Required before the `use_figma` call:** load `/figma-use` first.

## Inputs

```
pageId:    string             # REQUIRED. Target page id. Must resolve to a PAGE node.
name:      string             # REQUIRED. Section node name.
headline:  string?            # Optional. Headline text. Default = name.
placement: {                  # Optional. Omit → auto (right of the rightmost node on the page).
  besideNodeId: string        #   Place the section besideGap px right of this node's bounding box, top-aligned.
  gap:          number?       #   Override the besideGap. Default = config placement.besideGap (80).
}?
```

## Output

```
sectionId:  string            # The new Section's id. Caller appends its build here as children.
headlineId: string            # The headline text node (direct child, at (inset, inset)).
```

## Process

```
TaskCreate upfront:
  T1  "Preflight"        activeForm "Validating input"
  T2  "Read config"      activeForm "Reading config.json"   blockedBy T1
  T3  "Create section"   activeForm "Creating section"      blockedBy T2
  T4  "Return"           activeForm "Returning IDs"         blockedBy T3
```

---

## T1 — Preflight

- `pageId` is a non-empty string.
- `name` is a non-empty string.
- `headline` defaults to `name` when omitted/empty.
- `placement` omitted → auto mode (`{{besideNodeId}}` = `''`). If given, `placement.besideNodeId` must be a non-empty string; `placement.gap` defaults to config `placement.besideGap`.

---

## T2 — Read config

Read `config.json` (this skill's dir). It is authoritative — do not invent or override values. Build the placeholder map:

| Placeholder | Source |
|---|---|
| `{{pageId}}` `{{name}}` `{{headline}}` | inputs (headline → name if empty) |
| `{{besideNodeId}}` | input `placement.besideNodeId`, or `''` when no `placement` given (→ auto mode) |
| `{{besideGap}}` | input `placement.gap`, else config `placement.besideGap` |
| `{{fill_r}}` `{{fill_g}}` `{{fill_b}}` `{{cornerRadius}}` | `section.fill` / `section.cornerRadius` |
| `{{offsetRight}}` `{{originY}}` | `placement.offsetRight` / `placement.originY` (auto mode) |
| `{{font_family}}` `{{font_style}}` `{{font_size}}` `{{line_height_pct}}` | `headline.fontFamily/fontStyle/fontSize/lineHeightPct` |
| `{{inset}}` | `headline.inset` |
| `{{hl_r}}` `{{hl_g}}` `{{hl_b}}` | `headline.color` |

---

## T3 — Create section

Load `/figma-use`. Substitute every placeholder into `snippets/create-section.js` and execute via `use_figma`.

Returns `{ sectionId, headlineId }`. Store both.

---

## T4 — Return

Return to caller:

```
{ sectionId, headlineId }
```

No screenshot. No user interaction. The caller appends its build as children of `sectionId`, below the headline (headline sits at `(inset, inset)`), and resizes the section to fit its content.

---

## Edge cases

| Case | Handling |
|---|---|
| `pageId` missing or not a PAGE | Snippet aborts with clear error. |
| `headline` omitted | Defaults to `name` in T1. |
| No `placement`, page empty | Auto mode — section placed at origin `(0, originY)`. |
| No `placement`, page has nodes | Auto mode — section placed `offsetRight` px past the rightmost node's right edge. |
| `placement.besideNodeId` given | Section placed `gap`/`besideGap` px right of that node's bounding box, top-aligned (`y = node.y`). Snippet aborts if the node is missing or has no bounding box. |

---

## Red flags — you're skipping the process

| Thought | Reality |
|---|---|
| "I'll hardcode the values straight into the snippet" | No. config.json is authoritative; substitute its values. |
| "I'll tweak the inset/font for this caller" | No. The Section is one fixed spec — change config.json or nothing. |
| "I'll add an inner auto-layout frame, it's cleaner" | No. Section + Headline only — no inner frame is the chosen anatomy. |
| "I'll use figma-console, it's quicker" | Banned. Plugin MCP only, `/figma-use` first. |
| "Headline is optional, I'll skip the text node" | No. The wrapper always has Section + Headline. |
