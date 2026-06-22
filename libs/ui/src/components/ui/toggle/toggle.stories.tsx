import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { RiBold, RiItalic, RiBookmarkLine } from '@remixicon/react';

import { Toggle } from './toggle';

// Toggle contract — one CVA Radix Toggle.Root (data-slot="toggle", data-variant, data-size):
//  · two axes — variant (default ghost / outline bordered) × size (default / sm / lg).
//  · on/off is a Radix pressed state, NOT a CVA axis: aria-pressed + data-[state=on] both
//    carry the muted-fill selection so it survives whether the toggle is standalone (data-state)
//    or a group item (aria-pressed). Selection is never colour-alone — the attribute names it.
//  · icon-only Toggles need an aria-label (no text → no accessible name); text Toggles read their
//    label. The [&_svg] selectors auto-size a child icon (16px default, 14px on sm).
const meta: Meta<typeof Toggle> = {
  title: 'UI/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: {
    children: 'Toggle',
    variant: 'default',
    size: 'default',
  },
  // variant + size are docgen-surfaced from ToggleProps (JSDoc in toggle.tsx). Here: control
  // overrides + a defaultValue per defaulted prop (the ArgsTable ignores the @default tag).
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      table: { defaultValue: { summary: '"default"' } },
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm', 'lg'],
      table: { defaultValue: { summary: '"default"' } },
    },
    children: {
      control: 'text',
      description: 'Toggle content — text, a leading icon, or both.',
      table: { type: { summary: 'React.ReactNode' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A two-state button — pressed/unpressed. Two axes: `variant` (default/outline) and `size` (default/sm/lg). On/off rides on `aria-pressed` / `data-[state=on]`, not a CVA variant. Icon-only toggles must carry an `aria-label`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

// Default — the API playground. render spreads {...args} so every meta argType is a live control
// AND an ArgsTable row, and the 'code' snippet shows a real example. play drives the press cycle.
export const Default: Story = {
  render: (args) => <Toggle aria-label="Toggle" {...args} />,
  play: async ({ canvas, step }) => {
    const toggle = canvas.getByRole('button', { name: /toggle/i });

    await step('starts unpressed', async () => {
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    await step('click presses it (aria-pressed + data-state flip)', async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await expect(toggle).toHaveAttribute('data-state', 'on');
    });

    await step('click again releases it', async () => {
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    });

    // userEvent.click leaves the toggle programmatically focused (→ focus-visible ring); blur() drops
    // it so the end state matches a real mouse user (no lingering ring).
    await step('blurring clears the focus', async () => {
      toggle.blur();
      await expect(toggle).not.toHaveFocus();
    });
  },
};

// The two variants × an icon+text composition (the doc "Bookmark" example, Remix vector swapped
// in for lucide). Outline gains a field border; both share the on/hover muted-fill.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Toggle>
        <RiBold />
        Default
      </Toggle>
      <Toggle variant="outline">
        <RiBold />
        Outline
      </Toggle>
    </div>
  ),
};

// The size ladder — sm (h-7, 14px icon) · default (h-8, 16px icon) · lg (h-9). Icon-only here, so
// each carries an aria-label.
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Toggle size="sm" aria-label="Bold (small)">
        <RiBold />
      </Toggle>
      <Toggle size="default" aria-label="Bold">
        <RiBold />
      </Toggle>
      <Toggle size="lg" aria-label="Bold (large)">
        <RiBold />
      </Toggle>
    </div>
  ),
};

// States gallery — off · on (pressed via defaultPressed) · disabled · icon+text. Pressed shows the
// muted-fill; disabled dims + blocks pointer events.
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Toggle aria-label="Italic, off">
        <RiItalic />
      </Toggle>
      <Toggle defaultPressed aria-label="Italic, on">
        <RiItalic />
      </Toggle>
      <Toggle disabled aria-label="Italic, disabled">
        <RiItalic />
      </Toggle>
      <Toggle variant="outline">
        <RiBookmarkLine />
        Bookmark
      </Toggle>
    </div>
  ),
};
