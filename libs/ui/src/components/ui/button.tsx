import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Token-faithful port of the shadcn button to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6):
//  text-sm font-medium → text-label · shadow-xs dropped (DS is flat) ·
//  gap/padding mapped by px-value to space tokens · control heights stay numeric.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-md whitespace-nowrap rounded-md text-label transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-xl py-md has-[>svg]:px-lg',
        sm: 'h-8 rounded-md gap-sm px-lg has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-2xl has-[>svg]:px-xl',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonBaseProps = Omit<
  React.ComponentProps<'button'>,
  'aria-label' | 'aria-labelledby'
> &
  Omit<VariantProps<typeof buttonVariants>, 'size'> & {
    asChild?: boolean;
  };

// Icon-only buttons (size="icon") carry no text, so an accessible name is
// mandatory: require aria-label or aria-labelledby at the type level.
type ButtonProps = ButtonBaseProps &
  (
    | {
        size?: Exclude<NonNullable<VariantProps<typeof buttonVariants>['size']>, 'icon'>;
        'aria-label'?: string;
        'aria-labelledby'?: string;
      }
    | { size: 'icon'; 'aria-label': string; 'aria-labelledby'?: string }
    | { size: 'icon'; 'aria-labelledby': string; 'aria-label'?: string }
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
