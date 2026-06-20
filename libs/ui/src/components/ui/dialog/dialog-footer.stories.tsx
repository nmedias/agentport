import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '../button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

// Second Autodocs page for the footer. meta.component = DialogFooter → its own ArgsTable; `showCloseButton`
// comes from DialogFooterProps' JSDoc via react-docgen (see dialog.tsx) — appends a default "Close" button
// (a DialogClose) after the footer actions. The DialogContent corner × is turned OFF here so the only
// "Close" is the footer's; the render wraps it in a trigger-driven Dialog and the play queries the PORTAL.
const meta: Meta<typeof DialogFooter> = {
  title: 'UI/Dialog/DialogFooter',
  component: DialogFooter,
  tags: ['autodocs'],
  args: { showCloseButton: true },
  argTypes: {
    // The component default is false; this story defaults the control to true to show the feature.
    showCloseButton: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The action bar of a **`Dialog`** (tinted band, reversed column → row at `sm`). `showCloseButton` appends a default "Close" button (a `DialogClose`) after your own actions. The root open/modal API lives on the [`UI/Dialog`](?path=/docs/ui-dialog--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DialogFooter>;

// API playground — toggle `showCloseButton` to append the default Close button. The DialogContent corner ×
// is off here so the footer's Close is the only one; the play opens and asserts it reflects the prop.
export const Default: Story = {
  render: ({ showCloseButton }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete account</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton={showCloseButton}>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, step }) => {
    const body = within(document.body);
    await step('opens from the trigger', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Delete account' }));
      const dialog = await body.findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
    });
    await step('the footer Close button reflects showCloseButton (story default true)', async () => {
      await expect(body.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });
    await step('Escape dismisses it and unmounts the portal', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    });
  },
};
