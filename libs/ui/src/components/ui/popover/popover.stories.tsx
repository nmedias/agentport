import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

// Popover contract — Radix Popover, a single RAISED panel anchored to its trigger:
//  · PopoverContent portals to document.body (PopoverPrimitive.Portal) — the panel is OUTSIDE the
//    story canvas. Plays MUST query it via within(document.body), never `canvas`; only the
//    PopoverTrigger (and PopoverAnchor) live in canvas.
//  · NO scrim/overlay (unlike Dialog) and NO focus trap by default — an outside click or Escape
//    dismisses it and unmounts the portal. The panel carries the DS raised surface (dialog-fill +
//    border + shadow-elevation + corner-lg), NOT a Dialog-style modal band.
//  · Placement: `align` (start|center|end) + `side` + numeric `sideOffset` position the panel
//    relative to the trigger; geometry stays numeric, only colour/typo/spacing/radius bind to DS.
//  · a11y: the Trigger carries aria-expanded + aria-controls; Radix gives the content role="dialog".
//    PopoverTitle/Description are plain typo helpers — no aria wiring is auto-applied (unlike the modal
//    Dialog, whose Title auto-sets aria-labelledby), so an open panel needs an explicit aria-label (or
//    aria-labelledby → the title) or axe's aria-dialog-name fails. Every open-panel story names its content.
//
// Canonical usage set = the structurally-distinct shadcn doc example (the "Dimensions" form panel),
// plus the Nova header/title/description parts and the Anchor placement path. Render-only showcases
// → controls off.
const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {
    modal: false,
  },
  // Popover (Root) exposes its public API via the `PopoverProps` JSDoc → react-docgen fills the
  // ArgsTable + controls from the component; no hand-authored argTypes. PopoverContent's own props
  // (side/align/sideOffset/avoidCollisions/…) are documented on its dedicated page, also via docgen.
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A raised panel anchored to its trigger — no scrim, no focus trap unless `modal`; outside click or Escape dismisses. Unlike Dialog it does not name itself: an open panel needs an explicit accessible name.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

// A reusable dimensions form — the shadcn doc example. Labelled inputs in a 3-col grid; the
// real Label + Input primitives, never div+label.
function DimensionsForm() {
  return (
    <div className="grid gap-xl">
      <PopoverHeader>
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
      </PopoverHeader>
      <div className="grid gap-md">
        {[
          { id: 'width', label: 'Width', value: '100%' },
          { id: 'maxWidth', label: 'Max. width', value: '300px' },
          { id: 'height', label: 'Height', value: '25px' },
          { id: 'maxHeight', label: 'Max. height', value: 'none' },
        ].map(({ id, label, value }) => (
          <div key={id} className="grid grid-cols-3 items-center gap-xl">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} defaultValue={value} className="col-span-2 h-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Default — API playground: a complete trigger-driven popover holding the dimensions form. render
// spreads {...args} into the root so open/defaultOpen/modal stay live controls AND ArgsTable rows.
// The play drives the open→Escape flow against the PORTAL (the panel is not in canvas).
export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" aria-label="Dimensions">
        <DimensionsForm />
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, step }) => {
    // PopoverContent portals to document.body, so it is NOT inside `canvas` — only the trigger is.
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Open popover' });

    await step('starts closed', async () => {
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(body.queryByText('Dimensions')).toBeNull();
    });

    await step('opens from the trigger', async () => {
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      // Radix plays an open animation (fade-in-0 → opacity 0 at t=0); poll until it has rendered.
      await waitFor(() => expect(body.getByText('Dimensions')).toBeVisible());
    });

    await step('Escape dismisses it and unmounts the portal', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByText('Dimensions')).toBeNull());
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

// Simple content — the smallest real popover: just the header/title/description stack, no form.
// defaultOpen renders the panel at a glance.
export const SimpleContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">About this layer</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" aria-label="Layer details">
        <PopoverHeader>
          <PopoverTitle>Layer details</PopoverTitle>
          <PopoverDescription>
            A popover surfaces secondary content next to its trigger without
            leaving the page. Dismiss it with an outside click or Escape.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

// Anchored — PopoverAnchor decouples the positioning element from the trigger: a separate button
// opens the popover, but it floats next to the anchored text. defaultOpen shows the anchored panel.
export const Anchored: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Popover defaultOpen>
      <div className="flex items-center gap-lg">
        <PopoverAnchor asChild>
          <span className="text-format-body text-muted">Anchored here</span>
        </PopoverAnchor>
        <PopoverTrigger asChild>
          <Button variant="outline">Toggle</Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-72" aria-label="Anchored popover">
        <PopoverHeader>
          <PopoverTitle>Anchored popover</PopoverTitle>
          <PopoverDescription>
            The panel positions against the anchor, not the trigger.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

// Placements — the align axis side by side (start / center / end). No pseudo-state axis exists for
// a static raised panel, so the "gallery" axis is placement, not focus/disabled/invalid. Render-only.
export const Placements: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3xl">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Popover key={align} defaultOpen>
          <PopoverTrigger asChild>
            <Button variant="outline">align={align}</Button>
          </PopoverTrigger>
          <PopoverContent
            align={align}
            className="w-72"
            aria-label={`Popover aligned ${align}`}
          >
            <PopoverHeader>
              <PopoverTitle>align={align}</PopoverTitle>
              <PopoverDescription>
                The panel edge follows the chosen alignment.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

// Sides — the `side` axis (top / right / bottom / left): which edge of the trigger the panel opens
// toward (pairs with Placements, the `align` axis). avoidCollisions is off so each panel renders on
// its literal side; generous spacing keeps the open panels from colliding. Render-only.
export const Sides: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-3/4 m-auto  h-[80vh] grid-cols-2 gap-[7rem] p-[5rem] justify-items-center content-center">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover key={side} defaultOpen>
          <PopoverTrigger asChild>
            <Button variant="outline">side={side}</Button>
          </PopoverTrigger>
          <PopoverContent
            side={side}
            avoidCollisions={false}
            className="w-56"
            aria-label={`Popover on ${side}`}
          >
            <PopoverHeader>
              <PopoverTitle>side={side}</PopoverTitle>
              <PopoverDescription>Opens toward the {side}.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};
