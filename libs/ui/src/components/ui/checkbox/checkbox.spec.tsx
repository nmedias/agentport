import { render } from '@testing-library/react';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders with the checkbox data-slot', () => {
    const { container } = render(<Checkbox />);
    expect(container.querySelector('[data-slot="checkbox"]')).toBeTruthy();
  });

  it('exposes the checkbox role', () => {
    const { getByRole } = render(<Checkbox />);
    expect(getByRole('checkbox')).toBeTruthy();
  });

  it('reflects the checked state via aria-checked', () => {
    const { getByRole } = render(<Checkbox defaultChecked />);
    expect(getByRole('checkbox').getAttribute('aria-checked')).toBe('true');
  });

  it('reflects aria-invalid for the destructive state', () => {
    const { getByRole } = render(<Checkbox aria-invalid />);
    expect(getByRole('checkbox').getAttribute('aria-invalid')).toBe('true');
  });

  it('honors the disabled attribute', () => {
    const { getByRole } = render(<Checkbox disabled />);
    expect((getByRole('checkbox') as HTMLButtonElement).disabled).toBe(true);
  });

  // Guards the T3 radius pick: corner-sm is a DS custom utility (the only radius
  // vocabulary — rounded-* is dead under the theme reset). twMerge knows the
  // corner-* groups via the cn() extension, so the class must survive in markup.
  it('carries the DS corner-sm radius utility', () => {
    const { getByRole } = render(<Checkbox />);
    expect(getByRole('checkbox').className).toContain('corner-sm');
  });
});
