import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './switch';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '../field';

// Usage examples mirror ui.shadcn.com/docs/components/radix/switch, which composes the
// switch with the ported Field family — label leads, switch trails (FieldLabel's
// flex-auto pushes the control to the right edge). Skipped: the "RTL" locale demo.
const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    size: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// Bare control — the args control size/checked/disabled.
export const Default: Story = {};

// docs "Airplane Mode" (basic): a labeled switch in a horizontal Field.
export const AirplaneMode: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldLabel htmlFor="airplane-mode">Airplane Mode</FieldLabel>
      <Switch id="airplane-mode" />
    </Field>
  ),
};

// docs "Description": label + helper text on the left, switch on the right.
export const Description: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="marketing">Marketing emails</FieldLabel>
          <FieldDescription>
            Receive emails about new products, features, and more.
          </FieldDescription>
        </FieldContent>
        <Switch id="marketing" />
      </Field>
    </FieldGroup>
  ),
};

// docs "Choice Card": FieldLabel wraps the whole Field → a clickable, bordered card
// that tints when the switch is on (has-data-checked:border-primary/30 bg-primary/5).
export const ChoiceCard: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldLabel htmlFor="share-devices" className="max-w-sm">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Share across devices</FieldTitle>
          <FieldDescription>
            Focus is shared across devices and turns off when you leave.
          </FieldDescription>
        </FieldContent>
        <Switch id="share-devices" defaultChecked />
      </Field>
    </FieldLabel>
  ),
};

// docs "Size": both size variants, each labeled, in a FieldGroup.
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="size-sm">Small</FieldLabel>
        <Switch id="size-sm" size="sm" defaultChecked />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="size-default">Default</FieldLabel>
        <Switch id="size-default" size="default" defaultChecked />
      </Field>
    </FieldGroup>
  ),
};

// docs "Disabled": disabled prop on the Switch + data-disabled on the Field.
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" data-disabled="true" className="max-w-sm">
      <FieldLabel htmlFor="disabled-switch">Airplane Mode</FieldLabel>
      <Switch id="disabled-switch" disabled />
    </Field>
  ),
};

// docs "Invalid": aria-invalid on the Switch (destructive track) + data-invalid on
// the Field + FieldError.
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" data-invalid className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="two-factor">Two-factor authentication</FieldLabel>
        <FieldError>Two-factor authentication is required for this account.</FieldError>
      </FieldContent>
      <Switch id="two-factor" aria-invalid />
    </Field>
  ),
};

// DS-authored gallery: the state matrix (maps the Figma .Switch variant set). Invalid
// now shows the destructive track (per the Figma invalid member); focus is live.
export const AllStates: Story = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center gap-md">
        <Switch />
        <span className="text-format-body text-muted-foreground">Unchecked</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch defaultChecked />
        <span className="text-format-body text-muted-foreground">Checked</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch disabled />
        <span className="text-format-body text-muted-foreground">Disabled</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-invalid />
        <span className="text-format-body text-muted-foreground">Invalid</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-invalid defaultChecked />
        <span className="text-format-body text-muted-foreground">Invalid (checked)</span>
      </div>
    </div>
  ),
};
