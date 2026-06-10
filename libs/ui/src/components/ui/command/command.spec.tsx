import { render, fireEvent, waitFor } from '@testing-library/react';
import {
  Command,
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
