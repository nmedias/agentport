import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

// Public axis authored once here; the cva object is checked against it via `satisfies` (below) and the
// prop is typed by it, so the docgen-readable union can't drift from the cva. variant — the only axis.
type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link';

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-xs overflow-hidden corner-full border border-transparent px-md py-2xs text-format-label-md whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          'bg-primary-fill text-primary-ink [a]:hover:bg-primary-fill/80',
        secondary:
          'bg-secondary-fill text-secondary-ink [a]:hover:bg-secondary-fill/80',
        destructive:
          'bg-destructive text-destructive-ink focus-visible:ring-destructive/20 [a]:hover:bg-destructive/80',
        outline:
          'border-border text-ink [a]:hover:bg-muted-fill [a]:hover:text-muted-ink',
        ghost: 'text-ink hover:bg-muted-fill hover:text-muted-ink',
        link: 'text-primary underline-offset-4 hover:underline',
      } as const satisfies Record<BadgeVariant, string>,
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Own DS props, FLAT with JSDoc so react-docgen surfaces them (/docgen-props): `variant` typed by the
// local named alias (docgen resolves a named alias to its union → working select; a generic like
// VariantProps<…>['variant'] it does NOT resolve). `asChild` comes from Radix Slot — re-declared flat so
// docgen describes it. The rest of the <span> surface passes through via `...props`.
interface BadgeProps extends React.ComponentProps<'span'> {
  /**
   * Visual style — solid DS fills (`default`/`secondary`/`destructive`), a bordered neutral (`outline`),
   * or the Nova-baseline extras (`ghost`/`link`).
   * @default "default"
   */
  variant?: BadgeVariant;
  /**
   * Render the styling onto a single child element instead of a `<span>` (Radix Slot) — e.g. wrap an
   * `<a>` to get a real link badge.
   * @default false
   */
  asChild?: boolean;
}

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
