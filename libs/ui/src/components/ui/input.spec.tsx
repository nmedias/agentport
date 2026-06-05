import { render } from '@testing-library/react';
import { Input } from './input';

describe('Input', () => {
  it('renders an input with the placeholder', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Search…" />);
    expect(getByPlaceholderText('Search…')).toBeTruthy();
  });

  // Guards the T1 twMerge setup: without the `text-format` group, `text-label`
  // would collapse into text-color and silently drop from the markup.
  it('keeps the DS typography class (text-label survives twMerge)', () => {
    const { getByRole } = render(<Input />);
    expect(getByRole('textbox').className).toContain('text-label');
  });

  it('reflects aria-invalid for the destructive state', () => {
    const { getByRole } = render(<Input aria-invalid defaultValue="x" />);
    expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
  });

  it('honors the disabled attribute', () => {
    const { getByRole } = render(<Input disabled />);
    expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
  });
});
