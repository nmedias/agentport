# Skill-Feedback — toggle-group (+toggle) port · 2026-06-22

Capture ON. Findings ONLY. Pre-sorted A/B/C × Edit-Target. General, agent-directed phrasing; the
`Candidate fix` is the edit vorlage (the rest is review evidence, deleted with this file).

---

## A — gap caused a defect (priority)

### A1 · /storybook-rules — `play` interaction must use `userEvent`, not raw `element.click()` (Radix in the browser project)

| Feld | Inhalt |
|---|---|
| Why A | Two `play` tests failed the gate (storybook Chromium project) on a raw DOM `.click()`. |
| Gap | /storybook-rules says "a `play` test for interactive components" but doesn't pin the click API. A raw `node.click()` fires a bare DOM event that does NOT drive a Radix control's pointer/press handler in the real-browser storybook project → the state attribute never flips → assertion fails. (jsdom `.spec` with `fireEvent.click` passes — the divergence only bites in Chromium.) |
| Verified | `toggle.click()` → `aria-pressed` stayed `false` in the storybook project; `await userEvent.click(toggle)` → flips to `true`. Sibling stories (checkbox) already use `userEvent` from `storybook/test`. |
| Candidate fix | In the `play`-test rule: drive interactions with `userEvent` (`import { userEvent } from 'storybook/test'`, `await userEvent.click(el)`), never a raw `element.click()` — a bare DOM click doesn't trigger pointer-driven (Radix) handlers in the real-browser story project, so the assertion silently fails the gate. |
| Status | offen (User reviewt). |

## B — self-derived, result held (codify · deferred)

### B1 · /docgen-props (or SKILL.md T6) — a discriminated-union Radix base needs a `type` INTERSECTION, not `interface extends`

| Feld | Inhalt |
|---|---|
| Why B | Self-derived the intersection; build held + docgen unions still surface. |
| Gap | The docgen pattern (re-declare curated props via `interface … extends React.ComponentProps<typeof Primitive.Root>`) assumes Root's prop type is an object. When the primitive's Root is a DISCRIMINATED UNION (a `type`-discriminated prop, e.g. single|multiple — the union keeps a value-shape matched to the discriminant), `interface extends <union>` throws TS2312 ("can only extend an record type"), and the destructured `className`/`children` then read as missing. The composite `dist`/declaration build surfaces this; a plain typecheck against a stale build can mask it. |
| Verified | `interface ToggleGroupProps extends ComponentProps<typeof Root>` → TS2312 + className/children "does not exist"; switching to `type Props = ComponentProps<typeof Root> & OwnProps` (own props as a separate interface for the JSDoc) compiled + kept docgen. A non-union sibling Root extends fine. |
| Candidate fix | Note in /docgen-props: if the primitive Root's props are a discriminated union (a `type`/variant-discriminated prop), author the public props as `type X = React.ComponentProps<typeof Root> & XOwnProps` (own DS props in a separate `interface XOwnProps` carrying the JSDoc) — NOT `interface X extends ComponentProps<Root>` (TS2312 over a union). Object-typed Roots keep `interface extends`. |
| Status | zurückgestellt. |

## C — tooling / repo / already covered

### C1 · environment — a fresh git worktree needs a real `npm ci` + a clean composite build before the gate is trustworthy

| Feld | Inhalt |
|---|---|
| Why C | Environment/tooling, not skill prose — but it MASKED real type errors as a 200-error storm, costing triage time. |
| Gap | A git worktree does NOT share the main repo's `node_modules`, and the storybook **browser** test project cannot serve a **symlinked** `node_modules` (Vite fetches resolve to the absolute symlink target → "Failed to fetch dynamically imported module"). A fresh worktree also has no composite `dist`/`.d.ts`; `tsc --build` then emits TS6305 ("output not built from source") across every story file, and the real per-file type errors hide underneath. Both look like "my code is broken" when it's the env. |
| Verified | Symlinked node_modules → jsdom/lint/typecheck OK but 37 storybook browser files failed on the setup-file import; `npm ci` (real install) + `rm -rf libs/ui/dist libs/ui/out-tsc` then a forced `tsc --build` → the actual 2-line type error surfaced + gate went green (282 tests). |
| Candidate fix | When a port runs in an isolated worktree: do a real `npm ci` in the worktree (never symlink node_modules — the storybook browser project breaks), and clear stale `libs/ui/dist`/`out-tsc` so the composite build emits fresh `.d.ts` before trusting a red gate (TS6305 + an implicit-any storm across ALL stories = a missing/stale composite build, not your code). |
| Status | offen (Tooling/Env). |
