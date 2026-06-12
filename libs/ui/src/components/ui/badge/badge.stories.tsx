import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiVerifiedBadgeFill } from '@remixicon/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Badge',
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    // asChild swaps the rendered element for the child (Radix Slot) and needs a
    // SINGLE element child — toggling it onto the stories' plain-text children
    // crashes the Slot. No control; demonstrated in the AsChild story.
    asChild: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// The default badge — a brand-primary pill marker (text-format-label on the
// primary surface).
export const Default: Story = {};

// The full `variant` axis. default/outline are designed DS tints; secondary +
// destructive ride the stock PLACEHOLDER tokens (not finalized — see notes);
// ghost/link are the Nova-baseline extras.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

// A leading icon (Remix vector, auto-sized to 12px via [&>svg]:size-3); the
// classic "verified" affordance. Icons sit before the label as a child.
export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>
        <RiVerifiedBadgeFill />
        Verified
      </Badge>
      <Badge variant="outline">
        <RiVerifiedBadgeFill />
        Verified
      </Badge>
    </div>
  ),
};

// Count / number badges: a square-ish pill driven by min-w-5 + tabular mono
// digits (the docs notification-count pattern). Geometry overrides ride on
// className; the variant carries the colour.
export const Count: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className="min-w-5 px-xs font-mono tabular-nums">8</Badge>
      <Badge
        variant="destructive"
        className="min-w-5 px-xs font-mono tabular-nums"
      >
        99
      </Badge>
      <Badge variant="outline" className="min-w-5 px-xs font-mono tabular-nums">
        20+
      </Badge>
    </div>
  ),
};

// asChild merges the Badge styling onto its single child element instead of the
// <span> (Radix Slot) — here an <a>, so the badge becomes a real link and picks
// up the [a]:hover tint. Requires exactly one element child (Slot contract),
// hence no boolean control on the text stories.
export const AsChild: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <Badge asChild variant={variant}>
      <a href="#badge">Link badge</a>
    </Badge>
  ),
};
