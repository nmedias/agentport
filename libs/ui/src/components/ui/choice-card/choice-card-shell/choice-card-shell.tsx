import * as React from 'react';
import {Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle} from "@/components/ui/field";

type ChoiceCardShellProps = {
    /** Card heading — rendered as `FieldTitle` (its id wires the control's `aria-labelledby`). */
    title: React.ReactNode;
    /** The control slotted next to the text column (a `Checkbox`, `RadioGroupItem`, or `Switch`). */
    children: React.ReactNode;
    /** Links the `FieldLabel` (`htmlFor`) and the title id (`${id}-title`) to the control. */
    id: string;
    /** Secondary line under the title — rendered as `FieldDescription`. */
    description?: React.ReactNode;
    /** When truthy, marks the card invalid: renders a `FieldError` and sets `data-invalid` on the Field. */
    error?:  React.ReactNode;
    /** Dims the card via the Field's `data-disabled` group styling. @default false */
    disabled?: boolean;
}

function ChoiceCardShell({id, title, description, error, disabled, children}: ChoiceCardShellProps) {
    const invalid = !!error;

    return (
      <FieldLabel htmlFor={id} data-disabled={disabled || undefined}>
        <Field orientation="horizontal"
               data-disabled={disabled || undefined}
               data-invalid={invalid || undefined}>
          <FieldContent>
            <FieldTitle id={`${id}-title`}>{title}</FieldTitle>
            {description && <FieldDescription>{description}</FieldDescription>}
            {invalid && <FieldError>{error}</FieldError>}
          </FieldContent>
          {children}
        </Field>
      </FieldLabel>
  );
}

export { ChoiceCardShell };
export type { ChoiceCardShellProps };
