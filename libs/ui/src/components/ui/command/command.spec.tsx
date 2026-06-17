import { render, fireEvent, waitFor } from '@testing-library/react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './command';

function Palette() {
  return (
    <Command>
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem disabled>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe('Command', () => {
  it('renders the palette surface, group headings and items', () => {
    const { getByText, container } = render(<Palette />);
    expect(container.querySelector('[data-slot=command]')).toBeTruthy();
    expect(getByText('Suggestions')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Calendar')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
  });

  it('marks a disabled item with data-disabled', () => {
    const { getByText } = render(<Palette />);
    const item = getByText('Calculator').closest('[data-slot=command-item]');
    expect(item?.getAttribute('data-disabled')).toBe('true');
  });

  it('filters items as the search value changes', async () => {
    const { getByPlaceholderText, queryByText, findByText } = render(<Palette />);
    fireEvent.change(getByPlaceholderText('Search…'), {
      target: { value: 'Profile' },
    });
    expect(await findByText('Profile')).toBeTruthy();
    await waitFor(() => expect(queryByText('Calendar')).toBeNull());
  });

  it('surfaces the empty state when nothing matches', async () => {
    const { getByPlaceholderText, findByText } = render(<Palette />);
    fireEvent.change(getByPlaceholderText('Search…'), {
      target: { value: 'zxcvbnm' },
    });
    expect(await findByText('No results found.')).toBeTruthy();
  });

  // Guards the T1 twMerge setup: the DS typography classes must survive in the markup
  // (text-format group, else they collapse under text-color and get dropped).
  it('keeps the DS typography classes (text-format-label on the field, text-format-body on items)', () => {
    const { getByPlaceholderText, getByText } = render(<Palette />);
    expect(getByPlaceholderText('Search…').className).toContain('text-format-label');
    expect(
      getByText('Profile').closest('[data-slot=command-item]')?.className
    ).toContain('text-format-body');
  });
});

function PalettePanel() {
  return (
    <Command variant="palette">
      <CommandInput placeholder="type a command…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Jump to">
          <CommandItem>
            invoice
            <CommandShortcut>Type · System</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe('Command palette variant', () => {
  // Default regression: without variant the root keeps the original surface.
  it('keeps the default surface untouched without a variant', () => {
    const { container } = render(<Palette />);
    const root = container.querySelector('[data-slot=command]');
    expect(root?.getAttribute('data-variant')).toBe('default');
    const cls = root?.className.split(/\s+/) ?? [];
    expect(cls).toContain('corner-xl');
    expect(cls).toContain('p-xs');
    expect(cls).toContain('border');
  });

  it('re-shapes the root surface (corner-md, 1.5px border, full-bleed) and tags data-variant', () => {
    const { container } = render(<PalettePanel />);
    const root = container.querySelector('[data-slot=command]');
    expect(root?.getAttribute('data-variant')).toBe('palette');
    const cls = root?.className.split(/\s+/) ?? [];
    expect(cls).toContain('corner-md');
    expect(cls).not.toContain('corner-xl');
    expect(cls).toContain('border-[1.5px]');
    expect(cls).not.toContain('p-xs');
  });

  // Context inheritance: the input switches anatomy from the root variant alone —
  // prompt row instead of InputGroup, with caret bar, Kbd Esc and the mono text-format-input
  // format (text-format twMerge group must keep it alive next to text-ink).
  it('switches the input to the prompt row via context', () => {
    const { getByPlaceholderText, getByText, container } = render(
      <PalettePanel />
    );
    const input = getByPlaceholderText('type a command…');
    expect(input.className).toContain('text-format-input');
    const wrapper = container.querySelector('[data-slot=command-input-wrapper]');
    expect(wrapper?.className).toContain('bg-card');
    expect(wrapper?.className).toContain('border-b');
    expect(wrapper?.querySelector('[data-slot=input-group]')).toBeNull();
    expect(getByText('Esc')).toBeTruthy();
  });

  // The heading styling rides on the group element via the **:[[cmdk-group-heading]]:
  // descendant variant (cmdk renders the heading div without own classes).
  it('renders the group heading as a labeled rule with palette rhythm', () => {
    const { getByText } = render(<PalettePanel />);
    const group = getByText('Jump to').closest('[data-slot=command-group]');
    expect(group?.className).toContain('[[cmdk-group-heading]]:after:flex-1');
    expect(group?.className).toContain('[[cmdk-group-heading]]:after:bg-border');
    expect(group?.className).toContain('[[cmdk-group-heading]]:pt-lg');
    expect(group?.className).toContain('[[cmdk-group-heading]]:text-format-eyebrow');
    expect(group?.className.split(/\s+/)).toContain('px-md');
  });

  it('gives the list its palette breathing room (py-md)', () => {
    const { container } = render(<PalettePanel />);
    expect(
      container.querySelector('[data-slot=command-list]')?.className
    ).toContain('py-md');
  });
});

describe('CommandSeparator', () => {
  it('renders the labeled rule (eyebrow + trailing hairline) when label is set', () => {
    const { container, getByText } = render(
      <Command>
        <CommandList>
          <CommandSeparator label="Jump to" />
        </CommandList>
      </Command>
    );
    const sep = container.querySelector('[data-slot=command-separator]');
    // role=presentation, not separator: a separator is a disallowed child of the listbox
    // CommandList renders (aria-required-children) — the label text carries the section copy.
    expect(sep?.getAttribute('role')).toBe('presentation');
    expect(sep?.className).toContain('px-xl');
    expect(getByText('Jump to').className).toContain('text-format-eyebrow');
  });

  // Same hide-on-search contract as the line form: gone while filtering,
  // alwaysRender keeps it.
  it('hides the labeled rule while searching, like the line form', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandSeparator label="Jump to" />
          <CommandSeparator label="Stays put" alwaysRender />
          <CommandItem>invoice</CommandItem>
        </CommandList>
      </Command>
    );
    expect(getByText('Jump to')).toBeTruthy();
    fireEvent.change(getByPlaceholderText('Search…'), {
      target: { value: 'inv' },
    });
    await waitFor(() => expect(queryByText('Jump to')).toBeNull());
    expect(getByText('Stays put')).toBeTruthy();
  });

  it('stays the plain hairline without a label and drops the -mx-xs bleed in palette context', () => {
    const inset = render(
      <Command>
        <CommandList>
          <CommandSeparator alwaysRender />
        </CommandList>
      </Command>
    );
    expect(
      inset.container.querySelector('[data-slot=command-separator]')?.className
    ).toContain('-mx-xs');

    const fullBleed = render(
      <Command variant="palette">
        <CommandList>
          <CommandSeparator alwaysRender />
        </CommandList>
      </Command>
    );
    expect(
      fullBleed.container.querySelector('[data-slot=command-separator]')
        ?.className
    ).not.toContain('-mx-xs');
  });
});

function DialogPalette() {
  return (
    <CommandDialog open>
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Profile</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

describe('CommandDialog', () => {
  it('renders the palette inside an open dialog labelled by the sr-only header', () => {
    const { getByRole, getByText } = render(<DialogPalette />);
    const dialog = getByRole('dialog');
    expect(dialog.querySelector('[data-slot=command]')).toBeTruthy();
    expect(dialog.getAttribute('aria-labelledby')).toBe(
      getByText('Command Palette').id
    );
    expect(dialog.getAttribute('aria-describedby')).toBe(
      getByText('Search for a command to run…').id
    );
  });

  // The panel owns the frame: the inner Command must shed its border (twMerge
  // border → border-0) and the panel padding must collapse to p-0 (named-spacing
  // extension: p-xl vs p-0 conflict).
  it('re-shapes the panel and sheds the inner Command frame', () => {
    const { getByRole } = render(<DialogPalette />);
    const dialog = getByRole('dialog');
    const dialogClasses = dialog.className.split(/\s+/);
    expect(dialogClasses).toContain('p-0');
    expect(dialogClasses).not.toContain('p-xl');
    expect(dialogClasses).toContain('top-1/2');
    expect(dialogClasses).toContain('-translate-y-1/2');
    const command = dialog.querySelector('[data-slot=command]');
    const commandClasses = command?.className.split(/\s+/) ?? [];
    expect(commandClasses).toContain('border-0');
    expect(commandClasses).not.toContain('border');
  });

  it('filters inside the dialog as the search value changes', async () => {
    const { getByPlaceholderText, queryByText, findByText } = render(
      <DialogPalette />
    );
    fireEvent.change(getByPlaceholderText('Search…'), {
      target: { value: 'Profile' },
    });
    expect(await findByText('Profile')).toBeTruthy();
    await waitFor(() => expect(queryByText('Calendar')).toBeNull());
  });

  it('passes the palette variant through to the panel and the inner Command', () => {
    const { getByRole } = render(
      <CommandDialog open variant="palette">
        <CommandInput placeholder="Search…" />
      </CommandDialog>
    );
    const dialog = getByRole('dialog');
    expect(dialog.className.split(/\s+/)).toContain('corner-md');
    expect(
      dialog
        .querySelector('[data-slot=command]')
        ?.getAttribute('data-variant')
    ).toBe('palette');
  });
});
