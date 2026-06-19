'use client';

import * as React from 'react';
import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import { cva } from 'class-variance-authority';

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

// Public API. The curated prop API lives on Command (DS `variant` + the cmdk root props),
// CommandDialog, and CommandSeparator; the `variant` is set on the root only and flows to
// Input/List/Group/Separator via CommandVariantContext. The other parts (CommandInput,
// CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut) are passthroughs.
type CommandVariant = 'default' | 'palette';

const CommandVariantContext = React.createContext<CommandVariant>('default');

const commandVariants = cva(
  'flex size-full flex-col overflow-hidden border bg-dialog-fill text-dialog-ink shadow-elevation',
  {
    variants: {
      variant: {
        default: 'corner-xl p-xs',
        palette: 'corner-md border-[1.5px]',
      } satisfies Record<CommandVariant, string>,
    },
    defaultVariants: { variant: 'default' },
  }
);

interface CommandProps
  extends Omit<
    React.ComponentProps<typeof CommandPrimitive>,
    'label' | 'shouldFilter' | 'loop' | 'value' | 'defaultValue' | 'onValueChange' | 'filter'
  > {
  /** DS surface variant. `default` is the elevated overlay panel; `palette` is the full-bleed Agentport terminal palette (set on the root only, flows to Input/List/Group/Separator via context). @default "default" */
  variant?: CommandVariant;
  /** Accessible label for the command menu (cmdk renders it visually hidden). */
  label?: string;
  /** Whether cmdk filters + sorts items by the search query. Set `false` to render valid items yourself (server-side / async search). @default true */
  shouldFilter?: boolean;
  /** Loop arrow-key navigation around the ends of the list. @default false */
  loop?: boolean;
  /** Controlled value of the active item (pair with `onValueChange`). */
  value?: string;
  /** Active item value when uncontrolled. */
  defaultValue?: string;
  /** Called when the active item changes. */
  onValueChange?: (value: string) => void;
  /** Custom match function `(value, search, keywords) => number` (0 hidden … 1 best). Defaults to command-score. */
  filter?: (value: string, search: string, keywords?: string[]) => number;
}

function Command({
  className,
  variant = 'default',
  ...props
}: CommandProps) {
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
interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  /** Visually-hidden dialog title (the a11y name). @default "Command Palette" */
  title?: string;
  /** Visually-hidden dialog description. @default "Search for a command to run…" */
  description?: string;
  /** Extra classes merged onto the inner DialogContent panel. */
  className?: string;
  /** Show the dialog's corner close button. @default false */
  showCloseButton?: boolean;
  /** DS surface variant forwarded to the inner Command. @default "default" */
  variant?: CommandVariant;
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run…',
  children,
  className,
  showCloseButton = false,
  variant = 'default',
  ...props
}: CommandDialogProps) {
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

interface CommandSeparatorProps extends React.ComponentProps<'div'> {
  /** When set, render the labeled-rule form (an eyebrow caption + hairline) instead of a plain line. */
  label?: React.ReactNode;
  /** Keep the separator rendered while the user is filtering (by default it hides during search). */
  alwaysRender?: boolean;
}

function CommandSeparator({
  className,
  label,
  alwaysRender,
  ...props
}: CommandSeparatorProps) {
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
export type { CommandProps, CommandDialogProps, CommandSeparatorProps };
