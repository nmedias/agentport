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
  it('keeps the DS typography classes (text-label on the field, text-body on items)', () => {
    const { getByPlaceholderText, getByText } = render(<Palette />);
    expect(getByPlaceholderText('Search…').className).toContain('text-label');
    expect(
      getByText('Profile').closest('[data-slot=command-item]')?.className
    ).toContain('text-body');
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
    expect(dialogClasses).toContain('top-1/3');
    expect(dialogClasses).not.toContain('top-1/2');
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
});
