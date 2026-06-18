---
name: docgen-props
description: "Annotate a component's .tsx so react-docgen extracts its public prop API — flat props with JSDoc descriptions, plus Omit+re-declare for the curated Radix/DOM/CVA-derived props the default docgen filter would drop — so the Storybook Autodocs ArgsTable AND the storybook MCP get-documentation surface the API natively, not from hand-curated argTypes. Trigger when porting a shadcn component (within /shadcn-component-port T6) or updating a component whose props must show up in autodocs / get-documentation. Component code ONLY — story control config + pass-through-prop defaults stay in /storybook-rules."
---

# Docgen Props (component .tsx → react-docgen API)

Make a component's public prop API extractable by **react-docgen** so the Storybook Autodocs
ArgsTable **and** the storybook MCP `get-documentation` surface it natively — no hand-curated argType
descriptions. **Component code only**; control config + pass-through defaults stay in `/storybook-rules`.

Worked reference: `components/ui/switch/{switch.tsx,switch.stories.tsx}` (Radix case) — copy the shape.

## Why (the mechanism)

- Autodocs ArgsTable **and** the storybook MCP `get-documentation` both read **react-docgen**, which
  extracts from the component's **TS types + JSDoc** — *not* from the story's `argTypes`.
- The default propFilter drops every prop **declared in node_modules** → inherited DOM/Radix props and
  CVA-derived `VariantProps<…>` never surface. Only props declared **flat, in the component file** are
  extracted. So the public API must live there as flat own props with JSDoc.

## Rules

### 1. Own props (CVA variants, local props) → flatten + JSDoc
A prop hidden in `VariantProps<typeof xVariants>` is invisible. Declare it as a flat literal-union prop
with JSDoc. Keep it in lockstep with the CVA source so the written union can't drift:

```ts
/** Visual style — solid fills … */
variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
const _v: Equal<NonNullable<Props['variant']>, NonNullable<VariantProps<typeof xVariants>['variant']>> = true;
```

### 2. Inherited props (Radix / DOM) you want documented → Omit + re-declare
You can't JSDoc a prop you didn't declare. Take the **curated subset** out of the inherited base via
`Omit`, then re-add each as a flat own prop with JSDoc → one declaration each, attributed to this file →
passes the filter. The rest of the surface still passes through (`...props`) and stays type-complete.

```ts
interface XProps
  extends Omit<React.ComponentProps<typeof Root>, 'checked' | 'disabled' | 'onCheckedChange' | …> {
  /** Controlled on/off state (pair with `onCheckedChange`). */ checked?: boolean;
  /** … @default false */                                       disabled?: boolean;
}
function X({ className, ...props }: XProps) { return <Root {...props} />; }
```

Document only the props that are genuinely **your API** — not every inherited DOM/ARIA attribute.

### 3. What react-docgen yields

| Want in… | react-docgen reads | how |
|---|---|---|
| description | JSDoc comment text | `/** … */` on the prop |
| type · enum | the TS type | flat literal union |
| control type | inferred from the type | boolean→toggle · string→text · union→select |
| default (→ MCP `get-documentation`) | `@default x` JSDoc tag | set it on every prop that has a default |

The ArgsTable's Default column ignores `@default` → it's declared separately in the story argType (`/storybook-rules`).

### 4. Don'ts
- Don't loosen the global docgen `propFilter` to admit node_modules — it floods every DOM/ARIA/Radix
  prop, and they carry no curated descriptions.
- Don't write a prop's description in **both** the JSDoc and the story's `argTypes` — drift. JSDoc is the
  single source for description/type/enum/destructured-default.

## Boundary with /storybook-rules

| Lives on the component `.tsx` (this skill) | Lives in the story `argTypes` (`/storybook-rules`) |
|---|---|
| type · description · enum · `@default` (→ MCP `get-documentation`) | control-type **overrides** (e.g. `inline-radio` vs the inferred select) |
| | `table.defaultValue` for **every** defaulted prop (→ ArgsTable) |

## Verify
- `get-documentation <id>` (storybook MCP) → the props appear with descriptions + `@default`.
- `shoot -- <id>--docs` + `SELECTOR=.docblock-argstable` → ArgsTable complete (type · description ·
  control · default). (Storybook on :6006; the gate/typecheck never see the render — eyeball it.)
- `npx nx typecheck @agentport/ui` green → the `Omit`+re-declare didn't break the inherited surface
  (passthrough intact).
