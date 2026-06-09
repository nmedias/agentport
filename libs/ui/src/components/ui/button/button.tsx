import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// shadcn button on the **radix-nova structure**, re-clothed in DS values
// (tokens-reference.md §6). Adopted from Nova: the denser size ladder (h-8/7/9,
// + xs and the icon-xs/sm/lg steps), per-size icon sizing via
// [&_svg:not([class*='size-'])]:size-N, ring-3 focus, active press, aria-invalid
// + aria-expanded affordances. Kept on DS conventions (NOT Nova's raw values):
//  · radius by NAME → DS scale (rounded-lg=8, small sizes rounded-md=6), not
//    Nova's parametric --radius=10 · hover stays the cyan accent (§1 two-cyan /
//    accent=selection), not Nova's neutral bg-muted · destructive stays the DS
//    solid fill, not Nova's tint · text stays text-label (DS has no <14px sans).
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-label transition-all active:translate-y-px disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline active:underline',
      },
      size: {
        default: 'h-8 gap-sm px-md has-[>svg]:px-sm',
        xs: "h-6 gap-xs rounded-md px-sm [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-xs rounded-md px-md has-[>svg]:px-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-sm px-md has-[>svg]:px-sm',
        icon: 'size-8',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type IconSize = 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
type TextSize = Exclude<
  NonNullable<VariantProps<typeof buttonVariants>['size']>,
  IconSize
>;

type ButtonBaseProps = Omit<
  React.ComponentProps<'button'>,
  'aria-label' | 'aria-labelledby'
> &
  Omit<VariantProps<typeof buttonVariants>, 'size'> & {
    asChild?: boolean;
  };

// Icon-only buttons (every `icon*` size) carry no text, so an accessible name is
// mandatory: require aria-label or aria-labelledby at the type level.
type ButtonProps = ButtonBaseProps &
  (
    | {
        size?: TextSize;
        'aria-label'?: string;
        'aria-labelledby'?: string;
      }
    | { size: IconSize; 'aria-label': string; 'aria-labelledby'?: string }
    | { size: IconSize; 'aria-labelledby': string; 'aria-label'?: string }
  );

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
