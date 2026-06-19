import { FoundationsPage, Group } from './foundations-kit';

/*
  Foundations / Primitives — the raw OKLCH primitive ramps the semantic tokens
  alias (tokens-reference.md §1). These are INTERNAL: they live in :root only and
  are NOT bridged into Tailwind, so there are no bg-signal-400 utilities. This
  is the one page where the primitive vars ARE the subject, so each swatch reads
  its colour via inline style backgroundColor: var(--ap-color-<ramp>-<step>).
  The public API is the SEMANTIC layer — see the Colour page.
*/

type Step = { step: string; hex: string; note?: string };
type Ramp = { name: string; ref: string; steps: Step[] };

const RAMPS: Ramp[] = [
  {
    name: 'signal',
    ref: 'brand cyan',
    steps: [
      { step: '50', hex: '#c4feff' },
      { step: '100', hex: '#a4e5ff' },
      { step: '200', hex: '#7cceff' },
      { step: '300', hex: '#51b6f3' },
      { step: '400', hex: '#009fe3', note: 'brand' },
      { step: '500', hex: '#0081d2' },
      { step: '600', hex: '#0063bb' },
      { step: '700', hex: '#00459c' },
      { step: '800', hex: '#002779' },
      { step: '900', hex: '#000854' },
      { step: '950', hex: '#010034' },
    ],
  },
  {
    name: 'still',
    ref: 'muted cyan',
    steps: [
      { step: '50', hex: '#d8fbff' },
      { step: '100', hex: '#bde4fd' },
      { step: '200', hex: '#9fcdeb' },
      { step: '300', hex: '#80b7d9' },
      { step: '400', hex: '#61a1c8' },
      { step: '500', hex: '#3a8cba' },
      { step: '600', hex: '#0077a8' },
      { step: '700', hex: '#005685' },
      { step: '800', hex: '#003761' },
      { step: '900', hex: '#00193d' },
      { step: '950', hex: '#00001e' },
    ],
  },
  {
    name: 'deep',
    ref: 'deep navy',
    steps: [
      { step: '50', hex: '#eaf8ff' },
      { step: '100', hex: '#cfdde6' },
      { step: '200', hex: '#b2c4cf' },
      { step: '300', hex: '#97abb7' },
      { step: '400', hex: '#7c93a0' },
      { step: '500', hex: '#617c8b' },
      { step: '600', hex: '#476575' },
      { step: '700', hex: '#314f5e' },
      { step: '800', hex: '#1e3947' },
      { step: '900', hex: '#0d2531' },
      { step: '950', hex: '#00121c' },
    ],
  },
  {
    name: 'ink',
    ref: 'neutral greys',
    steps: [
      { step: '25', hex: '#f9fcfd' },
      { step: '50', hex: '#f3f5fa' },
      { step: '75', hex: '#e4e6eb' },
      { step: '100', hex: '#d5d8dd' },
      { step: '200', hex: '#b8bbc0' },
      { step: '300', hex: '#9b9fa5' },
      { step: '400', hex: '#7f848b' },
      { step: '500', hex: '#656971' },
      { step: '600', hex: '#4b5059' },
      { step: '700', hex: '#343840' },
      { step: '800', hex: '#1e2229' },
      { step: '900', hex: '#0d1016' },
      { step: '950', hex: '#020306' },
    ],
  },
  {
    name: 'success',
    ref: 'green',
    steps: [
      { step: '50', hex: '#defeec' },
      { step: '100', hex: '#c6ead6' },
      { step: '200', hex: '#abd7bf' },
      { step: '300', hex: '#91c4a8' },
      { step: '400', hex: '#76b192' },
      { step: '500', hex: '#57a07a' },
      { step: '600', hex: '#298058' },
      { step: '700', hex: '#005f3a' },
      { step: '800', hex: '#00401f' },
      { step: '900', hex: '#002207' },
      { step: '950', hex: '#000700' },
    ],
  },
  {
    name: 'warning',
    ref: 'amber',
    steps: [
      { step: '50', hex: '#fff0c8' },
      { step: '100', hex: '#fbd9ac' },
      { step: '200', hex: '#eac18a' },
      { step: '300', hex: '#d9a967' },
      { step: '400', hex: '#c8923f' },
      { step: '500', hex: '#af7000' },
      { step: '600', hex: '#944f00' },
      { step: '700', hex: '#753100' },
      { step: '800', hex: '#541500' },
      { step: '900', hex: '#340000' },
      { step: '950', hex: '#160000' },
    ],
  },
  {
    name: 'error',
    ref: 'red',
    steps: [
      { step: '50', hex: '#ffe3d9' },
      { step: '100', hex: '#ffc6bb' },
      { step: '200', hex: '#fca69a' },
      { step: '300', hex: '#e98779' },
      { step: '400', hex: '#d66859' },
      { step: '500', hex: '#c54235' },
      { step: '600', hex: '#b01207' },
      { step: '700', hex: '#8e0000' },
      { step: '800', hex: '#6a0000' },
      { step: '900', hex: '#440000' },
      { step: '950', hex: '#220000' },
    ],
  },
];

function RampStep({ ramp, step }: { ramp: string; step: Step }) {
  return (
    <div className="flex flex-col gap-sm">
      <div
        className="h-12 corner-md border border-border"
        style={{ backgroundColor: `var(--ap-color-${ramp}-${step.step})` }}
      />
      <div className="flex flex-col gap-2xs">
        <span className="text-format-data text-ink">
          {step.step}
          {step.note && (
            <span className="text-[color:var(--ap-color-signal-600)]">
              {' · '}
              {step.note}
            </span>
          )}
        </span>
        <span className="text-format-data text-muted-ink">{step.hex}</span>
        <span className="text-format-data text-muted-ink/60">
          {ramp}/{step.step}
        </span>
      </div>
    </div>
  );
}

export function Primitives() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Primitives"
      title="Primitives"
      intro="The raw OKLCH colour ramps that the semantic tokens alias. These are internal — they live in :root only and are NOT bridged into Tailwind, so there are no bg-signal-400 utilities. The SEMANTIC tokens (see the Colour page) are the public API; this page documents what they point at. Seven ramps plus base/white and the opacity primitive."
    >
      <Group name="base · white">
        <div className="grid gap-md [grid-template-columns:repeat(auto-fill,minmax(4.5rem,1fr))]">
          <RampStep ramp="base" step={{ step: 'white', hex: '#ffffff' }} />
        </div>
      </Group>

      {RAMPS.map((ramp) => (
        <Group key={ramp.name} name={`${ramp.name} · ${ramp.ref}`}>
          <div className="grid gap-md [grid-template-columns:repeat(auto-fill,minmax(4.5rem,1fr))]">
            {ramp.steps.map((step) => (
              <RampStep key={step.step} ramp={ramp.name} step={step} />
            ))}
          </div>
        </Group>
      ))}

      <Group
        name="opacity"
        note="A single opacity primitive (Figma 0–100 scale → CSS %). Composes the scrim dimmer."
      >
        <div className="flex flex-col gap-2xs">
          <span className="text-format-data text-ink">opacity/10</span>
          <span className="text-format-data text-muted-ink">10%</span>
        </div>
      </Group>
    </FoundationsPage>
  );
}

export default Primitives;
