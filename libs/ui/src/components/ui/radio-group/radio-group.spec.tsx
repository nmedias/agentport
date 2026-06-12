import { fireEvent, render } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from './radio-group';

function Group({ defaultValue }: { defaultValue?: string }) {
  return (
    <RadioGroup defaultValue={defaultValue} aria-label="Density">
      <RadioGroupItem value="default" />
      <RadioGroupItem value="comfortable" />
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('renders one radio per item', () => {
    const { getAllByRole } = render(<Group />);
    expect(getAllByRole('radio')).toHaveLength(2);
  });

  it('reflects the default selection via aria-checked', () => {
    const { getAllByRole } = render(<Group defaultValue="comfortable" />);
    const [first, second] = getAllByRole('radio');
    expect(first.getAttribute('aria-checked')).toBe('false');
    expect(second.getAttribute('aria-checked')).toBe('true');
  });

  it('moves selection to the clicked item', () => {
    const { getAllByRole } = render(<Group defaultValue="default" />);
    const [first, second] = getAllByRole('radio');
    expect(first.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(second);
    expect(second.getAttribute('aria-checked')).toBe('true');
    expect(first.getAttribute('aria-checked')).toBe('false');
  });

  // Guards the T1 twMerge setup: corner-full (the DS radius utility) must survive
  // — without the cn() corner-group extension a later rounded-* could collapse it.
  it('keeps the DS radius class (corner-full survives twMerge)', () => {
    const { getAllByRole } = render(<Group />);
    expect(getAllByRole('radio')[0].className).toContain('corner-full');
  });

  it('honors the disabled group', () => {
    const { getAllByRole } = render(
      <RadioGroup disabled aria-label="Density">
        <RadioGroupItem value="default" />
      </RadioGroup>,
    );
    expect((getAllByRole('radio')[0] as HTMLButtonElement).disabled).toBe(true);
  });

  it('reflects aria-invalid for the destructive state', () => {
    const { getByRole } = render(
      <RadioGroup aria-label="Density">
        <RadioGroupItem value="default" aria-invalid />
      </RadioGroup>,
    );
    expect(getByRole('radio').getAttribute('aria-invalid')).toBe('true');
  });
});
