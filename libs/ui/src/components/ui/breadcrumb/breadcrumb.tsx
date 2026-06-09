import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { RiArrowRightSLine, RiMoreLine } from '@remixicon/react';

import { cn } from '@/lib/utils';

// shadcn breadcrumb on the **radix-nova structure**, re-clothed in DS values
// (tokens-reference.md §6). Density follows the radix-nova baseline (mapped by
// NAME to DS tokens, not Nova's raw scale):
//  · List gap-1.5 (6px) → gap-sm; sm:gap-2.5 already gone (Nova dropped it too) ·
//    Item gap tightened 1.5→1 (6px→4px) → gap-xs · Ellipsis hit-area shrank
//    size-9→size-5 (36→20px) with icon-agnostic [&>svg]:size-4 (Nova form).
//  · text-sm → text-body (Page's redundant font-normal skipped — text-body owns
//    the weight) · break-words → Nova's v4 wrap-break-word (same CSS) · separator
//    size-3.5 stays numeric · lucide → Remix RiArrowRightSLine/RiMoreLine.
//  Multi-part composition: List sets the default muted colour, Link inherits it and
//  darkens on hover, Page is the current (foreground) leaf.

function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'flex flex-wrap items-center gap-sm wrap-break-word text-body text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-xs', className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('text-foreground', className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <RiArrowRightSLine />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        'flex size-5 items-center justify-center [&>svg]:size-4',
        className
      )}
      {...props}
    >
      <RiMoreLine />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
