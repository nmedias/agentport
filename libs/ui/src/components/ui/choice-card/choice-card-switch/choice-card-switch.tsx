import * as React from 'react';

import {ChoiceCardShell} from "@/components/ui/choice-card/choice-card-shell";
import {useFieldId} from "@/components/ui/choice-card/use-field-id";
import {Switch} from "@/components/ui/switch";

// Switch variant of the choice card. Same shell + a11y wiring as ChoiceCardCheckbox
// (aria-labelledby points the control at the FieldTitle id, reaching past the Field's
// role="group" which blocks implicit <label for> naming). Switch is a standalone boolean
// control, so checked / defaultChecked / onCheckedChange / size flow straight through.
type Props = Pick<React.ComponentProps<typeof ChoiceCardShell>, 'title' | 'description' | 'error'>
    & Omit<React.ComponentProps<typeof Switch>, 'title'>;

function ChoiceCardSwitch({id: idProp, title, description, error, disabled, ...props}: Props) {
    const id = useFieldId(idProp);

    return (
      <ChoiceCardShell id={id} title={title} description={description} disabled={disabled} error={error}>
          <Switch
              id={id}
              aria-labelledby={`${id}-title`}
              disabled={disabled}
              aria-invalid={!!error || undefined}
              {...props}
          />
      </ChoiceCardShell>
  );
}

export { ChoiceCardSwitch };
