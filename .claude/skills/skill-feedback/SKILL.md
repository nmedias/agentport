---
name: skill-feedback
description: "Toggle ON before/at the start of a skill run to capture skill-IMPROVEMENT feedback — gaps, bugs, candidate fixes that surface while running another skill — into that run's skill-feedback.md, on the spot. `off` ends capture and finalizes the file. Trigger when the user wants to switch on feedback capture for a run: 'skill feedback', 'capture skill gaps/improvements for this run', 'track feedback before I start'."
argument-hint: [on|off]
arguments: state
disable-model-invocation: true
---

# Skill Feedback

Toggle-on capture of **skill-improvement feedback** for one run. Switch it on *before* the run; it then
stays active and records every skill gap / tooling problem **the moment it surfaces** — so findings are
not deferred to the end and forgotten (the exact failure this skill exists to fix).

## Argument — `on` | `off`

`$state` (declared in `arguments:`, optional) — **defaults to `on`** when omitted, so bare
`/skill-feedback` ≡ `/skill-feedback on`.

- **`on`** → start the standing directive below; capture from now until the run ends (or `off`).
- **`off`** → end capture now: run the *End-of-run sweep* (directive step 5), confirm the file path,
  then drop the standing directive. Nothing already captured is discarded.

Any other value → treat as `on` and note the assumption.

## Inputs / Output

```
in   run dir, OR kind + subject to build it (else ask user)
out  agent-runs/<kind>/<date>-<subject>/skill-feedback.md  (next to that run's notes.md; append per finding)
```

`<kind>` = the running skill's run-folder (its short name).

## Once on — standing directive for the rest of the run

1. **Resolve the run dir** → `agent-runs/<kind>/<date>-<subject>/`. Unknown at toggle-time (run not
   started yet)? Hold findings, write once the dir exists. Ambiguous? Ask for kind + subject.
2. **Capture on the spot, pre-sorted.** The moment a skill gap / tooling problem surfaces, append a
   structured entry (below) **into its triage class × Edit-Target group** (see *Output structure*) —
   not a flat list at the bottom. **Never defer to run-end** — that is the documented failure mode.
3. **General phrasing.** Write the candidate fix so the next run reuses it — describe the rule, not the
   one case you happened to hit.
4. **Never edit the target skill.** The user reviews `skill-feedback.md` and applies. Update an entry's
   Status as it progresses; don't fold the fix into the skill yourself.
5. **End-of-run sweep.** Before finishing, confirm every surfaced finding is recorded and sits under the
   right class × Edit-Target heading (re-triage any borderline call you parked).

## Triage axis — A / B / C

Classify every finding by the same axis the user sorts on: **did the skill gap *cost* something, or did
you route around it and still land the planned result?**

| Class | Test | Meaning for the user |
|---|---|---|
| **A** | The gap caused a **defect**: gate red · crash · thrown error · wrong render · the user found the bug. | Skill-edit = guardrail → **active / priority.** |
| **B** | Self-derived the right move; the run's result was correct anyway. | Skill-edit = codify knowledge, **not** a bugfix → low prio / deferred. |
| **C** | Belongs in tooling / the repo, or the skill already covers it (entry = evidence only). | Out of the skill-prose path. |

Borderline → pick the class whose *test* the finding actually meets (a result that was only correct
**after** a defect or a burned iteration is **A**, not B), and record the one-line `Why <class>` so the
user can re-judge.

## Edit Target (home file)

The **home file inside the running skill** where the fix would land — the read-first locator for the
user's edit pass. Name the concrete file, not just the skill: the main `SKILL.md`, a referenced sub-doc,
a snippet/script it ships, or a sibling skill it delegates to. One finding may touch a second file →
note `(also: <file>)`.

## Output structure

`skill-feedback.md` is **pre-sorted as it's written** — class first, Edit-Target group within. Number
findings **globally in capture order** (stable `#` so a later finding can cross-ref an earlier one —
"sharpens #2"); the number stays with the finding regardless of which group it sits in. Lay headings
down lazily on first hit, keep **A → B → C** order; **each finding renders as a per-finding
`Feld | Inhalt` table** (see *Entry format*):

```
# Skill feedback — <kind> (<date>-<subject>)

## A — gap caused a defect (priority)
### <edit-target file>          ← group findings that land in the same file together
<entry-table> <entry-table> …
### <other edit-target file>
<entry-table> …

## B — self-derived, result held (codify · deferred)
### <edit-target file>
<entry-table> …

## C — tooling / repo / already covered
<entry-table> …
```

## Entry format

One **per-finding table** under its class × Edit-Target heading — a title line, then a `Feld | Inhalt`
table (rows = the sub-points, so a long entry stays scannable):

```
**<n> · <area / step> — <title>**   [— ✅ <status>]

| Feld | Inhalt |
|---|---|
| Why <class> | one line — what it cost (A) / how you routed around it (B). |
| Gap | what the skill omits or gets wrong. |
| Verified | evidence, when probed (result / value). „—" if not verified. |
| Candidate fix | general phrasing — what to add/change in the skill (not folded in). Second touched file → `(also: <file>)`. |
| Status | open · ✅ written into <skill> · ✅ closed (+ commit ref if a repo fix). |
```

Escape a literal `|` inside a cell as `\|`; keep each cell on one line (use `<br>` only if a step-list
truly needs the breaks).

## Boundaries

- Feedback that improves a skill — never domain notes, never a handoff.
- Read-only on the target skill: capture + status only; the user applies changes.
- One finding = one entry; verify before claiming a fix works; phrase generally.
- Triage (A/B/C) + Edit-Target are a *first guess* for the user's review — get the bucket close, don't
  agonise; record `Why <class>` so a re-judge is cheap.

## Red flags

| Thought | Reality |
|---|---|
| "I'll write it all up at the end." | That is exactly what failed before. Capture each finding the moment it surfaces. |
| "I'll dump it at the bottom and sort later." | No — file it under its class × Edit-Target heading on the spot. "Sort later" = the same defer trap. |
| "Result was fine, so it's a B." | Only if you *self-derived* it. Correct **after** a defect / burned iteration = **A** (priority). |
| "Some skill should change — good enough." | Name the concrete home file (the Edit Target), or the user's edit pass has to re-find it. |
| "I'll just fix the skill while I'm here." | No — never edit the target skill mid-run. Record it; the user applies. |
| "This is <subject>-specific." | Generalise it, or the next run can't reuse it. |
| "It's a run note." | If it improves the SKILL, it's feedback here. If it documents the WORK, it's `notes.md` (not this skill). |
