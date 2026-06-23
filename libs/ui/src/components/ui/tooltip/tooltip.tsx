import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// react-docgen surfaces the public API from FLAT own props with JSDoc (Omit+re-declare the curated
// Radix props; the default propFilter drops node_modules-declared props). Documented here:
//  · TooltipProps        — the Root open/timing API (open/defaultOpen/onOpenChange/delayDuration).
//  · TooltipContentProps — the placement API on the styled part (side/sideOffset/align/alignOffset).
// Provider/Trigger stay pass-through (no curated API → no own-props interface).

/**
 * Wraps a tree so its tooltips share one open-delay timer. Required ancestor of every Tooltip.
 * Re-export of Radix `Tooltip.Provider`; the only commonly-set prop is `delayDuration`.
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

interface TooltipProps
  extends Omit<
    React.ComponentProps<typeof TooltipPrimitive.Root>,
    'open' | 'defaultOpen' | 'onOpenChange' | 'delayDuration'
  > {
  /** Controlled open state (pair with `onOpenChange`). */
  open?: boolean;
  /**
   * Open state on first render for an uncontrolled tooltip.
   * @default false
   */
  defaultOpen?: boolean;
  /** Fires when the open state changes (controlled or uncontrolled). */
  onOpenChange?: (open: boolean) => void;
  /** Hover delay in ms before the tooltip opens; overrides the Provider's value for this tooltip. */
  delayDuration?: number;
}

/** A single tooltip: pairs a `TooltipTrigger` with a `TooltipContent`. Needs a `TooltipProvider` ancestor. */
function Tooltip({ ...props }: TooltipProps) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

/**
 * The element the tooltip describes. Use `asChild` to render the look onto your own button/link
 * (Radix Slot) — that child becomes the trigger and keeps its own accessible name.
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

interface TooltipContentProps
  extends Omit<
    React.ComponentProps<typeof TooltipPrimitive.Content>,
    | 'side'
    | 'sideOffset'
    | 'align'
    | 'alignOffset'
    | 'avoidCollisions'
    | 'collisionPadding'
    | 'sticky'
    | 'hideWhenDetached'
    | 'arrowPadding'
  > {
  /**
   * Preferred side of the trigger to render on (flips to stay in view unless `avoidCollisions` is off).
   * @default "top"
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Distance in px between the trigger and the tooltip.
   * @default 0
   */
  sideOffset?: number;
  /**
   * Alignment against the trigger along the chosen side.
   * @default "center"
   */
  align?: 'start' | 'center' | 'end';
  /** Offset in px from the `align` edge. @default 0 */
  alignOffset?: number;
  /**
   * Flip/shift the tooltip to keep it inside the viewport.
   * @default true
   */
  avoidCollisions?: boolean;
  /** Padding (px) kept from the viewport edge while avoiding collisions. @default 0 */
  collisionPadding?:
    | number
    | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  /**
   * Keep the tooltip attached to the trigger while it is partially scrolled out of view.
   * @default "partial"
   */
  sticky?: 'partial' | 'always';
  /** Hide the tooltip when the trigger is fully occluded. @default false */
  hideWhenDetached?: boolean;
  /** Padding (px) between the arrow and the content's rounded corners. @default 0 */
  arrowPadding?: number;
}

/**
 * The floating chip — a raised `dialog-fill` surface with a `shadow-elevation` and a diamond arrow.
 * Portals to `document.body` and mounts only while open.
 */
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-sm corner-md border bg-dialog-fill px-lg py-sm text-format-label text-dialog-ink shadow-elevation has-data-[slot=kbd]:pr-sm data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:corner-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-dialog-fill fill-dialog-fill" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
export type { TooltipProps, TooltipContentProps };
