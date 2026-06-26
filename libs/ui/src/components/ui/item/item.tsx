import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        'group/item-group flex w-full flex-col gap-xl has-data-[size=sm]:gap-lg has-data-[size=xs]:gap-md',
        className
      )}
      {...props}
    />
  );
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn('my-md', className)}
      {...props}
    />
  );
}

// Public axes authored once here; the cva object is checked against them via `satisfies` (below) and the
// props are typed by them, so the docgen-readable unions can't drift from the cva.
type ItemVariant = 'default' | 'outline' | 'muted';
type ItemSize = 'default' | 'sm' | 'xs';

const itemVariants = cva(
  'group/item flex w-full flex-wrap items-center corner-lg border text-format-body transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted-fill',
  {
    variants: {
      variant: {
        default: 'border-transparent',
        outline: 'border-border',
        muted: 'border-transparent bg-muted-fill/50',
      } as const satisfies Record<ItemVariant, string>,
      size: {
        default: 'gap-lg px-lg py-lg',
        sm: 'gap-lg px-lg py-lg',
        xs: 'gap-md px-md py-md in-data-[slot=dropdown-menu-content]:p-0',
      } as const satisfies Record<ItemSize, string>,
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Own DS props, FLAT with JSDoc so react-docgen surfaces them (/docgen-props): `variant`/`size` typed by
// the local named aliases (docgen resolves a named alias to its union → working select; the generic
// VariantProps<…> it does NOT resolve). `asChild` comes from Radix Slot — re-declared flat so docgen
// describes it. The rest of the <div> surface passes through via `...props`.
interface ItemProps extends React.ComponentProps<'div'> {
  /**
   * Surface style — `default` is borderless (sits on the page), `outline` adds a hairline border,
   * `muted` tints the row with a soft fill.
   * @default "default"
   */
  variant?: ItemVariant;
  /**
   * Density — `default` is a comfortable row, `sm` matches it, `xs` is the compact menu-row spacing.
   * @default "default"
   */
  size?: ItemSize;
  /**
   * Render the styling onto a single child element instead of a `<div>` (Radix Slot) — e.g. wrap an
   * `<a>` to get a fully clickable link row (adds the `[a]:hover` affordance).
   * @default false
   */
  asChild?: boolean;
}

function Item({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ItemProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size }), className)}
      {...props}
    />
  );
}

type ItemMediaVariant = 'default' | 'icon' | 'image';

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-md group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          'size-10 overflow-hidden corner-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover',
      } as const satisfies Record<ItemMediaVariant, string>,
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ItemMediaProps extends React.ComponentProps<'div'> {
  /**
   * Media kind — `default` for a bare slot, `icon` sizes a leading glyph, `image` is a fixed-size,
   * cover-cropped thumbnail/avatar that shrinks with the item `size`.
   * @default "default"
   */
  variant?: ItemMediaVariant;
}

function ItemMedia({ className, variant = 'default', ...props }: ItemMediaProps) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        'flex flex-1 flex-col gap-xs group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none',
        className
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        'line-clamp-1 flex w-fit items-center gap-md text-format-label underline-offset-4',
        className
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        'line-clamp-2 text-left text-format-body text-muted-ink [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn('flex items-center gap-md', className)}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        'flex basis-full items-center justify-between gap-md',
        className
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        'flex basis-full items-center justify-between gap-md',
        className
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
  itemVariants,
  itemMediaVariants,
};
export type { ItemProps, ItemMediaProps };
