import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '../button';
import { Kbd } from '../kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

// Tooltip contract — Radix Tooltip, a portal-mounted RAISED chip, NOT just "a label":
//  · TooltipContent renders inside a TooltipPrimitive.Portal → it lives on document.body, OUTSIDE
//    the story canvas, and mounts ONLY while open. Plays query it via within(document.body); a
//    closed tooltip has no content node at all.
//  · There is no variant/size/state axis: the only visual is the open chip (dialog-fill raised
//    surface + border + shadow-elevation + the diamond Arrow that inherits the fill). Placement is
//    a prop (side/sideOffset on TooltipContent), not a designed state.
//  · A TooltipProvider ancestor is REQUIRED (it carries delayDuration); every story wraps in one
//    with delayDuration={0} so hover/focus opens instantly for the test.
//  · a11y: TooltipContent is role="tooltip"; Radix wires aria-describedby from trigger→content while
//    open. An icon-only trigger still needs its OWN accessible name (the tooltip is a description,
//    not a name) — see IconTrigger.
const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    // Root defaults; the visible knobs (side/sideOffset/delayDuration) live on Provider/Content and
    // are set per-story — Root itself only governs open/controlled behaviour.
  },
  // Prop docs (type/description/@default) come from the component JSDoc via react-docgen. These
  // argTypes carry only what docgen can't: the non-control on the open callback + ArgsTable defaults.
  argTypes: {
    onOpenChange: { control: false },
    defaultOpen: { table: { defaultValue: { summary: 'false' } } },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A Radix Tooltip: the `TooltipContent` **portals to `document.body`** (so tests query it via `within(document.body)`) and mounts only while open, drawing a raised `dialog-fill` chip with a `shadow-elevation` and a diamond arrow. Requires a `TooltipProvider` ancestor (carries `delayDuration`). The content is `role="tooltip"` and wires `aria-describedby` on the trigger — see the **Default** story for the hover→open flow. An icon-only trigger still needs its own accessible name (**IconTrigger**).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Default — API playground: a complete trigger-driven tooltip (Button trigger + a short label),
// the shadcn doc demo re-clothed to DS tokens. render spreads {...args} into the Root so
// open/defaultOpen are live controls AND ArgsTable rows (no controls.include — it would filter the
// table). delayDuration={0} on the Provider makes the play deterministic. The play drives the
// canonical hover→open→leave flow against the PORTAL.
export const Default: Story = {
  render: (args) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvas, step }) => {
    // The content portals to document.body → it is NOT inside `canvas`, only the trigger is.
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Hover' });

    await step('hovering the trigger opens the tooltip', async () => {
      await userEvent.hover(trigger);
      // Radix may render >1 content node (a visible one + an aria mirror) → findAllByRole, assert
      // at least one is visible after the open animation settles.
      const tips = await body.findAllByRole('tooltip');
      await waitFor(() => expect(tips.some((t) => t.textContent?.includes('Add to library'))).toBe(true));
    });

    await step('unhovering closes it and unmounts the portal', async () => {
      await userEvent.unhover(trigger);
      await waitFor(() => expect(body.queryByText('Add to library')).toBeNull());
    });
  },
};

// Placement — the same tooltip on each of the four sides (the `side` prop on TooltipContent). The
// canonical "where does it point" showcase; sideOffset gives the arrow room. Render-only (the
// placement is the point, not a control). Padding so the top/bottom chips have room to portal into
// view in the docs frame.
export const Placement: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-wrap items-center justify-center gap-2xl p-4xl">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side} open>
            <TooltipTrigger asChild>
              <Button variant="outline">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side} sideOffset={6}>
              <p>On {side}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

// With Kbd — a trailing keyboard hint inside the tooltip (the docs shortcut pattern). Kbd is a
// ported DS primitive; the tooltip tightens its right padding when a Kbd trails
// (has-data-[slot=kbd]:pr-sm). `open` so the composition is visible at a glance without a hover.
export const WithKbd: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <TooltipProvider delayDuration={0}>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">Save</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Save changes</p>
          <Kbd>⌘S</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

// Icon trigger — the icon-only affordance. The Button gives the tooltip something to describe, but
// the TOOLTIP is not the trigger's name (it's a description) → the icon button carries its OWN
// aria-label. Proves the a11y contract: trigger named, content describes. `open` to show the chip.
export const IconTrigger: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <TooltipProvider delayDuration={0}>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button icon variant="outline" aria-label="Add to library">
            +
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
