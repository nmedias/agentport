import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Public axes authored once here so the docgen-readable unions can't drift from the cva object
// (checked via `satisfies` below, and the props are typed by these aliases — docgen resolves a named
// alias to its union, but not a generic like VariantProps<…>['variant']).
type ToggleVariant = 'default' | 'outline';
type ToggleSize = 'default' | 'sm' | 'lg';

const toggleVariants = cva(
  // Selected (on) state = the muted fill (data-[state=on] for the standalone Toggle, aria-pressed when
  // it is a ToggleGroup item — Radix sets aria-pressed, not data-state, on group items). Selection is
  // NOT colour-only: the data-state / aria-pressed attribute carries it for assistive tech.
  "group/toggle inline-flex items-center justify-center gap-xs corner-lg text-format-label whitespace-nowrap transition-all outline-none hover:bg-muted-fill hover:text-ink focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted-fill data-[state=on]:bg-muted-fill [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input-border bg-transparent hover:bg-muted-fill',
      } as const satisfies Record<ToggleVariant, string>,
      size: {
        default:
          'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-md has-data-[icon=inline-start]:pl-md',
        sm: 'h-7 min-w-7 corner-md px-2.5 has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm [&_svg:not([class*=size-])]:size-3.5',
        lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-md has-data-[icon=inline-start]:pl-md',
      } as const satisfies Record<ToggleSize, string>,
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Own DS props, FLAT with JSDoc so react-docgen surfaces them (/docgen-props): `variant`/`size` typed
// by the local named aliases. The rest of the Radix Toggle.Root surface (pressed / defaultPressed /
// onPressedChange / disabled …) passes through via `...props` on the base type.
interface ToggleProps
  extends React.ComponentProps<typeof TogglePrimitive.Root> {
  /**
   * Visual style — a transparent ghost (`default`) or a bordered field (`outline`).
   * @default "default"
   */
  variant?: ToggleVariant;
  /**
   * Control size — sets height, min-width and icon scale.
   * @default "default"
   */
  size?: ToggleSize;
}

function Toggle({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
export type { ToggleProps, ToggleVariant, ToggleSize };
