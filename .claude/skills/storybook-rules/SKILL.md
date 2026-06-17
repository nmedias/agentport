---
name: storybook-rules
description: "Author or update a component's .stories.tsx in this repo to the house pattern — the three story roles (Default playground+play, Usage examples, States gallery), hand-curated argTypes, role-based play tests, pseudo-state focus, axe-clean a11y, DS-token layout. Trigger when writing a NEW story file, adding stories to a component, or reconciling existing stories after a component's API/variants/states changed. Not a Figma→code token sync (use /component-sync) and not a first-time component build (use /shadcn-component-port — it delegates story work to these rules)."
---

# Storybook Rules (author + update stories)

Write and maintain `<name>.stories.tsx` to the repo's house pattern. **Story craft only** — not the
component code, not Figma. Two entry modes share one rule set: **author** a new story file, or
**update** an existing one after the component changed.

## Inputs / Output

```
in   component: name of a component in libs/ui/src/components/ui/<name>/ (or blocks/…)   REQUIRED
     mode: author (no .stories.tsx yet) | update (exists, component drifted)
out  <name>.stories.tsx to the pattern below; gate green (jsdom specs + storybook browser project)
     storybook MCP up (:6006) → preview-stories URLs surfaced
```

## Reference (living template — read, don't duplicate)

The **choice-card trio** is the canonical implementation of every rule here:
`components/ui/choice-card/{choice-card-checkbox,choice-card-radio,choice-card-switch}/*.stories.tsx`
plus the base `components/ui/checkbox/checkbox.stories.tsx` (usage-example set). When a rule is
ambiguous, copy the shape from these — don't reinvent.

## Imports (easy to get wrong)

```ts
import type { Meta, StoryObj } from '@storybook/react-vite';  // NOT @storybook/react
import { expect, userEvent } from 'storybook/test';           // NOT @storybook/test (old path)
```

## The three story roles (the spine)

Every component ships the same set. Map each role; don't skip.

```
Default          API playground (+ interaction smoke test, if the component is interactive)
                 · NEVER `export const Default = {}` — `render: (args) => <X {...args}>…</X>` spreading
                   args into a COMPLETE instance (props/children that make sense together), so the 'code'
                   snippet is a real example not {} — every prop stays a live control + ArgsTable row
                 · NO controls.include (it filters the table, not just the panel)
                 · carries the play() test (§play) — UNLESS Default is non-interactive (static display);
                   then the play moves to the interactive story (e.g. an asChild link), like radio→Group
                 · source stays the meta's 'code' — never override a story to 'dynamic'
Usage examples   one per STRUCTURALLY-DISTINCT real usage (Basic, Description, Group, Disabled, Invalid)
                 · reproduce the ACTUAL composition with ported DS primitives (Field/FieldLabel/…), never div+label
                 · `controls: { disable: true }` is the DEFAULT, not a reflex — add a scoped
                   `controls: { include: ['<prop>'] }` when a live toggle REINFORCES the example's
                   point or aids doc/understanding (§controls)
States gallery   AllStates / <Comp>States — every state side by side, at a glance
                 · grid: columns = primary axis (unchecked/checked, off/on, unselected/selected)
                 · rows mapped from a STATE_ROWS array (enabled/focus/disabled/invalid/invalid-focus)
                 · render-only; focus rows via pseudo addon (§pseudo)
                 · DISPLAY-ONLY component (no pseudo-state axis, e.g. badge) → the gallery axis is
                   variant/content, NOT state; don't fake focus/disabled/invalid rows (cf. port T2 anatomy)
```

## Meta block

```
tags: ['autodocs']
args: { …defaults for the playground }
argTypes: HAND-CURATED  — react-docgen can't read Pick<…> & Omit<ComponentProps<…>> / Radix type refs
  per prop: control | description (Backticks for `code`) | table:{ type:{summary}, defaultValue:{summary} }
  callbacks + id → control: false   (documented in table, no live control)
parameters: { docs: {
  source: { type: 'code' }              // ALWAYS 'code' — never override a story to 'dynamic'
  description: { component: '…' }        // autodocs-page prose (markdown); point at the key story (cf. radio-group)
}}
```

## play (interaction test) — §play

The play function IS the story's Vitest browser-test body AND animates in the Interactions tab.

```ts
play: async ({ canvas, step }) => {
  const el = canvas.getByRole('checkbox', { name: /enable notifications/i }); // role + accessible name, never test-id/class
  await step('starts unchecked', async () => { await expect(el).not.toBeChecked(); });
  await step('clicking toggles it on', async () => { await userEvent.click(el); await expect(el).toBeChecked(); });
  await step('blurring clears the focus', async () => { el.blur(); await expect(el).not.toHaveFocus(); });
};
```

