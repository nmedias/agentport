import { FoundationsPage, Group, TypeSpecimen } from './foundations-kit';

/*
  Foundations / Typography — all 14 composition formats (tokens-reference.md §4).
  Each is a single `text-format-*` utility composing family + size + weight +
  line-height + tracking. The `role` text is the canonical `use` sentence from
  tokens-reference — the same string sits on the Figma text style.
*/

const FORMATS = [
  {
    format: 'text-format-display',
    sample: 'Display',
    family: 'sans',
    size: '43',
    weight: '800 extrabold',
    lineHeight: '1.0',
    tracking: '-0.5px',
    role: 'Hero headline — one per page at most.',
    ref: {
      family: 'family/sans',
      size: 'size/step-5',
      weight: 'weight/extrabold',
      lineHeight: 'line-height/tight',
      tracking: 'tracking/tight',
    },
  },
  {
    format: 'text-format-heading',
    sample: 'Heading',
    family: 'sans',
    size: '27',
    weight: '800 extrabold',
    lineHeight: '1.2',
    tracking: '-0.5px',
    role: 'Page / section heading.',
    ref: {
      family: 'family/sans',
      size: 'size/step-3',
      weight: 'weight/extrabold',
      lineHeight: 'line-height/snug',
      tracking: 'tracking/tight',
    },
  },
  {
    format: 'text-format-heading-sm',
    sample: 'Heading small',
    family: 'sans',
    size: '22',
    weight: '800 extrabold',
    lineHeight: '1.2',
    tracking: '-0.5px',
    role: 'Sub-heading inside a section.',
    ref: {
      family: 'family/sans',
      size: 'size/step-2',
      weight: 'weight/extrabold',
      lineHeight: 'line-height/snug',
      tracking: 'tracking/tight',
    },
  },
  {
    format: 'text-format-title',
    sample: 'Title',
    family: 'sans',
    size: '18',
    weight: '800 extrabold',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Title of a panel, group or dialog; the largest text inside a component.',
    ref: {
      family: 'family/sans',
      size: 'size/step-1',
      weight: 'weight/extrabold',
      lineHeight: 'line-height/normal',
      tracking: 'tracking/normal',
    },
  },
  {
    format: 'text-format-lead',
    sample: 'Lead — a larger intro paragraph that sets up the section.',
    family: 'sans',
    size: '18',
    weight: '400 regular',
    lineHeight: '1.5',
    tracking: '0',
    role: 'Large intro paragraph under a heading.',
    ref: {
      family: 'family/sans',
      size: 'size/step-1',
      weight: 'weight/regular',
      lineHeight: 'line-height/relaxed',
      tracking: 'tracking/normal',
    },
  },
  {
    format: 'text-format-body',
    sample: 'Body — the foreign system becomes readable.',
    family: 'sans',
    size: '14',
    weight: '400 regular',
    lineHeight: '1.5',
    tracking: '0',
    role: 'Running text; the app default.',
    ref: {
      family: 'family/sans',
      size: 'size/step-0',
      weight: 'weight/regular',
      lineHeight: 'line-height/relaxed',
      tracking: 'tracking/normal',
    },
  },
  {
    format: 'text-format-body-strong',
    sample: 'Body strong — emphasised running text.',
    family: 'sans',
    size: '14',
    weight: '600 semibold',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Emphasised run inside body text.',
    ref: {
      family: 'family/sans',
      size: 'size/step-0',
      weight: 'weight/semibold',
      lineHeight: 'line-height/normal',
      tracking: 'tracking/normal',
    },
  },
  {
    format: 'text-format-label-md',
    sample: 'Label',
    family: 'sans',
    size: '14',
    weight: '500 medium',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Default UI label — control labels, button text, field labels.',
    ref: {
      family: 'family/sans',
      size: 'size/step-0',
      weight: 'weight/medium',
      lineHeight: 'line-height/normal',
      tracking: 'tracking/normal',
    },
  },
  {
    format: 'text-format-label-sm',
    sample: 'Small label',
    family: 'sans',
    size: '11',
    weight: '500 medium',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Small UI label — secondary controls, dense rows.',
    ref: {
      family: 'family/sans',
      size: 'size/step-neg1',
      weight: 'weight/medium',
      lineHeight: 'line-height/normal',
      tracking: 'tracking/normal',
    },
  },
  {
    format: 'text-format-eyebrow uppercase',
    sample: 'Eyebrow micro-label',
    family: 'mono',
    size: '9',
    weight: '500 medium',
    lineHeight: 'normal',
    tracking: '0.5px',
    role: 'Uppercase micro-label above a title or group (mono, tracked).',
    ref: {
      family: 'family/mono',
      size: 'size/step-neg2',
      weight: 'weight/medium',
      lineHeight: 'line-height/normal',
      tracking: 'tracking/wide',
    },
  },
  {
    format: 'text-format-data-sm',
    sample: 'choice-card-switch · L3 · 2 parts',
    family: 'mono',
    size: '9',
    weight: '500 medium',
    lineHeight: 'normal',
    tracking: '0.5px',
    role: 'Micro mono value — meta, slugs, counters.',
    ref: {
      family: 'family/mono',
      size: 'size/step-neg2',
      weight: 'weight/medium',
      lineHeight: 'line-height/normal',
      tracking: 'tracking/wide',
    },
  },
  {
    format: 'text-format-data-md',
    sample: 'documentType · 2026-06-18 · 1,204 rows',
    family: 'mono',
    size: '11',
    weight: '500 medium',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Tabular mono value — identifiers, paths, property values.',
    ref: {
      family: 'family/mono',
      size: 'size/step-neg1',
      weight: 'weight/medium',
      lineHeight: 'line-height/normal',
      tracking: 'tracking/normal',
    },
  },
  {
    format: 'text-format-data-lg',
    sample: 'SELECT * FROM documents',
    family: 'mono',
    size: '18',
    weight: '400 regular',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Large mono value — the text of a command / query input.',
    ref: {
      family: 'family/mono',
      size: 'size/step-1',
      weight: 'weight/regular',
      lineHeight: 'line-height/normal',
      tracking: 'tracking/normal',
    },
  },
  {
    format: 'text-format-kbd',
    sample: 'Ctrl K',
    family: 'mono',
    size: '11',
    weight: '500 medium',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Keycap text.',
    ref: {
      family: 'family/mono',
      size: 'size/step-neg1',
      weight: 'weight/medium',
      lineHeight: 'line-height/normal',
      tracking: 'tracking/normal',
    },
  },
];

export function Typography() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Typography"
      title="Typography"
      intro="Two families: Hanken Grotesk for prose and headings, Geist Mono for eyebrows, data, keys and command input. Each format is one utility that sets family, size, weight, line-height and tracking together — never combine it with raw text- or font- classes."
    >
      <Group name="The format ladder">
        <div className="flex flex-col">
          {FORMATS.map((f) => (
            <TypeSpecimen key={f.format} {...f} />
          ))}
        </div>
      </Group>
    </FoundationsPage>
  );
}

export default Typography;
