import { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Field — the shadcn/Radix form-field composite, re-clothed in DS tokens.
//
// Field has NO root element: it is ~10 pure layout/typography/spacing/a11y parts
// (no border / bg / shadow of their own — the control inside carries the surface).
// DS port (tokens-reference.md §3 spacing-by-px, §4 typo formats, §6 stock→DS):
//  · the named-spacing scale skips 20px → FieldGroup's stock gap-5 (20) lands on
//    gap-xl (16, denser — the Nova density direction) rather than gap-2xl (24);
//    noted in the run notes as a no-exact-rung pick.
//  · gap-4→gap-xl(16) · gap-3→gap-lg(12) · gap-2→gap-md(8) · gap-0.5→gap-2xs(2)
//    · gap-1→gap-xs(4) · mb-1.5/-mt-1.5→mb-sm/-mt-sm(6) · -my-2/-mb-2→-my-md(8)
//    · -mt-1→-mt-xs(4) · px-2→px-md(8) · ml-4→ml-xl(16).
//  · typography: the three stock utilities (text-sm/font-*/leading-*) are dead
//    under the theme reset (§6) → one text-format-* composition class each:
//    label/title → text-format-label (14/500); legend → text-format-title
//    (18/600 — 16px text-base has no DS rung, picked by the section-caption ROLE);
//    description/error → text-format-body (14/400/1.5). Standalone leading-* dropped.
//  · FieldError colour = the destructive token (text-destructive, now error/600 — a
//    real DS semantic since the 2026-06-17 rework, no longer a placeholder).
//  · invalid state keeps label + description NEUTRAL (ink / muted-ink) — only the
//    control (aria-invalid border/ring) + FieldError go destructive, matching the
//    Figma .Field design (3716:1020). This deviates from stock shadcn's group-wide
//    data-[invalid=true]:text-destructive, which reddened the label by inheritance.
//  · colour rework 2026-06-17 (-fill/-ink): description/separator text-muted-foreground
//    → text-muted-ink, separator bg-background → bg-surface; checked choice-card tint
//    (FieldLabel/FieldTitle) on accent-fill/accent-border/accent-ink (see those parts).
//  · rounded-lg→corner-lg; every dark: variant dropped (light is the only mode).
//  · responsive orientation (container-query @md flips column→row) is CODE-ONLY —
//    not modelled in Figma (Figma has no container queries); kept verbatim here.

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'flex flex-col gap-xl has-[>[data-slot=checkbox-group]]:gap-lg has-[>[data-slot=radio-group]]:gap-lg',
        className,
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-sm data-[variant=label]:text-format-label data-[variant=legend]:text-format-title',
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-xl data-[slot=checkbox-group]:gap-lg *:data-[slot=field-group]:gap-xl',
        className,
      )}
      {...props}
    />
  );
}

const fieldVariants = cva('group/field flex w-full gap-md', {
  variants: {
    orientation: {
      vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn('group/field-content flex flex-1 flex-col gap-2xs', className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        // checked choice-card tint = the accent selection model (Figma-synced 2026-06-17):
        // card fill → accent-fill (deep/50), stroke → accent-border (still/200); the title
        // recolours to accent-ink (see FieldTitle). The colour rework re-clothed the checked stroke
        // from primary to accent-border (Figma .ChoiceCard/* checked=on members bind accent-border).
        'group/field-label peer/field-label flex w-fit gap-md group-data-[disabled=true]/field:opacity-50 has-data-checked:border-accent-border has-data-checked:bg-accent-fill has-[>[data-slot=field]]:corner-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-md',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        // in a checked choice-card the title reads as accent-ink (signal/600) on the
        // accent tint — scoped to the FieldLabel card group so plain field rows are unaffected.
        'flex w-fit items-center gap-md text-format-label group-data-[disabled=true]/field:opacity-50 group-has-data-checked/field-label:text-accent-ink',
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        'text-left text-format-body text-muted-ink group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-sm',
        'last:mt-0 nth-last-2:-mt-xs',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        'relative -my-md h-5 text-format-body group-data-[variant=outline]/field-group:-mb-md',
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-surface px-md text-muted-ink"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-xl flex list-disc flex-col gap-xs">
        {uniqueErrors.map(
          (error, index) => error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn('text-format-body text-destructive', className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
