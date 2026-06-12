import { fireEvent, render } from '@testing-library/react';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders with the switch role', () => {
    const { getByRole } = render(<Switch />);
    expect(getByRole('switch')).toBeTruthy();
  });

  it('toggles checked state on click (uncontrolled)', () => {
    const { getByRole } = render(<Switch />);
    const sw = getByRole('switch');
    expect(sw.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(sw);
    expect(sw.getAttribute('aria-checked')).toBe('true');
  });

  it('honors defaultChecked', () => {
    const { getByRole } = render(<Switch defaultChecked />);
    expect(getByRole('switch').getAttribute('aria-checked')).toBe('true');
  });

  it('does not toggle when disabled', () => {
    const { getByRole } = render(<Switch disabled />);
    const sw = getByRole('switch');
    expect((sw as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(sw);
    expect(sw.getAttribute('aria-checked')).toBe('false');
  });

  it('reflects aria-invalid for the destructive state', () => {
    const { getByRole } = render(<Switch aria-invalid />);
    expect(getByRole('switch').getAttribute('aria-invalid')).toBe('true');
  });

  // DS-utility survival: corner-full is a custom @utility (not a stock rounded-*),
  // and the size axis drives data-[size]:* geometry. Both must survive cn()/twMerge.
  it('keeps the DS radius utility and size data-attribute', () => {
    const { getByRole } = render(<Switch size="sm" />);
    const sw = getByRole('switch');
    expect(sw.className).toContain('corner-full');
    expect(sw.getAttribute('data-size')).toBe('sm');
  });
});
