import * as React from 'react';

import {ChoiceCardShell} from "@/components/ui/choice-card/choice-card-shell";
import {useFieldId} from "@/components/ui/choice-card/use-field-id";
import {RadioGroupItem} from "@/components/ui/radio-group";

// Radio variant of the choice card. Same shell + a11y wiring as the others
// (aria-labelledby → FieldTitle id, past the Field's role="group"). Unlike checkbox/switch,
// a radio does NOT own its state: it carries a required `value` and must be rendered inside
// a <RadioGroup> — selection lives on the group (`value` / `onValueChange`), the card tints
// when the group's value matches this item's value (CSS :has() on data-state).
// Public API. The card props (title/description/error) are re-declared flat with JSDoc so
// react-docgen surfaces them; the rest of the RadioGroupItem surface is inherited via Omit.
// `value` stays required (a radio's value is mandatory) and matches the native string type.
interface ChoiceCardRadioProps
    extends Omit<React.ComponentProps<typeof RadioGroupItem>, 'title' | 'value' | 'disabled' | 'id'> {
    /** Card heading (rendered as `FieldTitle`). */
    title: React.ReactNode;
    /** Secondary line under the title (rendered as `FieldDescription`). */
    description?: React.ReactNode;
    /** When truthy, marks the card invalid: renders a `FieldError`, sets `data-invalid` on the Field and `aria-invalid` on the control. Empty/undefined = valid. */
    error?: React.ReactNode;
    /** The value this item selects in its parent RadioGroup (required). */
    value: string;
    /** Disables the control and dims the whole card. @default false */
    disabled?: boolean;
    /** Links the label to the control (`htmlFor` ↔ `id`). Auto-generated via `useId` if omitted. */
    id?: string;
}

function ChoiceCardRadio({id: idProp, title, description, error, disabled, ...props}: ChoiceCardRadioProps) {
    const id = useFieldId(idProp);

    return (
      <ChoiceCardShell id={id} title={title} description={description} disabled={disabled} error={error}>
          <RadioGroupItem
              id={id}
              aria-labelledby={`${id}-title`}
              disabled={disabled}
              aria-invalid={!!error || undefined}
              {...props}
          />
      </ChoiceCardShell>
  );
}

export { ChoiceCardRadio };
export type { ChoiceCardRadioProps };
