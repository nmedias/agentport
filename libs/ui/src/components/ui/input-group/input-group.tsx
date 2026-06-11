'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Token-faithful re-port of the shadcn input-group (radix-nova) into the Agentport DS
// (tokens-reference.md §6). Composite: the GROUP owns the surface, border and
// focus/invalid/disabled treatment; the controls (input/textarea) go borderless and
// addons (icons, text, buttons, kbd) sit beside them. Re-clothed in DS tokens:
//  · the group carries bg-input-background (DS fields are opaque — Input/Textarea
//    precedent); nova leaves it transparent in light mode. Command overrides the
//    surface for its palette look.
//  · text-sm font-medium addon → text-format-label; plain text-sm Text → text-format-body
//    (Medium vs Regular 14, the DS distinction).
//  · gap-2(8)→gap-md, py-1.5(6)→py-sm, pl/pr-2(8)→pl/pr-md, px-2.5(10)→px-md,
//    pl/pr-1.5(6)→pl/pr-sm, pt/pb-3(12)→pt/pb-lg; ring-3→ring-[3px]; radius by NAME.
//  · invalid bubbles border + ring WIDTH + colour (ring-[3px] ring-destructive/20).
//  · disabled:bg-input/50 dropped (DS disabled = opacity); dark: + combobox-content
//    overrides dropped; [&>kbd]:rounded-calc dropped (DS Kbd owns its radius).
// Geometry (h-8/h-6, size-6/8, svg sizes) stays numeric. destructive is a ⚠ placeholder.
function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'group/input-group relative flex h-8 w-full min-w-0 items-center corner-lg border border-input bg-input-background transition-[color,box-shadow] outline-none',
        // the control owns focus; the GROUP shows the ring
        'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
        // invalid bubbles up from any marked child: border + ring (width + colour)
        'has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:ring-[3px]',
        'has-[:disabled]:opacity-50',
        // block-aligned addons (and a textarea control) stack the group vertically
        'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>textarea]:h-auto',
        // nudge the input padding toward whichever addon sits beside it
        'has-[>[data-align=inline-start]]:[&>input]:pl-sm has-[>[data-align=inline-end]]:[&>input]:pr-sm has-[>[data-align=block-start]]:[&>input]:pb-lg has-[>[data-align=block-end]]:[&>input]:pt-lg',
        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-md py-sm text-format-label text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start':
          'order-first pl-md has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]',
        'inline-end':
          'order-last pr-md has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]',
        'block-start':
          'order-first w-full justify-start px-md pt-md group-has-[>input]/input-group:pt-md [.border-b]:pb-md',
        'block-end':
          'order-last w-full justify-start px-md pb-md group-has-[>input]/input-group:pb-md [.border-t]:pt-md',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
);

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

// InputGroupButton maps onto the DS Button's own size scale and forwards the mapped
// size (code↔Figma parity: the Figma .InputGroup/Button nests a real .Button at the
// same size). The Button then carries all geometry; the className below adds only the
// DS delta — corner-sm on xs/icon-xs (the DS Button uses corner-md there), else nothing.
const inputGroupButtonVariants = cva('', {
  variants: {
    size: {
      xs: 'corner-sm',
      sm: '',
      'icon-xs': 'corner-sm',
      'icon-sm': '',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
});

// InputGroup size → DS Button size (xs→xs, sm→default, icon-xs→icon-xs, icon-sm→icon).
const igButtonToButtonSize = {
  xs: 'xs',
  sm: 'default',
  'icon-xs': 'icon-xs',
  'icon-sm': 'icon-sm',
} as const;



function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) {

  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      // Button's icon sizes demand aria-label via a discriminated union; the mapped
      // value is a valid Button size, so cast past it — a11y stays the consumer's job.
      size={igButtonToButtonSize[size ?? 'xs'] as never}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "flex items-center gap-md text-format-body text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'flex-1 corner-none border-0 bg-transparent ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0',
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'flex-1 resize-none corner-none border-0 bg-transparent py-md ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0',
        className
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
