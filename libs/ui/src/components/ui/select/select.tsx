import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { RiArrowDownSLine, RiArrowUpSLine, RiCheckLine } from '@remixicon/react';

import { cn } from '@/lib/utils';

// Public API — the curated subset of the Radix Select.Root surface, re-declared FLAT so
// react-docgen extracts it (the default propFilter drops anything from node_modules, i.e. the
// inherited Radix props). Omit those keys from the inherited type, then re-add each with JSDoc.
// Native types kept exactly (value/defaultValue are `string`); the rest of the Radix surface still
// passes through untouched.
interface SelectProps
  extends Omit<
    React.ComponentProps<typeof SelectPrimitive.Root>,
    'value' | 'defaultValue' | 'onValueChange' | 'open' | 'defaultOpen' | 'onOpenChange' | 'disabled' | 'required' | 'name'
  > {
  /** Controlled selected value (pair with `onValueChange`). */
  value?: string;
  /** Selected value when uncontrolled. */
  defaultValue?: string;
  /** Called when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Controlled open state of the dropdown. */
  open?: boolean;
  /**
   * Open state when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when the dropdown opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Disables the whole select.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the select required for native form validation.
   * @default false
   */
  required?: boolean;
  /** Form field name submitted with the form. */
  name?: string;
}

function Select({ ...props }: SelectProps) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

interface SelectValueProps extends Omit<React.ComponentProps<typeof SelectPrimitive.Value>, 'placeholder'> {
  /** Content shown while no value is selected (greyed via `data-placeholder` on the trigger). */
  placeholder?: React.ReactNode;
}

function SelectValue({ ...props }: SelectValueProps) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

type SelectTriggerSize = 'sm' | 'default';

interface SelectTriggerProps extends Omit<React.ComponentProps<typeof SelectPrimitive.Trigger>, 'disabled'> {
  /**
   * Trigger height — the default (`h-8`) or the compact `sm` (`h-7`).
   * @default "default"
   */
  size?: SelectTriggerSize;
  /**
   * Prevents opening the select and dims the trigger.
   * @default false
   */
  disabled?: boolean;
}

function SelectTrigger({ className, size = 'default', children, ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        // Invalid ring is FOCUS-GATED (= Input/Checkbox/Switch/Radio family): aria-invalid alone shows
        // only the destructive border; the 3px ring width comes solely from focus-visible (ring/50 →
        // ring-destructive/20 recolours it when also invalid). No standalone aria-invalid:ring-[3px].
        "flex w-fit items-center justify-between gap-sm corner-lg border border-input-border bg-input-fill py-md px-md text-format-label whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-input-ink-placeholder data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:corner-md *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <RiArrowDownSLine className="pointer-events-none size-4 text-muted-ink" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

interface SelectContentProps extends Omit<React.ComponentProps<typeof SelectPrimitive.Content>, 'position' | 'align'> {
  /**
   * Dropdown positioning — `item-aligned` overlaps the selected item onto the trigger; `popper`
   * anchors below/above like a typical menu.
   * @default "item-aligned"
   */
  position?: 'item-aligned' | 'popper';
  /**
   * Alignment against the trigger (popper positioning).
   * @default "center"
   */
  align?: 'start' | 'center' | 'end';
}

function SelectContent({
  className,
  children,
  position = 'item-aligned',
  align = 'center',
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === 'item-aligned'}
        className={cn(
          'relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto corner-lg border border-border bg-dialog-fill text-dialog-ink shadow-elevation duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className="scroll-my-1 p-xs data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)"
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('px-sm py-xs text-format-label text-muted-ink', className)}
      {...props}
    />
  );
}

interface SelectItemProps extends Omit<React.ComponentProps<typeof SelectPrimitive.Item>, 'value' | 'disabled' | 'textValue'> {
  /** The value submitted when this item is selected — required, unique within the select. */
  value: string;
  /**
   * Disables the item — not selectable, dimmed.
   * @default false
   */
  disabled?: boolean;
  /** Typeahead text when the item's content isn't plain text (so the keyboard search still matches). */
  textValue?: string;
}

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-sm corner-md py-xs pr-3xl pl-sm text-format-label outline-hidden select-none focus:bg-accent-fill focus:text-accent-ink data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-md",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-md flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <RiCheckLine className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('pointer-events-none -mx-xs my-xs h-px bg-border', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-dialog-fill py-xs [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <RiArrowUpSLine />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-dialog-fill py-xs [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <RiArrowDownSLine />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
export type { SelectProps, SelectTriggerProps, SelectContentProps, SelectItemProps, SelectValueProps };
