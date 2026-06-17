import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

// shadcn badge on the **radix-nova structure**, re-clothed in DS values
// (tokens-reference.md §6). A single CVA `<span>` (data-slot="badge") with
// `asChild` (Radix Slot) → render as a link/button while keeping the look.
// The Figma `.Badge` set keys on the `variant` axis. DS translation:
//  · rounded-4xl → corner-full   (full pill — the DS radius vocabulary;
//    ALL rounded-* are dead, §6/§2)
//  · text-xs font-medium → text-format-label — no DS format sits at badge's
//    12px sans, so the token is picked by ROLE (label = chip/button text), which
//    snaps the size to 14px (⚠ see notes; a 12px micro-label format is missing).
//  · px-2(8)→px-md · py-0.5(2)→py-2xs · gap-1(4)→gap-xs · icon-side pr-1.5/
//    pl-1.5(6)→pr-sm/pl-sm   (spacing mapped per px-value, §3/§6)
//  · h-5 / [&>svg]:size-3! stay numeric (control + icon geometry, §6)
//  · focus ring = border-ring + ring-ring/50 ring-[3px] (DS ring tokens; the
//    [3px] width is an arbitrary value, kept)
// Colour clothing reconciled to the live `.Badge` Figma bindings (2026-06-17):
//  · default → bg-primary-fill (dark primary surface) + text-primary-ink
//  · secondary → bg-secondary + text-secondary-ink
//  · destructive → SOLID bg-destructive + text-destructive-ink (Figma replaced
//    the former /10 tint with a full-opacity fill; hover deepened accordingly)
//  · outline → border-border + text-ink
//  · ghost → text-ink with muted-fill/muted-ink hover
//  · link → text-primary (accent text token; value-only change, name unchanged)
// `ghost`/`link` are Nova-baseline extras (denser source than the stock doc's
// 4 variants); kept on DS tokens. dark: dropped.
const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-xs overflow-hidden corner-full border border-transparent px-md py-2xs text-format-label whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-sm has-data-[icon=inline-start]:pl-sm aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          'bg-primary-fill text-primary-ink [a]:hover:bg-primary-fill/80',
        secondary:
          'bg-secondary text-secondary-ink [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive text-destructive-ink focus-visible:ring-destructive/20 [a]:hover:bg-destructive/80',
        outline:
          'border-border text-ink [a]:hover:bg-muted-fill [a]:hover:text-muted-ink',
        ghost: 'text-ink hover:bg-muted-fill hover:text-muted-ink',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
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
