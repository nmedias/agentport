import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

// Secondary Autodocs page for TooltipContent — the raised chip itself. The root Tooltip API
// (open/defaultOpen/delayDuration) is documented on the parent page (UI/Tooltip). Here
// meta.component is TooltipContent so its own props get a real ArgsTable + live controls;
// side/sideOffset/align + the collision/behaviour props come from the TooltipContentProps JSDoc via
// react-docgen. The render wraps it in an open Tooltip + Provider + Trigger because TooltipContent
// only renders inside a Tooltip. Display-only → no play.
const meta: Meta<typeof TooltipContent> = {
  title: 'UI/Tooltip/TooltipContent',
  component: TooltipContent,
  tags: ['autodocs'],
  args: {
    side: 'top',
    sideOffset: 0,
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      table: { defaultValue: { summary: 'top' } },
    },
    sideOffset: {
      control: { type: 'number' },
      table: { defaultValue: { summary: '0' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The portalled raised chip with its diamond arrow. `side`/`sideOffset`/`align` position it relative to the trigger; the collision props (`avoidCollisions`, `collisionPadding`, `sticky`, `hideWhenDetached`) and `arrowPadding` are inherited from `TooltipPrimitive.Content`. The root API lives on the parent page: [Tooltip](?path=/docs/ui-tooltip--docs).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TooltipContent>;

// Playground — threads the meta props (side/sideOffset) onto TooltipContent inside a fixed open
// Tooltip scaffold (the wrapper is scaffolding, so it does not take {...args}).
export const Default: Story = {
  render: ({ side, sideOffset, ...args }) => (
    <TooltipProvider delayDuration={0}>
      <div className="grid m-auto h-[30vh] gap-[7rem] p-[5rem] justify-items-center content-center">
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover</Button>
          </TooltipTrigger>
          <TooltipContent side={side} sideOffset={sideOffset} {...args}>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};
