import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import {
  RiAddLine,
  RiSearchLine,
  RiDownloadLine,
  RiMore2Line,
  RiDeleteBinLine,
} from '@remixicon/react';

import { Button } from './button';

// Button contract — one CVA element (data-slot="button"), two axes on a real state layer:
//  · variant sets fill + ink: solid (default/secondary/destructive), transparent → accent-fill/-ink
//    on hover/active/aria-expanded (outline/ghost), or underline (link).
//  · size is the geometry scale (xs–lg), shared by text and icon buttons. `icon` (boolean) makes a
//    square icon-only button at that size → no text, so an accessible name (aria-label) is REQUIRED
//    (enforced at the type level); icon + size maps to the square `icon*` cva key in render.
//  · states are real CSS, not props: hover/active (fill darken or accent tint + active:translate-y-px),
//    focus-visible ring, disabled (opacity-50 + pointer-events-none), aria-invalid (destructive ring),
//    aria-expanded (menu-trigger tint). AllStates forces them statically via the pseudo addon.
//  · asChild (Radix Slot) merges the look onto a SINGLE element child → it renders AS that <a>/<div>.
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button', onClick: fn() },
  // variant + size + asChild are docgen-surfaced from the component's JSDoc (see ButtonOwnProps in
  // button.tsx);
  // react-docgen doesn't document — `icon` (in the a11y union, no JSDoc) + inherited `children`/`onClick`.
  argTypes: {
    variant: { table: { defaultValue: { summary: '"default"' } } },
    size: { table: { defaultValue: { summary: '"default"' } } },
    icon: {
      control: false,
      description:
        'Render as a square, icon-only button (no text) at the current `size`. Requires an accessible name (`aria-label`).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    asChild: { control: false, table: { defaultValue: { summary: 'false' } } },
    children: {
      control: 'text',
      description: 'Button label — text, an icon, or both.',
      table: { type: { summary: 'React.ReactNode' } },
    },
    onClick: {
      control: false,
      description: 'Click handler.',
      table: { type: { summary: '(e: MouseEvent) => void' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The action trigger: `variant` sets the semantic weight (solid primary through quiet ghost and link), `size` the geometry scale. One component covers text, text-with-icon and square icon-only buttons — icon-only requires its own accessible name. Via `asChild` a link can wear the button look without losing its semantics.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default — the API playground. render spreads {...args} into a complete <Button>, so every prop in
// the meta argTypes is a live control AND an ArgsTable row (no controls.include — it would also filter
// the table) and the 'code' snippet is a real example, never an empty {}. play drives a real click
// (onClick is an fn() spy in meta args) and asserts it fired.
export const Default: Story = {
  render: (args) => <Button {...args} />,
  play: async ({ canvas, args, step }) => {
    const button = canvas.getByRole('button', { name: /button/i });

    await step('clicking fires onClick', async () => {
      await userEvent.click(button);
      await expect(args.onClick).toHaveBeenCalledTimes(1);
    });

    // userEvent.click leaves the button programmatically focused (→ :focus-visible ring);
    // blur() drops it so the end state matches a real mouse user (no lingering ring).
    await step('blurring clears the focus', async () => {
      button.blur();
      await expect(button).not.toHaveFocus();
    });
  },
};

// Icon-only buttons (`icon`): square, no text, Remix icon child, and a mandatory accessible name
// (aria-label) — enforced at the type level. The variant + size controls apply to the whole set.
export const Icon: Story = {
    parameters: { controls: { include: ['variant', 'size'] } },
    render: ({ variant, size }) => (
        <div className="flex flex-wrap items-center gap-lg">
            <Button icon size={size} variant={variant} aria-label="Add">
                <RiAddLine />
            </Button>
            <Button icon size={size} variant={variant} aria-label="Search">
                <RiSearchLine />
            </Button>
            <Button icon size={size} variant={variant} aria-label="Download">
                <RiDownloadLine />
            </Button>
            <Button icon size={size} variant={variant} aria-label="More options">
                <RiMore2Line />
            </Button>
            <Button icon size={size} variant={variant} aria-label="Delete">
                <RiDeleteBinLine />
            </Button>
        </div>
    ),
};

// Gallery stories consume args so a single relevant control stays live: AllVariants → size,
// AllSizes/Icon → variant (the other controls are hidden via controls.include). size is now the plain
// scale (default|xs|sm|lg), so it passes straight through — no cast needed.
export const AllVariants: Story = {
  parameters: { controls: { include: ['size'] } },
  render: ({ size }) => (
    <div className="flex flex-wrap items-center gap-lg">
      <Button size={size}>Default</Button>
      <Button size={size} variant="secondary">Secondary</Button>
      <Button size={size} variant="outline">Outline</Button>
      <Button size={size} variant="ghost">Ghost</Button>
      <Button size={size} variant="destructive">Destructive</Button>
      <Button size={size} variant="link">Link</Button>
    </div>
  ),
};

// DS-authored gallery: the real state layer (default/hover/focus/active/disabled/invalid) on two
// representative variants — `default` (solid fill darkens) and `outline` (transparent → accent tint).
// hover/focus/active can't be set by a prop → forced via the pseudo-states addon (targeting ids).
// aria-expanded (the menu-trigger tint on outline/ghost) shares the hover treatment and isn't repeated.
const ST_VARIANTS = ['default', 'outline'] as const;
const STATE_ROWS = [
  { key: 'default', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'focus', label: 'Focus' },
  { key: 'active', label: 'Active' },
  { key: 'disabled', label: 'Disabled' },
  { key: 'invalid', label: 'Invalid' },
];

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: {
      hover: ST_VARIANTS.map((v) => `#b-${v}-hover`),
      focusVisible: ST_VARIANTS.map((v) => `#b-${v}-focus`),
      active: ST_VARIANTS.map((v) => `#b-${v}-active`),
    },
  },
  render: () => (
    <div className="flex flex-col gap-lg">
      <div className="grid grid-cols-[7rem_1fr_1fr] items-center gap-lg">
        <span />
        <span className="text-format-eyebrow text-muted">Default</span>
        <span className="text-format-eyebrow text-muted">Outline</span>
      </div>
      {STATE_ROWS.map((r) => (
        <div key={r.key} className="grid grid-cols-[7rem_1fr_1fr] items-center gap-lg">
          <span className="text-format-eyebrow text-muted">{r.label}</span>
          {ST_VARIANTS.map((v) => (
            <div key={v}>
              <Button
                id={`b-${v}-${r.key}`}
                variant={v}
                disabled={r.key === 'disabled'}
                aria-invalid={r.key === 'invalid' || undefined}
              >
                Button
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

// asChild merges the Button styling onto its single child element instead of rendering a <button> —
// canonical use: a link or element styled as a button. Requires exactly one element child (Radix Slot
// contract), hence no boolean control on the text stories.
export const AsChild: Story = {
  parameters: { controls: { include: ['variant', 'size'] } },
  render: ({ variant, size }) => (
    <Button asChild variant={variant} size={size}>
      <div role="button">Open explorer</div>
    </Button>
  ),
};

// The full radix-nova size ladder — text sizes xs → lg, denser than the new-york default (h-6/7/8/9).
// Text stays text-format-label-md across all (the DS has no sub-14px sans); only the geometry tightens.
export const AllSizes: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <div className="flex flex-wrap items-center gap-lg">
      <Button size="xs" variant={variant}>Extra small</Button>
      <Button size="sm" variant={variant}>Small</Button>
      <Button size="default" variant={variant}>Default</Button>
      <Button size="lg" variant={variant}>Large</Button>
    </div>
  ),
};

// The icon-only size ladder — `icon` + each size (xs → lg). Each square scales its Remix icon to match
// via the per-size [&_svg]:size-N rule; every one requires an accessible name (enforced at the type level).
export const AllIconSizes: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <div className="flex flex-wrap items-center gap-lg">
      <Button icon size="xs" variant={variant} aria-label="Add">
        <RiAddLine />
      </Button>
      <Button icon size="sm" variant={variant} aria-label="Add">
        <RiAddLine />
      </Button>
      <Button icon variant={variant} aria-label="Add">
        <RiAddLine />
      </Button>
      <Button icon size="lg" variant={variant} aria-label="Add">
        <RiAddLine />
      </Button>
    </div>
  ),
};

