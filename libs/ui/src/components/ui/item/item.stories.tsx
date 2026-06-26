import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import {
  RiArrowRightSLine,
  RiDownloadLine,
  RiShieldCheckLine,
  RiVerifiedBadgeFill,
} from '@remixicon/react';

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './item';
import { Button } from '../button';
import { Badge } from '../badge';

// Item contract — a multi-part list-row composite (no single root; each part is a data-slot div):
//  · Item (data-slot="item") is the row container — two axes: variant (default/outline/muted →
//    the surface) × size (default/sm/xs → density). data-variant/data-size drive descendant
//    group-data-* tweaks (e.g. xs shrinks the image media + tightens content gap).
//  · ItemMedia (variant default/icon/image) is the leading slot; ItemContent stacks
//    ItemTitle (label format) + ItemDescription (body, muted ink); ItemActions trails.
//    ItemHeader/ItemFooter span the full row width (basis-full); ItemGroup (role="list")
//    stacks items with ItemSeparator between them.
//  · asChild (Radix Slot) renders the row AS its single child — wrap an <a> for a fully
//    clickable link row: it becomes focusable (focus-visible ring) and gains the [a]:hover tint.
//  · a11y: the visible title/description text is the accessible name. As a link row, the <a>'s
//    content names it; icon-only media needs its own label at the call site.
const meta: Meta<typeof Item> = {
  title: 'UI/Item',
  component: Item,
  tags: ['autodocs'],
  args: {
    variant: 'outline',
    size: 'default',
  },
  // variant + size + asChild are docgen-surfaced from the component's JSDoc (see ItemProps in item.tsx) →
  // type/description/enum come from there. Here: control-overrides + a defaultValue per defaulted prop.
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline', 'muted'],
      table: { defaultValue: { summary: '"default"' } },
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm', 'xs'],
      table: { defaultValue: { summary: '"default"' } },
    },
    // asChild swaps the rendered <div> for its single child (Radix Slot); toggling it onto the
    // multi-child playground crashes the Slot → no control. Shown in the Link story.
    asChild: {
      control: false,
      table: { defaultValue: { summary: 'false' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A flexible list-row composite — a leading **`ItemMedia`** (icon/image), an **`ItemContent`** (title + description), and trailing **`ItemActions`**, composed inside an **`Item`** whose two axes are `variant` (default/outline/muted) and `size` (default/sm/xs). Stack rows in an **`ItemGroup`** with **`ItemSeparator`**, or wrap an `<a>` via **`asChild`** for a clickable link row — the interactive form that gains the `[a]:hover` tint and the focus ring (see the **Link** and **All States** stories). The leading media kinds are documented on the [`UI/Item/ItemMedia`](?path=/docs/ui-item-itemmedia--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Item>;

// Default — the API playground. variant + size are live controls; the composition stays fixed
// (media + content + actions) so the controls show their effect on a real row. No play: a bare
// item is static — the interaction test lives on Link (the only interactive form).
export const Default: Story = {
  render: (args) => (
    <Item {...args} className="w-full max-w-md">
      <ItemMedia variant="icon">
        <RiShieldCheckLine />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Schema synchronised</ItemTitle>
        <ItemDescription>
          All record types are up to date with the connected system.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          View
        </Button>
      </ItemActions>
    </Item>
  ),
};

// The full `variant` axis — default sits borderless on the page, outline adds a hairline,
// muted tints the row. This is the surface gallery.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-lg">
      <Item variant="default">
        <ItemContent>
          <ItemTitle>Default</ItemTitle>
          <ItemDescription>Borderless — sits directly on the page.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Outline</ItemTitle>
          <ItemDescription>A hairline border frames the row.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Muted</ItemTitle>
          <ItemDescription>A soft fill tints the whole row.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
};

// The full `size` axis — default/sm share the comfortable spacing, xs is the compact menu-row
// density (also shrinks the content gap). The image media tracks the size (size-10 → 8 → 6).
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-lg">
      {(['default', 'sm', 'xs'] as const).map((size) => (
        <Item key={size} variant="outline" size={size}>
          <ItemMedia variant="icon">
            <RiShieldCheckLine />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Size {size}</ItemTitle>
            <ItemDescription>Density follows the size axis.</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

// An icon leading slot (ItemMedia variant="icon" auto-sizes the Remix vector to 16px) plus a
// trailing action button and a status Badge — the canonical "row with affordance" composition.
export const WithActions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Item variant="outline" className="w-full max-w-md">
      <ItemMedia variant="icon">
        <RiVerifiedBadgeFill />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          Connection verified
          <Badge variant="secondary">SQL</Badge>
        </ItemTitle>
        <ItemDescription>The system responded to the handshake.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          <RiDownloadLine />
          Export
        </Button>
      </ItemActions>
    </Item>
  ),
};

// The image media variant — a fixed-size, cover-cropped thumbnail (size-10) that shrinks with
// the item size. Plain <img> (no Avatar component needed).
export const WithImage: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Item variant="outline" className="w-full max-w-md">
      <ItemMedia variant="image">
        <img
          src="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=80&h=80&fit=crop"
          alt=""
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Whiskers</ItemTitle>
        <ItemDescription>Last indexed 3 minutes ago.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="sm">
          Open
        </Button>
      </ItemActions>
    </Item>
  ),
};

// ItemGroup (role="list") stacks rows with an ItemSeparator between them — the list pattern the
// explorer list-navigation builds on. Each Item is a role="listitem" at the call site (the
// list/listitem pairing is the consumer's a11y contract); the decorative ItemSeparator is role="none".
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ItemGroup className="w-full max-w-md">
      <Item role="listitem" variant="muted">
        <ItemMedia variant="icon">
          <RiShieldCheckLine />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>invoice</ItemTitle>
          <ItemDescription>9 required fields</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="secondary">42</Badge>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item role="listitem" variant="muted">
        <ItemMedia variant="icon">
          <RiShieldCheckLine />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>contract</ItemTitle>
          <ItemDescription>13 required fields</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="secondary">17</Badge>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
};

// ItemHeader/ItemFooter span the full row width (basis-full → wrap onto their own line), framing
// the media+content block with a top label row and a bottom action row.
export const WithHeaderFooter: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Item variant="outline" className="w-full max-w-md">
      <ItemHeader>
        <ItemDescription>Record type</ItemDescription>
        <Badge variant="outline">read-only</Badge>
      </ItemHeader>
      <ItemMedia variant="icon">
        <RiShieldCheckLine />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>invoice</ItemTitle>
        <ItemDescription>Derived from the connected data source.</ItemDescription>
      </ItemContent>
      <ItemFooter>
        <ItemDescription>Updated just now</ItemDescription>
        <Button variant="ghost" size="sm">
          Details
        </Button>
      </ItemFooter>
    </Item>
  ),
};

