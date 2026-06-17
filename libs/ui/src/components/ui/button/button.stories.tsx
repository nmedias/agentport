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
//  · size sets geometry + per-size icon scaling ([&_svg…]:size-N); the `icon*` sizes are square and
//    carry no text → an accessible name (aria-label) is REQUIRED (enforced at the type level).
//  · states are real CSS, not props: hover/active (fill darken or accent tint + active:translate-y-px),
//    focus-visible ring, disabled (opacity-50 + pointer-events-none), aria-invalid (destructive ring),
//    aria-expanded (menu-trigger tint). AllStates forces them statically via the pseudo addon.
//  · asChild (Radix Slot) merges the look onto a SINGLE element child → it renders AS that <a>/<div>.
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button', onClick: fn() },
  // Curated prop docs for the Autodocs ArgsTable — react-docgen can't read the ButtonProps a11y
  // union (Omit<…> & VariantProps<…> with the icon-size aria-label branch), so document by hand.
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
      description:
        'Visual style — solid fills (`default`/`secondary`/`destructive`), tinted-on-interaction (`outline`/`ghost`), or `link`.',
      table: {
        type: { summary: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"' },
        defaultValue: { summary: '"default"' },
      },
    },
    // size="icon*" is a different anatomy (square, icon child, aria-label required), so it's excluded
    // from this generic text-button control — picking it with text children renders a broken overflow.
    // The full union is documented in the table; the icon ladder lives in IconSizes / Icon.
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg'],
      description:
        'Geometry. Text sizes `xs`/`sm`/`default`/`lg`; square `icon`/`icon-xs`/`icon-sm`/`icon-lg` are icon-only (need `aria-label`).',
      table: {
        type: { summary: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"' },
        defaultValue: { summary: '"default"' },
      },
    },
    children: {
      control: 'text',
      description: 'Button label — text, an icon, or both.',
      table: { type: { summary: 'React.ReactNode' } },
    },
    // asChild swaps the rendered <button> for its single child (Radix Slot) and needs exactly ONE
    // element child — toggling it onto the plain-text stories crashes the Slot. No control;
    // demonstrated in the AsChild story.
    asChild: {
      control: false,
      description:
        'Merge the button styling onto a single child element instead of a `<button>` (Radix Slot).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
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
          'The DS button — `variant` × `size` axes on a real CSS state layer (hover/active/focus/disabled/aria-invalid/aria-expanded). Icon-only sizes require an `aria-label`. Use **`asChild`** to render a link or other element as a button (see the **As Child** story).',
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

// Per-variant examples (the shadcn doc set) — each auto-renders <Button variant=…>Button</Button>.
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Link: Story = { args: { variant: 'link' } };

// Gallery stories consume args so a single relevant control stays live: AllVariants → size,
// AllSizes/Icon → variant (the other controls are hidden via controls.include). size is cast to the
// non-icon subset because args.size is typed with 'icon' too, which our a11y union rejects on text buttons.
export const AllVariants: Story = {
  parameters: { controls: { include: ['size'] } },
  render: ({ size }) => {
    const s = size as 'default' | 'xs' | 'sm' | 'lg';
    return (
      <div className="flex flex-wrap items-center gap-lg">
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
        <span className="text-format-eyebrow text-muted-ink">Default</span>
        <span className="text-format-eyebrow text-muted-ink">Outline</span>
      </div>
      {STATE_ROWS.map((r) => (
        <div key={r.key} className="grid grid-cols-[7rem_1fr_1fr] items-center gap-lg">
          <span className="text-format-eyebrow text-muted-ink">{r.label}</span>
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
  render: ({ variant, size }) => {
    const s = size as 'default' | 'xs' | 'sm' | 'lg';
    return (
      <Button asChild variant={variant} size={s}>
        <div role="button">Open explorer</div>
      </Button>
    );
  },
};

// The full radix-nova size ladder — text sizes xs → lg, denser than the new-york default (h-6/7/8/9).
// Text stays text-format-label across all (the DS has no sub-14px sans); only the geometry tightens.
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

// The icon-only size ladder (icon-xs → icon-lg). Each square scales its Remix icon to match via the
// per-size [&_svg]:size-N rule; every one requires an accessible name (enforced at the type level).
export const IconSizes: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <div className="flex flex-wrap items-center gap-lg">
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

// Icon-only buttons (size="icon"): square, no text, Remix icon child, and a mandatory accessible name
// (aria-label) — enforced at the type level. The variant control applies to the whole set.
export const Icon: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <div className="flex flex-wrap items-center gap-lg">
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
    </div>
  ),
};
