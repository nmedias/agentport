import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

/**
 * Popover root — a Radix Popover that floats a single raised panel anchored to its trigger.
 * Pass-through wrapper over `PopoverPrimitive.Root`; compose with `PopoverTrigger` /
 * `PopoverContent` (and optionally `PopoverAnchor`). State props (`open`, `defaultOpen`,
 * `onOpenChange`, `modal`) are forwarded to Radix.
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/**
 * The element that toggles the popover open. Use `asChild` to render your own control
 * (e.g. a `Button`) as the trigger; Radix forwards `aria-expanded` / `aria-controls` to it.
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

interface PopoverContentProps
  extends Omit<
    React.ComponentProps<typeof PopoverPrimitive.Content>,
    'align' | 'sideOffset'
  > {
  /** Edge alignment of the panel against the trigger/anchor. @default "center" */
  align?: 'start' | 'center' | 'end';
  /** Gap in px between the panel and the trigger/anchor edge. @default 4 */
  sideOffset?: number;
}

/**
 * The raised panel. Portals to `document.body` and carries the DS raised surface
 * (`dialog-fill` + `border` + `shadow-elevation` + `corner-lg`). `align` and the numeric
 * `sideOffset` position it relative to the trigger. Radix gives it `role="dialog"`, so pass an
 * `aria-label` (or `aria-labelledby` pointing at a `PopoverTitle`) to give the open panel an
 * accessible name.
 */
function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-md corner-lg border bg-dialog-fill p-lg text-format-body text-dialog-ink shadow-elevation outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/**
 * Decouples the popover's positioning anchor from its trigger — the panel floats next to the
 * anchored element instead of the trigger. Optional; omit it to anchor on the trigger.
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

/**
 * Optional heading region inside the content — stacks a `PopoverTitle` above a
 * `PopoverDescription` with a tight gap. Plain layout helper; no aria wiring.
 */
function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn('flex flex-col gap-2xs text-format-body', className)}
      {...props}
    />
  );
}

/**
 * The popover's title line — a compact bold caption (`label` format) on `dialog-ink`.
 * Renders a `div`; pair with a labelled trigger for the accessible name.
 */
function PopoverTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="popover-title"
      className={cn('text-format-label', className)}
      {...props}
    />
  );
}

/**
 * Secondary muted prose under the title (`body` format on `muted-ink`).
 */
function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="popover-description"
      className={cn('text-format-body text-muted-ink', className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};

export type { PopoverContentProps };
