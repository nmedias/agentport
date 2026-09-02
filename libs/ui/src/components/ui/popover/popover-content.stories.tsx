import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

// Secondary Autodocs page for PopoverContent — the raised panel itself. The root Popover API
// (open/defaultOpen/modal) is documented on the parent page (UI/Popover). Here meta.component is
// PopoverContent so its own props get a real ArgsTable + live controls; align/sideOffset come from
// the PopoverContentProps JSDoc via react-docgen. The render wraps it in an open Popover +
// PopoverTrigger because PopoverContent only renders inside a Popover. Display-only → no play.
const meta: Meta<typeof PopoverContent> = {
  title: 'UI/Popover/PopoverContent',
  component: PopoverContent,
  tags: ['autodocs'],
  args: {
    align: 'center',
    sideOffset: 4,
  },
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      table: { defaultValue: { summary: 'center' } },
    },
    sideOffset: {
      control: { type: 'number' },
      table: { defaultValue: { summary: '4' } },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8351-5085',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The floating panel of a `Popover` — `align` and `sideOffset` position it relative to the trigger; the remaining placement and collision behaviour is inherited. The root API lives on the [`UI/Popover`](?path=/docs/ui-popover--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PopoverContent>;

// Playground — threads the meta props (align/sideOffset) onto PopoverContent inside a fixed open
// Popover scaffold (the wrapper is scaffolding, so it does not take {...args}).
export const Default: Story = {
  render: ({ align, sideOffset, ...args }) => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        className="w-72"
        aria-label="Panel"
        {...args}
      >
        <PopoverHeader>
          <PopoverTitle>Panel</PopoverTitle>
          <PopoverDescription>
            Adjust align and sideOffset to reposition the panel.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};
