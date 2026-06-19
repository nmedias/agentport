import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Public API. Radix Label's whole surface is the htmlFor↔id pairing, but `htmlFor` is a
// standard DOM attribute inherited from ComponentProps<typeof Root> → the default docgen
// propFilter drops it (declared in node_modules), so JSDoc on the base type never surfaces.
// Omit it from the inherited type, then re-add it flat with JSDoc → one declaration here,
// attributed to this file → react-docgen extracts it. Everything else Radix/DOM accepts
// (children, id, the group/peer behaviour hooks) still passes through via the untouched
// rest of the base type.
interface LabelProps extends Omit<React.ComponentProps<typeof LabelPrimitive.Root>, 'htmlFor'> {
  /**
   * The `id` of the control this label names. Sets the native `for` association — clicking
   * the label focuses/toggles that control, and it becomes the control's accessible name.
   * Required for the a11y pairing.
   */
  htmlFor?: string;
}

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-md text-format-label select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
export type { LabelProps };
