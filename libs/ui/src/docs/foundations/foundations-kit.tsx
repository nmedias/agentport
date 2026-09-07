import * as React from 'react';

import { PROSE } from '../prose';

/*
  Foundations — shared specimen kit.

  Renders DS tokens live, each labelled by its real token name / utility classes /
  reference token + value / role (all from tokens-reference.md — not invented).
  Token discipline:
  components use SEMANTIC tokens only; `primary` and `ink` are TEXT/STROKE tokens
  (no bg- frame fills). Geometry stays numeric.
*/

// ── Page shell ───────────────────────────────────────────────────────────────

export function FoundationsPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface text-ink text-format-body">
      <header className="border-b border-border px-2xl py-4xl md:px-4xl">
        <div className="mx-auto max-w-[72rem]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-lg text-format-display text-ink text-[clamp(2.25rem,5vw,3.25rem)] leading-[0.95]">
            {title}
          </h1>
          <p className={`mt-xl max-w-[48rem] ${PROSE} text-ink text-pretty`}>
            {intro}
          </p>
        </div>
      </header>
      <div className="mx-auto flex max-w-[72rem] flex-col gap-4xl px-2xl py-4xl md:px-4xl">
        {children}
      </div>
    </div>
  );
}

// Mono micro-label opening a group; the leading tick is a stroke line, not a fill.
export function Eyebrow({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-md text-format-eyebrow uppercase text-muted ${className}`}
    >
      <span aria-hidden className="h-px w-6 bg-border-strong" />
      {children}
    </span>
  );
}

// A token group: heading + optional note + its specimen rows. The heading is a
// real step in the ladder (page display > Band heading > Group heading-sm >
// whatever a page titles inside a group) — not an eyebrow: on the Colour page
// these names carry the whole structure.
export function Group({
  name,
  note,
  children,
}: {
  name: string;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-xl">
      <div className="flex flex-col gap-sm">
        <h3 className="flex items-center gap-md text-format-heading-sm text-ink">
          <span aria-hidden className="h-px w-6 bg-border-strong" />
          {name}
        </h3>
        {note && (
          <p className={`max-w-[48rem] ${PROSE} text-ink text-pretty`}>
            {note}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

// A band groups several Groups under one heading — used on the Reference page,
// where the four reference groups (Color / Dimension / Font / Effect) each hold
// a set of Groups.
export function Band({
  name,
  note,
  children,
}: {
  name: string;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2xl border-t border-border-emphasis pt-2xl first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-sm">
        <h2 className="text-format-heading text-ink">{name}</h2>
        {note && (
          <p className={`max-w-[48rem] ${PROSE} text-ink text-pretty`}>
            {note}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

// Specimens stack as rows; each Row keeps a related set (a fill + its ink + its
// border) together on one line instead of letting them wrap apart in one grid.
export function Rows({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2xl">{children}</div>;
}

export function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-2xl sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

// ── Token chip ───────────────────────────────────────────────────────────────

// A token NAME reads as a name, not as a value: sans, chip-sized, one step up
// from the mono meta lines under it.
export function TokenChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-fit corner-sm bg-card-fill px-sm py-2xs text-format-label-md text-card-ink">
      {children}
    </span>
  );
}

// ── Token meta line ──────────────────────────────────────────────────────────

// The shared label block under every specimen: the token NAME as a chip (sans —
// it is a name, not a value), the possible utility CLASSES (mono, muted), the
// reference token it resolves to + the raw value, the SCOPES it may be applied
// in, then the role. Scopes are the `scopes` field of tokens-reference.md in
// Figma vocabulary — that field is canonical for this page and for Figma.
function TokenMeta({
  token,
  utilities,
  primitive,
  value,
  scopes,
  role,
}: {
  token: string;
  utilities: string;
  primitive: string;
  value: string;
  scopes: string;
  role?: string;
}) {
  return (
    <div className="flex flex-col gap-sm">
      <TokenChip>{token}</TokenChip>
      <div className="flex flex-col gap-2xs">
        <span className="text-format-data-md text-muted">{utilities}</span>
        <span className="text-format-data-md text-muted/60">
          {primitive} · {value}
        </span>
        <span className="text-format-data-md text-muted/60">{scopes}</span>
      </div>
      {role && (
        <span className="mt-md text-format-body text-ink text-pretty">{role}</span>
      )}
    </div>
  );
}

// ── Colour specimens (one per application) ───────────────────────────────────

// Frame-fill token → a bg- swatch. Light fills get a hairline so they read.
export function FillSwatch({
  bg,
  token,
  utilities,
  primitive,
  value,
  scopes,
  role,
  border = false,
}: {
  bg: string;
  token: string;
  utilities: string;
  primitive: string;
  value: string;
  scopes: string;
  role: string;
  border?: boolean;
}) {
  return (
    <div className="flex flex-col gap-md">
      <div
        className={`h-16 corner-lg ${bg} ${border ? 'border border-border' : ''}`}
      />
      <TokenMeta
        token={token}
        utilities={utilities}
        primitive={primitive}
        value={value}
        scopes={scopes}
        role={role}
      />
    </div>
  );
}

// Text/ink token → applied as type on a surface card.
export function TextSwatch({
  text,
  token,
  utilities,
  primitive,
  value,
  scopes,
  role,
  onFill,
}: {
  text: string;
  token: string;
  utilities: string;
  primitive: string;
  value: string;
  scopes: string;
  role: string;
  // when the ink belongs ON a dark fill, preview it on that fill
  onFill?: string;
}) {
  return (
    <div className="flex flex-col gap-md">
      <div
        className={`flex h-16 items-center corner-lg border border-border px-lg ${
          onFill ?? 'bg-surface'
        }`}
      >
        <span className={`text-format-title ${text}`}>Aa — 1234</span>
      </div>
      <TokenMeta
        token={token}
        utilities={utilities}
        primitive={primitive}
        value={value}
        scopes={scopes}
        role={role}
      />
    </div>
  );
}

// Border token → a divider line at its real weight/colour on a surface card.
export function BorderSwatch({
  border,
  token,
  utilities,
  primitive,
  value,
  scopes,
  role,
}: {
  border: string;
  token: string;
  utilities: string;
  primitive: string;
  value: string;
  scopes: string;
  role: string;
}) {
  return (
    <div className="flex flex-col gap-md">
      <div className="flex h-16 items-center corner-lg border border-border bg-surface px-lg">
        <span className={`h-0 w-full border-t ${border}`} />
      </div>
      <TokenMeta
        token={token}
        utilities={utilities}
        primitive={primitive}
        value={value}
        scopes={scopes}
        role={role}
      />
    </div>
  );
}

// Ring token → a focus-ring sample (a chip wearing the ring).
export function RingSwatch({
  ring,
  token,
  utilities,
  primitive,
  value,
  scopes,
  role,
}: {
  ring: string;
  token: string;
  utilities: string;
  primitive: string;
  value: string;
  scopes: string;
  role: string;
}) {
  return (
    <div className="flex flex-col gap-md">
      <div className="flex h-16 items-center justify-center corner-lg border border-border bg-surface px-lg">
        <span
          className={`corner-md bg-card-fill px-lg py-md text-format-data-md text-ink ring-2 ${ring}`}
        >
          focus
        </span>
      </div>
      <TokenMeta
        token={token}
        utilities={utilities}
        primitive={primitive}
        value={value}
        scopes={scopes}
        role={role}
      />
    </div>
  );
}

// Scrim token → the modal dimmer over a mock surface.
export function ScrimSwatch({
  token,
  utilities,
  primitive,
  value,
  scopes,
  role,
}: {
  token: string;
  utilities: string;
  primitive: string;
  value: string;
  scopes: string;
  role: string;
}) {
  return (
    <div className="flex flex-col gap-md">
      <div className="relative h-16 overflow-hidden corner-lg border border-border bg-surface">
        {/* a faux content row, then the scrim over it */}
        <div className="absolute inset-x-lg top-lg h-2 corner-full bg-card-fill" />
        <div className="absolute inset-x-lg top-[1.75rem] h-2 w-1/2 corner-full bg-card-fill" />
        <div className="absolute inset-0 bg-scrim" />
      </div>
      <TokenMeta
        token={token}
        utilities={utilities}
        primitive={primitive}
        value={value}
        scopes={scopes}
        role={role}
      />
    </div>
  );
}

// ── Typography specimen ──────────────────────────────────────────────────────

export function TypeSpecimen({
  format,
  sample,
  family,
  size,
  weight,
  lineHeight,
  tracking,
  role,
  ref,
}: {
  format: string;
  sample: string;
  family: string;
  size: string;
  weight: string;
  lineHeight: string;
  tracking: string;
  role: string;
  // the reference token behind each part (tokens-reference §4 `primitive`)
  ref: {
    family: string;
    size: string;
    weight: string;
    lineHeight: string;
    tracking: string;
  };
}) {
  return (
    <div className="grid gap-lg border-t border-border py-2xl lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-md">
        <span className={`${format} text-ink`}>{sample}</span>
        {/* the class may carry an extra utility (eyebrow adds uppercase) —
            the chip names the format token only */}
        <TokenChip>{format.split(' ')[0]}</TokenChip>
      </div>
      <dl className="grid grid-cols-2 gap-x-lg gap-y-md self-center text-format-data-md">
        <Part k="family" v={family} t={ref.family} />
        <Part k="size" v={size} t={ref.size} />
        <Part k="weight" v={weight} t={ref.weight} />
        <Part k="line-height" v={lineHeight} t={ref.lineHeight} />
        <Part k="tracking" v={tracking} t={ref.tracking} />
        <Part k="role" v={role} span />
      </dl>
    </div>
  );
}

function Part({
  k,
  v,
  t,
  span = false,
}: {
  k: string;
  v: string;
  t?: string;
  span?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2xs ${span ? 'col-span-2' : ''}`}>
      <dt className="text-muted">{k}</dt>
      <dd className="text-ink">{v}</dd>
      {t && <dd className="text-muted/60">{t}</dd>}
    </div>
  );
}
