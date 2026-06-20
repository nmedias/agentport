import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiSearchLine } from '@remixicon/react';

import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group';

// Second Autodocs page for the addon (the UI/InputGroup page documents the group shell). meta.component =
// InputGroupAddon → its own ArgsTable; `align` comes from InputGroupAddonProps' JSDoc via react-docgen (see
// input-group.tsx) — a live control. An addon sits beside (inline-*) or above/below (block-*, where the group
// stacks vertically) the borderless control, so the render wraps it in an InputGroup. Display-only → no play.
const meta: Meta<typeof InputGroupAddon> = {
  title: 'UI/InputGroup/InputGroupAddon',
  component: InputGroupAddon,
  tags: ['autodocs'],
  args: { align: 'inline-start' },
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['inline-start', 'inline-end', 'block-start', 'block-end'],
      table: { defaultValue: { summary: '"inline-start"' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'An adornment slot of an **`InputGroup`** — `align` places it `inline-start`/`inline-end` beside the control, or `block-start`/`block-end` as a toolbar above/below (the group then stacks vertically). The group-shell API lives on the [`UI/InputGroup`](?path=/docs/ui-inputgroup--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputGroupAddon>;

// API playground — a search icon addon; toggle `align` to move it around the control (block-* stacks the group).
export const Default: Story = {
  render: ({ align }) => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="Search…" />
        <InputGroupAddon align={align}>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
