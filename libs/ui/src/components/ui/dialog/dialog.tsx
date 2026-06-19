import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { RiCloseLine } from '@remixicon/react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Public API. The root's curated open/modal props are re-declared FLAT here (Omit them
// from the Radix Root type, then re-add with JSDoc) so react-docgen can extract them —
// the default propFilter drops anything inherited from node_modules. The other parts
// (Trigger/Portal/Close/Overlay/Header/Title/Description) are plain passthroughs with no
// curated API; DialogContent + DialogFooter add a single flat DS prop each.
interface DialogProps
  extends Omit<
    React.ComponentProps<typeof DialogPrimitive.Root>,
    'open' | 'defaultOpen' | 'onOpenChange' | 'modal'
  > {
  /** Controlled open state (pair with `onOpenChange`). Leave unset for an uncontrolled dialog driven by the trigger. */
  open?: boolean;
  /**
   * Open state when uncontrolled — `true` renders the dialog open on mount.
   * @default false
   */
  defaultOpen?: boolean;
  /** Called with the next open state whenever the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * When `true` (default) the overlay blocks pointer events and traps focus; `false` lets the rest of the page stay interactive.
   * @default true
   */
  modal?: boolean;
}

function Dialog({ ...props }: DialogProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 isolate z-50 bg-scrim duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className
      )}
      {...props}
    />
  );
}

interface DialogContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  /**
   * Render the corner close (×) button inside the panel.
   * @default true
   */
  showCloseButton?: boolean;
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-xl corner-xl border bg-dialog-fill p-xl text-format-body text-dialog-ink shadow-elevation duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              icon
              size="sm"
              aria-label="Close"
            >
              <RiCloseLine />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-md', className)}
      {...props}
    />
  );
}

interface DialogFooterProps extends React.ComponentProps<'div'> {
  /**
   * Render a default "Close" button (a DialogClose) at the end of the footer.
   * @default false
   */
  showCloseButton?: boolean;
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        '-mx-xl -mb-xl flex flex-col-reverse gap-md corner-b-xl border-t bg-muted-fill/50 p-xl sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-format-title', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        'text-format-body text-muted-ink *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-ink',
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
export type { DialogProps, DialogContentProps, DialogFooterProps };
