import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { RiCalendarLine, RiSettings3Line, RiUserLine } from '@remixicon/react';

import { Button } from '../button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from './command';

// Second Autodocs page for the modal palette (the UI/Command page documents the inline cmdk root).
// meta.component = CommandDialog → its own ArgsTable; `variant` + `showCloseButton` (+ title/description)
// come from CommandDialogProps' JSDoc via react-docgen (see command.tsx) — live controls. CommandDialog has
// no trigger slot (children are the palette), so it's opened via controlled `open`; the demo keeps that
// state + a reopen button, and the play drives the PORTAL (within(document.body)). open/onOpenChange are
// managed by the demo → their controls are off.
function CommandDialogDemo({
  variant,
  showCloseButton,
}: {
  variant?: 'default' | 'palette';
  showCloseButton?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Command Palette
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        variant={variant}
        showCloseButton={showCloseButton}
        title="Command Palette"
        description="Search for a command to run…"
      >
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <RiCalendarLine />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <RiUserLine />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <RiSettings3Line />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

const meta: Meta<typeof CommandDialog> = {
  title: 'UI/Command/CommandDialog',
  component: CommandDialog,
  tags: ['autodocs'],
  args: { variant: 'default', showCloseButton: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'palette'], table: { defaultValue: { summary: '"default"' } } },
    showCloseButton: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    // open state is owned by the demo wrapper, not args.
    open: { control: false },
    defaultOpen: { control: false },
    onOpenChange: { control: false },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The cmdk palette portalled into a modal **`Dialog`** (the Agentport ⌘K). `variant` re-shapes the panel (`palette` → terminal surface, flowing into the inner Command); `showCloseButton` toggles the corner ×; `title`/`description` are the visually-hidden a11y name. It has no trigger slot — drive it with controlled `open`. The inline cmdk root + filtering API lives on the [`UI/Command`](?path=/docs/ui-command--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommandDialog>;

// API playground — the palette opens in a portal; toggle variant / showCloseButton. The play drives the
// portalled palette (filter as you type) and closes it on Escape.
//
// The render delegates to a wrapper (CommandDialog has no trigger → it needs a controlled `open` + state),
// so the auto-generated snippet would only show `<CommandDialogDemo />`. An explicit `source.code` shows the
// real, full implementation a consumer writes instead.
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `
        const [open, setOpen] = useState(true);

        return (
          <CommandDialog
            open={open}
            onOpenChange={setOpen}
            title="Command Palette"
            description="Search for a command to run…"
          >
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <RiCalendarLine />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem>
                  <RiUserLine />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <RiSettings3Line />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        );`,
      },
    },
  },
  render: (args) => <CommandDialogDemo {...args} />,
  play: async ({ canvas, step }) => {
    // CommandDialog portals to document.body → query it there, not the canvas. The demo starts closed,
    // so open it from the button first.
    const body = within(document.body);

    await step('opens the palette from the button', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Open Command Palette' }));
      await expect(await body.findByRole('combobox')).toBeInTheDocument();
    });

    await step('the portalled palette filters as you type', async () => {
      const input = await body.findByRole('combobox');
      await userEvent.type(input, 'Profile');
      await expect(await body.findByRole('option', { name: /profile/i })).toBeInTheDocument();
      await expect(body.queryByRole('option', { name: /calendar/i })).toBeNull();
    });

    await step('Escape closes it and unmounts the portal', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('combobox')).toBeNull());
    });
  },
};
