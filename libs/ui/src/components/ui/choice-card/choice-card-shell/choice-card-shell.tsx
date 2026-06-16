import * as React from 'react';
import {Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle} from "@/components/ui/field";

type ChoiceCardShellProps = {
    title: React.ReactNode;
    children: React.ReactNode;
    id: string;
    description?: React.ReactNode;
    error?:  React.ReactNode;
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
