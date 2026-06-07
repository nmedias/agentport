# Skill feedback — `/shadcn-component-port` (run: 2026-06-06 kbd)

Per-run skill gaps surfaced during the kbd port. Candidate fixes, general phrasing — for the user to
review and fold into the skill (not edited mid-run).

## 1. T2 — `npm run ui:add -- <component>` does not work in this monorepo (path problem) — ✅ CLOSED

**Status: CLOSED — no skill edit needed.** The fix below is committed (`fc046fc`, alias scope refined
in `1eb20d4`), which makes `npm run ui:add -- <component>` land flat at
`libs/ui/src/components/ui/<component>.tsx` again — exactly what SKILL.md:72–74 already describes. The
`-c` / nested-path / `rm -rf libs/ui/libs` caveats were **symptoms of the broken state**, now removed,
so they must **not** go into the skill. What follows is kept as a root-cause + fix record in case the
setup ever regresses — not an open to-do.

---


**What the skill says (T2.2):** "If `libs/ui/src/components/ui/<component>/` is absent:
**`npm run ui:add -- <component>`** … shadcn writes it **flat** → move to `components/ui/<component>/…`".

**What actually happens here:**
- `npm run ui:add -- kbd` (script = `npx shadcn@latest add kbd`, run from the **monorepo root**)
  **errors**, it does not write a flat file:
  ```
  It looks like you are running add [component] from a monorepo root.
  To use shadcn in a specific workspace, use the -c flag:
    shadcn add [component] -c apps/agentport
    shadcn add [component] -c libs/ui
  ```
- The correct command is `npx shadcn@latest add <component> -c libs/ui`. **But** with `-c libs/ui`
  shadcn resolves the target relative to the workspace and writes to a **nested wrong path**:
  `libs/ui/libs/ui/src/components/ui/<component>.tsx` (i.e. `libs/ui/` is duplicated). It does **not**
  land at `libs/ui/src/components/ui/<component>.tsx`.

**Root cause (confirmed):** `@/* → ./libs/ui/src/*` is defined in **`tsconfig.base.json` (repo root)**,
so the path value is root-relative. shadcn run with `-c libs/ui` resolves that alias **relative to the
`libs/ui` workspace dir** → `libs/ui` + `libs/ui/src` = `libs/ui/libs/ui/src`. Hence the doubling. The
`aliases` block in `libs/ui/components.json` (`"ui": "@/components/ui"` …) is *where shadcn gets the
`@/` string*; it then reads the tsconfig `paths` to turn `@/` into a directory — and that resolution is
what doubles.

**VERIFIED FIX (applied + tested in this repo, throwaway `badge` port + repo-wide gate green):**

Two changes remove the footgun at the source so `npm run ui:add -- <component>` lands files correctly:

1. `package.json` — bake the workspace flag into the script:
   ```diff
   - "ui:add": "npx shadcn@latest add",
   + "ui:add": "npx shadcn@latest add -c libs/ui",
   ```
2. `libs/ui/tsconfig.json` — add a **local, workspace-relative** `@/*` override. A child tsconfig's
   `paths` *replaces* the inherited one wholesale (tsconfig `extends` does not deep-merge `paths`), so
   shadcn now resolves `@/* → ./src/*` relative to `libs/ui` → `libs/ui/src`. It works regardless of
   whether shadcn resolves relative-to-cwd (the bug) or relative-to-defining-tsconfig (correct TS),
   because for this file both are the `libs/ui` dir — they coincide.
   ```diff
     {
       "files": [],
       "include": [],
   +   "compilerOptions": { "paths": { "@/*": ["./src/*"] } },
       "references": [ … ],
       "extends": "../../tsconfig.base.json"
     }
   ```
   Safe because `libs/ui/tsconfig.json` is a solution-style file (compiles nothing). Confirmed:
   `nx run-many -t typecheck lint test` green across both `@agentport/ui` and `agentport`.

   > **Update (post-refactor, commit `1eb20d4`):** the `@/*` mapping was subsequently moved **out of
   > `tsconfig.base.json` entirely** and into the three libs/ui build configs (`tsconfig.lib/spec/
   > storybook.json`) as the workspace-relative `./src/*`, because a repo-global alias pointing into one
   > lib is the wrong altitude. So the canonical compiler entry now lives in the build configs, not the
   > base. The `libs/ui/tsconfig.json` override above stays (it serves shadcn-CLI + editor). Net: three
   > independent resolvers — TS compiler (build configs), Vite (`resolve.alias` in `vite.config.mts`,
   > hardcoded to `src`, used by Vitest + Storybook), shadcn/editor (`libs/ui/tsconfig.json`).

**Test evidence:** with both changes, `npm run ui:add -- badge` created
`libs/ui/src/components/ui/badge.tsx` (flat, correct) with **no** `libs/ui/libs/` nesting. (Note: the
shadcn "✔ Created …" log line is unreliable — it printed a non-nested path even on the broken kbd run.)

**Skill edit needed: NONE.** With the fix committed, SKILL.md:72–74 (`npm run ui:add -- <component>`
→ writes flat → move into `components/ui/<component>/` + barrel) is accurate as-is. No `-c`, nesting,
or cleanup wording should be added — that was the broken-state symptom, now gone.

**Side effect to watch:** `ui:add` also runs `npm install` for the component's deps (badge pulled in
`radix-ui`), touching `libs/ui/package.json` + `package-lock.json`. Real ports want that; throwaway
tests must `git checkout` those two files.

