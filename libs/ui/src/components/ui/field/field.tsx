import { useMemo } from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Public API. Four parts carry a curated, docgen-extractable prop API: Field + FieldGroup
// (CVA orientation — named alias + `satisfies Record<…>` on the cva so the docgen-readable
// union can't drift), FieldLegend (variant) and FieldError (errors), each re-declared flat
// with JSDoc so react-docgen surfaces it. The remaining parts (FieldSet/FieldContent/
// FieldLabel/FieldTitle/FieldDescription/FieldSeparator) are plain layout passthroughs.

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

interface FieldLegendProps extends React.ComponentProps<'legend'> {
  /**
   * Caption style — `legend` (section title) or `label` (control-sized).
   * @default "legend"
   */
  variant?: 'legend' | 'label';
}

function FieldLegend({ className, variant = 'legend', ...props }: FieldLegendProps) {
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

// FieldGroup stacks its Fields. orientation is a DS extension (stock shadcn ships a
// fixed flex-col group): horizontal lays the Fields in a wrapping row and lets each
// shrink to content — Field is w-full by default, so the row needs to override that
// (the same w-auto trick the responsive Field variant applies at @md). Parallels the
// RadioGroup container's orientation so checkbox groups get the same row capability.
type FieldGroupOrientation = 'vertical' | 'horizontal';

const fieldGroupVariants = cva(
  'group/field-group @container/field-group flex w-full gap-xl data-[slot=checkbox-group]:gap-lg *:data-[slot=field-group]:gap-xl',
  {
    variants: {
      orientation: {
        vertical: 'flex-col',
        horizontal: 'flex-row flex-wrap items-center [&>[data-slot=field]]:w-auto',
      } satisfies Record<FieldGroupOrientation, string>,
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  },
);

interface FieldGroupProps extends React.ComponentProps<'div'> {
  /**
   * Layout axis for the stacked Fields — `vertical` stacks them, `horizontal` lays them in a
   * wrapping row.
   * @default "vertical"
   */
  orientation?: FieldGroupOrientation;
}

function FieldGroup({ className, orientation = 'vertical', ...props }: FieldGroupProps) {
  return (
    <div
      data-slot="field-group"
      data-orientation={orientation}
      className={cn(fieldGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

const fieldVariants = cva('group/field flex w-full gap-md', {
  variants: {
    orientation: {
      vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    } satisfies Record<FieldOrientation, string>,
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

interface FieldProps extends React.ComponentProps<'div'> {
  /**
   * Flex axis of the row — `vertical` stacks label → control → description; `horizontal` puts
   * label + control on one row; `responsive` is column on narrow, row at `@md` (container query).
   * @default "vertical"
   */
  orientation?: FieldOrientation;
}

function Field({ className, orientation = 'vertical', ...props }: FieldProps) {
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

interface FieldErrorProps extends React.ComponentProps<'div'> {
  /**
   * Validation errors to render (dedup'd; one → text, many → bullet list). Omit when passing
   * `children`.
   */
  errors?: Array<{ message?: string } | undefined>;
}

function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
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
export type { FieldProps, FieldGroupProps, FieldLegendProps, FieldErrorProps };
