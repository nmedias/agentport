import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof Separator>;

// Doc demo, part 1 — a horizontal rule dividing two stacked text blocks
// (the default orientation): a hairline `border` line spanning full width.
export const HorizontalBetweenBlocks: Story = {
  render: () => (
    <div className="w-[320px]">
      <div className="flex flex-col gap-xs">
        <h4 className="text-format-body-strong">Radix Primitives</h4>
        <p className="text-format-body text-muted-ink">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-xl" />
      <div className="flex h-5 items-center gap-xl text-format-body">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

// Doc demo, part 2 — vertical separators inside a horizontal flex row, each
// stretching to the row height (`self-stretch`) to divide inline labels.
export const VerticalInRow: Story = {
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

// Overview — both orientations side by side, so the Figma component's full
// content axis (orientation: horizontal | vertical) is exercised in one frame.
export const Orientations: Story = {
  render: () => (
    <div className="flex flex-col gap-2xl">
      <div className="flex flex-col gap-md">
        <span className="text-format-eyebrow uppercase text-muted-ink">
          Horizontal
        </span>
        <div className="w-[280px]">
          <span className="text-format-body">Above the line</span>
          <Separator className="my-md" />
          <span className="text-format-body">Below the line</span>
        </div>
      </div>
      <div className="flex flex-col gap-md">
        <span className="text-format-eyebrow uppercase text-muted-ink">
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
