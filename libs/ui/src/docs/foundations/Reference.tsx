import { Band, FoundationsPage, Group } from './foundations-kit';

/*
  Foundations / Reference — the raw values behind the semantic layer, in the four
  groups of the Figma `reference` collection: Color (§1), Dimension (§2/§3), Font
  (§4) and Effect (§5). This is the one page where the reference vars ARE the
  subject, so specimens read them directly via var(--ap-<path>).
  The magenta ramp is Figma-only (utilities + file docs) and is not mirrored here.
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
    name: 'neutral',
    ref: 'de-tinted greys',
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
        <span className="text-format-data-sm text-ink">
          {step.step}
          {step.note && (
            <span className="text-[color:var(--ap-color-signal-600)]">
              {' · '}
              {step.note}
            </span>
          )}
        </span>
        <span className="text-format-data-sm text-muted">{step.hex}</span>
        <span className="text-format-data-sm text-muted/60">
          {ramp}/{step.step}
        </span>
      </div>
    </div>
  );
}

// ── Dimension · Font · Effect ────────────────────────────────────────────────

type Ref = { name: string; value: string };

const DIMENSION_SPACE: Ref[] = [{ name: 'space/base', value: '4px' }];

const DIMENSION_RADIUS: Ref[] = [
  { name: 'radius/4', value: '4px' },
  { name: 'radius/6', value: '6px' },
  { name: 'radius/8', value: '8px' },
  { name: 'radius/16', value: '16px' },
  { name: 'radius/full', value: '9999px' },
];

const FONT_FAMILY: Ref[] = [
  { name: 'family/sans', value: 'Hanken Grotesk Variable' },
  { name: 'family/mono', value: 'Geist Mono Variable' },
];

const FONT_SIZE: Ref[] = [
  { name: 'scale', value: '1.25' },
  { name: 'size/base', value: '14px' },
  { name: 'size/step-neg2', value: '9px' },
  { name: 'size/step-neg1', value: '11px' },
  { name: 'size/step-0', value: '14px' },
  { name: 'size/step-1', value: '18px' },
  { name: 'size/step-2', value: '22px' },
  { name: 'size/step-3', value: '27px' },
  { name: 'size/step-4', value: '34px — unused' },
  { name: 'size/step-5', value: '43px' },
];

const FONT_WEIGHT: Ref[] = [
  { name: 'weight/regular', value: '400' },
  { name: 'weight/medium', value: '500' },
  { name: 'weight/semibold', value: '600' },
  { name: 'weight/extrabold', value: '800' },
];

const FONT_LINE_HEIGHT: Ref[] = [
  { name: 'line-height/tight', value: '1' },
  { name: 'line-height/snug', value: '1.2' },
  { name: 'line-height/relaxed', value: '1.5' },
  {
    name: 'line-height/normal',
    value: 'normal — CSS keyword, string in Figma',
  },
];

const FONT_TRACKING: Ref[] = [
  { name: 'tracking/tight', value: '-0.5px' },
  { name: 'tracking/normal', value: '0' },
  { name: 'tracking/wide', value: '0.5px' },
];

const EFFECT_GLOW: Ref[] = [
  { name: 'glow/x', value: '0' },
  { name: 'glow/y', value: '0' },
  { name: 'glow/blur', value: '4px' },
  { name: 'glow/spread', value: '0' },
  { name: 'glow/color', value: 'signal/400 @ 50%' },
];

const EFFECT_ELEVATION: Ref[] = [
  { name: 'elevation/x', value: '0' },
  { name: 'elevation/y', value: '14px' },
  { name: 'elevation/blur', value: '36px' },
  { name: 'elevation/spread', value: '-6px' },
  { name: 'elevation/color', value: 'neutral/900 @ 18%' },
];

// A plain name → value list; the reference layer has no utilities to show.
function RefList({ items }: { items: Ref[] }) {
  return (
    <dl className="grid gap-x-2xl gap-y-md sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <div key={i.name} className="flex flex-col gap-2xs">
          <dt className="text-format-data-sm text-ink">{i.name}</dt>
          <dd className="text-format-data-sm text-muted">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Radius primitives get a live corner sample cut from the reference var itself.
function RadiusSample() {
  return (
    <div className="grid grid-cols-2 gap-xl sm:grid-cols-3 lg:grid-cols-5">
      {DIMENSION_RADIUS.map((r) => (
        <div key={r.name} className="flex flex-col gap-md">
          <div
            className="h-16 border border-border-strong bg-card-fill"
            style={{
              borderRadius: `var(--ap-dimension-${r.name.replace('/', '-')})`,
            }}
          />
          <div className="flex flex-col gap-2xs">
            <span className="text-format-data-sm text-ink">{r.name}</span>
            <span className="text-format-data-sm text-muted">{r.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Reference() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Reference"
      title="Reference"
      intro="The raw values behind the semantic layer, in the four groups of the Figma reference collection. They live in :root only and are not bridged into Tailwind — there is no bg-signal-400; build against the semantic layer instead."
    >
      <Band
        name="Color"
        note="Seven OKLCH ramps plus base/white and one opacity value."
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

        <Group name="opacity" note="Composes the scrim dimmer.">
          <RefList items={[{ name: 'opacity/10', value: '10%' }]} />
        </Group>
      </Band>

      <Band
        name="Dimension"
        note="One 4px base carries the whole spacing scale; the radius steps are separate values."
      >
        <Group name="space">
          <RefList items={DIMENSION_SPACE} />
        </Group>
        <Group name="radius">
          <RadiusSample />
        </Group>
      </Band>

      <Band
        name="Font"
        note="Five parts per format. Sizes are a 1.25 modular scale off the 14px base, rounded to whole px."
      >
        <Group name="family">
          <RefList items={FONT_FAMILY} />
        </Group>
        <Group name="scale · size">
          <RefList items={FONT_SIZE} />
        </Group>
        <Group name="weight">
          <RefList items={FONT_WEIGHT} />
        </Group>
        <Group name="line-height">
          <RefList items={FONT_LINE_HEIGHT} />
        </Group>
        <Group name="tracking">
          <RefList items={FONT_TRACKING} />
        </Group>
      </Band>

      <Band
        name="Effect"
        note="Five parts per shadow. In Figma the colour part holds a raw RGBA — an effect colour cannot alias a ramp — so code is the source for it; elevation's Figma value differs on purpose."
      >
        <Group name="glow">
          <RefList items={EFFECT_GLOW} />
        </Group>
        <Group name="elevation">
          <RefList items={EFFECT_ELEVATION} />
        </Group>
      </Band>
    </FoundationsPage>
  );
}

export default Reference;
