# Skill feedback — `/shadcn-component-port` (run: 2026-06-06 kbd)

Per-run skill gaps surfaced during the kbd port. Candidate fixes, general phrasing — for the user to
review and fold into the skill (not edited mid-run).

## 1. T2 — `npm run ui:add -- <component>` does not work in this monorepo (path problem)

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
   Safe because `libs/ui/tsconfig.json` is a solution-style file (compiles nothing); the real builds
   (`tsconfig.lib/spec/storybook.json`) extend the base **directly** and keep the root-relative `@/*`,
   so compilation is unaffected. Confirmed: `nx run-many -t typecheck lint test` green across both
   `@agentport/ui` and `agentport`.

**Test evidence:** with both changes, `npm run ui:add -- badge` created
`libs/ui/src/components/ui/badge.tsx` (flat, correct) with **no** `libs/ui/libs/` nesting. (Note: the
shadcn "✔ Created …" log line is unreliable — it printed a non-nested path even on the broken kbd run.)

**Candidate fix for T2.2:** once the two changes above are committed, the skill can simply say
> Run `npm run ui:add -- <component>` → lands flat at `libs/ui/src/components/ui/<component>.tsx`. Move
> it into its folder `components/ui/<component>/<component>.tsx`, add the barrel, re-export in
> `libs/ui/src/index.ts`.

i.e. the existing "flat → move into folder" wording becomes true again, and the `-c`/nesting/cleanup
caveats disappear. **Until committed**, the manual path is: `npx shadcn@latest add <component> -c libs/ui`
→ nested write → `mv libs/ui/libs/ui/src/components/ui/<c>.tsx …/<c>/<c>.tsx` → `rm -rf libs/ui/libs`.

**Side effect to watch:** `ui:add` also runs `npm install` for the component's deps (badge pulled in
`radix-ui`), touching `libs/ui/package.json` + `package-lock.json`. Real ports want that; throwaway
tests must `git checkout` those two files.

## 2. T4 — slot default size is fixed 100×100 and a slot cannot HUG

**Gap:** T4's slot guidance ("`component.createSlot()` … drop a sensible default inside") omits that a
fresh `SLOT` node is created at a **fixed 100×100** with `layoutMode='NONE'`. Inside an auto-layout
parent that blows the component out (the icon cap became 108px wide and the icon floated above the
cap). A slot **cannot** take `layoutSizingHorizontal='HUG'` (NONE layoutMode), so hugging the parent
to the icon requires resizing the slot itself.

**Candidate fix (T4 slot bullet):** add —
> After `createSlot()` the slot is a **fixed 100×100 / layoutMode NONE** node and cannot HUG. Resize
> it to the default content's box (`slot.resize(w,h)`) and set `slot.clipsContent=false`, so the
> auto-layout parent hugs correctly instead of inheriting 100px.

## 3. T4/T4b — TEXT (and other non-slot) component properties can't be added after `combineAsVariants`

**Gap:** Tried to add a `TEXT` property to a variant *after* combining → `addComponentProperty`
throws **"Can only set component property definitions on a product component"**. A variant inside a
set is not a "product component". The `INSTANCE_SWAP` slot prop only survived because `createSlot`
ran **before** `combineAsVariants`.

**Candidate fix (T4 / red-flags):** add a row —
> Add every TEXT / BOOLEAN / INSTANCE_SWAP / slot component property **before** `combineAsVariants` —
> on the standalone component. After combining, `addComponentProperty` throws "Can only set component
> property definitions on a product component". (VARIANT properties are the exception — they derive
> from the combine.) If a per-variant text label needs to stay editable and you only realise
> post-combine, a direct character override on the instance is a valid fallback (not a broken prop).
