import { render } from '@testing-library/react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from './input-group';

describe('InputGroup', () => {
  it('renders the group with role and data-slot', () => {
    const { getByRole } = render(
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
      </InputGroup>
    );
    const group = getByRole('group');
    expect(group.getAttribute('data-slot')).toBe('input-group');
  });

  it('marks the input as the focusable control (borderless)', () => {
    const { getByPlaceholderText } = render(
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
      </InputGroup>
    );
    const input = getByPlaceholderText('Search…');
    expect(input.getAttribute('data-slot')).toBe('input-group-control');
    expect(input.className).toContain('border-0');
  });

  it('sets data-align on the addon', () => {
    const { getByText } = render(
      <InputGroup>
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    );
    expect(
      getByText('USD')
        .closest('[data-slot=input-group-addon]')
        ?.getAttribute('data-align')
    ).toBe('inline-end');
  });

  it('renders a ghost button via InputGroupButton', () => {
    const { getByRole } = render(
      <InputGroup>
        <InputGroupButton aria-label="Clear">x</InputGroupButton>
      </InputGroup>
    );
    expect(getByRole('button').getAttribute('type')).toBe('button');
  });

  // Guards the T1 twMerge setup: the DS typography class must survive on the
  // borderless textarea control (text-format group, else it collapses under text-color).
  it('keeps the DS typography class on the textarea control', () => {
    const { getByRole } = render(
      <InputGroup>
        <InputGroupTextarea placeholder="Notes" />
      </InputGroup>
    );
    expect(getByRole('textbox').className).toContain('text-format-label');
  });
});
