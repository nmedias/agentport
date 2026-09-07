# Review — package `overlays` (Tooltip, Popover, Dialog, Command)

Reviewed sha: `api/overlays` @ `a78c3ad9b15739c7113b069f007404fae6a73dc2`
Fresh Figma dump: `nQSNLASjuLvgTh3we8Dp4s`, page "Components", `ONLY = ['Tooltip','Popover','Dialog','Command']` (this session, read-only).
Fresh code extract: `node tools/api-audit/extract-code.mjs ~/Dev/agentport` (this session).

## Verdicts

| Component | check.py | Structural gates | OPINION | Screenshot | Verdict |
|---|---|---|---|---|---|
| Tooltip | ALL PASS | pass | no findings | clean | **ACCEPT** |
| Popover | ALL PASS | pass | no findings | clean | **ACCEPT** |
| Dialog  | ALL PASS | pass | no findings | clean | **ACCEPT** |
| Command | ALL PASS | pass | no findings | clean | **ACCEPT** |

## check.py

Ran against `/tmp/cat-overlays.md` (worker branch catalog at the reviewed sha), the fresh code
extract, and the fresh Figma dump, `--only Tooltip,Popover,Dialog,Command`.

Result: **ALL PASS** (every C1–C6 assertion for all four entries passed; no FAIL lines in the
full output).

## Structural gates

- **YAML parses**: both ` ```yaml ` blocks in the catalog parse via `yaml.safe_load`. All 25
  `- name:` entries in the catalog parse (split test); Tooltip/Popover/Dialog/Command all present.
- **Diff scope**: `git diff master..api/overlays --stat` touches only
  `design-docs/design-system/components-reference.md` (44 insertions, 4 deletions, one file).
- **Hunk containment**: all 10 hunks fall strictly within the Command (lines 424–513), Dialog
  (514–578), Popover (1145–1202), or Tooltip (1203–1259) blocks — each hunk's `@@` context line
  (`open:` inside the relevant `figma:`/`code:` sub-block) confirms no bleed into a neighboring
  entry. No other entries touched.
- **Denylist**: `git grep -ilE` over the denylist term list on `api/overlays` prints nothing.

## OPINION pass

Read every Figma row's `code` sentence in the fresh dump against the four `.tsx` sources in
`~/Dev/agentport/libs/ui/src/components/ui/{tooltip,popover,dialog,command}/`. All sentences are
independently actionable — a developer could implement each without opening the codebase — and
every classification matches the source.

**Popover `state` (live-state) vs Radix `open`/`data-state` in `popover.tsx`:**
`PopoverProps` (popover.tsx:12-31) declares `open?`, `defaultOpen?`, `onOpenChange?`, `modal?`,
all forwarded flat onto `PopoverPrimitive.Root`. The catalog's `state` row triggers —
`open: "the open prop (controlled) or defaultOpen (uncontrolled) is set, or data-state=\"open\"
at runtime"`, `closed: "default"` — correctly describe this: there is no discrete `state` prop,
Radix drives `data-state` on Trigger/Content from the resolved open boolean. Verified correct.
`code.props` mirrors this: `open`/`defaultOpen` both map `figma: "state=open"` (not `none`),
consistent with the live-state row naming them as triggers — correctly counted as mapped (not
code-only) in check.py's C4 pass.

**Dialog `showFooter`/`showBody` have no code counterpart:**
Confirmed against `dialog.tsx`. `DialogProps` = `open`/`defaultOpen`/`onOpenChange`/`modal`.
`DialogContentProps` = `showCloseButton` only. `DialogFooterProps` = `showCloseButton` only (a
different, footer-scoped prop that renders a default "Close" button, default `false`). No
`showFooter` or `showBody` identifier exists anywhere in the file — in code, footer/body presence
is purely a function of which children (`DialogFooter`, arbitrary body children) get composed.
Both rows are correctly classified `code: none` with `figmaOnly: true`.