- **Uncontrolled instance for toggle tests** (no `checked` arg) — a controlled one freezes, the click shows nothing.
- **Final `blur()`** — `userEvent.click` leaves the element programmatically focused (→ `:focus-visible` ring);
  `blur()` makes the end-state match a real mouse user (no lingering ring). Recurring, deliberate.
- **Respect the component contract** — a radio can't be clicked off → Default tests selection only; the
  mutual-exclusion test (one selection deselects another) belongs in the `Group` story.

## Pseudo-states (focus/hover) — §pseudo

A plain boolean can't set a CSS pseudo-class. Use `storybook-addon-pseudo-states`, two mechanisms:

```ts
// A) static gallery → target by element id
parameters: { pseudo: { focusVisible: ['#cc-focus-off', '#cc-focus-on'] } }

// B) interactive playground → synthetic `focus` arg + wrapper
type pseudoState = { focus: boolean };
const pseudoStateArgTypes = { focus: { control: 'boolean' } } satisfies Record<keyof pseudoState, { control: 'boolean' }>;
function PseudoWrap({ focus, children }) { return <div className={focus ? 'pseudo-focus-visible-all' : ''}>{children}</div>; }
export const Default: StoryObj<ComponentProps<typeof X> & pseudoState> = { argTypes: pseudoStateArgTypes, args: { focus: false }, render: ({ focus, ...args }) => <PseudoWrap focus={focus}><X {...args} /></PseudoWrap>, … };
```

- **Never fake a state the component lacks** — e.g. omit `hover` if the component adds no hover style; say so in a comment.

## Cross-cutting invariants

- **a11y is a gate, not decor** — `preview.ts` sets `a11y: { test: 'error' }`; axe violations FAIL the
  story tests. Every story needs real labels/roles/aria (a bare control → `aria-label="…"`).
- **DS tokens in story layout** — stories are part of the DS surface: `gap-xl`, `text-format-eyebrow`,
  `text-muted-ink` — never raw Tailwind numbers (`gap-6`) or hex.
- **Controls hygiene** — §controls. Default playground = full panel (NEVER `include` — it filters the
  ArgsTable). Usage examples default to `controls: { disable: true }`, but `disable` is a DEFAULT, not a
  reflex: attach a scoped `controls: { include: ['<prop>'] }` (give the story its own arg shape if the prop
  isn't on the meta component) when a live toggle **reinforces the example's main point** or aids
  doc/understanding — e.g. the orientation/variant the example exists to show. ALWAYS add such a control
  when the example demonstrates a prop of a SUB-/SIBLING part the meta component's Default can't reach
  (e.g. `FieldGroup.orientation` while `component: Field`): that prop otherwise has NO playground anywhere.
  The States gallery stays render-only.
- **Comment discipline** — file-top **contract** comment: name the *mechanism* (which CSS/Slot/attribute
  tints/focuses/wires-a11y, and WHEN), not what the component *is* — "a pill marker" = description ✗;
  "variant sets fill+ink; asChild→Slot renders as `<a>`, becomes focusable→ring" = contract ✓. Each story
  a one-line "why I exist"; inline-justify non-obvious choices (why uncontrolled, why `blur()`, why no
  `include`). House norm, not optional.

## Process

```
S1 Locate    component folder; storybook MCP up (:6006)? → get-storybook-story-instructions (canonical CSF/imports)
S2 Meta      header contract comment; tags autodocs; args defaults; HAND-CURATED argTypes + docs.description.component; source:'code'
S3 Default   render: (args)=><X {...args}>…</X> — never {}; full ArgsTable (no include); play if interactive
S4 Examples  one per structurally-distinct usage, real DS composition primitives; controls.disable by default — scoped include where a toggle reinforces the point / reaches a sub-part prop (§controls)
S5 States    STATE_ROWS grid (primary axis = columns); focus via pseudo addon
S6 Verify    gate green (jsdom specs + storybook browser: Chromium + axe); shoot -- <storyId> / preview-stories → surface URLs
```

### Update mode (component drifted) — S2–S5 become a diff, not a rewrite

```
U1 Diff       what changed: prop added/removed/renamed · variant/size/state added/removed · role/label changed
U2 argTypes   re-sync the hand-curated docs to the new public API (react-docgen won't)
U3 Coverage   every variant×size/state appears in ≥1 story; add an overview story if examples don't exercise all
U4 play       fix role/name queries + assertions if the API moved
U5 Keep       never delete the States gallery / Usage examples — permanent deliverables
→ then S6 Verify
```

## Gate

`npx nx test|typecheck|lint @agentport/ui` green. `nx test` runs **two Vitest projects** — jsdom `.spec`
units **and** the `storybook` browser project (every story rendered in Chromium via
`@storybook/addon-vitest` + axe). A story that throws/regresses, or an axe violation, fails the gate.
Lint/typecheck don't see pixels → eyeball via `shoot` / `preview-stories`.
