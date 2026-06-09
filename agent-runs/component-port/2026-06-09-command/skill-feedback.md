# Skill feedback — /shadcn-component-port (run: command, 2026-06-09)

Captured live during the command port. Feedback for the SKILL, not domain notes.

## 1. T2/T6 — `ui:add` may write extra DEPENDENCY components that break the gate   [— open]

**Gap:** The skill treats `ui:add <component>` as writing one component. For composites,
shadcn pulls in **dependency components too** (command → also wrote `dialog.tsx`). That extra
file can import packages the project doesn't have (`dialog.tsx` imported `lucide-react`, not a
dep here) → it silently breaks `nx typecheck/test` even though the target component is fine.
**Verified:** `npm run ui:add -- command` created `command.tsx` **and** `dialog.tsx`;
`dialog.tsx` `import { XIcon } from "lucide-react"` with no `lucide-react` in package.json.
**Candidate fix:** Add a T2 step — after `ui:add`, **list every file it wrote** and check each
extra component's imports against installed deps. For each dependency component decide: port it
(separate run), minimally stub, or **delete + defer** and flag it. Never leave a stray
un-ported dependency component in the tree — it fails the gate. State this so the next composite
port (e.g. anything pulling Dialog/Popover) handles it deterministically.

## 2. T6 gate — cmdk/Radix components need jsdom polyfills (ResizeObserver, scrollIntoView)   [— open]

**Gap:** The T6 gate says "run nx test green" but components built on headless libs (cmdk, some
Radix primitives) call **ResizeObserver** / **Element.scrollIntoView** on mount — both absent in
jsdom. Specs `ReferenceError: ResizeObserver is not defined` before any assertion runs, and the
skill gives no heads-up.
**Verified:** command.spec failed 6/6 with `ResizeObserver is not defined` (cmdk dist) until a
vitest `setupFiles` polyfill was added; then 22/22 green.
**Candidate fix:** T6 gate note — if the component is built on a headless lib that touches
browser layout APIs, ensure the lib has a vitest **setupFile** polyfilling `ResizeObserver` and
`Element.prototype.scrollIntoView` (create one + wire `test.setupFiles` if absent). Mention this
is a one-time per-lib setup (like the T1 cn() extension), not per-component.

## 3. T4 Figma — Section children use SECTION-RELATIVE coordinates   [— open]

**Gap:** T4 says "place the set in a Section" but never states the coordinate system. SectionNode
children's `x/y` are **local to the section's top-left**, not absolute canvas coords. Adding the
section's absolute x/y when positioning children (a natural assumption from frame-less sections)
puts the build far off-canvas.
**Verified:** headline at local `(80,80)` → abs `(2865,222)` = sectionX(2785)+80. Setting a
child `x = section.absX + 80` rendered it at abs `5650` (2785+2865), way outside the section.
Fixed by using local coords directly.
**Candidate fix:** T4 "Section" bullet — note that **Section children use section-relative
coords**; position with local x/y from the section's top-left, never offset by the section's
absolute position. (Pairs with the existing `/figma-create-section` headline-at-(inset,inset)
convention.)