**Tooltip main-component choice — `Tooltip 4441:73`, not `Tooltip Root`:**
The Figma dump returns two components under the Tooltip section: `Tooltip 4441:73` (props
`content` slot + `side` variant) and `Tooltip Root 4419:2781` (props `trigger` slot + `state` +
`side` variants). Per the scope rule the main component is the one *named exactly like the
section* — `"Tooltip"` — which is `4441:73`, not `"Tooltip Root"`. The catalog's `figma.api` uses
only `content`/`side` from `4441:73`; `Tooltip Root`'s `trigger`/`state` axis is correctly kept
out of scope (noted on the code-only `open`/`defaultOpen`/`onOpenChange` rows: "the Tooltip Root
composition ... out of scope under the main-only rule"). Correct component choice.

**Additional spot checks (all correct):**
- Tooltip/Popover/Dialog `side` and Popover `align` rows correctly use the
  `<Export>.<prop>` form (`TooltipContent.side`, `PopoverContent.side`, `PopoverContent.align`)
  — verified these props exist on `TooltipContentProps`/`PopoverContentProps` with matching
  defaults (`top`/`bottom`/`center`).
- Dialog `showCloseButton` row correctly resolves to `DialogContent.showCloseButton` (default
  `true`) rather than the unrelated `DialogFooter.showCloseButton` (default `false`) — the
  Figma control's default (`true`) matches `DialogContent`'s, not `DialogFooter`'s.
- Command `variant`/code-only props (`label`, `shouldFilter`, `loop`, `value`, `defaultValue`,
  `onValueChange`, `filter`) all match `CommandProps` in `command.tsx` verbatim, including
  defaults (`shouldFilter` true, `loop` false).
- All `children`-classified slot/text rows (Tooltip `content`, Popover `trigger`, Dialog
  `footer`/`title`/`description`/`body`, Command `list`) correctly point at real composition
  points in the source (children of `TooltipContent`, `Popover`, `DialogFooter`/`DialogTitle`/
  `DialogDescription`/`DialogContent`, `Command`).

No factually wrong classification, no selector/attribute named in a trigger that the source
doesn't use, no external-prop sentence naming a nonexistent export.

## Screenshots

`get_screenshot` on each section's `meta well` frame (fresh, this session):

| Section | Node ID | Result |
|---|---|---|
| Tooltip | 8342:5006 | Eyebrow "API · 2 Figma controls · 4 code-only props" visible, 6 rows readable, no clipping, `code-only` chips only on `open`/`defaultOpen`/`onOpenChange`/`delayDuration`. |
| Popover | 8356:5143 | Eyebrow "API · 4 Figma controls · 2 code-only props" visible, 6 rows readable at 2000px re-render, no clipping, `figma-only` chip only on `state`, `code-only` chips only on `onOpenChange`/`modal`. |
| Dialog | 8367:5302 | Eyebrow "API · 7 Figma controls · 4 code-only props" visible, 11 rows readable, no clipping, `figma-only` chips only on `showFooter`/`showBody`, `code-only` chips only on `open`/`defaultOpen`/`onOpenChange`/`modal`. |
| Command | 8378:5505 | Eyebrow "API · 2 Figma controls · 7 code-only props" visible, 9 rows readable, no clipping, `code-only` chips only on `label`/`shouldFilter`/`loop`/`value`/`defaultValue`/`onValueChange`/`filter`. |

All four clean — no clipped text, no missing eyebrow, chips only where expected.

## Summary

All four components ACCEPT. check.py is fully green, all structural gates pass (scoped diff,
contained hunks, clean denylist, valid YAML), and the OPINION pass found no discrepancy between
the Figma `code` sentences and the actual `.tsx` source — including the three items flagged for
specific scrutiny (Popover live-state triggers, Dialog's two Figma-only demo toggles, Tooltip's
main-component choice).
