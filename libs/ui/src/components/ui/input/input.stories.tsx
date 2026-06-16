import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'file'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    type: 'text',
    placeholder: 'Search…',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const Filled: Story = { args: { defaultValue: 'invoice_2024' } };
export const Disabled: Story = { args: { disabled: true } };

// Invalid state: aria-invalid drives the destructive border + ring. The token is
// still a ⚠ placeholder (stock hex) — see tokens-reference.md.
export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'not-a-valid-value' },
};

export const File: Story = { args: { type: 'file', placeholder: undefined, 'aria-label': 'Upload file' } };

// Gallery: every state side by side. Matches the Figma .Input variant set
// (state = default | focus | filled | disabled | invalid). Focus is a live
// pseudo-state, so it is shown via the dedicated note rather than a static prop.
export const AllStates: Story = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Input aria-label="Default" placeholder="Default" />
      <Input aria-label="Filled" defaultValue="invoice_2024" />
      <Input aria-label="Disabled" placeholder="Disabled" disabled />
      <Input aria-label="Invalid" aria-invalid defaultValue="not-a-valid-value" />
    </div>
  ),
};
