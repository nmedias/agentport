import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    placeholder: 'Add a description…',
    rows: 3,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};
export const Filled: Story = {
  args: {
    defaultValue:
      'Draft notes for the invoice type.\nReviewed with the team.',
  },
};
export const Disabled: Story = { args: { disabled: true } };

// Invalid state: aria-invalid drives the destructive border + ring. The token is
// still a ⚠ placeholder (stock hex) — see tokens-reference.md.
export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'not-a-valid-value' },
};

// Gallery: every state side by side. Matches the Figma .Textarea variant set
// (state = default | focus | filled | disabled | invalid). Focus is a live
// pseudo-state, so it is shown via the dedicated Default story rather than a prop.
export const AllStates: Story = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Textarea placeholder="Default" rows={3} />
      <Textarea
        defaultValue={'Draft notes for the invoice type.\nReviewed with the team.'}
        rows={3}
      />
      <Textarea placeholder="Disabled" rows={3} disabled />
      <Textarea aria-invalid defaultValue="not-a-valid-value" rows={3} />
    </div>
  ),
};
