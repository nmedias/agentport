import type { ComponentProps, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { ChoiceCardCheckbox } from './choice-card-checkbox';

// ChoiceCardCheckbox bundles the FieldLabel-wraps-Field choice card with a Checkbox
// control (the composition the checkbox.stories ChoiceCard hand-rolled). The card tints
// on checked + dims on disabled via CSS :has() (field.tsx); the control carries focus +
// invalid. invalid is driven by the `error` prop (truthy → FieldError + data-invalid +
// aria-invalid); the red ring is focus-gated (checkbox.tsx, aligned with .Input).

type pseudoState = {
  focus: boolean;
};

const pseudoStateArgTypes = {
  focus: { control: 'boolean' },
} satisfies Record<keyof pseudoState, { control: 'boolean' }>;

const meta: Meta<typeof ChoiceCardCheckbox> = {
  title: 'UI/ChoiceCards/ChoiceCardCheckbox',
  component: ChoiceCardCheckbox,
  tags: ['autodocs'],
  args: {
    title: 'Enable notifications',
    description: 'You can enable or disable notifications at any time.',
    disabled: false,
  },
  // Prop docs come from the component's typed JSDoc (react-docgen reads the flat
  // ChoiceCardCheckboxProps interface). argTypes here only configure controls + the
  // defaults that the ArgsTable can't infer from the type.
  argTypes: {
    // React.ReactNode props — keep the text control so the playground stays editable.
    title: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    // checked/defaultChecked are boolean — a leaf choice card has no tri-state (no "indeterminate").
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    onCheckedChange: { control: false },
    disabled: { table: { defaultValue: { summary: 'false' } } },
    id: { control: false },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The checkbox form of the choice card: one binary option as a full clickable card. The card tints when checked and dims when disabled; focus and invalid stay on the control, and the `error` prop renders the message and marks the card invalid in one step.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChoiceCardCheckbox>;

// focus is a CSS pseudo-state a plain boolean can't set, so PseudoWrap forces
// :focus-visible on every descendant via storybook-addon-pseudo-states (same mechanism
// as the checkbox.stories ChoiceCard preview).
function PseudoWrap({ focus, children }: { focus: pseudoState['focus']; children: ReactNode }) {
  return <div className={focus ? 'pseudo-focus-visible-all' : ''}>{children}</div>;
}

// Default — the one interactive story: API playground (full ArgsTable), state preview, and
// the canonical interaction smoke test in one. Renders <ChoiceCardCheckbox {...args}/> so
// every prop is a live control; `focus` is the synthetic pseudo-state (PseudoWrap forces
// :focus-visible since a boolean can't). Uncontrolled (no checked arg) → the play function
// can click-toggle it, and `error` (text) flips invalid. No controls.include — the full
// ArgsTable stays intact (include would filter the table, not just the panel).
export const Default: StoryObj<ComponentProps<typeof ChoiceCardCheckbox> & pseudoState> = {
  argTypes: pseudoStateArgTypes,
  args: { focus: false },
  render: ({ focus, ...args }) => (
    <PseudoWrap focus={focus}>
      <ChoiceCardCheckbox {...args} />
    </PseudoWrap>
  ),
  play: async ({ canvas, step }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /enable notifications/i });

    await step('starts unchecked', async () => {
      await expect(checkbox).not.toBeChecked();
    });

    await step('clicking toggles it on', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
    });

    await step('clicking again toggles it back off', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).not.toBeChecked();
    });

    await step('blurring clears the focus', async () => {
      checkbox.blur();
      await expect(checkbox).not.toHaveFocus();
    });
  },
};

// At-a-glance gallery, columns = unchecked vs checked. The two Focus rows force
// :focus-visible on their checkbox via the pseudo-states addon, so the focus ring — and
// the focus-gated invalid red ring (invalid alone shows only the destructive border) — is
// visible statically. hover is omitted: default shadcn adds none to the card/control.
const ERROR = 'You must enable notifications to continue.';
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
        <span className="text-format-eyebrow text-muted">Unchecked</span>
        <span className="text-format-eyebrow text-muted">Checked</span>
      </div>
      {STATE_ROWS.map((r) => (
        <div key={r.key} className="grid grid-cols-[7rem_1fr_1fr] items-start gap-lg">
          <span className="pt-md text-format-eyebrow text-muted">{r.label}</span>
          <ChoiceCardCheckbox
            id={`cc-${r.key}-off`}
            title="Enable notifications"
            description="You can enable or disable notifications at any time."
            checked={false}
            disabled={r.disabled}
            error={r.error}
          />
          <ChoiceCardCheckbox
            id={`cc-${r.key}-on`}
            title="Enable notifications"
            description="You can enable or disable notifications at any time."
            checked
            disabled={r.disabled}
            error={r.error}
          />
        </div>
      ))}
    </div>
  ),
};
