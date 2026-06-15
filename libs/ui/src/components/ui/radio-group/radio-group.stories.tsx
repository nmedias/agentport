import type { ReactNode } from 'react';
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

// Shared state controls for the interactive ChoiceCard preview — same as the Checkbox /
// Switch stories. checked / disabled / invalid are driven by the RadioGroup value + props;
// hover / focus are CSS pseudo-states a plain boolean can't set, so PseudoWrap forces them
// via storybook-addon-pseudo-states (pseudo-hover-all / pseudo-focus-visible-all simulate
// :hover / :focus-visible on every descendant). disable:false re-enables the panel that the
// meta turns off for the doc-example stories. In default shadcn the radio item has no hover
// style, so the hover toggle is a no-op today (kept for the Figma state axis).
type StateArgs = {
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  hover: boolean;
  focus: boolean;
};

const stateArgTypes = {
  checked: { control: 'boolean' as const },
  disabled: { control: 'boolean' as const },
  invalid: { control: 'boolean' as const },
  hover: { control: 'boolean' as const },
  focus: { control: 'boolean' as const },
};

const stateControls = {
  controls: {
    disable: false,
    include: ['checked', 'disabled', 'invalid', 'hover', 'focus'],
  },
};

function PseudoWrap({
  hover,
  focus,
  children,
}: {
  hover: boolean;
  focus: boolean;
  children: ReactNode;
}) {
  const className = [hover && 'pseudo-hover-all', focus && 'pseudo-focus-visible-all']
    .filter(Boolean)
    .join(' ');
  return <div className={className}>{children}</div>;
}

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

// Choice Card — interactive state preview (single card). FieldLabel wraps the Field → a
// clickable, bordered card that tints when its item is selected (has-data-checked). All
// five interaction states are Controls (checked / disabled / invalid + hover / focus
// pseudo-states via PseudoWrap), so every combination — incl. invalid + focus — is
// reachable. DEFAULT shadcn: card reacts only to checked (tint) + disabled (dim); the radio
// item carries focus (ring) + invalid (destructive border + focus-gated red ring). Each
// card sits in its own RadioGroup (className="contents") so its checked state is independent.
function ChoiceCardCell({
  id,
  checked,
  disabled,
  invalid,
}: {
  id: string;
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
}) {
  return (
    <RadioGroup
      value={checked ? id : '__none'}
      disabled={disabled}
      className="contents"
    >
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
    </RadioGroup>
  );
}

export const ChoiceCard: StoryObj<StateArgs> = {
  parameters: stateControls,
  args: { checked: true, disabled: false, invalid: false, hover: false, focus: false },
  argTypes: stateArgTypes,
  render: ({ checked, disabled, invalid, hover, focus }) => (
    <PseudoWrap hover={hover} focus={focus}>
      <ChoiceCardCell
        id="cc-plan"
        checked={checked}
        disabled={disabled}
        invalid={invalid}
      />
    </PseudoWrap>
  ),
};

// docs "Choice Card" (multi): FieldLabel wraps each Field → clickable cards that tint when
// their item is selected; one RadioGroup, single selection across the cards.
export const ChoiceCardGroup: Story = {
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
  { key: 'invalidfocus', label: 'Invalid + Focus', disabled: false, invalid: true, focus: true },
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
  render: () => (
    <div className="flex max-w-2xl flex-col gap-xl">
      <div className="grid grid-cols-[7rem_1fr_1fr] items-center gap-lg">
        <span />
        <span className="text-format-eyebrow text-muted-foreground">Unchecked</span>
        <span className="text-format-eyebrow text-muted-foreground">Checked</span>
      </div>
      {STATE_ROWS.map((r) => (
        <div key={r.key} className="grid grid-cols-[7rem_1fr_1fr] items-start gap-lg">
          <span className="pt-md text-format-eyebrow text-muted-foreground">
            {r.label}
          </span>
          <ChoiceCardCell
            id={`cc-${r.key}-off`}
            checked={false}
            disabled={r.disabled}
            invalid={r.invalid}
          />
          <ChoiceCardCell
            id={`cc-${r.key}-on`}
            checked
            disabled={r.disabled}
            invalid={r.invalid}
          />
        </div>
      ))}
    </div>
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
