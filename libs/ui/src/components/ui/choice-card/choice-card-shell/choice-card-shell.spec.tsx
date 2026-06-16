import { render } from '@testing-library/react';
import { ChoiceCardShell } from './choice-card-shell';

describe('ChoiceCardShell', () => {
  it('renders the title and description', () => {
    const { getByText } = render(
      <ChoiceCardShell id="x" title="My Title" description="My description">
        <button />
      </ChoiceCardShell>,
    );
    expect(getByText('My Title')).toBeTruthy();
    expect(getByText('My description')).toBeTruthy();
  });

  it('wires the label htmlFor to the given id', () => {
    const { container } = render(
      <ChoiceCardShell id="x" title="T">
        <button />
      </ChoiceCardShell>,
    );
    expect(container.querySelector('label')?.getAttribute('for')).toBe('x');
  });

  // The title carries a derived id so a control can target it via aria-labelledby.
  it('derives the title id as <id>-title', () => {
    const { getByText } = render(
      <ChoiceCardShell id="x" title="My Title">
        <button />
      </ChoiceCardShell>,
    );
    expect(getByText('My Title').id).toBe('x-title');
  });

  it('renders a FieldError only when error is set', () => {
    const { queryByText, rerender, getByText } = render(
      <ChoiceCardShell id="x" title="T">
        <button />
      </ChoiceCardShell>,
    );
    expect(queryByText('Boom')).toBeNull();
    rerender(
      <ChoiceCardShell id="x" title="T" error="Boom">
        <button />
      </ChoiceCardShell>,
    );
    expect(getByText('Boom')).toBeTruthy();
  });

  it('sets data-invalid on the field when error is set', () => {
    const { container } = render(
      <ChoiceCardShell id="x" title="T" error="Boom">
        <button />
      </ChoiceCardShell>,
    );
    expect(container.querySelector('[data-slot="field"]')?.getAttribute('data-invalid')).toBe('true');
  });
});
