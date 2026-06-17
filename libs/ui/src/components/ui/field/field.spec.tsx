import { render } from '@testing-library/react';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from './field';

describe('Field', () => {
  it('renders a vertical field group by default', () => {
    const { container } = render(
      <Field>
        <FieldLabel htmlFor="x">Name</FieldLabel>
      </Field>,
    );
    const el = container.querySelector('[data-slot="field"]') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.getAttribute('data-orientation')).toBe('vertical');
    expect(el.getAttribute('role')).toBe('group');
  });

  it('honors the horizontal orientation', () => {
    const { container } = render(<Field orientation="horizontal" />);
    expect(
      container.querySelector('[data-slot="field"]')?.getAttribute('data-orientation'),
    ).toBe('horizontal');
  });

  // FieldGroup stacks vertically by default; orientation="horizontal" (DS extension)
  // switches it to a wrapping row that lets each Field shrink to content.
  it('stacks the FieldGroup vertically by default', () => {
    const { container } = render(
      <FieldGroup>
        <Field />
      </FieldGroup>,
    );
    const group = container.querySelector('[data-slot="field-group"]') as HTMLElement;
    expect(group.getAttribute('data-orientation')).toBe('vertical');
    expect(group.className).toContain('flex-col');
  });

  it('lays the FieldGroup in a row when orientation="horizontal"', () => {
    const { container } = render(
      <FieldGroup orientation="horizontal">
        <Field />
      </FieldGroup>,
    );
    const group = container.querySelector('[data-slot="field-group"]') as HTMLElement;
    expect(group.getAttribute('data-orientation')).toBe('horizontal');
    expect(group.className).toContain('flex-row');
    expect(group.className).not.toContain('flex-col');
  });

  // FieldError suppresses itself when there is no message, and renders role=alert
  // with the destructive format when there is one (the ⚠ placeholder token).
  it('renders FieldError only with content, as an alert', () => {
    const { container, rerender } = render(<FieldError />);
    expect(container.querySelector('[data-slot="field-error"]')).toBeNull();

    rerender(<FieldError>Required.</FieldError>);
    const err = container.querySelector('[data-slot="field-error"]') as HTMLElement;
    expect(err.getAttribute('role')).toBe('alert');
    expect(err.className).toContain('text-destructive');
    expect(err.className).toContain('text-format-body');
  });

  // FieldError dedupes identical messages and lists multiple distinct ones.
  it('dedupes and lists multiple errors', () => {
    const { container } = render(
      <FieldError
        errors={[{ message: 'A' }, { message: 'A' }, { message: 'B' }]}
      />,
    );
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(2);
  });

  // FieldSeparator nests the DS Separator and shows an inline label when given one.
  it('FieldSeparator nests a separator and an optional label', () => {
    const { container } = render(<FieldSeparator>or</FieldSeparator>);
    expect(container.querySelector('[data-slot="separator"]')).toBeTruthy();
    expect(
      container.querySelector('[data-slot="field-separator-content"]')?.textContent,
    ).toBe('or');
  });

  // Guards the T3 typography picks across the text-bearing parts (twMerge survival).
  it('carries the DS typography formats on its text parts', () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Caption</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldContent>
              <FieldTitle>Title</FieldTitle>
              <FieldDescription>Desc</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>,
    );
    expect(
      (container.querySelector('[data-slot="field-legend"]') as HTMLElement).className,
    ).toContain('text-format-title');
    expect(
      (container.querySelector('[data-slot="field-description"]') as HTMLElement).className,
    ).toContain('text-format-body');
  });
});
