import { render } from '@testing-library/react';
import { Kbd, KbdGroup } from './kbd';

describe('Kbd', () => {
  it('renders its children', () => {
    const { container } = render(<Kbd>Esc</Kbd>);
    expect(container.querySelector('[data-slot="kbd"]')?.textContent).toBe('Esc');
  });

  it('carries the DS keyboard typography format', () => {
    const { container } = render(<Kbd>K</Kbd>);
    expect(container.querySelector('[data-slot="kbd"]')?.className).toContain('text-kbd');
  });

  it('defaults to the high emphasis (inverted keycap)', () => {
    const { container } = render(<Kbd>K</Kbd>);
    expect(container.querySelector('[data-slot="kbd"]')?.className).toContain('bg-inverse');
  });

  it('applies the low emphasis (muted keycap) variant', () => {
    const { container } = render(<Kbd emphasis="low">K</Kbd>);
    expect(container.querySelector('[data-slot="kbd"]')?.className).toContain('bg-muted');
  });

  it('groups multiple keys', () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>B</Kbd>
      </KbdGroup>
    );
    const group = container.querySelector('[data-slot="kbd-group"]');
    expect(group?.querySelectorAll('[data-slot="kbd"]').length).toBe(2);
  });
});
