import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
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

// CONTRACT — cmdk command palette, re-clothed in DS tokens. MECHANISM: typing into the
// input (role="combobox") drives cmdk's CLIENT-SIDE filter — non-matching CommandItems
// unmount, the list re-sorts by match score, and CommandEmpty surfaces when nothing
// matches (filtered.count === 0). Arrow keys move the active option (aria-selected). A
// CommandGroup's heading tracks ITS items (hidden when its group is empty); a labeled
// CommandSeparator is scope-less. WHEN: the inline Command renders in canvas; CommandDialog
// portals to document.body (Radix) — play queries the palette inside it via
// within(document.body). The `variant="palette"` axis (root only, flows to Input/List/
// Group/Separator via context) re-shapes the surface into the Agentport terminal palette.
const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  tags: ['autodocs'],
  // Prop docs come from react-docgen (CommandProps JSDoc on command.tsx); argTypes here
  // only carry control overrides + the ArgsTable default column. `value`/`defaultValue`/
  // `label` are plain strings → Storybook infers a text control, so they need no entry.
  argTypes: {
    variant: {
      control: 'inline-radio',
      table: { defaultValue: { summary: '"default"' } },
    },
    shouldFilter: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
    loop: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    onValueChange: { control: false },
    filter: { control: false },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A command palette built on **cmdk** with **client-side filtering**: typing in the input filters and re-sorts the list, and **`CommandEmpty`** surfaces when nothing matches. Compose `CommandInput` + `CommandList` with `CommandGroup`/`CommandItem`/`CommandSeparator`/`CommandShortcut`; **`CommandDialog`** portals the same palette into a modal (the Agentport ⌘K). The **`variant="palette"`** axis re-shapes the surface — see the **Palette** and **PaletteInDialog** stories. Sub-parts with their own API have dedicated pages: [CommandDialog](?path=/docs/ui-command-commanddialog--docs) · [CommandSeparator](?path=/docs/ui-command-commandseparator--docs).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Command>;

// Default — the API playground: render spreads {...args} onto a COMPLETE canonical palette
// (input + two grouped sections, icons, a disabled item, a separator, trailing shortcuts),
// so every meta argType is a live control AND an ArgsTable row. INTERACTIVE → the play types
// into the input and asserts cmdk's client-side filter: the matching item stays, the
// non-matching one unmounts; clearing the query restores the full list. No controls.include
// (it would filter the table too).
export const Default: Story = {
  render: (args) => (
    <Command {...args} className="w-[450px]">
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
  play: async ({ canvas, step }) => {
    // cmdk's input is role="combobox"; items are role="option".
    const input = canvas.getByRole('combobox');

    await step('typing a query filters the list to the matching item', async () => {
      await userEvent.type(input, 'Profile');
      await expect(
        await canvas.findByRole('option', { name: /profile/i })
      ).toBeInTheDocument();
      // Non-matching items unmount (cmdk returns null below its match threshold).
      await expect(canvas.queryByRole('option', { name: /calendar/i })).toBeNull();
    });

    await step('clearing the query restores the full list', async () => {
      await userEvent.clear(input);
      await expect(
        await canvas.findByRole('option', { name: /calendar/i })
      ).toBeInTheDocument();
    });
  },
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

// The palette variant — terminal-style prompt row (glow caret bar, mono text-format-data-lg,
// Esc keycap) on a full-bleed corner-md panel; group headings render as labeled rules.
// One switch point: variant="palette" on the root, everything else adapts via context.
// The trailing CommandSeparator is the footer divider from the Figma composition.
export const Palette: Story = {
  parameters: { controls: { disable: true } },
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

// The flat alternative to grouped content: CommandSeparator with a label renders the
// labeled rule (eyebrow + trailing hairline). It hides while searching exactly like
// the line form (alwaysRender opts out). Trade-off vs. CommandGroup: a group heading
// tracks ITS items (hides only when its group is empty), a labeled separator has no
// item scope — prefer groups for searchable palettes, labeled separators for
// static/composed lists.
export const PaletteFlat: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Command variant="palette" className="w-[720px]">
      <CommandInput placeholder="type a command, jump or search" />
      <CommandList>
        <CommandSeparator label="Jump to" alwaysRender/>
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
        <CommandSeparator label="Search" alwaysRender/>
        <CommandItem>
          <RiSearchLine />
          <span>Search all types</span>
          <CommandShortcut>global</CommandShortcut>
        </CommandItem>
      </CommandList>
    </Command>
  ),
};

// Empty state — a search term that matches nothing surfaces CommandEmpty in place
// of the list. (Controlled `value` on the input freezes the palette on the no-results
// frame for a static visual.)
export const Empty: Story = {
  parameters: { controls: { disable: true } },
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
