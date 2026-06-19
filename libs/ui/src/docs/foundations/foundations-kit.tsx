import * as React from 'react';

/*
  Foundations — shared specimen kit.

  Renders DS tokens live, each labelled by its real token name / utility classes /
  primitive / scope / value / role (all from tokens-reference.md — not invented).
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
          <p className="mt-xl max-w-[48rem] text-format-body text-ink text-pretty">
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
      className={`inline-flex items-center gap-md text-format-eyebrow uppercase text-muted-ink ${className}`}
    >
      <span aria-hidden className="h-px w-6 bg-border-strong" />
      {children}
    </span>
  );
}

// A token group: eyebrow + optional note + its specimen rows.
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
        <Eyebrow>{name}</Eyebrow>
        {note && (
          <p className="max-w-[48rem] text-format-body text-ink text-pretty">
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
    <div className="grid gap-xl sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

// ── Token meta line ──────────────────────────────────────────────────────────

// The shared label block under every specimen: the token NAME (mono, ink), the
// possible utility CLASSES (mono, muted), then the primitive it aliases + raw
// value, then the scope, then the role.
function TokenMeta({
  token,
  utilities,
  primitive,
  scope,
  value,
  role,
}: {
  token: string;
  utilities: string;
  primitive: string;
  scope: string;
  value: string;
  role?: string;
}) {
  return (
    <div className="flex flex-col gap-2xs">
      <span className="text-format-data text-ink">{token}</span>
      <span className="text-format-data text-muted-ink">{utilities}</span>
      <span className="text-format-data text-muted-ink/60">
        {primitive} · {value}
      </span>
      <span className="text-format-data text-muted-ink/60">scope: {scope}</span>
      {role && (
        <span className="mt-2xs text-format-body text-ink text-pretty">
          {role}
        </span>
      )}
    </div>
  );
}

// ── Colour specimens (per scope) ─────────────────────────────────────────────

// Frame-fill token → a bg- swatch. Light fills get a hairline so they read.
export function FillSwatch({
  bg,
  token,
  utilities,
  primitive,
  scope,
  value,
  role,
  border = false,
}: {
  bg: string;
  token: string;
  utilities: string;
  primitive: string;
  scope: string;
  value: string;
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
        scope={scope}
        value={value}
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
  scope,
  value,
  role,
  onFill,
}: {
  text: string;
  token: string;
  utilities: string;
  primitive: string;
  scope: string;
  value: string;
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
        scope={scope}
        value={value}
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
  scope,
  value,
  role,
}: {
  border: string;
  token: string;
  utilities: string;
  primitive: string;
  scope: string;
  value: string;
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
        scope={scope}
        value={value}
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
  scope,
  value,
  role,
}: {
  ring: string;
  token: string;
  utilities: string;
  primitive: string;
  scope: string;
  value: string;
  role: string;
}) {
  return (
    <div className="flex flex-col gap-md">
      <div className="flex h-16 items-center justify-center corner-lg border border-border bg-surface px-lg">
        <span
          className={`corner-md bg-card-fill px-lg py-md text-format-data text-ink ring-2 ${ring}`}
        >
          focus
        </span>
      </div>
      <TokenMeta
        token={token}
        utilities={utilities}
        primitive={primitive}
        scope={scope}
        value={value}
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
  scope,
  value,
  role,
}: {
  token: string;
  utilities: string;
  primitive: string;
  scope: string;
  value: string;
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
        scope={scope}
        value={value}
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
}: {
  format: string;
  sample: string;
  family: string;
  size: string;
  weight: string;
  lineHeight: string;
  tracking: string;
  role: string;
}) {
  return (
    <div className="grid gap-lg border-t border-border py-2xl lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-sm">
        <span className={`${format} text-ink`}>{sample}</span>
        <span className="text-format-data text-muted-ink">
          text-format-{format.replace('text-format-', '')}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-lg gap-y-xs self-center text-format-data">
        <Part k="family" v={family} />
        <Part k="size" v={size} />
        <Part k="weight" v={weight} />
        <Part k="line-height" v={lineHeight} />
        <Part k="tracking" v={tracking} />
        <Part k="role" v={role} span />
      </dl>
    </div>
  );
}

function Part({ k, v, span = false }: { k: string; v: string; span?: boolean }) {
  return (
    <div className={`flex flex-col gap-2xs ${span ? 'col-span-2' : ''}`}>
      <dt className="text-muted-ink">{k}</dt>
      <dd className="text-ink">{v}</dd>
    </div>
  );
}
