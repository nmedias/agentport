import { render } from '@testing-library/react';
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
      <CommandInput placeholder="Search commands…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            Open explorer
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
}

describe('Command', () => {
  it('renders the search input', () => {
    const { getByPlaceholderText } = render(<Palette />);
    expect(getByPlaceholderText('Search commands…')).toBeTruthy();
  });

  // The DS mono-18 "Command-/Eingabe-Text" signature must survive twMerge (T1
  // text-format group) — otherwise text-input collapses into text-color.
  it('keeps the DS mono command-input format (text-input survives twMerge)', () => {
    const { getByPlaceholderText } = render(<Palette />);
    expect(getByPlaceholderText('Search commands…').className).toContain(
      'text-input'
    );
  });

  // The cmdk input is the InputGroup's focusable control (borderless).
  it('marks the cmdk input as the input-group control', () => {
    const { getByPlaceholderText } = render(<Palette />);
    expect(
      getByPlaceholderText('Search commands…').getAttribute('data-slot')
    ).toBe('input-group-control');
  });

  it('renders items with the DS label format', () => {
    const { getByText } = render(<Palette />);
    const item = getByText('Open explorer').closest(
      '[data-slot=command-item]'
    );
    expect(item?.className).toContain('text-label');
    expect(item?.className).toContain('data-[selected=true]:bg-accent');
  });

  // CommandShortcut reuses the ported Kbd (text-kbd) and carries the data-slot
  // that lets the item checkmark hide itself.
  it('renders the shortcut as a Kbd with the command-shortcut slot', () => {
    const { getByText } = render(<Palette />);
    const kbd = getByText('⌘B');
    expect(kbd.getAttribute('data-slot')).toBe('command-shortcut');
    expect(kbd.className).toContain('text-kbd');
  });
});
