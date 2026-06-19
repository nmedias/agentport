'use client';

import * as React from 'react';
import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';
import { RiSearchLine, RiCheckLine } from '@remixicon/react';

// Token-faithful port of the shadcn command (cmdk, radix-nova) into the Agentport DS
// (tokens-reference.md §6). Composite: the palette is an elevated overlay surface
// holding a search input (built on the ported InputGroup) and a scrollable list of
// grouped, selectable items. Re-clothed in DS tokens:
//  · palette = overlay surface (overlay.use names Command) + border + shadow-elevation
//    (an overlay carries depth) — DS interpretation of the demo's `border shadow-md`.
//    Figma binds the panel fill to overlay-fill, the inherited text role to overlay-ink.
//  · the search field uses text-format-label (sans 14 — the standard DS field text; adjusted in
//    Figma from the mono text-format-data-lg command-format), placeholder:text-input-ink-placeholder,
//    on the InputGroup's opaque DS field (nova's translucent softening dropped).
//  · selection = the DS accent tint, not stock's neutral grey — data-selected
//    bg-accent-fill + text-accent-ink (accent-fill.use = "Selektions-/Aktiv-Tint").
//  · group heading = text-format-eyebrow + uppercase (the DS mono micro-label for sections;
//    text-xs/font-medium are dead under the theme reset).
//  · shortcut hint = text-format-kbd (keyboard text); tracking-* is dead → dropped.
//  · empty = text-format-body muted. gap-2(8)→gap-md, px-2(8)→px-md, py-1.5(6)→py-sm,
//    p-1(4)→p-xs, py-6(24)→py-2xl, -mx-1(4)→-mx-xs; radius by NAME.
//  · CommandDialog nests the ported Dialog (sr-only header; panel re-shaped to the
//    palette: centered via top-1/2 -translate-y-1/2, p-0, overflow clip). The panel
//    owns the frame, so the inner
//    Command drops its own border/shadow; items widen to corner-lg inside the
//    dialog (nova's in-data-[slot=dialog-content] override on the DS corner scale).
// Geometry (h-px, max-h-72, scroll-py-1, size-4) stays numeric.
//
// PALETTE variant (Figma sets: .Command 3642:2, .Command/Input 3639:2, .Command/Group 3640:9,
// .Command/Separator 3653:6 — source frame "C2 · palette-panel" 3554:859):
//  · the variant lives ONLY on the Command root and flows to Input/List/Group/Separator via
//    CommandVariantContext (shadcn ToggleGroup idiom) — one switch point; data-variant for CSS.
//  · palette surface = corner-md + border-[1.5px] + full-bleed (no root padding); overlay
//    fill + elevation stay from the base.
//  · palette input = terminal prompt row (bg-card-fill p-xl gap-lg): static glow caret bar
//    (bg-primary shadow-glow — Figma binds the caret fill to `primary` (signal/600,
//    SHAPE_FILL-scoped); 2.5×18 numeric geometry, the frame's 1px radius is dropped),
//    mono text-format-data-lg field (the frame's typed+ghost-hint state is a mid-typing
//    mock → standard placeholder; default caret colour), Kbd "Esc". The prompt divider is border-b on
//    the wrapper — Figma models it as a separator instance in the composition.
//  · palette group = px-md container (items keep px-md → 16px text inset like the prompt);
//    heading = labeled rule (gap-md px-md pt-lg pb-sm + after: hairline). Figma nests a
//    labeled-separator instance with px-xl (label inset 24) — code keeps the C2 frame's
//    16px alignment; flagged in the sync notes.
//  · CommandSeparator: a label prop renders the labeled rule (eyebrow + flex-1 hairline,
//    gap-md px-xl pt-lg pb-sm) as a role=separator div with the SAME hide-on-search
//    contract as the line form (useCommandState; alwaysRender opts out); the line form
//    drops -mx-xs in palette context (no root padding to bleed into).
//  · CommandItem/CommandShortcut/CommandEmpty unchanged (decided: "items sind gleich").
type CommandVariant = 'default' | 'palette';

const CommandVariantContext = React.createContext<CommandVariant>('default');

