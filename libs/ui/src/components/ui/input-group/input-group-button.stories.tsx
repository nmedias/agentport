import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { RiCornerDownLeftLine } from '@remixicon/react';

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './input-group';

// Second Autodocs page for the addon button. meta.component = InputGroupButton → its own ArgsTable; `size`
// comes from InputGroupButtonProps' JSDoc via react-docgen (see input-group.tsx) — `xs`/`sm` text buttons,
// `icon-xs`/`icon-sm` icon-only, mapped onto the DS Button. Lives in an inline-end addon, so the render wraps
// it in an InputGroup; the play asserts the mapped size lands on data-size.
const meta: Meta<typeof InputGroupButton> = {
  title: 'UI/InputGroup/InputGroupButton',
  component: InputGroupButton,
  tags: ['autodocs'],
  args: { size: 'xs' },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'icon-xs', 'icon-sm'],
      table: { defaultValue: { summary: '"xs"' } },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8180-3500',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'An action button inside an `InputGroup` addon — a compact form of the DS Button: `size` offers text (`xs`/`sm`) and icon-only (`icon-xs`/`icon-sm`) scales that sit flush in the field. The group-shell API lives on the [`UI/InputGroup`](?path=/docs/ui-inputgroup--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputGroupButton>;

// API playground — a submit button in a trailing addon; toggle `size` (icon-* render square). The play
// asserts the mapped size lands on data-size.
export const Default: Story = {
  render: ({ size }) => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput aria-label="Run query" placeholder="documents…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size={size} aria-label="Submit" title="Submit">
            <RiCornerDownLeftLine />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step('the mapped size reflects on data-size', async () => {
      await expect(canvas.getByRole('button', { name: 'Submit' })).toHaveAttribute('data-size', 'xs');
    });
  },
};
