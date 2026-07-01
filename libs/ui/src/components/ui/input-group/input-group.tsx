'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Public API. The curated CVA props are re-declared flat with JSDoc so react-docgen surfaces them
// (/docgen-props): InputGroupAddon's `align` and InputGroupButton's `size`. The remaining parts
// (InputGroup, InputGroupText, InputGroupInput, InputGroupTextarea) are plain passthroughs.
function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'group/input-group relative flex h-8 w-full min-w-0 items-center corner-lg border border-input-border bg-input-fill transition-[color,box-shadow] outline-none',
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

// Public axis authored once here; the cva object is checked against it via `satisfies` (below) and the
// prop is typed by it, so the docgen-readable union can't drift from the cva.
type InputGroupAddonAlign =
  | 'inline-start'
  | 'inline-end'
  | 'block-start'
  | 'block-end';

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-md py-sm text-format-label-md text-muted-ink select-none group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-4",
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
      } satisfies Record<InputGroupAddonAlign, string>,
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
);

interface InputGroupAddonProps extends React.ComponentProps<'div'> {
  /**
   * Where the addon sits relative to the control — `inline-start`/`inline-end` beside it,
   * `block-start`/`block-end` as a toolbar above/below (the group stacks vertically).
   * @default "inline-start"
   */
  align?: InputGroupAddonAlign;
}

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: InputGroupAddonProps) {
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

// Public axis authored once here; the cva object is checked against it via `satisfies` (below) and the
// prop is typed by it, so the docgen-readable union can't drift from the cva.
type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm';

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
    } satisfies Record<InputGroupButtonSize, string>,
  },
  defaultVariants: {
    size: 'xs',
  },
});

// InputGroup size → DS Button (icon flag + size scale): xs→{xs}, sm→{default},
// icon-xs→{icon, xs}, icon-sm→{icon, sm}.
const igButtonToButton = {
  xs: { icon: false, size: 'xs' },
  sm: { icon: false, size: 'default' },
  'icon-xs': { icon: true, size: 'xs' },
  'icon-sm': { icon: true, size: 'sm' },
} as const satisfies Record<
  InputGroupButtonSize,
  { icon: boolean; size?: string }
>;

interface InputGroupButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'size' | 'icon'> {
  /**
   * Button size on the InputGroup's own scale — `xs`/`sm` text buttons, `icon-xs`/`icon-sm`
   * icon-only. Mapped onto the DS Button's size + icon flag.
   * @default "xs"
   */
  size?: InputGroupButtonSize;
}

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: InputGroupButtonProps) {
  const mapped = igButtonToButton[size ?? 'xs'];

  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      // Button's `icon` carries an a11y discriminated union (icon ⟹ aria-label); InputGroupButton
      // forwards the mapped flag + size and leaves the accessible name to the consumer → cast past it.
      icon={mapped.icon as never}
      size={mapped.size}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "flex items-center gap-md text-format-body text-muted-ink [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
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
export type { InputGroupAddonProps, InputGroupButtonProps };