const commandVariants = cva(
  'flex size-full flex-col overflow-hidden border bg-dialog-fill text-dialog-ink shadow-elevation',
  {
    variants: {
      variant: {
        default: 'corner-xl p-xs',
        palette: 'corner-md border-[1.5px]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Command({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof CommandPrimitive> &
  VariantProps<typeof commandVariants>) {
  return (
    <CommandVariantContext.Provider value={variant ?? 'default'}>
      <CommandPrimitive
        data-slot="command"
        data-variant={variant ?? 'default'}
        className={cn(commandVariants({ variant }), className)}
        {...props}
      />
    </CommandVariantContext.Provider>
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
  variant = 'default',
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
} & VariantProps<typeof commandVariants>) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          'top-1/2 -translate-y-1/2 overflow-hidden p-0',
          variant === 'palette' && 'corner-md border-[1.5px]',
          className
        )}
        showCloseButton={showCloseButton}
      >
        <Command variant={variant} className="border-0 shadow-none">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  const variant = React.useContext(CommandVariantContext);
  if (variant === 'palette') {
    return (
      <div
        data-slot="command-input-wrapper"
        className="flex items-center gap-lg border-b bg-card-fill p-xl"
      >
        <span
          aria-hidden="true"
          className="h-[18px] w-[2.5px] shrink-0 bg-primary shadow-glow"
        />
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            'min-w-0 flex-1 bg-transparent text-format-data-lg text-ink placeholder:text-input-ink-placeholder outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        <Kbd>Esc</Kbd>
      </div>
    );
  }
  return (
    <div data-slot="command-input-wrapper" className="p-xs pb-0">
      <InputGroup>
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            'w-full bg-transparent text-format-label text-ink placeholder:text-input-ink-placeholder outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        <InputGroupAddon>
          <RiSearchLine className="size-4 shrink-0 text-ink" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  const variant = React.useContext(CommandVariantContext);
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'no-scrollbar max-h-96 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none',
        variant === 'palette' && 'py-md',
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  // cmdk's Empty hard-codes role="presentation" (applied AFTER our props, so a prop can't
  // override it), leaving CommandList (role="listbox") with no option/group child →
  // aria-required-children. Replicate cmdk's render condition (filtered.count === 0) on our
  // own node and expose the no-results message as a non-interactive (disabled) option: the
  // listbox owns a permitted child AND screen readers announce it. Not a cmdk item, so it
  // never joins keyboard navigation.
  const isEmpty = useCommandState((state) => state.filtered.count === 0);
  if (!isEmpty) return null;
  return (
    <div
      data-slot="command-empty"
      role="option"
      aria-disabled
      aria-selected={false}
      className={cn('py-2xl text-center text-format-body text-muted-ink', className)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  const variant = React.useContext(CommandVariantContext);
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        variant === 'palette'
          ? "overflow-hidden px-md text-ink **:[[cmdk-group-heading]]:flex **:[[cmdk-group-heading]]:items-center **:[[cmdk-group-heading]]:gap-md **:[[cmdk-group-heading]]:px-md **:[[cmdk-group-heading]]:pt-lg **:[[cmdk-group-heading]]:pb-sm **:[[cmdk-group-heading]]:text-format-eyebrow **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:text-muted-ink **:[[cmdk-group-heading]]:after:h-px **:[[cmdk-group-heading]]:after:flex-1 **:[[cmdk-group-heading]]:after:bg-border **:[[cmdk-group-heading]]:after:content-['']"
          : "overflow-hidden p-xs text-ink **:[[cmdk-group-heading]]:px-md **:[[cmdk-group-heading]]:py-sm **:[[cmdk-group-heading]]:text-format-eyebrow **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:text-muted-ink",
        className
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  label,
  alwaysRender,
  ...props
}: React.ComponentProps<'div'> & {
  label?: React.ReactNode;
  alwaysRender?: boolean;
}) {
  const variant = React.useContext(CommandVariantContext);
  // Both forms render as our own div with role="presentation": cmdk's CommandPrimitive.Separator
  // hard-codes role="separator" (applied after our props), a disallowed child of the listbox
  // CommandList renders (aria-required-children). We replicate cmdk's hide-on-search contract —
  // the separator is gone while filtering; alwaysRender opts out (e.g. the labeled rule).
  const search = useCommandState((state) => state.search);
  if (search && !alwaysRender) return null;
  if (label != null) {
    return (
      <div
        data-slot="command-separator"
        role="presentation"
        className={cn('flex items-center gap-md px-xl pt-lg pb-sm', className)}
        {...props}
      >
        <span className="text-format-eyebrow uppercase text-muted-ink">
          {label}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return (
    <div
      data-slot="command-separator"
      role="presentation"
      className={cn(
        variant === 'palette' ? 'h-px bg-border' : '-mx-xs h-px bg-border',
        className
      )}
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
        "group/command-item relative flex cursor-default items-center gap-md corner-sm px-md py-sm text-format-body outline-hidden select-none in-data-[slot=dialog-content]:corner-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-accent-fill data-selected:text-accent-ink [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-accent-ink",
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
        'ml-auto text-format-kbd text-muted-ink group-data-selected/command-item:text-accent-ink',
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
  commandVariants,
};
