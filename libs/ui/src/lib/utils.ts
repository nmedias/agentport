import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge does NOT read globals.css or the Tailwind config — it has its own
// built-in knowledge of class groups for conflict resolution. Two DS additions must
// be taught to it manually, or className overrides misbehave:
//
// 1. Typography formats — the 11 multi-property @utility classes (.text-display …
//    .text-input) live in the `text-*` namespace but set font/size/weight, NOT
//    colour. Stock twMerge files any `text-*` under text-color, so `text-label` +
//    `text-primary-foreground` collapse and the typography class is dropped.
//    Registering them as their own group makes them conflict only with each other.
// 2. Named spacing — our t-shirt spacing steps (gap-md, p-lg, px-2xl …) are not in
//    twMerge's built-in numeric spacing scale, so it leaves them unrecognised and a
//    later `gap-lg` would NOT override an earlier `gap-md`. Adding the step names to
//    the spacing theme folds them into every spacing group (gap/p/m/px/size/…) while
//    keeping the numeric scale (p-4 etc.) intact.
const TEXT_FORMATS = [
  'display',
  'heading',
  'heading-sm',
  'title',
  'body',
  'body-strong',
  'label',
  'eyebrow',
  'data',
  'kbd',
  'input',
];

const SPACING_STEPS = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

const twMerge = extendTailwindMerge<'text-format'>({
  extend: {
    theme: { spacing: SPACING_STEPS },
    classGroups: {
      'text-format': [{ text: TEXT_FORMATS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
