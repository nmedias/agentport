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
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8373-5402',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A divider inside a `Command` list — a plain line, or a labeled rule with an eyebrow caption when given a `label`. Like groups it hides while a search narrows the list; `alwaysRender` opts out. The filtering API lives on the [`UI/Command`](?path=/docs/ui-command--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommandSeparator>;

// API playground — the separator captioning a flat item list; clear `label` to get the plain divider line.
export const Default: Story = {
  render: ({ label }) => (
    // shouldFilter={false}: a labeled separator has no item scope, so cmdk's filter re-sort would drift
    // items across it — a flat labeled-separator list is static (see the CommandSeparator docs).
    <Command className="w-[450px]" shouldFilter={false}>
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
