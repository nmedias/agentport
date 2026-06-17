import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// shadcn button on the **radix-nova structure**, re-clothed in DS values
// (tokens-reference.md §6). Adopted from Nova: the denser size ladder (h-8/7/9,
// + xs and the icon-xs/sm/lg steps), per-size icon sizing via
// [&_svg:not([class*='size-'])]:size-N, ring-3 focus, active press, aria-invalid
// + aria-expanded affordances. Kept on DS conventions (NOT Nova's raw values):
//  · radius by NAME → DS scale (corner-lg=8, small sizes corner-md=6), not
//    Nova's parametric --radius=10 · text stays text-format-label (DS has no <14px sans).
// Colour clothing synced to the Figma .Button set (2026-06-17 -fill/-ink rework):
//    default = primary-fill surface + primary-ink text · outline/ghost hover =
//    accent-fill + accent-ink (selection tint) · secondary = secondary + -ink ·
//    destructive solid + destructive-ink text. Figma drives hover/active via a
//    state-layer overlay; here expressed as the DS /opacity idiom (see notes).
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap corner-lg text-format-label transition-all active:translate-y-px disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  {
    variants: {
      variant: {
        default:
          'bg-primary-fill text-primary-ink hover:bg-primary-fill/90 active:bg-primary-fill/90',
        destructive:
          'bg-destructive text-destructive-ink hover:bg-destructive/90 active:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border bg-surface hover:bg-accent-fill hover:text-accent-ink active:bg-accent-fill active:text-accent-ink aria-expanded:bg-accent-fill aria-expanded:text-accent-ink',
        secondary:
          'bg-secondary text-secondary-ink hover:bg-secondary/80 active:bg-secondary/80',
        ghost:
          'hover:bg-accent-fill hover:text-accent-ink active:bg-accent-fill active:text-accent-ink aria-expanded:bg-accent-fill aria-expanded:text-accent-ink',
        link: 'text-primary underline-offset-4 hover:underline active:underline',
      },
      size: {
        default: 'h-8 gap-sm px-md has-[>svg]:px-sm',
        xs: "h-6 gap-xs corner-md px-sm [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-xs corner-md px-md has-[>svg]:px-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-sm px-md has-[>svg]:px-sm',
        icon: 'size-8',
        'icon-xs': "size-6 corner-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': "size-7 corner-md [&_svg:not([class*='size-'])]:size-3.5",
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
