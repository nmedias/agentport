import * as React from 'react';
import {useId} from "react";
import {Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle} from "@/components/ui/field";



type ShellProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

function ChoiceCardShell({title, description, error, disabled, children}: ShellProps) {
  const invalid = error != null;
  const id = useId();
  return (
      <FieldLabel htmlFor={id} data-disabled={disabled || undefined}>
        <Field orientation="horizontal"
               data-disabled={disabled || undefined}
               data-invalid={invalid || undefined}>
          <FieldContent>
            <FieldTitle>{title}</FieldTitle>
            {description && <FieldDescription>{description}</FieldDescription>}
            {error && <FieldError>{error}</FieldError>}
          </FieldContent>
          {children}   {/* ← hier kommt der Control rein */}
        </Field>
      </FieldLabel>
  );
}

export { ChoiceCardShell };
