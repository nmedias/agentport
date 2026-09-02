import type { ComponentProps, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { RadioGroup } from '@/components/ui/radio-group';
import { ChoiceCardRadio } from './choice-card-radio';

// Radio choice card. Unlike checkbox/switch it does NOT own its state: it carries a required
// `value` and must live inside a <RadioGroup> — selection lives on the group, the card tints
// when the group's value matches (CSS :has() on data-state). Same a11y wiring as the others
// (aria-labelledby → FieldTitle id, past the Field's role="group").

type pseudoState = {
  focus: boolean;
};

const pseudoStateArgTypes = {
  focus: { control: 'boolean' },
} satisfies Record<keyof pseudoState, { control: 'boolean' }>;

const meta: Meta<typeof ChoiceCardRadio> = {
  title: 'UI/ChoiceCards/ChoiceCardRadio',
  component: ChoiceCardRadio,
  tags: ['autodocs'],
  args: {
    title: 'Pro',
    description: 'For growing teams that need more room.',
    value: 'pro',
    disabled: false,
  },
  // Prop docs come from the component's typed JSDoc (react-docgen reads the flat
  // ChoiceCardRadioProps interface). argTypes here only configure controls + the
  // defaults that the ArgsTable can't infer from the type.
  argTypes: {
    // React.ReactNode props — keep the text control so the playground stays editable.
    title: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    value: { control: 'text' },
    disabled: { table: { defaultValue: { summary: 'false' } } },
    id: { control: false },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The radio form of the choice card — one option of a single-choice set. It does not own its state: it must live inside a `RadioGroup`, which carries the value; the card tints when the group value matches. The `error` prop renders the message and marks the card invalid.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChoiceCardRadio>;

function PseudoWrap({ focus, children }: { focus: pseudoState['focus']; children: ReactNode }) {
  return <div className={focus ? 'pseudo-focus-visible-all' : ''}>{children}</div>;
}

// Default — playground + interaction smoke test. The single card lives in an uncontrolled
// RadioGroup, so the play function can click to select it (a radio can't be clicked off —
// that's the Group story's job). Type into `error` to flip invalid, toggle `focus` for the ring.
export const Default: StoryObj<ComponentProps<typeof ChoiceCardRadio> & pseudoState> = {
  argTypes: pseudoStateArgTypes,
  args: { focus: false },
  render: ({ focus, ...args }) => (
    <PseudoWrap focus={focus}>
      <RadioGroup className="max-w-sm">
        <ChoiceCardRadio {...args} />
      </RadioGroup>
    </PseudoWrap>
  ),
  play: async ({ canvas, step }) => {
    const radio = canvas.getByRole('radio', { name: /pro/i });

    await step('starts unselected', async () => {
      await expect(radio).not.toBeChecked();
    });

    await step('clicking selects it', async () => {
      await userEvent.click(radio);
      await expect(radio).toBeChecked();
    });

    await step('blurring clears the focus', async () => {
      radio.blur();
      await expect(radio).not.toHaveFocus();
    });
  },
};

// Group — the canonical usage: several cards in one RadioGroup, single selection. The play
// asserts mutual exclusion (selecting one deselects the previous).
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <RadioGroup defaultValue="pro" className="max-w-sm">
      <ChoiceCardRadio value="starter" title="Starter" description="For individuals getting started." />
      <ChoiceCardRadio value="pro" title="Pro" description="For growing teams that need more room." />
      <ChoiceCardRadio value="enterprise" title="Enterprise" description="Custom limits and support." />
    </RadioGroup>
  ),
  play: async ({ canvas, step }) => {
    const pro = canvas.getByRole('radio', { name: /pro/i });
    const enterprise = canvas.getByRole('radio', { name: /enterprise/i });

    await step('default selection is Pro', async () => {
      await expect(pro).toBeChecked();
    });

    await step('selecting Enterprise deselects Pro (mutual exclusion)', async () => {
      await userEvent.click(enterprise);
      await expect(enterprise).toBeChecked();
      await expect(pro).not.toBeChecked();
    });
  },
};

// At-a-glance gallery, columns = unselected vs selected. Each cell is its own RadioGroup whose
// value either matches the item (selected) or is a non-existent '__none' (unselected). The two
// Focus rows force :focus-visible via the pseudo-states addon.
const ERROR = 'Please choose a plan to continue.';
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
        <span className="text-format-eyebrow text-muted">Unselected</span>
        <span className="text-format-eyebrow text-muted">Selected</span>
      </div>
      {STATE_ROWS.map((r) => (
        <div key={r.key} className="grid grid-cols-[7rem_1fr_1fr] items-start gap-lg">
          <span className="pt-md text-format-eyebrow text-muted">{r.label}</span>
          <RadioGroup value="__none" className="contents">
            <ChoiceCardRadio
              id={`cc-${r.key}-off`}
              value="opt"
              title="Pro"
              description="For growing teams that need more room."
              disabled={r.disabled}
              error={r.error}
            />
          </RadioGroup>
          <RadioGroup value="opt" className="contents">
            <ChoiceCardRadio
              id={`cc-${r.key}-on`}
              value="opt"
              title="Pro"
              description="For growing teams that need more room."
              disabled={r.disabled}
              error={r.error}
            />
          </RadioGroup>
        </div>
      ))}
    </div>
  ),
};
