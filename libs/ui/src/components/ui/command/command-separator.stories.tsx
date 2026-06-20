import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiArrowRightLine, RiPlayLine, RiSearchLine } from '@remixicon/react';

import { Command, CommandInput, CommandItem, CommandList, CommandSeparator } from './command';

// Second Autodocs page for the separator (the UI/Command page documents the cmdk root). meta.component =
// CommandSeparator → its own ArgsTable; `label` comes from CommandSeparatorProps' JSDoc via react-docgen (see
// command.tsx) — a live control: a non-empty label renders the "labeled rule" (eyebrow + trailing hairline),
// an empty one the plain divider line. Lives in a CommandList, so the render wraps it in a Command;
// `alwaysRender` keeps it visible here (cmdk hides separators while searching). Display-only → no play.
const meta: Meta<typeof CommandSeparator> = {
  title: 'UI/Command/CommandSeparator',
  component: CommandSeparator,
  tags: ['autodocs'],
  args: { label: 'Jump to' },
  argTypes: {
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A divider inside a **`Command`** list — plain line by default, or a **labeled rule** (eyebrow caption + trailing hairline) when given a `label`, for flat/composed lists. Hides while searching like the line form (`alwaysRender` opts out). The cmdk root + filtering API lives on the [`UI/Command`](?path=/docs/ui-command--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommandSeparator>;

// API playground — the separator captioning a flat item list; clear `label` to get the plain divider line.
export const Default: Story = {
  render: ({ label }) => (
    <Command className="w-[450px]">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandSeparator label={label} alwaysRender />
        <CommandItem>
          <RiArrowRightLine />
          <span>Jump to file…</span>
        </CommandItem>
        <CommandItem>
          <RiSearchLine />
          <span>Search everywhere</span>
        </CommandItem>
        <CommandItem>
          <RiPlayLine />
          <span>Run query</span>
        </CommandItem>
      </CommandList>
    </Command>
  ),
};
