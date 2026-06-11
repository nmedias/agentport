# Skill-Feedback — CommandDialog re-add (component-port follow-up) · 2026-06-11

Run: re-add of the deferred `CommandDialog` sub-part into the already-ported `command/`
(code-only — no Figma work). Target skill: `/shadcn-component-port` (+ `references/composites.md`).

## 1. T2/composites — style source can contradict the doc-example contract

**Gap:** the skill treats the style registry source (radix-nova) as the anatomy authority. For
CommandDialog the nova source renders `{children}` bare inside `DialogContent` — no `<Command>`
wrapper — while the canonical doc example passes `CommandInput`/`CommandList` directly as children.
Ported source-faithfully, the component is broken (cmdk parts outside a cmdk root). new-york-v4
wraps children in `<Command>`; nova appears to have dropped the wrapper without changing the usage
contract.
**Verified:** fetched `r/styles/radix-nova/command.json` (children bare) vs
`r/styles/new-york-v4/command-dialog.json` demo (palette parts as direct children). Port with an
internal `<Command>` wrapper passes the doc-example usage (spec: palette renders + filters inside
the dialog).
**Candidate fix:** in composites.md (anatomy/Exposure-Surface): *the usage contract comes from the
doc examples, not the style source — when they disagree, reproduce the example's call-site API and
note the source deviation.* Cross-check every composite wrapper against at least one doc example
before T3.
**Status:** open

## 2. T2.5 Stories — DOM-global-free applies to the WHOLE stories file, not just play functions

**Gap:** dialog-run finding #6 is phrased as "play functions without DOM globals". The constraint
is wider: the stories tsconfig (`tsconfig.storybook.json` → base `lib: ["es2022"]`, no DOM) covers
the entire compilation unit — render-helper components in a `.stories.tsx` can't use
`document`/`KeyboardEvent` either. Doc examples with global listeners (command-dialog's ⌘J
`document.addEventListener`) cannot be ported into a story as-is.
**Verified:** tsconfig chain read; story written DOM-free (DS `Button` trigger + `Kbd` hint instead
of the ⌘J listener) typechecks; the listener variant would reference missing DOM lib types.
**Candidate fix:** generalize dialog #6 in SKILL.md T2.5: *stories compile without DOM lib — no
`document`/`window`/DOM event types anywhere in the file; replace doc-example global-listener
wiring with an in-canvas trigger and note the adaptation.*
**Status:** open (refines dialog-run #6)

## 3. T1/T3 — DS shadow semantics are not in the twMerge extensions

**Gap:** `cn()` registers typo formats, named spacing and corner-* — but not the DS shadow
vocabulary (`shadow-elevation`, `shadow-glow`). `cn('… shadow-elevation', 'shadow-none')` keeps
BOTH classes (twMerge's built-in shadow scale doesn't know `elevation`), so neutralizing a frame
relies on CSS order. Harmless here only because the inner shadow is clipped by the panel's
`overflow-hidden`; a port that must genuinely override a DS shadow would misbehave silently.
**Verified:** read `libs/ui/src/lib/utils.ts` (no shadow group) + `tw-theme.css` (`--shadow-*:
initial` + glow/elevation only). Spec asserts the border merge (`border`→`border-0` collapses);
shadow classes both present in the rendered markup.
**Candidate fix:** either register a `shadow` class-group extension (`shadow-elevation`,
`shadow-glow` + `none`) in utils.ts (repo fix), or add to SKILL.md T1's twMerge checklist: *any DS
utility family a port overrides via className must be registered in twMerge — currently missing:
shadows.*
**Status:** open
