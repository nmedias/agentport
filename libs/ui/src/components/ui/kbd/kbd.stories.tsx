import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiCommandLine, RiArrowUpLine, RiArrowDownLine } from '@remixicon/react';
import { Kbd, KbdGroup } from './kbd';

const meta: Meta<typeof Kbd> = {
  title: 'UI/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: {
    children: 'Esc',
  },
  argTypes: {
    emphasis: { control: 'inline-radio', options: ['high', 'low'] },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

// A single text key — the default anatomy (emphasis=high): inverted dark cap,
// mono key glyph.
export const Default: Story = {};

// The emphasis axis (Figma `.Kbd`): high (default) is the inverted dark keycap;
// low is the quiet muted keycap (the stock-shadcn look).
export const Emphasis: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Kbd emphasis="high">Esc</Kbd>
      <Kbd emphasis="low">Esc</Kbd>
    </div>
  ),
};

// Single-character keys hit the 20px min-width and read as square caps.
export const SingleKeys: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-2">
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
    <div className="flex items-center gap-2">
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
      <span className="text-muted-foreground text-kbd">+</span>
      <Kbd>B</Kbd>
    </KbdGroup>
  ),
};

// Inline inside running text — the typical "press X to do Y" affordance.
export const InText: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="text-body text-foreground">
      Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> to open the command palette.
    </p>
  ),
};
