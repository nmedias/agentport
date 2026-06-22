'use client';

import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';
import {
  toggleVariants,
  type ToggleVariant,
  type ToggleSize,
} from '@/components/ui/toggle';

// variant/size propagate Root → Item via context (the ToggleGroup idiom — an item picks up the group's
// look unless it overrides). `spacing` drives the gap: >0 = separate pills, 0 = a connected/segmented
// bar (items lose their inner corners + double borders). `orientation` flips the axis.
const ToggleGroupContext = React.createContext<{
  variant?: ToggleVariant;
  size?: ToggleSize;
  spacing?: number;
  orientation?: 'horizontal' | 'vertical';
}>({
  size: 'default',
  variant: 'default',
  spacing: 2,
  orientation: 'horizontal',
});

// Curated DS props (FLAT + JSDoc so react-docgen surfaces them). They are intersected with the Radix
// Root surface below — NOT `interface extends`, because Radix's ToggleGroup.Root prop type is a
// DISCRIMINATED UNION on `type` (single | multiple), and an interface can only extend an record type.
// `type` (single | multiple), value / defaultValue / onValueChange / disabled / loop … come through
// the Radix base; the union keeps `type` correctly required + the value/onValueChange shapes matched.
interface ToggleGroupOwnProps {
  /**
   * Visual style applied to every item — transparent ghost (`default`) or bordered (`outline`).
   * @default "default"
   */
  variant?: ToggleVariant;
  /**
   * Size applied to every item.
   * @default "default"
   */
  size?: ToggleSize;
  /**
   * Gap between items, in `--spacing` units. `0` renders a connected/segmented bar (shared border,
   * only the outer corners rounded); any positive value renders separate pills.
   * @default 2
   */
  spacing?: number;
  /**
   * Layout axis of the group.
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
}

type ToggleGroupProps = React.ComponentProps<
  typeof ToggleGroupPrimitive.Root
> &
  ToggleGroupOwnProps;

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 2,
  orientation = 'horizontal',
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      style={{ '--gap': spacing } as React.CSSProperties}
      className={cn(
        'group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] corner-lg data-[size=sm]:corner-md data-vertical:flex-col data-vertical:items-stretch',
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

interface ToggleGroupItemProps
  extends React.ComponentProps<typeof ToggleGroupPrimitive.Item> {
  /**
   * Per-item visual style override. Falls back to the group's `variant`.
   * @default "default"
   */
  variant?: ToggleVariant;
  /**
   * Per-item size override. Falls back to the group's `size`.
   * @default "default"
   */
  size?: ToggleSize;
}

function ToggleGroupItem({
  className,
  children,
  variant = 'default',
  size = 'default',
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        'shrink-0 group-data-[spacing=0]/toggle-group:corner-none group-data-[spacing=0]/toggle-group:px-md focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-sm group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-sm group-data-horizontal/toggle-group:data-[spacing=0]:first:corner-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:corner-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:corner-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:corner-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t',
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
export type { ToggleGroupProps, ToggleGroupItemProps };
