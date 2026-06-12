import { render } from '@testing-library/react';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    const { container } = render(<Separator data-testid="sep" />);
    const el = container.querySelector('[data-slot="separator"]') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('honors the vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const el = container.querySelector('[data-slot="separator"]') as HTMLElement;
    expect(el.getAttribute('data-orientation')).toBe('vertical');
  });

  // Decorative (the default) is non-semantic → role="none"; non-decorative
  // exposes the ARIA separator role with its orientation.
  it('is decorative (role none) by default and semantic when decorative=false', () => {
    const { container: dec } = render(<Separator />);
    expect(
      dec.querySelector('[data-slot="separator"]')?.getAttribute('role'),
    ).toBe('none');

    const { getByRole } = render(<Separator decorative={false} orientation="vertical" />);
    expect(getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');
  });

  // Guards the T3 token pick: the line colour is the DS `border` token, not
  // stock bg-border value-matching — bg-border must survive in the markup.
  it('carries the DS border surface (bg-border)', () => {
    const { container } = render(<Separator />);
    expect(
      (container.querySelector('[data-slot="separator"]') as HTMLElement).className,
    ).toContain('bg-border');
  });
});
