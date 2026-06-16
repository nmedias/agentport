import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoiceCardShell } from './choice-card-shell';

const meta: Meta<typeof ChoiceCardShell> = {
  title: 'UI/ChoiceCard',
  component: ChoiceCardShell,
  tags: ['autodocs'],
  args: {},
  argTypes: {},
  parameters: {
    docs: {
      source: { type: 'code' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChoiceCardShell>;

// The default badge — a brand-primary pill marker (text-format-label on the
// primary surface).
export const Default: Story = {};
