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
      options: ['default', 'sm', 'lg'],
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

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        <RiAddLine />
      </Button>
    </div>
  ),
};

// Icon-only buttons (size="icon"): square, no text, Remix icon child, and a
// mandatory accessible name (aria-label) — enforced at the type level.
export const Icon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon" aria-label="Add">
        <RiAddLine />
      </Button>
      <Button size="icon" variant="secondary" aria-label="Search">
        <RiSearchLine />
      </Button>
      <Button size="icon" variant="outline" aria-label="Download">
        <RiDownloadLine />
      </Button>
      <Button size="icon" variant="ghost" aria-label="More options">
        <RiMore2Line />
      </Button>
      <Button size="icon" variant="destructive" aria-label="Delete">
        <RiDeleteBinLine />
      </Button>
    </div>
  ),
};