// asChild renders the Item AS its single child — here an <a>, so the whole row is one clickable,
// focusable link (focus-visible ring + [a]:hover tint). Item's only interactive form → it carries
// the interaction smoke test. controls.include scopes the panel to the meaningful axes.
export const Link: Story = {
  parameters: { controls: { include: ['variant', 'size'] } },
  render: ({ variant, size }) => (
    <Item asChild variant={variant} size={size} className="w-full max-w-md">
      <a href="#invoice">
        <ItemMedia variant="icon">
          <RiShieldCheckLine />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Open invoice type</ItemTitle>
          <ItemDescription>Jump to the type in the explorer.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <RiArrowRightSLine className="size-4 text-muted-ink" />
        </ItemActions>
      </a>
    </Item>
  ),
  play: async ({ canvas, step }) => {
    const link = canvas.getByRole('link', { name: /open invoice type/i });

    await step('renders as a real <a> — href + item slot survive the Slot merge', async () => {
      await expect(link).toHaveAttribute('href', '#invoice');
      await expect(link).toHaveAttribute('data-slot', 'item');
    });

    // The link is focusable (a bare <div> item isn't) → it shows the focus-visible ring;
    // blur() drops it so the end state matches a real mouse user (no lingering ring).
    await step('is focusable, and blurring clears the focus', async () => {
      link.focus();
      await expect(link).toHaveFocus();
      link.blur();
      await expect(link).not.toHaveFocus();
    });
  },
};

// The interaction-state gallery — every state of the interactive (asChild link) form, side by side.
// Item itself is a static <div>: hover (`[a]:hover:bg-muted-fill`) and focus only fire on the focusable
// link form, so every cell is an asChild <a>. Hover/Focus rows are forced via the pseudo-states addon
// (targeting each cell's id). `selected` is NOT a primitive state (Item stays stock-faithful) — it's the
// call-site contract: `aria-current` + the DS accent tint, exactly what the ListNavigator block applies.
const ST_VARIANTS = ['default', 'outline', 'muted'] as const;
const ST_ROWS = [
  { key: 'base', label: 'Base' },
  { key: 'hover', label: 'Hover' },
  { key: 'focus', label: 'Focus' },
  { key: 'selected', label: 'Selected' },
] as const;

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: {
      hover: ST_VARIANTS.map((v) => `#it-${v}-hover`),
      focusVisible: ST_VARIANTS.map((v) => `#it-${v}-focus`),
    },
  },
  render: () => (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex items-center gap-lg">
        <span className="w-20 shrink-0" />
        {ST_VARIANTS.map((v) => (
          <span key={v} className="flex-1 text-format-eyebrow text-muted-ink">
            {v}
          </span>
        ))}
      </div>
      {ST_ROWS.map((r) => (
        <div key={r.key} className="flex items-center gap-lg">
          <span className="w-20 shrink-0 text-format-eyebrow text-muted-ink">{r.label}</span>
          {ST_VARIANTS.map((v) => (
            <div key={v} className="min-w-0 flex-1">
              <Item
                asChild
                id={`it-${v}-${r.key}`}
                variant={v}
                aria-current={r.key === 'selected' ? 'true' : undefined}
                className={r.key === 'selected' ? 'bg-accent-fill text-accent-ink' : undefined}
              >
                <a href="#state">
                  <ItemMedia variant="icon">
                    <RiShieldCheckLine />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>invoice</ItemTitle>
                  </ItemContent>
                </a>
              </Item>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
