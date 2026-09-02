import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { Switch } from './switch';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../field';

// Switch contract — a Radix Root[role=switch] (data-slot="switch") whose track + thumb are
// pure CSS, not props:
//  · data-checked tints the track primary-fill and slides the thumb (translate-x); data-unchecked
//    paints input-fill-high. focus-visible adds the border-ring + 3px ring; aria-invalid sets the
//    destructive border (+ destructive track when checked), with the red ring focus-gated. disabled
//    dims via data-disabled. AllStates forces focus statically via the pseudo addon.
//  · size is a manual code prop (sm | default) → data-[size] geometry on track + thumb.
// Usage examples mirror ui.shadcn.com/docs/components/radix/switch, which composes the switch with
// the ported Field family — label leads, switch trails (FieldLabel's flex-auto pushes the control to
// the right edge). Skipped: the "RTL" locale demo. The clickable Choice Card lives in its own DS
// component (UI/ChoiceCards/ChoiceCardSwitch).
const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  // onCheckedChange is an fn() spy so Default's play can assert the toggle fired (button pattern).
  args: { checked: true, disabled: false, size: 'default', onCheckedChange: fn() },
  // Prop type · description · enum come from the component's JSDoc via react-docgen (see SwitchProps in
  // switch.tsx); Storybook infers each control from the type (boolean → toggle, string → text, union →
  // select). argTypes adds only: (1) a control override — `size` as inline-radio vs the inferred select;
  // (2) a defaultValue per defaulted prop — the ArgsTable Default column ignores the @default JSDoc tag,
  // so every default is declared here uniformly (the component's @default tags feed the storybook MCP
  // get-documentation instead).
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default'], table: { defaultValue: { summary: '"default"' } } },
    defaultChecked: { table: { defaultValue: { summary: 'false' } } },
    disabled: { table: { defaultValue: { summary: 'false' } } },
    required: { table: { defaultValue: { summary: 'false' } } },
    value: { table: { defaultValue: { summary: '"on"' } } },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'An on/off toggle — track tints and thumb slides when checked; `size` adds a compact variant. Same composition rule as its siblings: the label comes from Label/Field, invalid is a live state, not a prop.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// Bare switch — the API playground. Renders <Switch {...args} />, so every prop documented
// in the meta argTypes shows in the ArgsTable AND as a live control (no controls.include —
// that would also filter the table). aria-label gives the otherwise-bare control an
// accessible name (in real usage a Field/Label supplies it). play drives a real click and
// asserts onCheckedChange (the fn() spy in meta args) fired — args.checked is controlled, so
// the visible toggle is exercised by AirplaneMode's uncontrolled instance below. The
// Field-composed examples live in the stories below.
export const Default: Story = {
  render: (args) => <Switch aria-label="Switch" {...args} />,
  play: async ({ canvas, args, step }) => {
    const toggle = canvas.getByRole('switch', { name: /switch/i });

    await step('clicking fires onCheckedChange', async () => {
      await userEvent.click(toggle);
      await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
    });

    // userEvent.click leaves the switch programmatically focused (→ :focus-visible ring);
    // blur() drops it so the end state matches a real mouse user (no lingering ring).
    await step('blurring clears the focus', async () => {
      toggle.blur();
      await expect(toggle).not.toHaveFocus();
    });
  },
};

// docs "Airplane Mode" (basic): a labeled switch in a horizontal Field.
// Interaction test — drives the switch like a user (mirrors Checkbox `Basic`). Uncontrolled
// (Radix toggles itself on userEvent click — raw/fireEvent clicks don't), queried by role +
// accessible name (FieldLabel's htmlFor names the button[role=switch]); we assert aria-checked.
export const AirplaneMode: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldLabel htmlFor="airplane-mode">Airplane Mode</FieldLabel>
      <Switch id="airplane-mode" />
    </Field>
  ),
  play: async ({ canvas, step }) => {
    const toggle = canvas.getByRole('switch', { name: /airplane mode/i });

    await step('starts off', async () => {
      await expect(toggle).not.toBeChecked();
    });

    await step('clicking turns it on', async () => {
      await userEvent.click(toggle);
      await expect(toggle).toBeChecked();
    });

    // userEvent.click leaves the switch programmatically focused (→ :focus-visible ring);
    // blur() drops the focus so the end state matches a real mouse user (no ring).
    await step('blurring clears the focus', async () => {
      toggle.blur();
      await expect(toggle).not.toHaveFocus();
    });
  },
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
// now shows the destructive track (per the Figma invalid member); the focus rows force
// :focus-visible via the pseudo-states addon, so the focus ring — and the focus-gated
// invalid red ring — is visible statically. Each bare control carries an aria-label (the
// caption span is decorative) so the visual matrix still has accessible names.
export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['#sw-focus', '#sw-checked-focus', '#sw-focus-invalid', '#sw-checked-focus-invalid'] },
  },
  render: () => (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center gap-md">
        <Switch aria-label="Unchecked" />
        <span className="text-format-body text-muted">Unchecked</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch id="sw-focus" aria-label="Focus" />
        <span className="text-format-body text-muted">Focus</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-label="Checked" defaultChecked />
        <span className="text-format-body text-muted">Checked</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch id="sw-checked-focus" aria-label="Checked and focused" defaultChecked />
        <span className="text-format-body text-muted">Checked + focus</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-label="Disabled" disabled />
        <span className="text-format-body text-muted">Disabled</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-label="Checked and disabled" defaultChecked disabled />
        <span className="text-format-body text-muted">Checked + disabled</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-label="Invalid" aria-invalid />
        <span className="text-format-body text-muted">Invalid</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch aria-label="Invalid and checked" aria-invalid defaultChecked />
        <span className="text-format-body text-muted">Invalid (checked)</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch id="sw-focus-invalid" aria-label="Invalid and focused" aria-invalid />
        <span className="text-format-body text-muted">Invalid + focus</span>
      </div>
      <div className="flex items-center gap-md">
        <Switch id="sw-checked-focus-invalid" aria-label="Checked, invalid and focused" aria-invalid defaultChecked />
        <span className="text-format-body text-muted">Checked + invalid + focus</span>
      </div>
    </div>
  ),
};
