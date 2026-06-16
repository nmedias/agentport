import { render } from '@testing-library/react';
import { ChoiceCardSwitch } from './choice-card-switch';

describe('ChoiceCardSwitch', () => {
  it('renders the title and description', () => {
    const { getByText } = render(
      <ChoiceCardSwitch title="Airplane mode" description="Disable wireless" />,
    );
    expect(getByText('Airplane mode')).toBeTruthy();
    expect(getByText('Disable wireless')).toBeTruthy();
  });

  it('names the switch via aria-labelledby pointing at the title id', () => {
    const { getByRole } = render(<ChoiceCardSwitch title="Airplane mode" />);
    const labelledby = getByRole('switch').getAttribute('aria-labelledby') ?? '';
    expect(labelledby).toBeTruthy();
    expect(document.getElementById(labelledby)?.textContent).toBe('Airplane mode');
  });

  it('forwards checked + disabled to the control', () => {
    const { getByRole } = render(<ChoiceCardSwitch title="A" defaultChecked disabled />);
    const sw = getByRole('switch') as HTMLButtonElement;
    expect(sw.getAttribute('aria-checked')).toBe('true');
    expect(sw.disabled).toBe(true);
  });

  it('marks invalid and renders the error message when error is set', () => {
    const { getByRole, getByText } = render(<ChoiceCardSwitch title="A" error="Required" />);
    expect(getByRole('switch').getAttribute('aria-invalid')).toBe('true');
    expect(getByText('Required')).toBeTruthy();
  });
});
