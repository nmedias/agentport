import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

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

const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof Command>;

// Inline command palette: mono text-input search, eyebrow group headings, cyan
// accent selection, Kbd shortcuts.
export const Default: Story = {
  render: () => (
    <div className="w-96 rounded-xl border border-border shadow-elevation">
      <Command>
        <CommandInput placeholder="Search commands…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              Open explorer
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Run SQL query
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
            <CommandItem>Connect to system…</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              Preferences
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
            <CommandItem disabled>Sign out</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

// Empty state — query with no matches.
export const EmptyState: Story = {
  render: () => (
    <div className="w-96 rounded-xl border border-border shadow-elevation">
      <Command>
        <CommandInput placeholder="Search commands…" defaultValue="zzzzz" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Open explorer</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

// Checkable items — the trailing checkmark shows on selected (data-checked)
// rows and hides whenever a shortcut occupies the trailing slot.
export const CheckableItems: Story = {
  render: () => {
    const ViewToggles = () => {
      const [checked, setChecked] = useState<Record<string, boolean>>({
        types: true,
        secondary: false,
      });
      return (
        <div className="w-96 rounded-xl border border-border shadow-elevation">
          <Command>
            <CommandInput placeholder="Toggle columns…" />
            <CommandList>
              <CommandGroup heading="Visible columns">
                {[
                  { id: 'types', label: 'Record types' },
                  { id: 'secondary', label: 'Secondary types' },
                ].map((c) => (
                  <CommandItem
                    key={c.id}
                    data-checked={checked[c.id] || undefined}
                    onSelect={() =>
                      setChecked((p) => ({ ...p, [c.id]: !p[c.id] }))
                    }
                  >
                    {c.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      );
    };
    return <ViewToggles />;
  },
};
