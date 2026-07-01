import { render } from '@testing-library/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// Closed render only — SelectContent lives in a Radix Portal that mounts on open, so the
// jsdom specs exercise the trigger surface without needing the open-dropdown browser APIs
// (that path is covered by the storybook browser project + the play test).
function renderSelect(triggerProps?: React.ComponentProps<typeof SelectTrigger>) {
  return render(
    <Select>
      <SelectTrigger aria-label="Fruit" {...triggerProps}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
      </SelectContent>
    </Select>,
  );
}

describe('Select', () => {
  it('renders the trigger with the select-trigger data-slot', () => {
    const { container } = renderSelect();
    expect(container.querySelector('[data-slot="select-trigger"]')).toBeTruthy();
  });

  it('exposes the combobox role', () => {
    const { getByRole } = renderSelect();
    expect(getByRole('combobox')).toBeTruthy();
  });

  it('defaults the trigger to the default size', () => {
    const { getByRole } = renderSelect();
    expect(getByRole('combobox').getAttribute('data-size')).toBe('default');
  });

  it('reflects the sm size on the trigger', () => {
    const { getByRole } = renderSelect({ size: 'sm' });
    expect(getByRole('combobox').getAttribute('data-size')).toBe('sm');
  });

  it('honors the disabled attribute on the trigger', () => {
    const { getByRole } = renderSelect({ disabled: true });
    expect((getByRole('combobox') as HTMLButtonElement).disabled).toBe(true);
  });

  // Guards the T3 picks against the theme reset: corner-lg is a DS custom utility (rounded-* is
  // dead) and text-format-label-md is a multi-prop typo @utility — both must survive twMerge (the
  // cn() extension knows the corner-* + text-format groups), or the trigger silently loses its
  // radius / type. Assert they reach markup.
  it('carries the DS corner-lg radius + text-format-label-md utilities on the trigger', () => {
    const { getByRole } = renderSelect();
    const cls = getByRole('combobox').className;
    expect(cls).toContain('corner-lg');
    expect(cls).toContain('text-format-label-md');
  });
});
