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
//    the spacing theme folds them into every spacing group while keeping the numeric
//    scale (p-4 etc.) intact. CSS-side the steps exist only on the gap/padding/margin
//    families (tw-utilities.css @utility on --space-step-*; sizing names = container
//    scale) — the broader twMerge grouping is harmless, it only affects conflict
//    resolution among classes that exist.
// 3. Corner radius — the DS radius vocabulary is the custom corner-* utilities
//    (tw-utilities.css; rounded-* is dead). twMerge doesn't know them, so corner-lg
//    + corner-xl would not collapse. Registered with the same side/corner conflict
//    map as stock rounded (corner beats corner-t beats corner-tl, …).
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

const CORNER_STEPS = ['sm', 'md', 'lg', 'xl', 'full'];

type CornerGroup =
  | 'corner'
  | 'corner-t'
  | 'corner-r'
  | 'corner-b'
  | 'corner-l'
  | 'corner-tl'
  | 'corner-tr'
  | 'corner-br'
  | 'corner-bl';

const twMerge = extendTailwindMerge<'text-format' | CornerGroup>({
  extend: {
    theme: { spacing: SPACING_STEPS },
    classGroups: {
      'text-format': [{ text: TEXT_FORMATS }],
      corner: [{ corner: [...CORNER_STEPS, 'none'] }],
      'corner-t': [{ 'corner-t': CORNER_STEPS }],
      'corner-r': [{ 'corner-r': CORNER_STEPS }],
      'corner-b': [{ 'corner-b': CORNER_STEPS }],
      'corner-l': [{ 'corner-l': CORNER_STEPS }],
      'corner-tl': [{ 'corner-tl': CORNER_STEPS }],
      'corner-tr': [{ 'corner-tr': CORNER_STEPS }],
      'corner-br': [{ 'corner-br': CORNER_STEPS }],
      'corner-bl': [{ 'corner-bl': CORNER_STEPS }],
    },
    conflictingClassGroups: {
      corner: ['corner-t', 'corner-r', 'corner-b', 'corner-l', 'corner-tl', 'corner-tr', 'corner-br', 'corner-bl'],
      'corner-t': ['corner-tl', 'corner-tr'],
      'corner-r': ['corner-tr', 'corner-br'],
      'corner-b': ['corner-br', 'corner-bl'],
      'corner-l': ['corner-tl', 'corner-bl'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
