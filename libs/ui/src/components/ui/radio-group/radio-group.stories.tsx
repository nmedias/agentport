import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from '../label';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../field';

// Usage examples mirror ui.shadcn.com/docs/components/radix/radio-group. The docs
// "Default" is the one example NOT Field-composed (bare item + Label); the rest use
// the ported Field family (Field / FieldContent / FieldSet / FieldLegend). Skipped:
// the "RTL" Arabic locale demo. The clickable Choice Card lives in its own DS component
// (UI/ChoiceCards/ChoiceCardRadio).
const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { defaultValue: 'comfortable' },
  // Prop type · description · enum come from RadioGroupProps' JSDoc via react-docgen (see
  // radio-group.tsx); Storybook infers each control from the type. argTypes adds only: (1) a
  // control override — `orientation` as inline-radio vs the inferred select (docgen resolves
  // the literal union, so options are inferred); (2) a defaultValue per defaulted prop — the
  // ArgsTable Default column ignores the @default JSDoc tag. The RadioGroupItem props get
  // their own ArgsTable on the UI/RadioGroup/Item page.
  argTypes: {
    orientation: { control: 'inline-radio', table: { defaultValue: { summary: '"vertical"' } } },
    disabled: { table: { defaultValue: { summary: 'false' } } },
    required: { table: { defaultValue: { summary: 'false' } } },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'Single choice out of a set: the group carries the value and the layout, each `RadioGroupItem` is one option. Items behave like Checkbox — state-driven, named only through composition; the selection itself always lives on the group.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

// Bare group — the API playground. Renders <RadioGroup {...args}> with three items, so every
// prop documented in the meta argTypes shows in the ArgsTable AND as a live control (no
// controls.include — that would also filter the table). The Field-composed examples live
// in the stories below.
export const Default: Story = {
  render: (args) => (
      <RadioGroup {...args} className="max-w-sm">
      <div className="flex items-center gap-lg">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-lg">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-lg">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

// orientation="horizontal": the options lay out in a row (the DS container switches its
// grid flow off Radix's data-orientation; arrow keys then navigate left/right). Stock
// shadcn ignores orientation visually — this row layout is a DS addition.
export const Horizontal: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <RadioGroup orientation="horizontal" defaultValue="comfortable">
      <div className="flex items-center gap-lg">
        <RadioGroupItem value="default" id="h1" />
        <Label htmlFor="h1">Default</Label>
      </div>
      <div className="flex items-center gap-lg">
        <RadioGroupItem value="comfortable" id="h2" />
        <Label htmlFor="h2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-lg">
        <RadioGroupItem value="compact" id="h3" />
        <Label htmlFor="h3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

// docs "Description": each option carries helper text via Field + FieldContent.
export const Description: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <RadioGroup defaultValue="comfortable" className="max-w-sm">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="d-default" />
        <FieldContent>
          <FieldLabel htmlFor="d-default">Default</FieldLabel>
          <FieldDescription>Standard spacing between items.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="d-comfortable" />
        <FieldContent>
          <FieldLabel htmlFor="d-comfortable">Comfortable</FieldLabel>
          <FieldDescription>More breathing room between items.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="d-compact" />
        <FieldContent>
          <FieldLabel htmlFor="d-compact">Compact</FieldLabel>
          <FieldDescription>Less spacing for denser lists.</FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  ),
};

// docs "Fieldset": FieldSet + FieldLegend group the items with a caption + description.
// Interaction test — drives the group like a user (mirrors Checkbox `Basic`). Uncontrolled
// (Radix moves selection on userEvent click — raw/fireEvent clicks don't), queried by role +
// accessible name (each Label's htmlFor names its button[role=radio]); asserts single-select:
// clicking Yearly checks it AND unchecks the defaultValue Monthly (mutual exclusion).
export const Fieldset: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldSet className="max-w-sm">
      <FieldLegend>Billing cycle</FieldLegend>
      <FieldDescription>Choose how often you want to be billed.</FieldDescription>
      <RadioGroup defaultValue="monthly">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="monthly" id="billing-monthly" />
          <Label htmlFor="billing-monthly">Monthly</Label>
        </div>
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="yearly" id="billing-yearly" />
          <Label htmlFor="billing-yearly">Yearly</Label>
        </div>
      </RadioGroup>
    </FieldSet>
  ),
  play: async ({ canvas, step }) => {
    const monthly = canvas.getByRole('radio', { name: /monthly/i });
    const yearly = canvas.getByRole('radio', { name: /yearly/i });

    await step('defaultValue selects Monthly', async () => {
      await expect(monthly).toBeChecked();
      await expect(yearly).not.toBeChecked();
    });

    await step('clicking Yearly moves the selection (single-select)', async () => {
      await userEvent.click(yearly);
      await expect(yearly).toBeChecked();
      await expect(monthly).not.toBeChecked();
    });

    // userEvent.click leaves the item programmatically focused (→ :focus-visible ring);
    // blur() drops the focus so the end state matches a real mouse user (no ring).
    await step('blurring clears the focus', async () => {
      yearly.blur();
      await expect(yearly).not.toHaveFocus();
    });
  },
};

