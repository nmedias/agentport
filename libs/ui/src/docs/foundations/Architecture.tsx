import { PROSE } from '../prose';
import { FoundationsPage, Group } from './foundations-kit';

/*
  Foundations / Architecture — the three token levels, each described by how it
  relates to the semantic level (tokens-reference.md §Architecture). Figma
  collections and CSS prefixes are deliberately NOT columns here: the utility
  level has neither, and the holes broke the chain the page is meant to show.
  The written form per level carries that chain instead.
*/

type Layer = {
  name: string;
  access: string;
  blurb: string;
  relation: string;
  written: string;
};

const LAYERS: Layer[] = [
  {
    name: 'Reference',
    access: 'internal',
    blurb:
      'The raw material: the colour ramps, the 4px base, the font parts, the shadow parts.',
    relation:
      'Sits below it — a semantic token resolves to a value here. Nothing in a component reaches this far down.',
    written: '--ap-color-signal-600',
  },
  {
    name: 'Semantic',
    access: 'public',
    blurb: 'Named after the role it plays, not after the value it carries.',
    relation:
      'This level. It is the whole surface a component may bind, and the only place a value is decided.',
    written: '--ap-sys-primary-fill',
  },
  {
    name: 'Utility (Tailwind)',
    access: 'public',
    blurb: 'How a semantic token reaches the markup — one class per decision.',
    relation:
      'Sits above it — a class per semantic token, generated from the same names.',
    written: 'bg-primary-fill',
  },
];

function LayerRow({ layer }: { layer: Layer }) {
  return (
    <div className="grid gap-lg border-t border-border py-2xl lg:grid-cols-[14rem_1fr]">
      <div className="flex flex-col gap-sm">
        <span className="text-format-title text-ink">{layer.name}</span>
        <span
          className={`w-fit corner-full px-md py-2xs text-format-data-md ${
            layer.access === 'public'
              ? 'bg-accent-fill text-accent-ink'
              : 'bg-muted-fill text-muted-ink'
          }`}
        >
          {layer.access}
        </span>
      </div>
      <div className="flex flex-col gap-lg">
        <p className={`max-w-[42rem] ${PROSE} text-ink text-pretty`}>
          {layer.blurb}
        </p>
        <dl className="grid gap-x-2xl gap-y-md sm:grid-cols-[1fr_14rem]">
          <div className="flex flex-col gap-2xs">
            <dt className="text-format-data-md text-muted">
              in relation to the semantic level
            </dt>
            <dd className={`${PROSE} text-ink text-pretty`}>
              {layer.relation}
            </dd>
          </div>
          <div className="flex flex-col gap-2xs">
            <dt className="text-format-data-md text-muted">written as</dt>
            <dd className="text-format-data-md text-ink">{layer.written}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function Architecture() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Architecture"
      title="Token architecture"
      intro="Foundations is the token layer, and it has three levels: the raw reference values, the semantic tokens named after their role, and the utilities that apply them. Components bind the semantic level and nothing else — that single rule is what keeps a retune to one edit."
    >
      <Group name="The three levels">
        <div className="flex flex-col">
          {LAYERS.map((l) => (
            <LayerRow key={l.name} layer={l} />
          ))}
        </div>
      </Group>
    </FoundationsPage>
  );
}

export default Architecture;
