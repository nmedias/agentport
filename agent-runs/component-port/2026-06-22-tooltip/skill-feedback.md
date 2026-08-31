# Skill-Feedback — Tooltip Port (2026-06-22)

Capture format per `.claude/skills/skill-feedback`: triage class A/B/C × Edit-Target file.
General phrasing (the rule, not the one case). NEVER edit the target skills here — record only.

---

## B (self-derived, result held · codify · deferred)

### /shadcn-component-port — T3 (Translate)

**#1 · T3 — inverted stock surface (`bg-foreground`/`text-background`) has no DS inverted-overlay token → re-clothe to the raised-overlay surface + record the fork**

| Feld | Inhalt |
|---|---|
| Why B | Self-derived: picked `dialog-fill`/`dialog-ink` by role; build + render held. No defect. |
| Gap | T3 says "pick by use/avoid", but doesn't cover the case where the stock component is deliberately INVERTED (dark surface, light text — to contrast with popover/dialog) and the DS has only a LIGHT raised-overlay token. A porter could either keep an unbound dark fill or wrongly reach for `bg-ink` (which has no FRAME_FILL → shape-fill only). |
| Verified | Stock tooltip = `bg-foreground` + `text-background` (inverted). DS raised-overlay = `dialog-fill`/`dialog-ink` (light). Bound to those; tooltip renders as a light raised chip — a deliberate, recorded DS deviation from stock's dark chip. |
| Candidate fix | Add a T3 note: an inverted stock surface (dark fill / light text, used to set an overlay apart) maps to the DS raised-overlay surface token (`dialog-fill`/`dialog-ink`) like any other overlay — the DS has no inverted-overlay token, so the chip becomes LIGHT; record the dark→light shift as a deviation. Never reach for `bg-ink`/`bg-*-fill` shape-fills as a container surface (no FRAME_FILL). |
| Status | deferred. |

**#2 · T3 / Usage-examples — a sibling component's `in-data-[slot=<this-component>]:` context-override can go stale when the host surface is re-clothed to a different tone**

| Feld | Inhalt |
|---|---|
| Why B | Spotted while planning the WithKbd usage example; host (tooltip) chosen light, the override assumed dark. Out-of-scope to fix here → flagged. No defect to the tooltip port itself. |
| Gap | The skill doesn't prompt the porter to check whether already-ported siblings carry an `in-data-[slot=<component-being-ported>]:` override keyed on THIS component's slot — those overrides were authored against a previous (or assumed) host surface and silently mis-tune once the host is re-clothed. |
| Verified | `kbd.tsx` has `in-data-[slot=tooltip-content]:bg-surface/20 text-ink` (faint white tint + dark text — tuned for a DARK tooltip). On the chosen light `dialog-fill` tooltip it reads near-invisible. |
| Candidate fix | T3/T6 note: grep the lib for `in-data-[slot=<this-component-slot>]:` before finalizing the surface tone — a ported sibling may carry a context-override keyed on it. If the chosen tone contradicts the override's assumption, flag it as an open item (don't silently edit the sibling in a single-component port; record + defer). |
| Status | deferred. |

### /storybook-rules — (B20 application, already codified)

**#3 · B20 confirmed — portal-mounted Radix content: jsdom spec stays closed-only, open path via Chromium play**

| Feld | Inhalt |
|---|---|
| Why C-ish | Already codified (B20 in the consolidated handoff). This run is a confirming 2nd data point (after Select), not a new gap. |
| Gap | — (covered). |
| Verified | Tooltip `TooltipContent` portals + mounts on open only. jsdom `.spec` exercises the closed/trigger path (no `scrollIntoView`/pointer polyfill needed beyond what test-setup already has). The hover-open path is a Chromium-project `play` story querying `within(document.body)`. |
| Candidate fix | None — evidence that B20 generalizes (Select → Tooltip). Keep as-is. |
| Status | covered (evidence only). |

## C (tooling / repo / env)

**C5 · parallel-worktree batch — sibling worktrees nested under `.claude/worktrees/` break the Nx project graph (duplicate project names)**

| Feld | Inhalt |
|---|---|
| Why C | Pure environment/tooling collision in the parallel-port batch; my code was fine. Cost one gate iteration to diagnose. |
| Gap | When N agents each create a git worktree under a shared parent's `.claude/worktrees/`, every worktree contains a full `libs/ui` + `apps/agentport`, and Nx (run from any worktree that can see the others) errors `projects defined in multiple locations` and refuses to build the graph → the gate can't run at all. No skill/batch-brief step pre-empts this. |
| Verified | `nx typecheck` → "The following projects are defined in multiple locations: agentport / @agentport/ui" listing `.claude/worktrees/toggle-group-run/...` + the root. An untracked `.nxignore` containing `.claude/worktrees` + `nx reset` fixed it. |
| Candidate fix | The parallel-batch orchestration (or the port skill's setup note for batch runs) should ensure worktrees are NOT nested where Nx globs them — either place worktrees outside the repo tree, or seed a (gitignored) `.nxignore` with `.claude/worktrees` in each worktree before the gate. Also: a sibling agent's UNTRACKED component files land in the shared `libs/ui` tree → the full `nx test` reports the sibling's failing stories; each agent must read the gate as "are MY component's tests green", not the aggregate. |
| Status | open (tooling/orchestration). |
