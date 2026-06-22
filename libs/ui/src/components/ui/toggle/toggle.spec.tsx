import { fireEvent, render } from '@testing-library/react';
import { Toggle } from './toggle';

describe('Toggle', () => {
  it('renders as a button, unpressed by default', () => {
    const { getByRole } = render(<Toggle aria-label="bold" />);
    const t = getByRole('button', { name: 'bold' });
    expect(t).toBeTruthy();
    expect(t.getAttribute('aria-pressed')).toBe('false');
  });

  it('toggles pressed state on click (uncontrolled)', () => {
    const { getByRole } = render(<Toggle aria-label="bold" />);
    const t = getByRole('button');
    fireEvent.click(t);
    expect(t.getAttribute('aria-pressed')).toBe('true');
    expect(t.getAttribute('data-state')).toBe('on');
    fireEvent.click(t);
    expect(t.getAttribute('aria-pressed')).toBe('false');
  });

  it('honors defaultPressed', () => {
    const { getByRole } = render(<Toggle defaultPressed aria-label="bold" />);
    expect(getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });

  it('does not toggle when disabled', () => {
    const { getByRole } = render(<Toggle disabled aria-label="bold" />);
    const t = getByRole('button') as HTMLButtonElement;
    expect(t.disabled).toBe(true);
    fireEvent.click(t);
    expect(t.getAttribute('aria-pressed')).toBe('false');
  });

  it('exposes variant + size data-attributes', () => {
    const { getByRole } = render(
      <Toggle variant="outline" size="sm" aria-label="bold" />
    );
    const t = getByRole('button');
    expect(t.getAttribute('data-variant')).toBe('outline');
    expect(t.getAttribute('data-size')).toBe('sm');
  });

  // DS-utility survival: corner-lg (custom @utility, not stock rounded-*) and the text-format-label
  // typography class must survive cn()/twMerge — the at-risk utilities for this control.
  it('keeps the DS radius + typography utilities', () => {
    const { getByRole } = render(<Toggle aria-label="bold" />);
    const cls = getByRole('button').className;
    expect(cls).toContain('corner-lg');
    expect(cls).toContain('text-format-label');
  });
});
