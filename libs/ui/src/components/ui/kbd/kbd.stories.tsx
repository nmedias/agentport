import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiCommandLine, RiArrowUpLine, RiArrowDownLine } from '@remixicon/react';
import { Kbd, KbdGroup } from './kbd';

// Kbd contract — a DISPLAY-ONLY <kbd> keycap (data-slot="kbd", pointer-events-none):
//  · emphasis is the ONLY axis (high/low) → it sets the keycap fill + ink. high (default)
//    is the inverted dark cap (Inverse fill/ink); low is the quiet muted cap (stock look).
//    The Figma Kbd set (3217:308) keys on emphasis; there is NO state axis — a keycap never
//    gains focus/disabled/invalid (it's inert by design, pointer-events-none).
//  · content is children-driven, not a prop: a text glyph, or a modifier symbol as a Remix
//    icon (the svg inherits the keycap colour via currentColor, auto-sized to 12px).
//  · KbdGroup is a layout wrapper (data-slot="kbd-group") that rows keys with a 4px gap to
//    spell a chord — it carries no variant of its own.
// a11y: the key text (or the icon's a11y name) is the accessible content; nothing to drive.
const meta: Meta<typeof Kbd> = {
  title: 'UI/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: {
    children: 'Esc',
    emphasis: 'high',
  },
  // Curated prop docs for the Autodocs ArgsTable — react-docgen can't read the
  // ComponentProps<'kbd'> & VariantProps<…> intersection, so the public API is
  // documented here by hand (same approach as the other ports).
  argTypes: {
    emphasis: {
      control: 'inline-radio',
      options: ['high', 'low'],
      description:
        'Keycap weight. `high` (default) is the inverted dark cap (Inverse fill/ink); `low` is the quiet muted cap (the stock-shadcn look).',
      table: {
        type: { summary: '"high" | "low"' },
        defaultValue: { summary: '"high"' },
      },
    },
    children: {
      control: 'text',
      description: 'Keycap content — a text glyph, or a modifier symbol passed as a Remix icon.',
      table: { type: { summary: 'React.ReactNode' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A DISPLAY-ONLY keyboard keycap — its one axis is `emphasis` (`high`/`low`), which sets the cap fill + ink. The cap is inert (`pointer-events-none`); compose **`KbdGroup`** to spell a chord (see the **Group** story).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

// Default — the API playground. render spreads {...args} into a complete <Kbd>, so every
// prop in the meta argTypes is a live control AND an ArgsTable row (no controls.include — it
// would also filter the table) and the 'code' snippet shows a real example, never an empty {}.
// No play: a keycap is inert (pointer-events-none) — there is nothing to drive.
export const Default: Story = {
  render: (args) => <Kbd {...args} />,
};

// The full `emphasis` axis side by side — kbd's ONLY designed axis (the Figma Kbd set keys
// on emphasis; there's no state axis, no disabled/focus/invalid — the cap is inert by design,
// pointer-events-none). So this IS the at-a-glance gallery: high (default) is the inverted
// dark keycap, low the quiet muted keycap (the stock-shadcn look).
export const Emphasis: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-lg">
      <Kbd emphasis="high">Esc</Kbd>
      <Kbd emphasis="low">Esc</Kbd>
    </div>
  ),
};

// Single-character keys hit the 20px min-width and read as square caps.
export const SingleKeys: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-md">
      <Kbd>K</Kbd>
      <Kbd>J</Kbd>
      <Kbd>/</Kbd>
      <Kbd>?</Kbd>
    </div>
  ),
};

// Modifier symbols belong here as an icon (Remix vector at size-3), never as a
// raw glyph — keeps them crisp and accessible.
export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-md">
      <Kbd>
        <RiCommandLine />
      </Kbd>
      <Kbd>
        <RiArrowUpLine />
      </Kbd>
      <Kbd>
        <RiArrowDownLine />
      </Kbd>
    </div>
  ),
};

// KbdGroup lays keys out in a row with a 4px gap — a chord of modifiers.
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <KbdGroup>
      <Kbd>
        <RiCommandLine />
      </Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
};

// A combo with a literal separator between keys.
export const Combo: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <span className="text-muted-ink text-format-kbd">+</span>
      <Kbd>B</Kbd>
    </KbdGroup>
  ),
};

// Inline inside running text — the typical "press X to do Y" affordance.
export const InText: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="text-format-body text-ink">
      Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> to open the command palette.
    </p>
  ),
};
