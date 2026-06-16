import * as React from 'react';

import {ChoiceCardShell} from "@/components/ui/choice-card/choice-card-shell";
import {useFieldId} from "@/components/ui/choice-card/use-field-id";
import {Checkbox} from "@/components/ui/checkbox";



type Props = Pick<React.ComponentProps<typeof ChoiceCardShell>, 'title' | 'description' | 'error'>
    & Omit<React.ComponentProps<typeof Checkbox>, 'title'>;

function ChoiceCardCheckbox({id: idProp, title, description, error, disabled, ...props}: Props) {
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
