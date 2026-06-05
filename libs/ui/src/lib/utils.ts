import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The 11 DS typography formats are multi-property @utility classes (.text-display …
// .text-input — see libs/ui/src/styles/globals.css). They live in the `text-*`
// namespace but set font/size/weight/leading/tracking, NOT colour. Stock twMerge
// classifies any `text-*` as the text-color group, so e.g. `text-label` +
// `text-primary-foreground` collapse and the typography class is dropped. Register
// the formats as their own group so they conflict only with each other, never with
// text colours.
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

const twMerge = extendTailwindMerge<'text-format'>({
  extend: {
    classGroups: {
      'text-format': [{ text: TEXT_FORMATS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
