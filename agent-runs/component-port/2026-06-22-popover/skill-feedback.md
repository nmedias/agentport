# Skill-Feedback — popover port (2026-06-22)

Capture ON. Findings captured the moment they surface, pre-sorted A/B/C × edit-target file
(`.claude/skills/skill-feedback`): A = gap caused a defect; B = self-derived, result held (codify,
deferred); C = tooling/repo/already-covered. General phrasing. NEVER edit the target skills here.

---

### A — gap caused a defect (priority)

#### /storybook-rules (+ /shadcn-component-port T6 a11y note)

**A(popover-1) · Portal overlay with `role="dialog"` needs an accessible NAME or axe fails the gate**

| Feld | Inhalt |
|---|---|
| Why A | The axe `aria-dialog-name` rule failed the storybook gate (serious) on every story whose panel was open at scan time — a real defect, not self-derived. |
| Gap | An overlay primitive whose content carries `role="dialog"` (Radix Popover.Content does, even non-modal) MUST have an accessible name. Unlike a modal Dialog (where the Title auto-wires `aria-labelledby`), this overlay does NOT auto-associate its title → an open panel with only a visible title still has NO accessible name → axe `aria-dialog-name` fails. The skills' a11y guidance covers naming a role node on a nested child (T6 "name the role element"), but not that a `role="dialog"` OVERLAY whose title isn't auto-wired needs an explicit `aria-label`/`aria-labelledby` on the content. |
| Verified | 3 open-at-scan stories flagged `aria-dialog-name` serious; adding `aria-label` to the content cleared all (5/5 green, 0 violations). The closed-at-scan playground (play opens then Escapes) did NOT flag — only panels open during the axe scan. |
| Candidate fix | For any portal overlay whose content gets `role="dialog"` and does not auto-wire a title (popover/hovercard-style, vs modal Dialog), give each open-panel story an explicit `aria-label` (or `aria-labelledby` → the title node). Note in the component's contract/docs that an open panel needs an accessible name. A story that opens only transiently (play opens→closes) won't flag, but any `defaultOpen`/persistently-open one will. |
| Status | open (A — review + apply). |

---

### B — self-derived, result held (codify · deferred)

#### /figma-build-rules

**B(popover-1) · §Usage-examples — nesting a sibling Input instance: `filled=true` does NOT auto-hide its placeholder**

| Feld | Inhalt |
|---|---|
| Why B | Self-derived workaround (clear the placeholder text); example renders correct. No defect shipped. |
| Gap | §Usage-examples says "drive state via setProperties" for nested partner instances, but a sibling whose `value` and `placeholder` are STACKED text nodes renders BOTH when only `value` + a `filled` boolean are set — the boolean toggles value visibility but not the placeholder, so the two overlap. |
| Verified | All 4 nested Input instances: `filled=true`, `value` set, yet `placeholder` ('{Placeholder}') stayed `visible=true` and rendered over the value. Setting the `placeholder` TEXT prop to ' ' fixed the overlap. |
| Candidate fix | When nesting a sibling field/input instance to show a FILLED state, set BOTH its value AND clear/blank its placeholder text prop — don't assume a `filled`/value-only boolean hides the placeholder; verify by screenshot which text nodes stay visible. |
| Status | deferred. |

---
