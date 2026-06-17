import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './label';
import { Input } from '../input';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  args: { children: 'Email' },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

// Bound to a control via htmlFor — clicking the label focuses the input.
export const WithControl: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-80 flex-col gap-md">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

// Inside a data-disabled group the label dims and stops pointer events.
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="group" data-disabled="true">
      <Label htmlFor="disabled-input" aria-disabled>Disabled field</Label>
    </div>
  ),
};
