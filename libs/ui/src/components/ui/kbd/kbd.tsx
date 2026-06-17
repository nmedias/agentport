import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// shadcn kbd on the **radix-nova structure**, re-clothed in DS values
// (tokens-reference.md §6). Nova ships kbd metric-identical to new-york
// (h-5/min-w-5/px-1→px-xs/gap-1→gap-xs/corner-sm/size-3), so geometry stays
// numeric. The Agentport Kbd set (3217:308) adds an **emphasis axis** (Figma
// variant `emphasis`, default high):
//  · high = inverted dark keycap — Inverse/inverse-fill + Inverse/inverse-ink.
//  · low  = quiet muted keycap   — shadcn muted-fill + muted-ink (stock look).
// Other bindings: text-format-kbd (Geist Mono Medium, "Kbd" style), gap-xs/px-xs
// (Space/space-xs), corner-sm (Corner/corner-sm). The tooltip-context overrides
// are code-only stock carryover (no Figma binding) — re-clothed to bg-surface/
// text-ink per §6. The content axis (text|icon) is children-driven, not a prop;
// modifier symbols (⌘ ⇧ …) belong here as an icon (the svg inherits the keycap
// colour via currentColor), not a text glyph.
const kbdVariants = cva(
  "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-xs corner-sm px-xs text-format-kbd select-none in-data-[slot=tooltip-content]:bg-surface/20 in-data-[slot=tooltip-content]:text-ink [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      emphasis: {
        high: 'bg-inverse-fill text-inverse-ink',
        low: 'bg-muted-fill text-muted-ink',
      },
    },
    defaultVariants: { emphasis: 'high' },
  }
);

function Kbd({
  className,
  emphasis,
  ...props
}: React.ComponentProps<'kbd'> & VariantProps<typeof kbdVariants>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ emphasis }), className)}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-xs', className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup, kbdVariants };
