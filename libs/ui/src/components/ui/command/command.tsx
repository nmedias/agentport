'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { RiSearchLine } from '@remixicon/react';

import { cn } from '@/lib/utils';
import { Kbd } from '@/components/ui/kbd';

// Token-faithful port of the shadcn command (cmdk) to the Agentport DS vocabulary
// (see design-docs/design-system/tokens-reference.md §6). Keeps cmdk's
// structure + selection logic, re-clothed in DS tokens:
//  · bg-popover/text-popover-foreground = the overlay surface (alias of overlay)
//  · CommandInput text = text-input (the DS mono-18 "Command-/Eingabe-Text"
//    signature, §4) with placeholder = input-placeholder
//  · group heading = text-eyebrow (mono micro-label; DS has no 12px sans)
//  · CommandItem selected = bg-accent + text-accent-foreground (cyan selection
//    tint, §1 two-cyan model), disabled dims via opacity
//  · CommandShortcut reuses the ported Kbd (text-kbd, inverted keycap)
// CommandDialog is intentionally NOT included — it needs a Dialog component that
// is not yet ported to the DS. Add it once Dialog lands (then wrap Command in it).
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md border border-border bg-popover text-popover-foreground',
        className
      )}
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-11 items-center gap-md border-b border-border px-lg"
    >
      <RiSearchLine className="size-4 shrink-0 text-muted-foreground" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'flex h-full w-full bg-transparent text-input outline-hidden placeholder:text-input-placeholder disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
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
        'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-2xl text-center text-body text-muted-foreground"
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
        'overflow-hidden p-xs text-foreground [&_[cmdk-group-heading]]:px-md [&_[cmdk-group-heading]]:py-sm [&_[cmdk-group-heading]]:text-eyebrow [&_[cmdk-group-heading]]:text-muted-foreground',
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
      className={cn('-mx-1 h-px bg-border', className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-md rounded-sm px-md py-sm text-label outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

// The trailing keyboard hint reuses the ported Kbd (inverted keycap, text-kbd) —
// a DS upgrade over stock command's plain muted text. ml-auto keeps it pushed to
// the row's end.
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<typeof Kbd>) {
  return (
    <Kbd
      data-slot="command-shortcut"
      className={cn('ml-auto', className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
