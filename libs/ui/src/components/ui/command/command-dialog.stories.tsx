import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  RiArrowRightLine,
  RiArrowUpDownLine,
  RiCalendarLine,
  RiDownloadLine,
  RiPlayLine,
  RiSearchLine,
  RiSettings3Line,
  RiUserLine,
} from '@remixicon/react';

import { Button } from '../button';
import { Kbd } from '../kbd';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
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
          'The palette in a modal — the app\'s ⌘K launcher. It has no trigger slot: drive it with a controlled `open`. `title`/`description` provide the visually hidden accessible name, `showCloseButton` toggles the corner close, and `variant="palette"` switches to the launcher surface. The filtering API lives on the [`UI/Command`](?path=/docs/ui-command--docs) page.',
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

// Shared palette list content for the palette-variant demo — mirrors the Figma "Example · palette-demo"
// (3650:63): three groups (jump / search / run) with trailing meta via CommandShortcut. (The inline
// UI/Command Palette story keeps its own copy — story content, local per page.)
function PaletteListContent() {
  return (
    <>
      <CommandEmpty>No results.</CommandEmpty>
      <CommandGroup heading="Jump to">
        <CommandItem>
          <RiArrowRightLine />
          <span>invoice</span>
          <CommandShortcut>Type · System</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <RiArrowRightLine />
          <span>customer</span>
          <CommandShortcut>Type · Custom</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <RiArrowUpDownLine />
          <span>Switch endpoint …</span>
          <CommandShortcut>client.example.org</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Search">
        <CommandItem>
          <RiSearchLine />
          <span>Field “amount…” in invoice</span>
          <CommandShortcut>7 matches</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <RiSearchLine />
          <span>Search all types</span>
          <CommandShortcut>global</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Run">
        <CommandItem>
          <RiPlayLine />
          <span>Run query</span>
          <CommandShortcut>active query</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <RiDownloadLine />
          <span>Export result</span>
          <CommandShortcut>CSV · JSON</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  );
}

// The palette variant inside CommandDialog — the Agentport ⌘K palette. variant="palette" on the dialog
// wrapper re-shapes the panel (corner-md, 1.5px border) and flows into the inner Command. Toggled with
// ⌘K / Ctrl+K; starts closed (the docs view shows the button). Moved here from UI/Command.
function PaletteDialogDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Agentport palette
        <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog
        variant="palette"
        open={open}
        onOpenChange={setOpen}
        title="Agentport Command Palette"
        description="Type a command, jump or search…"
        className="sm:max-w-[720px]"
      >
        <CommandInput placeholder="type a command, jump or search" />
        <CommandList>
          <PaletteListContent />
        </CommandList>
      </CommandDialog>
    </>
  );
}

// The palette-variant CommandDialog (the Agentport ⌘K). Render-only showcase (no play) — starts closed,
// open via the button or ⌘K. Moved from UI/Command's "PaletteInDialog" to live beside the other
// CommandDialog stories.
export const Palette: Story = {
  parameters: {
     controls: {disable: true},
      docs: {
        source: {
          code: `
            const [open, setOpen] = useState(false);
          
            useEffect(() => {
              const down = (e: KeyboardEvent) => {
                if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  setOpen((open) => !open);
                }
              };
              document.addEventListener('keydown', down);
              return () => document.removeEventListener('keydown', down);
            }, []);
          
            return (
              <>
                <Button variant="outline" onClick={() => setOpen(true)}>
                  Agentport palette
                  <Kbd>⌘K</Kbd>
                </Button>
                <CommandDialog
                  variant="palette"
                  open={open}
                  onOpenChange={setOpen}
                  title="Agentport Command Palette"
                  description="Type a command, jump or search…"
                  className="sm:max-w-[720px]"
                >
                  <CommandInput placeholder="type a command, jump or search" />
                  <CommandList>
                    <PaletteListContent />
                  </CommandList>
                </CommandDialog>
              </>`
        }
      }
    },
  render: () => <PaletteDialogDemo />,
};

// Flat palette content — the same items as PaletteListContent but FLAT: items sit directly in the list,
// captioned by labeled `CommandSeparator`s (eyebrow + hairline) instead of `CommandGroup` headings. The
// labeled separator has no item scope, so `alwaysRender` keeps it visible (cmdk hides separators while
// searching). Prefer this for static/composed palettes; groups for searchable ones (heading tracks items).
function PaletteFlatListContent() {
  return (
    <>
      <CommandEmpty>No results.</CommandEmpty>
      <CommandSeparator label="Jump to" alwaysRender />
      <CommandItem>
        <RiArrowRightLine />
        <span>invoice</span>
        <CommandShortcut>Type · System</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <RiArrowRightLine />
        <span>customer</span>
        <CommandShortcut>Type · Custom</CommandShortcut>
      </CommandItem>
      <CommandSeparator label="Search" alwaysRender />
      <CommandItem>
        <RiSearchLine />
        <span>Search all types</span>
        <CommandShortcut>global</CommandShortcut>
      </CommandItem>
      <CommandSeparator label="Run" alwaysRender />
      <CommandItem>
        <RiPlayLine />
        <span>Run query</span>
        <CommandShortcut>active query</CommandShortcut>
      </CommandItem>
    </>
  );
}

// The flat palette inside CommandDialog — same modal as Palette, but the inner list is composed flat
// (labeled separators, no groups). Toggled with ⌘K / Ctrl+K; starts closed (the docs view shows the button).
function PaletteFlatDialogDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Agentport palette (flat)
        <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog
        variant="palette"
        open={open}
        onOpenChange={setOpen}
        title="Agentport Command Palette"
        description="Type a command, jump or search…"
        className="sm:max-w-[720px]"
        // Flat = STATIC list: cmdk would otherwise re-sort items by match score on typing/clearing,
        // but the labeled separators have no item scope and stay fixed → items drift across them.
        // shouldFilter={false} keeps the order stable (no re-sort). Groups (the Palette story) are the
        // searchable alternative.
        shouldFilter={false}
      >
        <CommandInput placeholder="type a command, jump or search" />
        <CommandList>
          <PaletteFlatListContent />
        </CommandList>
      </CommandDialog>
    </>
  );
}

// The flat-composition palette CommandDialog — the alternative to Palette's grouped content: labeled
// CommandSeparators caption a flat item list instead of CommandGroup headings. Render-only showcase
// (no play) — starts closed, open via the button or ⌘K.
export const PaletteFlat: Story = {
  parameters: { controls: { disable: true } },
  render: () => <PaletteFlatDialogDemo />,
};
