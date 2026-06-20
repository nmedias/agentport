import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from './field';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Button } from '../button';

// Field family contract — a DISPLAY-ONLY composition primitive, no root element of its own.
// The parts only lay out + carry a11y semantics; the surface lives on the control inside.
//  · Field (role="group") = the per-row wrapper. `orientation` is its one real prop and the
//    only flex axis: vertical (default) stacks label→control→description; horizontal puts
//    label + control on one centered row; responsive flips column→row at @md (container query).
//  · State is expressed by DATA ATTRIBUTES on the wrapper, never pseudo-classes: `data-invalid`
//    dims nothing itself — it only flips FieldDescription/error wiring; the control's own
//    aria-invalid border/ring + FieldError (text-destructive) carry the red. `data-disabled`
//    on the Field dims its label via group styling. There is NO focus/hover/active state here.
//  · FieldContent stacks label+description into a column beside a control (horizontal rows).
//    FieldSet+FieldLegend wrap a <fieldset>/<legend> caption; FieldGroup stacks its Fields
//    (vertical default; `orientation="horizontal"` lays them in a wrapping row — a DS extension,
//    the row axis the checkbox/radio groups build on); FieldSeparator nests the DS Separator.
// So the "states" are: orientation × invalid × disabled × which parts are present — shown as
// the usage examples below, NOT as a faked pseudo-state gallery. Default = canonical playground.
const meta: Meta<typeof Field> = {
  title: 'UI/Field',
  component: Field,
  tags: ['autodocs'],
  args: { orientation: 'vertical' },
  // Prop docs come from docgen (JSDoc on the component types). Only story-side control config
  // stays here: orientation's control override (inline-radio) + its ArgsTable default (the
  // Default column ignores @default); docgen resolves the FieldOrientation union → options.
  // children is hand-curated (docgen surfaces no useful children). data-invalid / data-disabled
  // are HTML data attributes (not typed props) → described in the component block, not the table.
  argTypes: {
    orientation: {
      control: 'inline-radio',
      table: {
        defaultValue: { summary: '"vertical"' },
      },
    },
    children: {
      control: false,
      description: 'The field parts — FieldLabel, a control, FieldDescription, FieldError.',
      table: { type: { summary: 'React.ReactNode' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The form-field PRIMITIVE family — **`Field`** + **`FieldLabel`** / **`FieldContent`** / **`FieldDescription`** / **`FieldError`** / **`FieldSet`** / **`FieldLegend`** / **`FieldGroup`** / **`FieldSeparator`**. A display-only layout + semantics layer (no surface of its own — the control inside carries it). Its axes are `orientation` and the `data-invalid` / `data-disabled` attributes on the wrapper, not pseudo-states. See the **Input Field** / **Fieldset** / **Responsive** stories for the real compositions. Sub-parts with their own API have dedicated pages: [FieldGroup](?path=/docs/ui-field-fieldgroup--docs) · [FieldLegend](?path=/docs/ui-field-fieldlegend--docs) · [FieldError](?path=/docs/ui-field-fielderror--docs).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

// Default — the API playground. render spreads {...args} into a complete canonical Field
// (label → control → description), so `orientation` is a live control AND an ArgsTable row
// (no controls.include — it would also filter the table) and the 'code' snippet shows a real
// composition, never an empty {}. Display-only → no play (nothing to drive on a layout wrapper).
export const Default: Story = {
  render: (args) => (
    <Field {...args} className="w-full max-w-md">
      <FieldLabel htmlFor="default-username">Username</FieldLabel>
      <Input id="default-username" type="text" placeholder="Max Leiter" />
      <FieldDescription>Choose a unique username for your account.</FieldDescription>
    </Field>
  ),
};

// field-input (shadcn docs): vertical Input fields with label + description.
// Exercises the canonical stack order (label → control → description) and the
// label-first / description-first ordering.
export const InputField: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" type="text" placeholder="Max Leiter" />
            <FieldDescription>Choose a unique username for your account.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            <Input id="password" type="password" placeholder="••••••••" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

// field-textarea (shadcn docs): a Textarea field with label + description.
export const TextareaField: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
            <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
            <FieldDescription>Share your thoughts about our service.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

// field-fieldset (shadcn docs): a FieldSet with a FieldLegend caption + a nested
// two-column grid of Inputs. Exercises the legend (legend variant → title format).
export const Fieldset: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldLegend>Address Information</FieldLegend>
        <FieldDescription>We need your address to deliver your order.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="street">Street Address</FieldLabel>
            <Input id="street" type="text" placeholder="123 Main St" />
          </Field>
          <div className="grid grid-cols-2 gap-xl">
            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input id="city" type="text" placeholder="New York" />
            </Field>
            <Field>
              <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
              <Input id="zip" type="text" placeholder="90502" />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

// field-responsive (shadcn docs): orientation="responsive" — column on narrow,
// row on @md. Exercises FieldContent (label+description column beside the control),
// FieldSeparator between rows (nests the DS Separator), and a Button action row.
export const Responsive: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-4xl">
      <form>
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>Fill in your profile information.</FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>Provide your full name for identification</FieldDescription>
              </FieldContent>
              <Input id="name" placeholder="Evil Rabbit" required />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <FieldDescription>
                  You can write your message here. Keep it short, preferably under 100 characters.
                </FieldDescription>
              </FieldContent>
              <Textarea
                id="message"
                placeholder="Hello, world!"
                required
                className="min-h-[100px] resize-none sm:min-w-[300px]"
              />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  ),
};

// DS-authored (no standalone doc example): the invalid state. data-invalid marks the
// group invalid; per the Figma .Field design only the control (aria-invalid border/ring)
// and FieldError (text-destructive → error/600, a real DS semantic since the 2026-06-17
// rework) go red — label + description stay neutral (ink / muted-ink). Single message vs
// the dedup list both shown.
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-md">
      <FieldGroup>
        <Field data-invalid>
          <FieldLabel htmlFor="email-invalid">Email</FieldLabel>
          <Input id="email-invalid" type="email" defaultValue="not-an-email" aria-invalid />
          <FieldError>Enter a valid email address.</FieldError>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="bio-invalid">Bio</FieldLabel>
          <Textarea id="bio-invalid" defaultValue="x" aria-invalid rows={3} />
          <FieldError errors={[{ message: 'Bio is too short.' }, { message: 'Bio is required.' }]} />
        </Field>
      </FieldGroup>
    </div>
  ),
};

// DS-authored: the disabled state — data-disabled="true" on the Field dims its label via
// the group/field styling (the control itself carries its own disabled look).
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-md">
      <Field data-disabled="true">
        <FieldLabel htmlFor="api-key">API key</FieldLabel>
        <Input id="api-key" type="text" placeholder="sk-…" disabled />
        <FieldDescription>Generated once your plan is upgraded.</FieldDescription>
      </Field>
    </div>
  ),
};

// DS-authored: the horizontal orientation in isolation — label leading, control
// trailing, on one baseline-centered row.
export const Horizontal: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-4xl">
      <FieldSet>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="optin-wide" className="min-w-1/3">
              Subscribe to updates
            </FieldLabel>
            <Input id="optin-wide" type="text" placeholder="you@example.com" />
          </Field>
        </FieldGroup>
        <FieldSeparator />
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="optin-narrow">Subscribe to updates</FieldLabel>
            <Input id="optin-narrow" type="text" placeholder="you@example.com" className="max-w-1/3" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

// The sub-parts with their own API each live on a dedicated Autodocs page (meta.component = the part),
// mirroring UI/RadioGroup → UI/RadioGroup/Item: UI/Field/FieldGroup (orientation), UI/Field/FieldLegend
// (variant), UI/Field/FieldError (errors). This page keeps Field (the per-row wrapper) + the real
// compositions; the prop-less layout parts (FieldLabel/Content/Description/Separator/Title/Set) have no
// API to document and stay shown only inside the compositions above.
