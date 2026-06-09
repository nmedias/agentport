import { render } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a textarea with the placeholder', () => {
    const { getByPlaceholderText } = render(
      <Textarea placeholder="Add a description…" />
    );
    expect(getByPlaceholderText('Add a description…')).toBeTruthy();
  });

  // Guards the T1 twMerge setup: without the `text-format` group, `text-label`
  // would collapse into text-color and silently drop from the markup.
  it('keeps the DS typography class (text-label survives twMerge)', () => {
    const { getByRole } = render(<Textarea />);
    expect(getByRole('textbox').className).toContain('text-label');
  });

  it('reflects aria-invalid for the destructive state', () => {
    const { getByRole } = render(<Textarea aria-invalid defaultValue="x" />);
    expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
  });

  it('honors the disabled attribute', () => {
    const { getByRole } = render(<Textarea disabled />);
    expect((getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(true);
  });
});
