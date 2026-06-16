import { render } from '@testing-library/react';
import { ChoiceCardCheckbox } from './choice-card-checkbox';

describe('ChoiceCardCheckbox', () => {
  it('renders the title and description', () => {
    const { getByText } = render(
      <ChoiceCardCheckbox title="Notifications" description="Toggle me" />,
    );
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Toggle me')).toBeTruthy();
  });

  // The accessible-name fix: the Field's role="group" blocks implicit <label for> naming,
  // so the control is named explicitly via aria-labelledby → the FieldTitle id.
  it('names the checkbox via aria-labelledby pointing at the title id', () => {
    const { getByRole } = render(<ChoiceCardCheckbox title="Notifications" />);
    const labelledby = getByRole('checkbox').getAttribute('aria-labelledby') ?? '';
    expect(labelledby).toBeTruthy();
    expect(document.getElementById(labelledby)?.textContent).toBe('Notifications');
  });

  it('forwards checked + disabled to the control', () => {
    const { getByRole } = render(<ChoiceCardCheckbox title="N" defaultChecked disabled />);
    const cb = getByRole('checkbox') as HTMLButtonElement;
    expect(cb.getAttribute('aria-checked')).toBe('true');
    expect(cb.disabled).toBe(true);
  });

  it('marks invalid and renders the error message when error is set', () => {
    const { getByRole, getByText } = render(<ChoiceCardCheckbox title="N" error="Required" />);
    expect(getByRole('checkbox').getAttribute('aria-invalid')).toBe('true');
    expect(getByText('Required')).toBeTruthy();
  });

  it('treats an empty error as valid (no aria-invalid)', () => {
    const { getByRole } = render(<ChoiceCardCheckbox title="N" error="" />);
    expect(getByRole('checkbox').getAttribute('aria-invalid')).toBeNull();
  });
});
