import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// shadcn button on the **radix-nova structure**, re-clothed in DS values
// (tokens-reference.md §6). Adopted from Nova: the denser size ladder (h-8/7/9,
// + xs and the icon-xs/sm/lg steps), per-size icon sizing via
// [&_svg:not([class*='size-'])]:size-N, ring-3 focus, active press, aria-invalid
// + aria-expanded affordances. Kept on DS conventions (NOT Nova's raw values):
//  · radius by NAME → DS scale (corner-lg=8, small sizes corner-md=6), not
//    Nova's parametric --radius=10 · text stays text-format-label (DS has no <14px sans).
// Colour clothing synced to the Figma .Button set (2026-06-17 -fill/-ink rework):
//    default = primary-fill surface + primary-ink text · outline/ghost hover =
//    accent-fill + accent-ink (selection tint) · secondary = secondary + -ink ·
//    destructive solid + destructive-ink text. Figma drives hover/active via a
//    state-layer overlay; here expressed as the DS /opacity idiom (see notes).

// Public scales authored once here; the cva objects are checked against them via `satisfies` (below)
// and the props are typed by them, so the docgen-readable unions can't drift from the cva.
//  · variant — the visual style axis.
//  · size — the geometry scale, shared by text and icon-only buttons. The square `icon*` cva keys are
//    NOT public sizes: an icon-only button is `size` (the scale) + `icon` (boolean), mapped in render.
type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type ButtonSize = 'default' | 'xs' | 'sm' | 'lg';
type IconSize = 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap corner-lg text-format-label transition-all active:translate-y-px disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  {
    variants: {
      variant: {
        default:
          'bg-primary-fill text-primary-ink hover:bg-primary-fill/90 active:bg-primary-fill/90',
        destructive:
          'bg-destructive text-destructive-ink hover:bg-destructive/90 active:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border bg-surface hover:bg-accent-fill hover:text-accent-ink active:bg-accent-fill active:text-accent-ink aria-expanded:bg-accent-fill aria-expanded:text-accent-ink',
        secondary:
          'bg-secondary-fill text-secondary-ink hover:bg-secondary-fill/80 active:bg-secondary-fill/80',
        ghost:
          'hover:bg-accent-fill hover:text-accent-ink active:bg-accent-fill active:text-accent-ink aria-expanded:bg-accent-fill aria-expanded:text-accent-ink',
        link: 'text-primary underline-offset-4 hover:underline active:underline',
      } satisfies Record<ButtonVariant, string>,
      size: {
        default: 'h-8 gap-sm px-md has-[>svg]:px-sm',
        xs: "h-6 gap-xs corner-md px-sm [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-xs corner-md px-md has-[>svg]:px-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-sm px-md has-[>svg]:px-sm',
        icon: 'size-8',
        'icon-xs': "size-6 corner-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': "size-7 corner-md [&_svg:not([class*='size-'])]:size-3.5",
        'icon-lg': 'size-9',
      } satisfies Record<ButtonSize | IconSize, string>,
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Own DS props, FLAT with JSDoc so react-docgen surfaces them (/docgen-props): `variant` + `size` are
// typed by the local named aliases (docgen resolves a named alias to its union → working select; a
// generic like VariantProps<…>['variant'] it does NOT resolve). `icon` is NOT here — it carries the
// a11y contract (icon-only ⟹ accessible name) and lives in the discriminated union below.
interface ButtonOwnProps {
  /**
   * Visual style — solid fills (`default`/`secondary`/`destructive`), tinted-on-interaction
   * (`outline`/`ghost`), or `link`.
   * @default "default"
   */
  variant?: ButtonVariant;
  /**
   * Size scale (geometry) — shared by text and icon-only buttons.
   * @default "default"
   */
  size?: ButtonSize;
  /**
   * Render the styling onto a single child element instead of a `<button>` (Radix Slot).
   * @default false
   */
  asChild?: boolean;
}

type ButtonBaseProps = Omit<
  React.ComponentProps<'button'>,
  'aria-label' | 'aria-labelledby'
> &
  ButtonOwnProps;

// "at least one of aria-label / aria-labelledby" — an icon-only control needs an accessible name. The
// constraint is inherently a 2-branch union (no single object expresses "at least one of two"); naming
// it keeps ButtonProps to one line and is reusable for other icon-only components.
type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-labelledby': string; 'aria-label'?: string };

// `icon` makes a square, icon-only button → `icon: true` requires an accessible name at the type level.
// `icon` is a boolean modifier on the size scale (icon + size → the square `icon*` cva key in render),
// NOT a separate variant.
type ButtonProps = ButtonBaseProps &
  (
    | { icon?: false; 'aria-label'?: string; 'aria-labelledby'?: string }
    | ({ icon: true } & AccessibleName)
  );

function Button({
  className,
  variant,
  size = 'default',
  icon = false,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  // icon + size → the square icon-* cva key (default→icon, xs→icon-xs, sm→icon-sm, lg→icon-lg);
  // otherwise the text size key. `icon` is consumed here, never spread onto the element.
  const resolvedSize: ButtonSize | IconSize = icon
    ? size === 'default'
      ? 'icon'
      : `icon-${size}`
    : size;

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size: resolvedSize, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
