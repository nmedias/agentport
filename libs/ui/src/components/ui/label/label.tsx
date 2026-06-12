import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Radix Label re-clothed in DS tokens. Co-ported as a Field dependency
// (FieldLabel wraps it); usable standalone for any control caption.
//
// DS re-clothe (tokens-reference.md §6 / §4):
//  · text-sm leading-none font-medium → text-format-label — the DS label
//    format (14 / 500), the documented role "Form-/Toggle-Labels, Button-Text".
//    The three stock typography utilities are dead under the theme reset (§6);
//    one composition class carries family+size+weight+line-height+tracking.
//  · gap-2 (8px) → gap-md — the icon↔text gap on the named spacing scale (§3).
//  · select-none + the group/peer-disabled opacity dimming are behaviour, no
//    DS surface — kept verbatim.
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
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
