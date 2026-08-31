import { FoundationsPage, Group } from './foundations-kit';

/*
  Foundations / Spacing & Radius — the dimension scales (tokens-reference §2/§3).
  Spacing: one t-shirt scale on a 4px base, feeding gap/padding/margin via named
  utilities (numeric utilities also valid). Radius: the corner-* vocabulary; all
  rounded-* are dead. Live samples read from the real semantic vars / utilities.
*/

const SPACING = [
  { step: '2xs', px: '2', role: 'Hairline — vertical padding of the smallest pill, gap between stacked micro-elements.' },
  { step: 'xs', px: '4', role: 'Gap inside a control (icon to label); tightest inner padding.' },
  { step: 'sm', px: '6', role: 'Inner padding of small controls; gap in inline text runs.' },
  { step: 'md', px: '8', role: 'Default — gap between siblings, standard control padding. Start here.' },
  { step: 'lg', px: '12', role: 'Padding of list rows and floating panels; gap between a control and its label block.' },
  { step: 'xl', px: '16', role: 'Padding of windows and panels; gap between groups.' },
  { step: '2xl', px: '24', role: 'Vertical breathing room of empty / placeholder states.' },
  { step: '3xl', px: '32', role: 'Reserved space for a trailing indicator inside a row.' },
  { step: '4xl', px: '48', role: 'Page and section margins of a layout.' },
  { step: '5xl', px: '80', role: 'Editorial / hero spacing only.' },
];

const RADIUS = [
  { step: 'corner-none', cls: 'corner-none', px: '0', role: 'Square — no radius.' },
  { step: 'corner-sm', cls: 'corner-sm', px: '4', role: 'Smallest radius — tick boxes, keycaps, markers and rows nested inside a panel.' },
  { step: 'corner-md', cls: 'corner-md', px: '6', role: 'Compact size class of a control (small / icon-only sizes), tooltips, menu rows.' },
  { step: 'corner-lg', cls: 'corner-lg', px: '8', role: 'Regular size class of a control — fields, standard buttons, floating panels, in-flow items. Default; start here.' },
  { step: 'corner-xl', cls: 'corner-xl', px: '16', role: 'Windows — dialogs and other large floating surfaces.' },
  { step: 'corner-full', cls: 'corner-full', px: '9999', role: 'Pills and circles — toggles, radio dots, slider parts, badges. Only for shapes meant to read as round.' },
];

export function SpacingRadius() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Dimension"
      title="Spacing & Radius"
      intro="One spacing scale serves gap, padding, and margin — t-shirt steps on a 4px base, applied via named utilities like gap-md / p-xl (numeric utilities such as p-4 stay valid for geometry). Radius is the corner-* vocabulary; the stock rounded-* utilities are dead. Pick a step by the size you need."
    >
      <Group
        name="Spacing"
        note="gap-{step} · p{side}-{step} · m{side}-{step}. One scale for gap, padding and margin — pick the step by the distance needed. The bar width reads the real --ap-sys-space-{step} token."
      >
        <div className="flex flex-col gap-lg">
          {SPACING.map(({ step, px, role }) => (
            <div key={step} className="flex items-center gap-xl">
              <span className="w-12 shrink-0 text-format-data-sm text-ink">
                {step}
              </span>
              <div
                className="h-4 shrink-0 corner-sm bg-inverse-fill"
                style={{ width: `var(--ap-sys-space-${step})` }}
              />
              <span className="text-format-data-sm text-muted">{px}px</span>
              <span className="text-format-data-sm text-muted">
                gap-{step} · p-{step}
              </span>
              <span className="text-format-body text-ink text-pretty">{role}</span>
            </div>
          ))}
        </div>
      </Group>

      <Group
        name="Radius"
        note="corner-{step}, plus per-side corner-t/r/b/l-* and per-corner corner-tl/tr/br/bl-*."
      >
        <div className="grid grid-cols-2 gap-xl sm:grid-cols-3 lg:grid-cols-6">
          {RADIUS.map(({ step, cls, px, role }) => (
            <div key={step} className="flex flex-col gap-md">
              <div
                className={`h-20 border border-border-strong bg-card-fill ${cls}`}
              />
              <div className="flex flex-col gap-2xs">
                <span className="text-format-data-sm text-ink">{cls}</span>
                <span className="text-format-data-sm text-muted">{px}px</span>
                <span className="mt-2xs text-format-body text-ink text-pretty">
                  {role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Group>
    </FoundationsPage>
  );
}

export default SpacingRadius;
