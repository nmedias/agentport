import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import {
  RiFileLine,
  RiFolderOpenLine,
  RiSettings3Line,
  RiUserLine,
  RiCalendarLine,
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
import { Kbd } from '../kbd';

const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof Command>;

// The full inline palette: search input (mono-18 text-input), a group with an
// eyebrow heading, items with leading icons + Kbd shortcuts, and a separator.
// cmdk auto-selects the first matching item, so "New File" shows the accent
// selection tint out of the box.
export const Default: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <RiFileLine />
            New File
            <CommandShortcut>
              <Kbd>⌘</Kbd>
              <Kbd>N</Kbd>
            </CommandShortcut>
          </CommandItem>
          <CommandItem>
            <RiFolderOpenLine />
            Open File
            <CommandShortcut>
              <Kbd>⌘</Kbd>
              <Kbd>O</Kbd>
            </CommandShortcut>
          </CommandItem>
          <CommandItem>
            <RiCalendarLine />
            Open Calendar
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <RiUserLine />
            Profile
            <CommandShortcut>
              <Kbd>⌘</Kbd>
              <Kbd>P</Kbd>
            </CommandShortcut>
          </CommandItem>
          <CommandItem disabled>
            <RiSettings3Line />
            Settings (disabled)
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

// A disabled item is non-interactive and dimmed (opacity), while the rest of the
// list stays selectable.
export const WithDisabledItem: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandGroup heading="Actions">
          <CommandItem>
            <RiFileLine />
            Available action
          </CommandItem>
          <CommandItem disabled>
            <RiSettings3Line />
            Unavailable action
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

// Typing a query that matches nothing reveals the CommandEmpty state.
export const EmptyState: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Type to search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <RiFileLine />
            New File
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Type to search…');
    await userEvent.type(input, 'zzzzz');
    await expect(canvas.getByText('No results found.')).toBeVisible();
  },
};

// Filtering: typing narrows the list to matching items.
export const Filtering: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Search commands…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>New File</CommandItem>
          <CommandItem>Open File</CommandItem>
          <CommandItem>Save File</CommandItem>
          <CommandItem>Close Window</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Search commands…');
    await userEvent.type(input, 'open');
    await expect(canvas.getByText('Open File')).toBeVisible();
    await expect(canvas.queryByText('Close Window')).toBeNull();
  },
};
