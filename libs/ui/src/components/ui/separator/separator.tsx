import * as React from 'react';
import { Separator as SeparatorPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

// Public API. The curated subset of the Radix Separator surface is re-declared here as
// FLAT, own props so react-docgen can extract it (the default docgen propFilter drops
// anything declared in node_modules — i.e. the inherited Radix/DOM props — so JSDoc on
// `ComponentProps<typeof Root>` would never surface). Omit those keys from the inherited
// type first, then re-add them with JSDoc → one declaration each, attributed to this file.
// Everything else Radix accepts still passes through via the untouched rest of the base type.
interface SeparatorProps
  extends Omit<React.ComponentProps<typeof SeparatorPrimitive.Root>, 'orientation' | 'decorative'> {
  /**
   * Axis of the hairline — `horizontal` is a full-width rule between stacked content,
   * `vertical` a line that stretches to the row height between inline items.
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Semantic role only, not the look. `true` is non-semantic (`role="none"`, aria-hidden)
   * for a purely visual divider; `false` exposes the ARIA `separator` role for assistive tech.
   * @default true
   */
  decorative?: boolean;
}

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
export type { SeparatorProps };
