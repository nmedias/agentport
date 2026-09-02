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

// Second Autodocs page for the panel (the UI/Dialog page documents the value-driven Dialog root).
// meta.component = DialogContent → its own ArgsTable; `showCloseButton` comes from DialogContentProps' JSDoc
// via react-docgen (see dialog.tsx) — a live control that toggles the corner × (a DialogClose). DialogContent
// portals to document.body + draws its own overlay, so the render wraps it in a trigger-driven Dialog and the
// play queries the PORTAL via within(document.body).
const meta: Meta<typeof DialogContent> = {
  title: 'UI/Dialog/DialogContent',
  component: DialogContent,
  tags: ['autodocs'],
  args: { showCloseButton: true },
  argTypes: {
    showCloseButton: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
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
          'The panel of a `Dialog`: it draws the scrim and traps focus while open. `showCloseButton` toggles the corner close — the other dismiss paths (footer close, Escape, overlay click) always stay. The open/modal API lives on the [`UI/Dialog`](?path=/docs/ui-dialog--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DialogContent>;

// API playground — toggle `showCloseButton` to add/remove the corner ×. The play opens from the trigger and
// asserts the corner Close button reflects the prop (default true → present), then dismisses via Escape.
export const Default: Story = {
  render: ({ showCloseButton }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
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
    // DialogContent portals to document.body → query it there, only the trigger is in canvas.
    const body = within(document.body);
    await step('opens from the trigger', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Edit Profile' }));
      const dialog = await body.findByRole('dialog');
      // Radix plays an open animation → poll until the panel has finished animating in.
      await waitFor(() => expect(dialog).toBeVisible());
    });
    await step('the corner close button reflects showCloseButton (default true)', async () => {
      await expect(body.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });
    await step('Escape dismisses it and unmounts the portal', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    });
  },
};
