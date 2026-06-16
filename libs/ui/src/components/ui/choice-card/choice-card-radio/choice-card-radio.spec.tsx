import { render } from '@testing-library/react';
import { RadioGroup } from '@/components/ui/radio-group';
import { ChoiceCardRadio } from './choice-card-radio';

describe('ChoiceCardRadio', () => {
  it('renders the title and description', () => {
    const { getByText } = render(
      <RadioGroup>
        <ChoiceCardRadio value="pro" title="Pro" description="For growing teams" />
      </RadioGroup>,
    );
    expect(getByText('Pro')).toBeTruthy();
    expect(getByText('For growing teams')).toBeTruthy();
  });

  it('renders the title and names the radio via aria-labelledby', () => {
    const { getByRole, getByText } = render(
      <RadioGroup>
        <ChoiceCardRadio value="pro" title="Pro" description="For teams" />
      </RadioGroup>,
    );
    expect(getByText('Pro')).toBeTruthy();
    const labelledby = getByRole('radio').getAttribute('aria-labelledby') ?? '';
    expect(labelledby).toBeTruthy();
    expect(document.getElementById(labelledby)?.textContent).toBe('Pro');
  });

  // Radio doesn't own its state: it's selected when the group's value matches its value.
  it('is selected when the group value matches its value', () => {
    const { getByRole } = render(
      <RadioGroup value="pro">
        <ChoiceCardRadio value="pro" title="Pro" />
      </RadioGroup>,
    );
    expect(getByRole('radio').getAttribute('aria-checked')).toBe('true');
  });

  it('marks invalid and renders the error message when error is set', () => {
    const { getByRole, getByText } = render(
      <RadioGroup>
        <ChoiceCardRadio value="pro" title="Pro" error="Pick one" />
      </RadioGroup>,
    );
    expect(getByRole('radio').getAttribute('aria-invalid')).toBe('true');
    expect(getByText('Pick one')).toBeTruthy();
  });
});
