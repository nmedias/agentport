import { FoundationsPage, Group, TypeSpecimen } from './foundations-kit';

/*
  Foundations / Typography — all 12 composition formats (tokens-reference.md §4).
  Each is a single `text-format-*` utility composing family + size + weight +
  line-height + tracking; the raw text-/font- utilities are dead. Specimen +
  the 5 part values + role, quoted from tokens-reference.
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
    role: 'Hero headline.',
  },
  {
    format: 'text-format-heading',
    sample: 'Heading',
    family: 'sans',
    size: '27',
    weight: '800 extrabold',
    lineHeight: '1.2',
    tracking: '-0.5px',
    role: 'Heading.',
  },
  {
    format: 'text-format-heading-sm',
    sample: 'Heading small',
    family: 'sans',
    size: '22',
    weight: '800 extrabold',
    lineHeight: '1.2',
    tracking: '-0.5px',
    role: 'Smaller heading.',
  },
  {
    format: 'text-format-title',
    sample: 'Title',
    family: 'sans',
    size: '18',
    weight: '600 semibold',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Section / panel title.',
  },
  {
    format: 'text-format-lead',
    sample: 'Lead — a larger intro paragraph that sets up the section.',
    family: 'sans',
    size: '18',
    weight: '400 regular',
    lineHeight: '1.5',
    tracking: '0',
    role: 'Large intro / lead body.',
  },
  {
    format: 'text-format-body',
    sample: 'Body — the foreign system becomes readable.',
    family: 'sans',
    size: '14',
    weight: '400 regular',
    lineHeight: '1.5',
    tracking: '0',
    role: 'Body copy; the app body default.',
  },
  {
    format: 'text-format-body-strong',
    sample: 'Body strong — emphasised running text.',
    family: 'sans',
    size: '14',
    weight: '600 semibold',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Emphasised body copy.',
  },
  {
    format: 'text-format-label',
    sample: 'Label',
    family: 'sans',
    size: '14',
    weight: '500 medium',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Form / toggle labels, button text.',
  },
  {
    format: 'text-format-eyebrow uppercase',
    sample: 'Eyebrow micro-label',
    family: 'mono',
    size: '9',
    weight: '500 medium',
    lineHeight: 'normal',
    tracking: '0.5px',
    role: 'Uppercase micro-labels.',
  },
  {
    format: 'text-format-data-sm',
    sample: 'documentType · 2026-06-18 · 1,204 rows',
    family: 'mono',
    size: '11',
    weight: '400 regular',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Small tabular mono data (also filenames etc.).',
  },
  {
    format: 'text-format-data-lg',
    sample: 'SELECT * FROM documents',
    family: 'mono',
    size: '18',
    weight: '400 regular',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Large mono data: command / query input.',
  },
  {
    format: 'text-format-kbd',
    sample: 'Ctrl K',
    family: 'mono',
    size: '11',
    weight: '500 medium',
    lineHeight: 'normal',
    tracking: '0',
    role: 'Keyboard key text.',
  },
];

export function Typography() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Typography"
      title="Typography"
      intro="Two families — Hanken Grotesk (sans) for prose and headings, Geist Mono (mono) for eyebrows, data, keys, and command input. Sizes follow a 1.25 modular scale off a 14px body base. Each format is ONE composition utility (text-format-*) that sets family, size, weight, line-height, and tracking together; the raw text-/font- utilities are intentionally dead. Hierarchy comes from weight and scale, not colour."
    >
      <Group
        name="The format ladder"
        note="Twelve formats, each a single text-format-* utility. The five part values are shown beside every specimen."
      >
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
