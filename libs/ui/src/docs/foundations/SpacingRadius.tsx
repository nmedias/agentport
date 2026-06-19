import { FoundationsPage, Group } from './foundations-kit';

/*
  Foundations / Spacing & Radius — the dimension scales (tokens-reference §2/§3).
  Spacing: one t-shirt scale on a 4px base, feeding gap/padding/margin via named
  utilities (numeric utilities also valid). Radius: the corner-* vocabulary; all
  rounded-* are dead. Live samples read from the real semantic vars / utilities.
*/

const SPACING = [
  { step: '2xs', px: '2' },
  { step: 'xs', px: '4' },
  { step: 'sm', px: '6' },
  { step: 'md', px: '8' },
  { step: 'lg', px: '12' },
  { step: 'xl', px: '16' },
  { step: '2xl', px: '24' },
  { step: '3xl', px: '32' },
  { step: '4xl', px: '48' },
  { step: '5xl', px: '80' },
];

const RADIUS = [
  { step: 'corner-none', cls: 'corner-none', px: '0', role: 'Square — no radius.' },
  { step: 'corner-sm', cls: 'corner-sm', px: '4', role: 'Small controls / chips / markers.' },
  { step: 'corner-md', cls: 'corner-md', px: '6', role: 'Medium containers.' },
  { step: 'corner-lg', cls: 'corner-lg', px: '8', role: 'Buttons, fields, icon buttons, toggles.' },
  { step: 'corner-xl', cls: 'corner-xl', px: '16', role: 'Large surfaces / windows.' },
  { step: 'corner-full', cls: 'corner-full', px: '9999', role: 'Pills (radius ≈ min(w,h)/2).' },
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
        note="gap-{step} · p{side}-{step} · m{side}-{step}. The bar width reads the real --ap-sys-space-{step} token."
      >
        <div className="flex flex-col gap-lg">
          {SPACING.map(({ step, px }) => (
            <div key={step} className="flex items-center gap-xl">
              <span className="w-12 shrink-0 text-format-data text-ink">
                {step}
              </span>
              <div
                className="h-4 shrink-0 corner-sm bg-inverse-fill"
                style={{ width: `var(--ap-sys-space-${step})` }}
              />
              <span className="text-format-data text-muted-ink">{px}px</span>
              <span className="text-format-data text-muted-ink">
                gap-{step} · p-{step}
              </span>
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
                <span className="text-format-data text-ink">{cls}</span>
                <span className="text-format-data text-muted-ink">{px}px</span>
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