// docs "Disabled": a disabled group — every item non-interactive and dimmed.
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <RadioGroup defaultValue="one" disabled className="max-w-sm">
      <div className="flex items-center gap-lg">
        <RadioGroupItem value="one" id="dis-one" />
        <Label htmlFor="dis-one">First option</Label>
      </div>
      <div className="flex items-center gap-lg">
        <RadioGroupItem value="two" id="dis-two" />
        <Label htmlFor="dis-two">Second option</Label>
      </div>
    </RadioGroup>
  ),
};

// docs "Invalid": aria-invalid on the items + data-invalid on the Field + FieldError.
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldSet data-invalid className="max-w-sm">
      <FieldLegend variant="label">Notifications</FieldLegend>
      <RadioGroup defaultValue="">
        <Field orientation="horizontal">
          <RadioGroupItem value="all" id="inv-all" aria-invalid />
          <FieldLabel htmlFor="inv-all">All new messages</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="mentions" id="inv-mentions" aria-invalid />
          <FieldLabel htmlFor="inv-mentions">Mentions only</FieldLabel>
        </Field>
      </RadioGroup>
      <FieldError>Please select a notification preference.</FieldError>
    </FieldSet>
  ),
};

// DS-authored gallery: the item state axis (maps the Figma .RadioGroupItem set).
// Each item lives in its own RadioGroup (className="contents") so its checked state
// is independent. The focus rows force :focus-visible via the pseudo-states addon, so
// the focus ring — and the focus-gated invalid red ring — is visible statically.
export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['#s-focus', '#s-checked-focus', '#s-focus-invalid', '#s-checked-focus-invalid'] },
  },
  render: () => (
    <div className="flex flex-col gap-lg">
      <RadioGroup defaultValue="" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="unchecked" id="s1" />
          <Label htmlFor="s1">Unchecked (default)</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="focus" id="s-focus" />
          <Label htmlFor="s-focus">Focus</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="checked" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="checked" id="s2" />
          <Label htmlFor="s2">Checked</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="checked-focus" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="checked-focus" id="s-checked-focus" />
          <Label htmlFor="s-checked-focus">Checked + focus</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="" disabled className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="disabled" id="s3" />
          <Label htmlFor="s3">Disabled</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="checked-disabled" disabled className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="checked-disabled" id="s-checked-disabled" />
          <Label htmlFor="s-checked-disabled">Checked + disabled</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="invalid" id="s4" aria-invalid />
          <Label htmlFor="s4">Invalid</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="checked-invalid" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="checked-invalid" id="s5" aria-invalid />
          <Label htmlFor="s5">Checked + invalid</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="focus-invalid" id="s-focus-invalid" aria-invalid />
          <Label htmlFor="s-focus-invalid">Invalid + focus</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="checked-focus-invalid" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="checked-focus-invalid" id="s-checked-focus-invalid" aria-invalid />
          <Label htmlFor="s-checked-focus-invalid">Checked + invalid + focus</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};
