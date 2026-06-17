import type { ComponentProps, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { ChoiceCardSwitch } from './choice-card-switch';

// Switch choice card. Mirrors ChoiceCardCheckbox: card tints on checked + dims on disabled
// via CSS :has() (field.tsx); the switch carries focus + invalid; invalid is driven by the
// `error` prop (truthy → FieldError + data-invalid + aria-invalid). The accessible name comes
// from aria-labelledby → the FieldTitle id (past the Field's role="group").

type pseudoState = {
  focus: boolean;
};

const pseudoStateArgTypes = {
  focus: { control: 'boolean' },
} satisfies Record<keyof pseudoState, { control: 'boolean' }>;

const meta: Meta<typeof ChoiceCardSwitch> = {
  title: 'UI/ChoiceCards/ChoiceCardSwitch',
  component: ChoiceCardSwitch,
  tags: ['autodocs'],
  args: {
    title: 'Airplane mode',
    description: 'Disable all wireless connections.',
    disabled: false,
  },
  // Curated prop docs for the Autodocs ArgsTable — react-docgen can't read the
  // Pick<…> & Omit<ComponentProps<typeof Switch>> type, so document the public API by hand.
  argTypes: {
    title: {
      control: 'text',
      description: 'Card heading (rendered as `FieldTitle`).',
      table: { type: { summary: 'React.ReactNode' } },
    },
    description: {
      control: 'text',
      description: 'Secondary line under the title (rendered as `FieldDescription`).',
      table: { type: { summary: 'React.ReactNode' } },
    },
    error: {
      control: 'text',
      description:
        'When truthy, marks the card invalid: renders a `FieldError`, sets `data-invalid` on the Field and `aria-invalid` on the control. Empty/undefined = valid.',
      table: { type: { summary: 'React.ReactNode' } },
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state (pair with `onCheckedChange`).',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Checked state when uncontrolled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onCheckedChange: {
      control: false,
      description: 'Called when the checked state changes.',
      table: { type: { summary: '(checked: boolean) => void' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default'],
      description: 'Track size.',
      table: { type: { summary: '"sm" | "default"' }, defaultValue: { summary: '"default"' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the control and dims the whole card.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    id: {
      control: false,
      description: 'Links the label to the control. Auto-generated via `useId` if omitted.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    docs: { source: { type: 'code' } },
  },
};

export default meta;
type Story = StoryObj<typeof ChoiceCardSwitch>;

function PseudoWrap({ focus, children }: { focus: pseudoState['focus']; children: ReactNode }) {
  return <div className={focus ? 'pseudo-focus-visible-all' : ''}>{children}</div>;
}

// Default — playground + state preview + interaction smoke test in one. Uncontrolled (no
// checked arg) → the play function can click-toggle it; type into `error` to flip invalid.
export const Default: StoryObj<ComponentProps<typeof ChoiceCardSwitch> & pseudoState> = {
  argTypes: pseudoStateArgTypes,
  args: { focus: false },
  render: ({ focus, ...args }) => (
    <PseudoWrap focus={focus}>
      <ChoiceCardSwitch {...args} />
    </PseudoWrap>
  ),
  play: async ({ canvas, step }) => {
    const sw = canvas.getByRole('switch', { name: /airplane mode/i });

    await step('starts off', async () => {
      await expect(sw).not.toBeChecked();
    });

    await step('clicking toggles it on', async () => {
      await userEvent.click(sw);
      await expect(sw).toBeChecked();
    });

    await step('clicking again toggles it back off', async () => {
      await userEvent.click(sw);
      await expect(sw).not.toBeChecked();
    });

    await step('blurring clears the focus', async () => {
      sw.blur();
      await expect(sw).not.toHaveFocus();
    });
  },
};

// At-a-glance gallery, columns = off vs on. The two Focus rows force :focus-visible via the
// pseudo-states addon, so the focus ring — and the focus-gated invalid red ring — is visible
// statically.
const ERROR = 'Airplane mode must be enabled to continue.';
const STATE_ROWS = [
  { key: 'enabled', label: 'Enabled', disabled: false, error: undefined, focus: false },
  { key: 'focus', label: 'Focus', disabled: false, error: undefined, focus: true },
  { key: 'disabled', label: 'Disabled', disabled: true, error: undefined, focus: false },
  { key: 'invalid', label: 'Invalid', disabled: false, error: ERROR, focus: false },
  { key: 'invalid-focus', label: 'Invalid + Focus', disabled: false, error: ERROR, focus: true },
];

export const ChoiceCardStates: Story = {
  parameters: {
    controls: { disable: true },
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
        <span className="text-format-eyebrow text-muted-ink">Off</span>
        <span className="text-format-eyebrow text-muted-ink">On</span>
      </div>
      {STATE_ROWS.map((r) => (
        <div key={r.key} className="grid grid-cols-[7rem_1fr_1fr] items-start gap-lg">
          <span className="pt-md text-format-eyebrow text-muted-ink">{r.label}</span>
          <ChoiceCardSwitch
            id={`cc-${r.key}-off`}
            title="Airplane mode"
            description="Disable all wireless connections."
            checked={false}
            disabled={r.disabled}
            error={r.error}
          />
          <ChoiceCardSwitch
            id={`cc-${r.key}-on`}
            title="Airplane mode"
            description="Disable all wireless connections."
            checked
            disabled={r.disabled}
            error={r.error}
          />
        </div>
      ))}
    </div>
  ),
};
