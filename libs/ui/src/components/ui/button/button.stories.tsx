import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RiAddLine,
  RiSearchLine,
  RiDownloadLine,
  RiMore2Line,
  RiDeleteBinLine,
} from '@remixicon/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    // size="icon" is a different anatomy (square, icon child, requires aria-label),
    // so it's excluded from the generic text-button control — picking it with text
    // children renders a broken overflow. It's demonstrated in the AllSizes story.
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg'],
    },
  },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Link: Story = { args: { variant: 'link' } };

// Gallery stories consume args so a single relevant control stays live:
// AllVariants → size, AllSizes/Icon → variant (the other controls are hidden
// via controls.include). size is cast to the non-icon subset because args.size
// is typed with 'icon' too, which our a11y union would reject on text buttons.
export const AllVariants: Story = {
  parameters: { controls: { include: ['size'] } },
  render: ({ size }) => {
    const s = size as 'default' | 'xs' | 'sm' | 'lg';
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button size={s}>Default</Button>
        <Button size={s} variant="secondary">Secondary</Button>
        <Button size={s} variant="outline">Outline</Button>
        <Button size={s} variant="ghost">Ghost</Button>
        <Button size={s} variant="destructive">Destructive</Button>
        <Button size={s} variant="link">Link</Button>
      </div>
    );
  },
};

// The full radix-nova size ladder — text sizes xs → lg, denser than the
// new-york default (h-6/7/8/9). Text stays text-format-label across all (the DS has no
// sub-14px sans), only the geometry tightens.
export const AllSizes: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs" variant={variant}>Extra small</Button>
      <Button size="sm" variant={variant}>Small</Button>
      <Button size="default" variant={variant}>Default</Button>
      <Button size="lg" variant={variant}>Large</Button>
    </div>
  ),
};

// The icon-only size ladder (icon-xs → icon-lg). Each square scales its Remix
// icon to match via the per-size [&_svg]:size-N rule; every one requires an
// accessible name (enforced at the type level).
export const IconSizes: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon-xs" variant={variant} aria-label="Add">
        <RiAddLine />
      </Button>
      <Button size="icon-sm" variant={variant} aria-label="Add">
        <RiAddLine />
      </Button>
      <Button size="icon" variant={variant} aria-label="Add">
        <RiAddLine />
      </Button>
      <Button size="icon-lg" variant={variant} aria-label="Add">
        <RiAddLine />
      </Button>
    </div>
  ),
};

// Icon-only buttons (size="icon"): square, no text, Remix icon child, and a
// mandatory accessible name (aria-label) — enforced at the type level. The
// variant control applies to the whole set.
export const Icon: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon" variant={variant} aria-label="Add">
        <RiAddLine />
      </Button>
      <Button size="icon" variant={variant} aria-label="Search">
        <RiSearchLine />
      </Button>
      <Button size="icon" variant={variant} aria-label="Download">
        <RiDownloadLine />
      </Button>
      <Button size="icon" variant={variant} aria-label="More options">
        <RiMore2Line />
      </Button>
      <Button size="icon" variant={variant} aria-label="Delete">
        <RiDeleteBinLine />
      </Button>

        <Button size="xs" variant="link" aria-label="Delete">
            <RiDeleteBinLine /> sfdsfs
        </Button>
    </div>
  ),
};
