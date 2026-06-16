import {ComponentProps} from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
  FieldTitle,
} from '../field';

// Usage examples mirror ui.shadcn.com/docs/components/radix/radio-group. The docs
// "Default" is the one example NOT Field-composed (bare item + Label); the rest use
// the ported Field family (Field / FieldContent / FieldSet / FieldLegend). Skipped:
// the "RTL" Arabic locale demo.
const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { defaultValue: 'comfortable' },
  // Curated prop docs for the Autodocs ArgsTable — react-docgen can't extract props from
  // `ComponentProps<typeof RadioGroupPrimitive.Root>` (a Radix type reference), so the public
  // API is documented here by hand. The table documents RadioGroup (the container); the
  // RadioGroupItem props live in the component description block. Interactive stories scope
  // their panel via controls.include.
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled selected value (pair with `onValueChange`).',
      table: { type: { summary: 'string' } },
    },
    defaultValue: {
      control: 'text',
      description: 'Selected value when uncontrolled.',
      table: { type: { summary: 'string' } },
    },
    onValueChange: {
      control: false,
      description: 'Called when the selected value changes.',
      table: { type: { summary: '(value: string) => void' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every item in the group.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the group required for native form validation.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    name: {
      control: 'text',
      description: 'Form field name submitted with the form.',
      table: { type: { summary: 'string' } },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Arrow-key navigation direction.',
      table: { type: { summary: '"horizontal" | "vertical"' }, defaultValue: { summary: '"vertical"' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The value-driven container documented below. Each option is a **`RadioGroupItem`** with its own props: `value: string` *(required)* — value selected when chosen · `disabled?: boolean` — disables just this item · `id?: string` — pairs with a `<label htmlFor>`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

type pseudoState = {
  focus: boolean;
  invalid: boolean;
  checked: boolean;
};

const pseudoStateArgTypes = {
  invalid: { control: 'boolean' },
  focus: { control: 'boolean' },
  checked: { control: 'boolean' },
} satisfies Record<keyof pseudoState, { control: 'boolean' }>;

// Bare group — the API playground. Renders <RadioGroup {...args}> with three items, so every
// prop documented in the meta argTypes shows in the ArgsTable AND as a live control (no
// controls.include — that would also filter the table). The Field-composed examples + the
// pseudo-state preview live in the stories below.
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


function ChoiceCardRadioItem({
  id,
  disabled,
  invalid,
}: {
  id: string;
  disabled: boolean;
  invalid: boolean;
}) {
  return (
      <FieldLabel
        htmlFor={id}
        className="max-w-sm"
        data-disabled={disabled ? 'true' : undefined}
      >
        <Field
          orientation="horizontal"
          data-disabled={disabled ? 'true' : undefined}
          data-invalid={invalid || undefined}
        >
          <FieldContent>
            <FieldTitle>Pro</FieldTitle>
            <FieldDescription>For growing teams that need more room.</FieldDescription>
            {invalid && <FieldError>Please choose a plan to continue.</FieldError>}
          </FieldContent>
          <RadioGroupItem id={id} value={id} aria-invalid={invalid || undefined} />
        </Field>
      </FieldLabel>
  );
}

export const ChoiceCard: StoryObj<ComponentProps<typeof RadioGroup> & pseudoState> = {
  parameters: {
    controls: { include: ['checked', 'disabled', 'invalid', 'focus'] },
  },
  args: {checked: false, invalid: false, focus: false, disabled: false },
  argTypes: pseudoStateArgTypes,
  render: ({checked, disabled, invalid, focus }) => {
    const id = "cc-plan";
    return (
        <div className={focus ? 'pseudo-focus-visible-all' : ''}>
          <RadioGroup
              value={checked ? id : '__none'}
              disabled={disabled}
              className="contents">
            <ChoiceCardRadioItem
                id={id}
                disabled={disabled ?? false}
                invalid={invalid}
            />
          </RadioGroup>
        </div>
    )
  }
};
// docs "Choice Card" (multi): FieldLabel wraps each Field → clickable cards that tint when
// their item is selected; one RadioGroup, single selection across the cards.
export const ChoiceCardGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <RadioGroup defaultValue="pro" className="max-w-sm">
      <FieldLabel htmlFor="plan-starter">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Starter</FieldTitle>
            <FieldDescription>For individuals getting started.</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="starter" id="plan-starter" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="plan-pro">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Pro</FieldTitle>
            <FieldDescription>For growing teams that need more room.</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="pro" id="plan-pro" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  ),
};

// At-a-glance gallery, columns = unchecked vs checked. The Focus rows force :focus-visible
// on the radio item via the pseudo-states addon, so the focus ring — and the focus-gated
// invalid red ring (invalid alone shows only the destructive border) — is visible statically.
const STATE_ROWS = [
  { key: 'enabled', label: 'Enabled', disabled: false, invalid: false, focus: false },
  { key: 'focus', label: 'Focus', disabled: false, invalid: false, focus: true },
  { key: 'disabled', label: 'Disabled', disabled: true, invalid: false, focus: false },
  { key: 'invalid', label: 'Invalid', disabled: false, invalid: true, focus: false },
  { key: 'invalid-focus', label: 'Invalid + Focus', disabled: false, invalid: true, focus: true },
];

export const ChoiceCardStates: Story = {
  parameters: {
    controls: { disable: true },
    // force :focus-visible on the focus rows' radio items (storybook-addon-pseudo-states)
    pseudo: {
      focusVisible: STATE_ROWS.filter((r) => r.focus).flatMap((r) => [
        `#cc-${r.key}-off`,
        `#cc-${r.key}-on`,
      ]),
    },
  },
  render: () => {

      return (
          <div className="flex max-w-2xl flex-col gap-xl">
            <div className="grid grid-cols-[7rem_1fr_1fr] items-center gap-lg">
              <span />
              <span className="text-format-eyebrow text-muted-foreground">Unchecked</span>
              <span className="text-format-eyebrow text-muted-foreground">Checked</span>
            </div>
            {STATE_ROWS.map((r) => (

              <RadioGroup
                    value={`cc-${r.key}-on`}
                    disabled={r.disabled}
                    className="contents"
                >
                  <div key={r.key} className="grid grid-cols-[7rem_1fr_1fr] items-start gap-lg">
                    <span className="pt-md text-format-eyebrow text-muted-foreground">
                      {r.label}
                    </span>
                    <ChoiceCardRadioItem
                      id={`cc-${r.key}-off`}
                      disabled={r.disabled}
                      invalid={r.invalid}
                    />
                    <ChoiceCardRadioItem
                      id={`cc-${r.key}-on`}
                      disabled={r.disabled}
                      invalid={r.invalid}
                    />
                  </div>
                </RadioGroup>
            ))}
          </div>
      )
  },
};

// docs "Fieldset": FieldSet + FieldLegend group the items with a caption + description.
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
// is independent. Focus is a live pseudo-state.
export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-lg">
      <RadioGroup defaultValue="" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="unchecked" id="s1" />
          <Label htmlFor="s1">Unchecked (default)</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="checked" className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="checked" id="s2" />
          <Label htmlFor="s2">Checked</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="" disabled className="contents">
        <div className="flex items-center gap-lg">
          <RadioGroupItem value="disabled" id="s3" />
          <Label htmlFor="s3">Disabled</Label>
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
    </div>
  ),
};
