import * as React from 'react';

import {ChoiceCardShell} from "@/components/ui/choice-card/choice-card-shell";
import {useFieldId} from "@/components/ui/choice-card/use-field-id";
import {Switch} from "@/components/ui/switch";

// Switch variant of the choice card. Same shell + a11y wiring as ChoiceCardCheckbox
// (aria-labelledby points the control at the FieldTitle id, reaching past the Field's
// role="group" which blocks implicit <label for> naming). Switch is a standalone boolean
// control, so checked / defaultChecked / onCheckedChange / size flow straight through.
// Public API. The card props (title/description/error) are re-declared flat with JSDoc so
// react-docgen surfaces them; the rest of the Switch surface is inherited via Omit. Switch
// is a plain boolean control — checked / onCheckedChange are `boolean` (NOT the checkbox's
// `boolean | 'indeterminate'`); size matches the Switch's `'sm' | 'default'` union.
interface ChoiceCardSwitchProps
    extends Omit<
        React.ComponentProps<typeof Switch>,
        'title' | 'checked' | 'defaultChecked' | 'onCheckedChange' | 'size' | 'disabled' | 'id'
    > {
    /** Card heading (rendered as `FieldTitle`). */
    title: React.ReactNode;
    /** Secondary line under the title (rendered as `FieldDescription`). */
    description?: React.ReactNode;
    /** When truthy, marks the card invalid: renders a `FieldError`, sets `data-invalid` on the Field and `aria-invalid` on the control. Empty/undefined = valid. */
    error?: React.ReactNode;
    /** Controlled checked state (pair with onCheckedChange). */
    checked?: boolean;
    /** Checked state when uncontrolled. @default false */
    defaultChecked?: boolean;
    /** Called when the checked state changes. */
    onCheckedChange?: (checked: boolean) => void;
    /** Track size. @default "default" */
    size?: 'sm' | 'default';
    /** Disables the control and dims the whole card. @default false */
    disabled?: boolean;
    /** Links the label to the control (`htmlFor` ↔ `id`). Auto-generated via `useId` if omitted. */
    id?: string;
}

function ChoiceCardSwitch({id: idProp, title, description, error, disabled, ...props}: ChoiceCardSwitchProps) {
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
export type { ChoiceCardSwitchProps };
