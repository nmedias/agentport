import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import {
  RiBold,
  RiItalic,
  RiUnderline,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
} from '@remixicon/react';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

// ToggleGroup contract — Radix Root (data-slot="toggle-group") + Items (data-slot="toggle-group-item"):
//  · variant/size set on the Root propagate to every Item via context (an Item may still override).
//  · type single | multiple — single = one active (radio-like, role=radio items), multiple = any
//    number on (toggle-button items, aria-pressed). Selection survives on the attribute, not colour.
//  · spacing — >0 renders separate pills; 0 a connected/segmented bar (shared border, only the outer
//    corners rounded). orientation flips the axis. Items reuse Toggle's look (toggleVariants).
//  · icon-only items each carry an aria-label.
const meta: Meta<typeof ToggleGroup> = {
  title: 'UI/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  args: {
    variant: 'outline',
    size: 'default',
    type: 'multiple',
    spacing: 2,
    orientation: 'horizontal',
  },
  // variant/size/spacing/orientation are docgen-surfaced from ToggleGroupProps (JSDoc). `type` is a
  // Radix Root prop (single | multiple) — exposed as a control here. value/onValueChange pass through.
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
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
    },
    spacing: {
      control: { type: 'number', min: 0, max: 8, step: 1 },
      table: { defaultValue: { summary: '2' } },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: '"horizontal"' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A set of toggles that share `variant`/`size` (propagated Root→Item via context). `type` is `single` (one active, radio-like) or `multiple` (any number on). `spacing: 0` renders a connected/segmented bar.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

// Default — the API playground. The text-formatting toolbar (Bold/Italic/Underline), the doc demo.
// render spreads {...args}, so variant/size/type/spacing/orientation are all live controls. play
// drives a multi-select press cycle.
export const Default: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <RiBold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <RiItalic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <RiUnderline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvas, step }) => {
    const bold = canvas.getByRole('button', { name: /bold/i });
    const italic = canvas.getByRole('button', { name: /italic/i });

    await step('group exposes role=group', async () => {
      await expect(canvas.getByRole('group')).toBeInTheDocument();
    });

    await step('type=multiple lets two items be pressed at once', async () => {
      await userEvent.click(bold);
      await userEvent.click(italic);
      await expect(bold).toHaveAttribute('aria-pressed', 'true');
      await expect(italic).toHaveAttribute('aria-pressed', 'true');
    });
  },
};

// type=single — radio semantics: pressing one item releases the previous (only one active). Items
// render as role=radio. type=multiple — any number on (the Default). Side by side.
export const SingleVsMultiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-xl">
      <ToggleGroup type="single" variant="outline" defaultValue="center">
        <ToggleGroupItem value="left" aria-label="Align left">
          <RiAlignLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <RiAlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <RiAlignRight />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" variant="outline" defaultValue={['bold']}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <RiBold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <RiItalic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <RiUnderline />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

// variant (default ghost / outline) × the size ladder (sm/default/lg). The group keys the look once;
// every item inherits it.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-xl">
      {(['default', 'outline'] as const).map((variant) =>
        (['sm', 'default', 'lg'] as const).map((size) => (
          <ToggleGroup
            key={`${variant}-${size}`}
            type="multiple"
            variant={variant}
            size={size}
            defaultValue={['bold']}
          >
            <ToggleGroupItem value="bold" aria-label="Bold">
              <RiBold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <RiItalic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <RiUnderline />
            </ToggleGroupItem>
          </ToggleGroup>
        ))
      )}
    </div>
  ),
};

// spacing=0 — the connected/segmented bar: items lose their inner corners and double borders, only the
// outer corners stay rounded. Compared against the default gapped pills.
export const Connected: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-xl">
      <ToggleGroup type="single" variant="outline" spacing={0} defaultValue="center">
        <ToggleGroupItem value="left" aria-label="Align left">
          <RiAlignLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <RiAlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <RiAlignRight />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline" defaultValue="center">
        <ToggleGroupItem value="left" aria-label="Align left (gapped)">
          <RiAlignLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center (gapped)">
          <RiAlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right (gapped)">
          <RiAlignRight />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

// orientation=vertical — the group stacks; items stretch to a shared width. Connected vertical loses
// the inner top/bottom corners.
export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ToggleGroup
      type="single"
      variant="outline"
      orientation="vertical"
      spacing={0}
      defaultValue="left"
    >
      <ToggleGroupItem value="left" aria-label="Align left">
        <RiAlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <RiAlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <RiAlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

// Disabled — the whole group is inert and dimmed (disabled on the Root cascades to every item).
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ToggleGroup type="multiple" variant="outline" disabled defaultValue={['bold']}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <RiBold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <RiItalic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <RiUnderline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
