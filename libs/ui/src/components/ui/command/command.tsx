'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { RiSearchLine, RiCheckLine } from '@remixicon/react';

import { cn } from '@/lib/utils';
import { Kbd } from '@/components/ui/kbd';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';

// Token-faithful nova re-port of the shadcn command (cmdk) to the Agentport DS
// (tokens-reference.md §6). Keeps cmdk's structure + selection logic, re-clothed:
//  · root: rounded-xl bg-popover p-xs text-popover-foreground (overlay surface)
//  · CommandInput builds on the ported InputGroup + InputGroupAddon (leading
//    search icon); the cmdk input is the borderless control, text = text-input —
//    the DS mono-18 "Command-/Eingabe-Text" signature (§4). The group is bumped
//    to h-10 so the mono-18 fits, and its border softened (border-input/30).
//  · group heading = text-eyebrow (mono micro-label; DS has no 12px sans)
//  · CommandItem selected = bg-accent + text-accent-foreground (DS cyan selection,
//    §1 two-cyan model — the DS keeps this over nova's neutral bg-muted), disabled
//    dims via opacity. Nova's checkable checkmark is kept: it shows on
//    data-[checked=true] and hides when a CommandShortcut is present.
//  · CommandShortcut reuses the ported Kbd (inverted keycap) — a DS upgrade over
//    stock command's plain muted text. ml-auto pushes it to the row end.
//  · CommandDialog intentionally NOT included — it needs a Dialog component not
//    yet ported to the DS. Add it (wrapping Command) once Dialog lands.
// Density on the radix-nova baseline mapped by NAME: p-1→p-xs, gap-2→gap-md,
// px-2→px-md, py-1.5→py-sm, py-6→py-2xl. max-h-72 stays numeric (geometry).
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'flex size-full flex-col overflow-hidden rounded-xl bg-popover p-xs text-popover-foreground',
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
    <div data-slot="command-input-wrapper" className="p-xs pb-0">
      <InputGroup className="h-10 border-input/30">
        <InputGroupAddon align="inline-start">
          <RiSearchLine />
        </InputGroupAddon>
        <CommandPrimitive.Input
          data-slot="input-group-control"
          className={cn(
            'flex-1 rounded-none border-0 bg-transparent text-input outline-hidden ring-0 placeholder:text-input-placeholder focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
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
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-md rounded-sm px-md py-sm text-label outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[selected=true]:[&_svg]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      {/* Checkable affordance: visible only when the item is data-[checked=true]
          and no keyboard shortcut occupies the trailing slot. */}
      <RiCheckLine className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  );
}

// The trailing keyboard hint reuses the ported Kbd (inverted keycap, text-kbd) —
// a DS upgrade over stock command's plain muted text. Its data-slot lets the
// CommandItem checkmark hide itself whenever a shortcut is present.
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