## 2. T4 — slot needs explicit config (geometry + fill + auto-layout) — ✅ written into SKILL.md

**Gap:** T4's slot guidance ("`createSlot()` … drop a sensible default inside") omitted that a fresh
slot must be configured — and that *how* depends on intent.

**Verified (throwaway probes + the live kbd slot):**
- Default geometry is **unreliable**: in one session a fresh slot came up `100×100 / layoutMode NONE /
  opaque-white fill`, while the built kbd slot ended up `auto-layout / HUG / empty fill`. Never assume
  the default — set it explicitly.
- An unconfigured `100×100` slot inflates the auto-layout parent (icon cap blew to 108px, icon floated
  above the cap).
- A slot with `layoutMode='NONE'` **cannot** `HUG` (`"HUG can only be set on auto-layout frames…"`).
  `FILL` is *accepted* but leaves it at 100 — a trap, not a fix.
- Default slot fill is **opaque white** (`{1,1,1}`) → a box behind the content unless cleared.
- Giving the slot its **own auto-layout** makes the slotted content a real layout child: it can be
  **aligned** AND **self-fit** (child `layoutSizing='FILL'` → scales to the slot box), not just placed
  at coords.

**Intent decides the sizing (not a one-size fix):**
- **Stable box** (key cap, avatar — the kbd case): slot keeps its size, content sits inside without
  growing it → slot `FIXED`/`FILL` to fixed dims, content centered. A swapped 24px icon is centered,
  not allowed to blow up the cap.
- **Hug content** (component should grow to whatever's slotted): slot `HUG/HUG`.
- A bare `resize()` without auto-layout freezes the size **and** leaves the content unmanaged — avoid.

**Resolution:** written into the T4 slot bullet of `SKILL.md` (compact). Supersedes the earlier
"resize the slot" candidate — that was a workaround for the bad default, not the right model.

## 3. T4 — where component properties can be added (set vs variant) — ✅ written into SKILL.md

**Original (wrong) claim:** "add every TEXT/BOOL/INSTANCE_SWAP/slot prop **before** `combineAsVariants`;
after combining `addComponentProperty` throws, and the slot only survived because it ran pre-combine."
That conflated two different APIs and was **doubly wrong** — it is a **target** rule (which node type),
not a timing rule.

**Verified (throwaway probes):**

| API | standalone (pre-combine) | child variant (post-combine) | set (post-combine) |
|---|---|---|---|
| `addComponentProperty` (TEXT/BOOL/INSTANCE_SWAP) | ✅ | ❌ *"product component"* | ✅ |
| `createSlot` (SLOT) | ✅ | ✅ | ❌ no `createSlot` on a set |

- TEXT/etc. **can** be added post-combine — on the **set**, not a child variant. Binding a variant's
  node to a set-level prop post-combine works end-to-end (verified: `set.addComponentProperty` → set
  `node.componentPropertyReferences={characters: id}` → instantiate → `setProperties` → the text node
  actually changed to "Changed").
- Slots **can** be added post-combine — on a **child variant** (not restricted). So the kbd slot would
  have worked post-combine too; "survived because pre-combine" was a false causation.
- A prop's id **changes on combine** (`Label#…:0` → `Label#…:1`) — re-read it post-combine.
- The earlier "instance character override as a fallback" is unnecessary — a proper set-level TEXT prop
  is fully available post-combine.

**Resolution:** written into SKILL.md T4 as a plain **rule bullet** (next to `combineAsVariants`), not a
red flag — it is a positive "do it this way" rule, not a trap to avoid. Supersedes the original
pre-combine claim.

## 4. Extract run-logging into a separate, opt-in skill (user request)

**Request (from the user, this run):** pull all run-logging out of `/shadcn-component-port` into a
**dedicated, toggleable `runlog` skill** that can be switched on alongside any skill. The component-port
skill should **know nothing** about run-logging anymore — no T7 Notes step, no `skill-feedback.md`
mechanism baked in. Those concerns move to the separate skill and are only active when it is enabled.

**Why:** run-logging **did not work reliably in this run** — the `skill-feedback.md` was not written
until the user explicitly asked for it, even though findings had surfaced mid-run (the T7 notes were
written, the feedback file was forgotten). Baking the logging into the port skill makes it easy to skip
under task pressure. A separate skill makes the logging an explicit, independent responsibility that can
be reasoned about (and triggered) on its own, and keeps the port skill focused on the port itself.

**Implication for `/shadcn-component-port`:** remove **T7 — Notes** and the per-run
`skill-feedback.md` wording (Process box + Boundaries note "Per-run skill gaps go to
`<run>/skill-feedback.md`"). The Output contract's `notes` line and the agent-run folder convention
become the new skill's concern.

**Sketch of the `runlog` skill (for the user to design):** generic, source-agnostic run journal —
given a run dir (`agent-runs/<kind>/<date>-<subject>/`), write `notes.md` (what happened, decisions,
node/var IDs, gate state) and `skill-feedback.md` (skill gaps surfaced, candidate fixes, general
phrasing). Opt-in: only runs when explicitly added to a session. Should be usable by *any* skill
(component-port, component-sync, design-punk…), not bound to shadcn. Open design questions: how it is
toggled on, how it learns the run dir, and how/when it prompts to capture feedback so it is not
forgotten (the exact failure mode of this run).
