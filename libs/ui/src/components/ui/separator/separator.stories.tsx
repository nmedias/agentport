import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from './separator';

// Separator contract — a single static Radix Separator.Root (data-slot="separator"),
// no CVA, no state axis:
//  · `orientation` (horizontal | vertical) is the ONLY content axis — it sets which
//    way the hairline runs: horizontal → h-px/w-full (divides stacked content),
//    vertical → w-px/self-stretch (divides inline items inside a flex row).
//  · `decorative` toggles the SEMANTICS, not the look — true (default) is non-semantic
//    (role="none", aria-hidden), false exposes the ARIA `separator` role with its
//    aria-orientation. The pixel line is identical either way.
//  · DISPLAY-ONLY: there is no focus/hover/disabled/invalid state. A separator only
//    renders inside a context (a stack or a row), so every story wraps it.
const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
  // Prop type · description · enum come from the component's JSDoc via react-docgen (see SeparatorProps
  // in separator.tsx); Storybook infers each control from the type. argTypes adds only: (1) a control
  // override — `orientation` as inline-radio vs the inferred select; (2) a defaultValue per defaulted
  // prop — the ArgsTable Default column ignores the @default JSDoc tag, so every default is declared
  // here uniformly (the component's @default tags feed the storybook MCP get-documentation instead).
  argTypes: {
    orientation: {
      control: 'inline-radio',
      table: { defaultValue: { summary: '"horizontal"' } },
    },
    decorative: {
      table: { defaultValue: { summary: 'true' } },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8417-5749',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A hairline divider, horizontal or vertical. `decorative` decides whether it is announced as a semantic separator or hidden from assistive tech — the line itself never changes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

// Default — the API playground. render spreads {...args} into a complete <Separator>
// inside a wrapper that gives the line a context to be visible (a separator collapses
// with no content around it), so orientation/decorative are live controls AND ArgsTable
// rows, and the 'code' snippet shows a real example, never an empty {}. No play: the
// separator is a static element with no interaction to drive (display-only).
export const Default: Story = {
  render: (args) => (
    <div className="flex h-5 w-[280px] items-center gap-xl text-format-body">
      <span>Before</span>
      <Separator {...args} />
      <span>After</span>
    </div>
  ),
};

// Usage 1 — horizontal rule (the default orientation) dividing two stacked text blocks:
// a hairline `border` line spanning full width between content above and below.
export const HorizontalBetweenBlocks: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[320px]">
      <div className="flex flex-col gap-xs">
        <h4 className="text-format-body-strong">Radix Primitives</h4>
        <p className="text-format-body text-muted">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-xl" />
      <div className="flex flex-col gap-xs">
        <h4 className="text-format-body-strong">shadcn/ui</h4>
        <p className="text-format-body text-muted">
          Components built on Radix and Tailwind.
        </p>
      </div>
    </div>
  ),
};

// Usage 2 — vertical separators inside a horizontal flex row, each stretching to the
// row height (`self-stretch`) to divide inline labels. Structurally distinct from the
// horizontal rule: the line runs across the cross-axis of a flex row, not the page width.
export const VerticalInRow: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex h-5 items-center gap-xl text-format-body">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
};

// Overview — both orientations side by side, so the component's full content axis
// (orientation: horizontal | vertical) is exercised in one frame. NOT a state gallery:
// the separator is display-only, so the axis here is orientation/content, not state.
export const Orientations: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2xl">
      <div className="flex flex-col gap-md">
        <span className="text-format-eyebrow uppercase text-muted">
          Horizontal
        </span>
        <div className="w-[280px]">
          <span className="text-format-body">Above the line</span>
          <Separator className="my-md" />
          <span className="text-format-body">Below the line</span>
        </div>
      </div>
      <div className="flex flex-col gap-md">
        <span className="text-format-eyebrow uppercase text-muted">
          Vertical
        </span>
        <div className="flex h-5 items-center gap-xl text-format-body">
          <span>Left</span>
          <Separator orientation="vertical" />
          <span>Right</span>
        </div>
      </div>
    </div>
  ),
};
