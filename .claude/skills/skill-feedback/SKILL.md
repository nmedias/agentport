---
name: skill-feedback
description: "Toggle ON before/at the start of a skill run to capture skill-IMPROVEMENT feedback — gaps, bugs, candidate fixes that surface while running another skill — into that run's skill-feedback.md, on the spot. Trigger when the user wants to switch on feedback capture for a run: 'skill feedback', 'capture skill gaps/improvements for this run', 'track feedback before I start'."
---

# Skill Feedback

Toggle-on capture of **skill-improvement feedback** for one run. Switch it on *before* the run; it then
stays active and records every skill gap / tooling problem **the moment it surfaces** — so findings are
not deferred to the end and forgotten (the exact failure this skill exists to fix).
.

## Inputs / Output

```
in   run dir, OR kind + subject to build it (else ask user)
out  agent-runs/<kind>/<date>-<subject>/skill-feedback.md  (next to that run's notes.md; append per finding)
```

`<kind>` = the running skill's run-folder (e.g. `component-port`, `sketch-jammer`, `design-punk`).

## Once on — standing directive for the rest of the run

1. **Resolve the run dir** → `agent-runs/<kind>/<date>-<subject>/`. Unknown at toggle-time (run not
   started yet)? Hold findings, write once the dir exists. Ambiguous? Ask for kind + subject.
2. **Capture on the spot.** The moment a skill gap / tooling problem surfaces, append a structured
   entry (below) to `<run>/skill-feedback.md`. **Never defer to run-end** — that is the documented
   failure mode.
3. **General phrasing.** Write the candidate fix so the next run reuses it — describe the rule, not the
   one component you happened to hit.
4. **Never edit the target skill.** The user reviews `skill-feedback.md` and applies. Update an entry's
   Status as it progresses; don't fold the fix into the skill yourself.
5. **End-of-run sweep.** Before finishing, confirm every surfaced finding is recorded.

## Entry format

One file per run; append one block per finding:

```
## <n>. <area / T-step> — <title>   [— ✅ <status>]

**Gap:** what the skill omits or gets wrong.
**Verified:** evidence, when probed (result / small table). Omit only if not verified — then say so.
**Candidate fix:** general phrasing — what to add/change in the skill (not folded in).
**Status:** open · ✅ written into <skill> · ✅ closed (+ commit ref if a repo fix).
```

Worked example: `agent-runs/component-port/2026-06-06-kbd/skill-feedback.md`.

## Boundaries

- Feedback that improves a skill — never domain notes, never a handoff.
- Read-only on the target skill: capture + status only; the user applies changes.
- One finding = one entry; verify before claiming a fix works; phrase generally.

## Red flags

| Thought | Reality |
|---|---|
| "I'll write it all up at the end." | That is exactly what failed before. Capture each finding the moment it surfaces. |
| "I'll just fix the skill while I'm here." | No — never edit the target skill mid-run. Record it; the user applies. |
| "This is <component>-specific." | Generalise it, or the next run can't reuse it. |
| "It's a run note." | If it improves the SKILL, it's feedback here. If it documents the WORK, it's `notes.md` (not this skill). |
