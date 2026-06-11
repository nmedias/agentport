import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RiCalendarLine,
  RiEmotionLine,
  RiCalculatorLine,
  RiUserLine,
  RiBankCardLine,
  RiSettings3Line,
  RiArrowRightLine,
  RiArrowUpDownLine,
  RiSearchLine,
  RiPlayLine,
  RiDownloadLine,
} from '@remixicon/react';

import { Button } from '../button';
import { Kbd } from '../kbd';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './command';

// Canonical usage set = the structurally-distinct, portable shadcn doc examples
// (see run notes example-inventory). Visual showcases → controls disabled.
const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof Command>;

// Hero: the command palette — search input + scrollable list with two grouped
// sections, icons, a disabled item, a separator, and trailing keyboard shortcuts.
export const Default: Story = {
  render: () => (
    <Command className="w-[450px]">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <RiCalendarLine />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <RiEmotionLine />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <RiCalculatorLine />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <RiUserLine />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <RiBankCardLine />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <RiSettings3Line />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

// The command-dialog doc example: the same palette inside a CommandDialog,
// toggled with ⌘J / Ctrl+J like the demo. The DS Button (with the Kbd keycap as
// shortcut hint) stays as a click affordance — it also pulls focus into the
// preview iframe so the hotkey lands. Starts open so the story shows the
// palette; Esc / overlay click close it.
function CommandDialogDemo() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
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
        Open Command Palette
        <Kbd>⌘J</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <RiCalendarLine />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <RiEmotionLine />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <RiCalculatorLine />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <RiUserLine />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <RiBankCardLine />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
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

export const InDialog: Story = {
  render: () => <CommandDialogDemo />,
};

// Shared palette list content — mirrors the Figma "Example · palette-demo" (3650:63):
// three groups (jump / search / run) with trailing meta via CommandShortcut.
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

// The palette variant — terminal-style prompt row (glow caret bar, mono text-input,
// Esc keycap) on a full-bleed corner-md panel; group headings render as labeled rules.
// One switch point: variant="palette" on the root, everything else adapts via context.
// The trailing CommandSeparator is the footer divider from the Figma composition.
export const Palette: Story = {
  render: () => (
    <Command variant="palette" className="w-[720px]">
      <CommandInput placeholder="type a command, jump or search" />
      <CommandList>
        <PaletteListContent />
      </CommandList>
      <CommandSeparator alwaysRender />
    </Command>
  ),
};

// The palette inside CommandDialog — the Agentport ⌘K palette. variant="palette" on the
// dialog wrapper re-shapes the panel (corner-md, 1.5px border) and flows into the
// inner Command.
function PaletteDialogDemo() {
  const [open, setOpen] = useState(true);

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
        Agentport-Palette
        <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog
        variant="palette"
        open={open}
        onOpenChange={setOpen}
        title="Agentport Command Palette"
        description="Befehl, Sprung oder Suche eingeben…"
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

export const PaletteInDialog: Story = {
  render: () => <PaletteDialogDemo />,
};

// The flat alternative to grouped content: CommandSeparator with a label renders the
// labeled rule (eyebrow + trailing hairline). Trade-off vs. CommandGroup: no cmdk
// auto-hide — the labels stay while their items filter out, so prefer groups for
// searchable palettes and labeled separators for static/composed lists.
export const PaletteFlat: Story = {
  render: () => (
    <Command variant="palette" className="w-[720px]">
      <CommandInput placeholder="type a command, jump or search" />
      <CommandList>
        <CommandSeparator label="Jump to" />
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
        <CommandSeparator label="Search" />
        <CommandItem>
          <RiSearchLine />
          <span>Search all types</span>
          <CommandShortcut>global</CommandShortcut>
        </CommandItem>
      </CommandList>
      <CommandSeparator alwaysRender />
    </Command>
  ),
};

// Empty state — a search term that matches nothing surfaces CommandEmpty in place
// of the list. (Controlled `value` on the input freezes the palette on the no-results
// frame for a static visual.)
export const Empty: Story = {
  render: () => (
    <Command className="w-[450px]">
      <CommandInput placeholder="Type a command or search…" value="zxcvbnm" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <RiCalendarLine />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <RiCalculatorLine />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
