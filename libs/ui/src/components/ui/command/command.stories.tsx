import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RiCalendarLine,
  RiEmotionLine,
  RiCalculatorLine,
  RiUserLine,
  RiBankCardLine,
  RiSettings3Line,
} from '@remixicon/react';

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './command';

// Canonical usage set = the structurally-distinct, portable shadcn doc examples
// (see run notes example-inventory). CommandDialog is deferred (needs a Dialog port),
// so the dialog example is skipped. Visual showcases → controls disabled.
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
