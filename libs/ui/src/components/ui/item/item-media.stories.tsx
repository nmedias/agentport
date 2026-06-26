import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiShieldCheckLine } from '@remixicon/react';

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from './item';

// Second Autodocs page for the leading-media part. meta.component = ItemMedia → its own ArgsTable; the
// `variant` (default/icon/image) prop comes from ItemMediaProps' JSDoc via react-docgen (see item.tsx).
// ItemMedia sizes its content by kind — `icon` auto-sizes a leading glyph to 16px, `image` is a fixed,
// cover-cropped thumbnail that shrinks with the item size, `default` is a bare slot — so each render adapts
// the child to the kind. An ItemMedia only makes sense inside an Item row, so every example wraps one. The
// row container API (variant/size/asChild) lives on the [`UI/Item`](?path=/docs/ui-item--docs) page.
const meta: Meta<typeof ItemMedia> = {
  title: 'UI/Item/ItemMedia',
  component: ItemMedia,
  tags: ['autodocs'],
  args: { variant: 'icon' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'icon', 'image'],
      table: { defaultValue: { summary: '"default"' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The leading slot of an **`Item`** row. Its one axis is `variant`: **`icon`** auto-sizes a leading vector to 16px, **`image`** renders a fixed-size (`size-10`), cover-cropped thumbnail that shrinks with the item `size`, and **`default`** is a bare slot for anything else. Always lives inside an `Item` — the row API is documented on the [`UI/Item`](?path=/docs/ui-item--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ItemMedia>;

// API playground — the single `variant` control on a real media slot inside a fixed Item scaffold. The
// child adapts to the kind (an <img> for image, a Remix vector otherwise). Display-only → no play.
export const Default: Story = {
  render: ({ variant }) => (
    <Item variant="outline" className="w-full max-w-md">
      <ItemMedia variant={variant}>
        {variant === 'image' ? (
          <img
            src="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=80&h=80&fit=crop"
            alt=""
          />
        ) : (
          <RiShieldCheckLine />
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>invoice</ItemTitle>
        <ItemDescription>Leading {variant} media.</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

// The three media kinds side by side — `icon` (sized glyph), `image` (cover-cropped thumbnail), and
// `default` (a bare slot, here holding a mono initial).
export const Kinds: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-lg">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <RiShieldCheckLine />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>icon</ItemTitle>
          <ItemDescription>Glyph auto-sized to 16px.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="image">
          <img
            src="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=80&h=80&fit=crop"
            alt=""
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>image</ItemTitle>
          <ItemDescription>Fixed, cover-cropped thumbnail.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="default">
          <span className="text-format-data-sm text-muted-ink">IN</span>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>default</ItemTitle>
          <ItemDescription>Bare slot — no sizing applied.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
};
