import * as React from 'react';

import {ChoiceCardShell} from "@/components/ui/choice-card/choice-card-shell";
import {useFieldId} from "@/components/ui/choice-card/use-field-id";
import {Checkbox} from "@/components/ui/checkbox";



// Public API. The card props (title/description/error) are re-declared flat with JSDoc so
// react-docgen surfaces them; the rest of the Checkbox surface is inherited via Omit (the
// curated keys are pulled out and re-declared, everything else still passes through via
// {...props}). Native control types are kept exactly — checked is Radix CheckedState
// (`boolean | 'indeterminate'`), narrowing would break callers.
interface ChoiceCardCheckboxProps
    extends Omit<
        React.ComponentProps<typeof Checkbox>,
        'title' | 'checked' | 'defaultChecked' | 'onCheckedChange' | 'disabled' | 'id'
    > {
    /** Card heading (rendered as `FieldTitle`). */
    title: React.ReactNode;
    /** Secondary line under the title (rendered as `FieldDescription`). */
    description?: React.ReactNode;
    /** When truthy, marks the card invalid: renders a `FieldError`, sets `data-invalid` on the Field and `aria-invalid` on the control. Empty/undefined = valid. */
    error?: React.ReactNode;
    /** Controlled checked state (pair with `onCheckedChange`). Accepts `"indeterminate"`. */
    checked?: boolean | 'indeterminate';
    /** Checked state when uncontrolled. @default false */
    defaultChecked?: boolean | 'indeterminate';
    /** Called when the checked state changes. */
    onCheckedChange?: (checked: boolean | 'indeterminate') => void;
    /** Disables the control and dims the whole card. @default false */
    disabled?: boolean;
    /** Links the label to the control (`htmlFor` ↔ `id`). Auto-generated via `useId` if omitted. */
    id?: string;
}

function ChoiceCardCheckbox({id: idProp, title, description, error, disabled, ...props}: ChoiceCardCheckboxProps) {
    const id = useFieldId(idProp);

    return (
      <ChoiceCardShell id={id} title={title} description={description} disabled={disabled} error={error}>
          <Checkbox
              id={id}
              aria-labelledby={`${id}-title`}
              disabled={disabled}
              aria-invalid={!!error || undefined }
              {...props}
          />
      </ChoiceCardShell>
  );
}

export { ChoiceCardCheckbox };
export type { ChoiceCardCheckboxProps };
