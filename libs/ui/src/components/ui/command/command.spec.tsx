import type { ReactNode } from 'react';
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

function renderPalette(extra?: ReactNode) {
  return render(
    <Command>
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>New File</CommandItem>
          <CommandItem disabled>Disabled item</CommandItem>
          {extra}
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
}

describe('Command', () => {
  it('renders the overlay surface on the DS popover token', () => {
    const { container } = renderPalette();
    const root = container.querySelector('[data-slot="command"]');
    expect(root?.className).toContain('bg-popover');
  });

  it('gives the input the DS command typography format (text-input)', () => {
    const { container } = renderPalette();
    const input = container.querySelector('[data-slot="command-input"]');
    expect(input?.className).toContain('text-input');
    expect(input?.className).toContain('placeholder:text-input-placeholder');
  });

  it('renders items with the label format and accent selection tokens', () => {
    const { container } = renderPalette();
    const item = container.querySelector('[data-slot="command-item"]');
    expect(item?.className).toContain('text-label');
    expect(item?.className).toContain('data-[selected=true]:bg-accent');
    expect(item?.className).toContain('data-[selected=true]:text-accent-foreground');
  });

  it('marks a disabled item non-interactive', () => {
    const { container } = renderPalette();
    const disabled = container.querySelector('[data-disabled="true"]');
    expect(disabled).not.toBeNull();
  });

  it('renders the group heading on the eyebrow format', () => {
    const { container } = renderPalette();
    const group = container.querySelector('[data-slot="command-group"]');
    expect(group?.className).toContain('text-eyebrow');
  });

  it('reuses the Kbd component for shortcuts', () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandItem>
            Action
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    );
    const shortcut = container.querySelector('[data-slot="command-shortcut"]');
    expect(shortcut?.className).toContain('text-kbd');
    expect(shortcut?.className).toContain('ml-auto');
  });
});
