'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
import { RiSearchLine, RiCheckLine } from '@remixicon/react';

// Token-faithful port of the shadcn command (cmdk, radix-nova) into the Agentport DS
// (tokens-reference.md §6). Composite: the palette is an elevated overlay surface
// holding a search input (built on the ported InputGroup) and a scrollable list of
// grouped, selectable items. Re-clothed in DS tokens:
//  · palette = overlay surface (overlay.use names Command) + border + shadow-elevation
//    (an overlay carries depth) — DS interpretation of the demo's `border shadow-md`.
//  · the search field uses text-label (sans 14 — the standard DS field text; adjusted in
//    Figma from the mono text-input command-format), placeholder:text-input-placeholder,
//    on the InputGroup's opaque DS field (nova's translucent softening dropped).
//  · selection = the DS accent (cyan) tint, not stock's neutral grey — data-selected
//    bg-accent + text-accent-foreground (accent.use = "Selektions-/Aktiv-Tint").
//  · group heading = text-eyebrow + uppercase (the DS mono micro-label for sections;
//    text-xs/font-medium are dead under the theme reset).
//  · shortcut hint = text-kbd (keyboard text); tracking-* is dead → dropped.
//  · empty = text-body muted. gap-2(8)→gap-md, px-2(8)→px-md, py-1.5(6)→py-sm,
//    p-1(4)→p-xs, py-6(24)→py-2xl, -mx-1(4)→-mx-xs; radius by NAME.
//  · CommandDialog nests the ported Dialog (sr-only header; panel re-shaped to the
//    palette: top-1/3, p-0, overflow clip). The panel owns the frame, so the inner
//    Command drops its own border/shadow; items widen to corner-lg inside the
//    dialog (nova's in-data-[slot=dialog-content] override on the DS corner scale).
// Geometry (h-px, max-h-72, scroll-py-1, size-4) stays numeric.
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'flex size-full flex-col overflow-hidden corner-xl border bg-overlay p-xs text-overlay-foreground shadow-elevation',
        className
      )}
      {...props}
    />
  );
}

// The palette inside the ported Dialog. Children are the palette parts
// (CommandInput/CommandList …) — the wrapper supplies the <Command> root, like
// new-york-v4 (nova's registry source renders children bare, which breaks the
// canonical doc usage; deliberate deviation). nova deltas: the rounded-xl!
// override is dropped (DialogContent is already corner-xl); the inner Command
// sheds its frame (border-0 — the panel owns border + elevation; the inner
// shadow is clipped by the panel's overflow-hidden either way).
function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run…',
  children,
  className,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('top-1/3 translate-y-0 overflow-hidden p-0', className)}
        showCloseButton={showCloseButton}
      >
        <Command className="border-0 shadow-none">{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="p-xs pb-0">
      <InputGroup>
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            'w-full bg-transparent text-label placeholder:text-input-placeholder outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        <InputGroupAddon>
          <RiSearchLine className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none',
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn('py-2xl text-center text-body text-muted-foreground', className)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-xs text-foreground **:[[cmdk-group-heading]]:px-md **:[[cmdk-group-heading]]:py-sm **:[[cmdk-group-heading]]:text-eyebrow **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn('-mx-xs h-px bg-border', className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-md corner-sm px-md py-sm text-body outline-hidden select-none in-data-[slot=dialog-content]:corner-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-accent data-selected:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      <RiCheckLine className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'ml-auto text-kbd text-muted-foreground group-data-selected/command-item:text-accent-foreground',
        className
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
