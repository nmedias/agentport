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
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

// docs "Default": bare item + Label rows in a RadioGroup.
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" className="max-w-sm">
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

// docs "Description": each option carries helper text via Field + FieldContent.
export const Description: Story = {
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

// docs "Choice Card": FieldLabel wraps each Field → clickable cards that tint when
// their item is selected (has-data-checked accent).
export const ChoiceCard: Story = {
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

// docs "Fieldset": FieldSet + FieldLegend group the items with a caption + description.
export const Fieldset: Story = {
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
