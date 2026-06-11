import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RiCalendarLine,
  RiEmotionLine,
  RiCalculatorLine,
  RiUserLine,
  RiBankCardLine,
  RiSettings3Line,
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
