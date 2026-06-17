# component-sync — breadcrumb (2026-06-17)

Figma → code reconcile of the `breadcrumb` colour clothing after the DS `-fill`/`-ink`/`-border`
token rework. Read-only on Figma; code = the authoritative target.

## Structure read (Figma)

- File `FIGMA_FILE_KEY`, page **"Shadcn Components"** `3126:2`.
- Section **`Breadcrumb`** `3249:302`. Children (LIVE names):
  - `Breadcrumb` (TEXT headline) `3249:303`
  - `Breadcrumb` (COMPONENT, composition) `3254:302`
  - `Segment` (COMPONENT_SET) `3250:308` — props `Item (children)#3253:0`, `state`
    - `state=link` `3250:302` · `state=link-hover` `3250:304` · `state=page` `3250:306`
  - `.Separator` (COMPONENT) `3251:302`
  - `Ellipsis` (COMPONENT) `3251:305`

Note: separator + ellipsis are **siblings of** the segment set, not members inside it.
The segment set carries only the three text states; the icon colours live on the separate
`.Separator` / `Ellipsis` components.

LIVE-name drift vs the recorded components-reference entry (IDs stable):
| recorded name        | live name    |
|----------------------|--------------|
| `.Breadcrumb` (comp) | `Breadcrumb` |
| `.Breadcrumb/Segment`| `Segment`    |
| `.Breadcrumb/Separator` | `.Separator` |
| `.Breadcrumb/Ellipsis`  | `Ellipsis`   |

## Bound-variable read (paints on inner TEXT / VECTOR nodes)

Resolver: `figma.variables.getVariableByIdAsync` (the `figma.getVariableByIdAsync` form does not exist).

| role                | carrier node              | bound variable           | value     |
|---------------------|---------------------------|--------------------------|-----------|
| link (rest) text    | `{Item}` TEXT `3250:303`  | `shadcn Default/muted-ink` | `#656971` |
| link-hover text     | `{Item}` TEXT `3250:305`  | `shadcn Default/ink`       | `#0d1016` |
| page (current) text | `{Item}` TEXT `3250:307`  | `shadcn Default/ink`       | `#0d1016` |
| separator icon      | `Vector` `3251:304`       | `shadcn Default/muted-ink` | `#656971` |
| ellipsis icon       | `Vector` `3251:307`       | `shadcn Default/muted-ink` | `#656971` |

All five paints are properly bound (no raw/unbound paints; no wrong bindings).

## Diff + delta (var → DS utility via §6 color_renames)

`muted-ink` → `text-muted-ink` · `ink` → `text-ink` (rename of stock `text-foreground`).

| sub-part / role          | property        | code-before                | code-after (Figma binding)          |
|--------------------------|-----------------|----------------------------|-------------------------------------|
| BreadcrumbList (default) | text colour     | `text-muted-foreground`    | `text-muted-ink` (muted-ink)        |
| BreadcrumbLink (hover)   | hover text col. | `hover:text-foreground`    | `hover:text-ink` (ink)              |
| BreadcrumbPage (current) | text colour     | `text-foreground`          | `text-ink` (ink)                    |
| BreadcrumbSeparator icon | text colour     | *(inherits list colour)*   | *(unchanged — inherits text-muted-ink, matches separator=muted-ink)* |
| BreadcrumbEllipsis icon  | text colour     | *(inherits list colour)*   | *(unchanged — inherits text-muted-ink, matches ellipsis=muted-ink)* |

Pure name re-clothing — the *values* already matched (rest=muted, hover/page=ink). Only the
stale stock utility names needed migration to the new `-ink` system. The separator and ellipsis
carry no explicit colour class; they inherit `currentColor` from the list, and the Figma model
confirms both icons = `muted-ink`, i.e. the inherited list colour. No class added (would be redundant).

Also updated: header clothing comment in `breadcrumb.tsx`; the two stale assertions in
`breadcrumb.spec.tsx` (`text-muted-foreground` → `text-muted-ink`, `text-foreground` → `text-ink`)
+ one test title; one prose comment in `breadcrumb.stories.tsx` ("foreground leaf" → "ink leaf").

## DEVIATIONS

| # | what | why |
|---|------|-----|
| 1 | Did not add an explicit colour class to BreadcrumbSeparator / BreadcrumbEllipsis | Figma icons = `muted-ink` = the inherited list `currentColor`; an explicit class would be redundant and is not how the existing composition is wired. |
| 2 | Edited `breadcrumb.spec.tsx` (not just the component) | Two assertions hard-coded the OLD utility names and would fail the gate; updated to the re-clothed names. In scope (test catch-up to the clothing rename), not an opportunistic rewrite. |

## Verification

- Token-faithful 1:1: every changed utility maps to its bound Figma var via §6.
- No opportunistic rewrites; geometry/typography/structure untouched.
- Gate NOT run here (parent runs one consolidated gate). Code comments in English.
