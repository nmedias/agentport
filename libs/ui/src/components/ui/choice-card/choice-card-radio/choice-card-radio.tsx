import * as React from 'react';

import {ChoiceCardShell} from "@/components/ui/choice-card/choice-card-shell";
import {useFieldId} from "@/components/ui/choice-card/use-field-id";
import {RadioGroupItem} from "@/components/ui/radio-group";

// Radio variant of the choice card. Same shell + a11y wiring as the others
// (aria-labelledby → FieldTitle id, past the Field's role="group"). Unlike checkbox/switch,
// a radio does NOT own its state: it carries a required `value` and must be rendered inside
// a <RadioGroup> — selection lives on the group (`value` / `onValueChange`), the card tints
// when the group's value matches this item's value (CSS :has() on data-state).
type Props = Pick<React.ComponentProps<typeof ChoiceCardShell>, 'title' | 'description' | 'error'>
    & Omit<React.ComponentProps<typeof RadioGroupItem>, 'title'>;

function ChoiceCardRadio({id: idProp, title, description, error, disabled, ...props}: Props) {
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
