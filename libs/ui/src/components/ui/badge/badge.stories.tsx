import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { RiVerifiedBadgeFill } from '@remixicon/react';

import { Badge } from './badge';

// Badge contract — one CVA <span> (data-slot="badge", data-variant=<variant>):
//  · variant is the ONLY axis (default/secondary/destructive/outline/ghost/link) → it sets
//    the fill + ink; the Figma `.Badge` set keys on it, there is no state axis, no disabled.
//  · asChild (Radix Slot) merges the look onto a SINGLE element child, so the badge renders
//    AS that <a>/<button>: it gains the [a]:hover tint and becomes focusable → the
//    focus-visible ring (border-ring + ring-ring/50) shows. A bare <span> badge is inert.
//  · aria-invalid is base CSS (destructive border/ring), not a designed badge state → not
//    storied. a11y: the text content (or the child link's text) is the accessible name.
const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Badge',
    variant: 'default',
  },
  // variant + asChild are docgen-surfaced from the component's JSDoc (see BadgeProps in badge.tsx) →
  // type/description/enum come from there. Here: control-overrides + a defaultValue per defaulted prop
  // (the ArgsTable ignores the @default tag). react-docgen doesn't document the inherited `children`.
  argTypes: {
    variant: {
      // inline-radio override (vs the inferred select) — the axis is short enough to lay flat.
      control: 'inline-radio',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
      table: { defaultValue: { summary: '"default"' } },
    },
    children: {
      control: 'text',
      description: 'Badge content — text, a leading icon, or both.',
      table: { type: { summary: 'React.ReactNode' } },
    },
    // asChild swaps the rendered <span> for its single child (Radix Slot) and needs exactly ONE element
    // child — toggling it onto the plain-text stories crashes the Slot. No control; shown in AsChild.
    asChild: {
      control: false,
      table: { defaultValue: { summary: 'false' } },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8113-11356',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A compact status pill; `variant` carries the tone from solid emphasis to quiet outline/ghost. Informative by default — via `asChild` it wraps a real link or button and stays a pill.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Default — the API playground. render spreads {...args} into a complete <Badge>, so every
// prop in the meta argTypes is a live control AND an ArgsTable row (no controls.include — it
// would also filter the table) and the 'code' snippet shows a real example, never an empty {}.
// No play: a bare badge is a static <span> with nothing to drive — the interaction test lives
// on AsChild (the only interactive form), like a radio's exclusion test on its Group story.
export const Default: Story = {
  render: (args) => <Badge {...args} />,
};

// The full `variant` axis side by side — badge's ONLY designed axis (the Figma `.Badge`
// set keys on variant; there's no state axis, no disabled, and the focus/invalid rings are
// base CSS that only surface on the interactive asChild form). So this IS the at-a-glance
// gallery. default/secondary/destructive are solid DS fills, outline a bordered neutral;
// ghost/link the Nova extras.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

// A leading icon (Remix vector, auto-sized to 12px via [&>svg]:size-3); the classic
// "verified" affordance. The icon sits before the label as a child.
export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
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

// Count / number badges: a square-ish pill driven by min-w-5 + tabular mono digits (the
// docs notification-count pattern). Geometry overrides ride on className; the variant
// carries the colour.
export const Count: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-md">
      <Badge className="min-w-5 px-xs font-mono tabular-nums">8</Badge>
      <Badge variant="destructive" className="min-w-5 px-xs font-mono tabular-nums">
        99
      </Badge>
      <Badge variant="outline" className="min-w-5 px-xs font-mono tabular-nums">
        20+
      </Badge>
    </div>
  ),
};

// asChild merges the Badge styling onto its single child element instead of the <span>
// (Radix Slot) — here an <a>, so the badge becomes a real link: focusable with the
// focus-visible ring and the [a]:hover tint. This is badge's only interactive form, so it
// carries the interaction smoke test. controls.include scopes the panel to `variant` (the
// only meaningful control on a fixed link).
export const AsChild: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: ({ variant }) => (
    <Badge asChild variant={variant}>
      <a href="#badge">Link badge</a>
    </Badge>
  ),
  play: async ({ canvas, step }) => {
    const link = canvas.getByRole('link', { name: /link badge/i });

    await step('renders as a real <a> — href + badge slot survive the merge (Slot contract)', async () => {
      await expect(link).toHaveAttribute('href', '#badge');
      await expect(link).toHaveAttribute('data-slot', 'badge');
    });

    // The link is focusable (a bare <span> badge isn't) → it shows the focus-visible ring;
    // blur() drops it so the end state matches a real mouse user (no lingering ring).
    await step('is focusable, and blurring clears the focus', async () => {
      link.focus();
      await expect(link).toHaveFocus();
      link.blur();
      await expect(link).not.toHaveFocus();
    });
  },
};
