import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

// Dialog contract — Radix Dialog, NOT just "a modal":
//  · DialogContent portals to document.body (DialogPortal) — so the panel is OUTSIDE the
//    story canvas. Plays MUST query it via within(document.body), never `canvas`; only the
//    DialogTrigger lives in canvas.
//  · A DialogOverlay (bg-scrim) sits under the panel; the panel grids header/body/footer and
//    carries a focus trap while open.
//  · Dismiss paths: the corner X (showCloseButton, a DialogClose), any DialogClose in the
//    footer, the Escape key, or an overlay click. Each flips the root closed and unmounts the
//    portal (queryByRole('dialog') → null).
//  · a11y: role="dialog"; DialogTitle sets aria-labelledby and DialogDescription sets
//    aria-describedby — a Title is REQUIRED for the accessible name (axe gate). Keep one per
//    DialogContent.
//
// Canonical usage set = the structurally-distinct, portable shadcn doc examples (see run
// notes example-inventory). "With Form" is kept structurally but without its Field/FieldLabel
// rows (not ported); "Chat Settings" is skipped entirely (Tabs/Select/Switch/Checkbox not
// ported). Render-only showcases → controls off.
const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: {
    modal: true,
  },
  // Prop docs (type/description/@default) come from the DialogProps JSDoc via react-docgen.
  // These argTypes only carry what docgen can't: the non-control on onOpenChange and the
  // ArgsTable default cells (the @default JSDoc tag isn't read by the Default column).
  argTypes: {
    onOpenChange: { control: false },
    defaultOpen: { table: { defaultValue: { summary: 'false' } } },
    modal: { table: { defaultValue: { summary: 'true' } } },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8362-5227',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The modal: scrim, focus trap, dismiss via corner close, footer close, Escape or overlay click. A `DialogTitle` is mandatory — it is the dialog\'s accessible name. The footer is its own part with an optional built-in close action.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const loremParagraphs = Array.from({ length: 10 }).map((_, index) => (
  <p key={index} className="mb-4">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur.
  </p>
));

// Default — API playground: a complete trigger-driven dialog (header + two-action footer),
// the doc "With Form" example minus its un-ported Field rows. render spreads {...args} into the
// root so open/defaultOpen/modal are live controls AND ArgsTable rows (no controls.include — it
// would also filter the table). The play drives the canonical flow against the PORTAL.
export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re
            done. Your profile will be updated immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, step }) => {
    // The DialogContent portals to document.body, so it is NOT inside `canvas` — only the
    // trigger is. Open from canvas, then assert/dismiss against within(document.body).
    const body = within(document.body);

    await step('opens from the trigger', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Edit Profile' }));
      const dialog = await body.findByRole('dialog');
      // Radix plays an open animation (fade-in-0 → opacity 0 at t=0), so poll until the panel
      // has finished animating in before asserting visibility (real browser, unlike jsdom).
      await waitFor(() => expect(dialog).toBeVisible());
      // Title is the accessible name (aria-labelledby) → axe-clean dialog.
      await expect(body.getByText('Edit profile')).toBeVisible();
    });

    await step('Escape dismisses it and unmounts the portal', async () => {
      await userEvent.keyboard('{Escape}');
      // The exit animation keeps the portal mounted briefly → poll until it unmounts.
      await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    });
  },
};

// Basic confirm — the smallest real dialog: header + a single Cancel close, no destructive
// intent. The corner X and Escape both dismiss it too.
export const BasicConfirm: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action confirms your current selection. You can change it
            again later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Destructive confirm — same shape, but the primary action is a `destructive` button: the
// guarded "delete" pattern. Cancel stays the safe default; the irreversible action is red.
export const DestructiveConfirm: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>
            This permanently removes the project and all of its data. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Long body content scrolling inside the panel; no footer. The scroll region bleeds through
// the panel padding (negative margins) and hides its scrollbar. defaultOpen shows the
// scrolling state at a glance.
export const ScrollableContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Scrollable Content</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>
            This is a dialog with scrollable content.
          </DialogDescription>
        </DialogHeader>
        <div
          tabIndex={0}
          className="no-scrollbar -mx-xl max-h-[70vh] overflow-y-auto px-xl"
        >
          {loremParagraphs}
        </div>
      </DialogContent>
    </Dialog>
  ),
};

// Scrollable body + footer: the footer band stays fixed below the scroll region.
export const StickyFooter: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Sticky Footer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>
            This is a dialog with scrollable content.
          </DialogDescription>
        </DialogHeader>
        <div
          tabIndex={0}
          className="no-scrollbar -mx-xl max-h-[70vh] overflow-y-auto px-xl"
        >
          {loremParagraphs}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// showCloseButton={false}: no X in the corner — closing runs through the footer (or Escape).
export const NoCloseButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">No Close Button</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            This dialog doesn&apos;t have a close button in the top-right
            corner.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
