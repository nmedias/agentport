import { FoundationsPage, Group } from './foundations-kit';

/*
  Foundations / Architecture — the three token layers and the naming rules that
  the other foundations pages assume (tokens-reference.md §Architecture + §Rules).
  This page carries the rules ONCE so the per-token pages can stay specimens.
*/

type Layer = {
  name: string;
  figma: string;
  css: string;
  code: string;
  public: boolean;
  blurb: string;
};

const LAYERS: Layer[] = [
  {
    name: 'Reference',
    figma: 'reference — Color · Dimension · Font · Effect',
    css: '--ap-<path>',
    code: '—',
    public: false,
    blurb:
      'The raw material: ramps, the 4px base, the font parts, the shadow parts. Not bridged into Tailwind, so it has no utilities.',
  },
  {
    name: 'Semantic',
    figma: 'semantic · semantic-dimension · semantic-typo',
    css: '--ap-sys-<name>',
    code: 'the layer components bind',
    public: true,
    blurb:
      'Every semantic token is an alias onto exactly one reference token, named after its role rather than its value.',
  },
  {
    name: 'Utility',
    figma: '—',
    css: '—',
    code: 'bg-* · text-* · corner-* · gap-* · text-format-*',
    public: true,
    blurb:
      'How the semantic layer is applied. One class per decision; the stock Tailwind equivalents are switched off.',
  },
];

function LayerRow({ layer }: { layer: Layer }) {
  return (
    <div className="grid gap-lg border-t border-border py-2xl lg:grid-cols-[14rem_1fr]">
      <div className="flex flex-col gap-sm">
        <span className="text-format-title text-ink">{layer.name}</span>
        <span
          className={`w-fit corner-full px-md py-2xs text-format-data-sm ${
            layer.public
              ? 'bg-accent-fill text-accent-ink'
              : 'bg-muted-fill text-muted-ink'
          }`}
        >
          {layer.public ? 'public' : 'internal'}
        </span>
      </div>
      <div className="flex flex-col gap-lg">
        <p className="max-w-[42rem] text-format-body text-ink text-pretty">
          {layer.blurb}
        </p>
        <dl className="grid gap-x-xl gap-y-md sm:grid-cols-3 text-format-data-sm">
          <Cell k="figma" v={layer.figma} />
          <Cell k="css" v={layer.css} />
          <Cell k="code" v={layer.code} />
        </dl>
      </div>
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-2xs">
      <dt className="text-muted">{k}</dt>
      <dd className="text-ink">{v}</dd>
    </div>
  );
}

const SUFFIXES: { suffix: string; meaning: string; example: string }[] = [
  {
    suffix: 'bare name or -fill',
    meaning: 'a surface',
    example: 'surface · card-fill · primary-fill',
  },
  {
    suffix: '-ink',
    meaning: 'text and icons on exactly that one surface',
    example: 'card-ink sits on card-fill',
  },
  {
    suffix: '-border',
    meaning: 'the edge of that same area',
    example: 'accent-border edges accent-fill',
  },
];

export function Architecture() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Architecture"
      title="Token architecture"
      intro="Foundations is the token layer, and it has three levels: raw reference values, the semantic aliases named after their role, and the utilities that apply them. Components only ever bind the semantic level — that single rule is what keeps a retune to one edit."
    >
      <Group name="The three levels">
        <div className="flex flex-col">
          {LAYERS.map((l) => (
            <LayerRow key={l.name} layer={l} />
          ))}
        </div>
      </Group>

      <Group
        name="Reading a token name"
        note="A colour token's suffix tells you where it may be applied, so the pages that follow do not repeat it per swatch."
      >
        <div className="flex flex-col">
          {SUFFIXES.map((s) => (
            <div
              key={s.suffix}
              className="grid gap-md border-t border-border py-xl lg:grid-cols-[14rem_1fr_1fr]"
            >
              <span className="text-format-data-md text-ink">{s.suffix}</span>
              <span className="text-format-body text-ink">{s.meaning}</span>
              <span className="text-format-data-sm text-muted">
                {s.example}
              </span>
            </div>
          ))}
        </div>
        <p className="max-w-[48rem] text-format-body text-ink text-pretty">
          Four colours stand alone and have no surface partner:{' '}
          <span className="text-format-data-md">ink</span>,{' '}
          <span className="text-format-data-md">primary</span>,{' '}
          <span className="text-format-data-md">muted</span> and{' '}
          <span className="text-format-data-md">brand-ink</span>. They colour
          type and shapes, never a container.
        </p>
      </Group>
    </FoundationsPage>
  );
}

export default Architecture;
