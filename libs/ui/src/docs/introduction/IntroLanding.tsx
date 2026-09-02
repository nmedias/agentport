import * as React from 'react';
import { RiArrowRightLine } from '@remixicon/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { FIGMA_LIBRARY_URL, FigmaMark } from '../FigmaMark';

/*
  Agentport DS — Introduction landing (code-only, light-mode).

  A factual portal for the design system, rendered in the live DS tokens. No
  fabricated canon: only tokens/values that actually exist in the system. Page =
  Hero → Scope → Foundations pointer → Components → Footer.

  Token discipline (tokens-reference.md §1): components use SEMANTIC tokens only.
  `primary`/`ink` are TEXT/STROKE tokens — never a bg- frame fill, and bg-primary
  is not used at all here. Dark surfaces use inverse-fill / primary-fill. The
  brand cyan signal/400 (#009fe3) has no on-dark semantic token yet, so the
  hero's single brand gesture uses the primitive via an arbitrary class — a
  sanctioned, isolated exception (authorised). Geometry stays numeric.
*/

// ── Primitives ───────────────────────────────────────────────────────────────

// Mono micro-label that opens each section — the DS eyebrow format. The leading
// tick is a stroke/border line, not an area fill.
function Eyebrow({
  children,
  tone = 'muted',
  className = '',
}: {
  children: React.ReactNode;
  tone?: 'muted' | 'inverse';
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-md text-format-eyebrow uppercase ${
        tone === 'inverse' ? 'text-inverse-ink' : 'text-muted'
      } ${className}`}
    >
      <span
        aria-hidden
        className={`h-px w-6 ${
          tone === 'inverse' ? 'bg-inverse-ink/40' : 'bg-border-strong'
        }`}
      />
      {children}
    </span>
  );
}

// A bordered content band. The page is a stack of these — rhythm from a shared
// hairline + generous block padding.
function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-border px-2xl py-4xl md:px-4xl">
      <div className="mx-auto max-w-[68rem]">
        <header className="max-w-[46rem]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-lg text-format-heading text-ink text-balance">
            {title}
          </h2>
          {lead && (
            <p className="mt-lg text-format-body text-ink text-pretty">
              {lead}
            </p>
          )}
        </header>
        {children && <div className="mt-3xl">{children}</div>}
      </div>
    </section>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

// Motif: a BLUEPRINT HERO — a centered, technical-drawing composition. A faint
// blueprint grid + L-shaped corner crop-marks + a center guide line frame a huge
// uppercase wordmark, with a subtle brand glow behind it and a mono spec table
// below. Reads as a calm precision instrument / engineering plan. The grid and
// the single brand glow are the only gradient-ish exceptions (a technical grid is
// structure, not decoration) — both use a token colour at low alpha. Cyan is the
// one accent (signal/400 via the authorised primitive); the wordmark is white.

// An L-shaped corner crop-mark built from two borders on a corner.
function CropMark({
  className,
  accent = false,
}: {
  className: string;
  accent?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`absolute h-7 w-7 ${className} ${
        accent
          ? 'border-brand-ink'
          : 'border-inverse-ink/25'
      }`}
    />
  );
}

// Shortened, horizontal facts strip — kept very faint so it sits in the
// background and never competes with the wordmark. REAL DS facts.
const FACTS: { k: string; v: string }[] = [
  { k: 'tokens', v: '2-tier' },
  { k: 'color', v: 'OKLCH · 7' },
  { k: 'type', v: 'Hanken · Geist' },
  { k: 'a11y', v: 'WCAG AA' },
];

function Hero() {
  return (
    <header className="relative isolate flex min-h-[80vh] flex-col overflow-hidden text-ink bg-accent-fill border-b border-border">
      {/* very soft blueprint line grid — faint hairlines in a token colour at low
          alpha (structural, not a decorative colour fade) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 left-1/2  right[0]  -z-10 bg-surface/20"
        style={{

          backgroundImage:
            'repeating-linear-gradient(to right, color-mix(in srgb, var(--ap-sys-ink) 8%, transparent) 0 1px, transparent 1px 6rem), repeating-linear-gradient(to bottom, color-mix(in srgb, var(--ap-sys-ink) 8%, transparent) 0 1px, transparent 1px 6rem)',
        }}
      />
      {/* one soft centered brand glow behind the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-[44rem] max-w-[80%] -translate-x-1/2 -translate-y-1/2 corner-full bg-brand-ink/12 blur-[120px]"
      />
      {/* center vertical guide — splits the "design | system" line (ref) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-px -translate-x-1/2 bg-accent-ink/15"
      />

      {/* corner crop-marks — all four accent (ref) */}
      <CropMark className="left-25 top-25 border-l-2 border-t-2" accent />

      <CropMark className="bottom-25 left-25 border-b-2 border-l-2" accent />


      {/* centered identity block (vertically centered in the hero) */}
      <div className="relative mx-auto flex w-full max-w-[68rem] flex-1 flex-col items-center justify-center px-2xl py-4xl text-center md:px-4xl">

        <p
            aria-hidden
            className="mt-xl text-format-label-md uppercase tracking-[0.5em]"
        >
          design system
        </p>
        <p className="mt-md  text-format-eyebrow uppercase tracking-[0.35em]">
          agent-driven shadcn port
        </p>
        {/* wordmark — sized + weighted for the hero (not bound to a text token);
            family + tight tracking still come from text-format-display. The
            accessible name lives on the sr-only h1. */}
        <h1 className="sr-only">Agentport Design System</h1>
        <p
          aria-hidden
          className="relative mt-2xl text-format-display uppercase text-primary font-[850] text-[clamp(4rem,15vw,11rem)] leading-[0.85]  tracking-[-0.05em] [text-box:trim-both_cap_alphabetic]"
        >
          AGENTPORT <span className="text-ink absolute pl-xl text-[clamp(1rem,2vw,1.5rem)]  top-0 [text-box:trim-both_cap_alphabetic] tracking-[0]">DS</span>
        </p>

        {/* one small sentence */}
        <p className="mt-2xl  text-format-title font-[500]">
          shadcn/ui, re-clothed in its own token layer through an agent-driven Figma ↔ code pipeline.
        </p>

        {/* the source of truth for the component sets — opens the Figma library */}
        <Button asChild variant="outline" className="mt-2xl">
          <a href={FIGMA_LIBRARY_URL} target="_blank" rel="noreferrer">
            <FigmaMark />
            View Figma Library
          </a>
        </Button>



      </div>

      {/* shortened, horizontal facts strip — faint, sits in the background at the
          hero's foot so it never disturbs the wordmark */}
      <dl className="relative mx-auto flex w-full max-w-[68rem] flex-wrap items-center justify-center gap-x-2xl gap-y-xs px-2xl pb-3xl text-format-data-sm text-inverse-ink/35 md:px-4xl">
        {FACTS.map(({ k, v }) => (
          <div key={k} className="flex items-center gap-sm">
            <dt className="uppercase tracking-[0.2em]">{k}</dt>
            <dd className="text-inverse-ink/55">{v}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

// ── Foundations pointer ──────────────────────────────────────────────────────

const FOUNDATIONS: { label: string; id: string; note: string }[] = [
  { label: 'Colour', id: 'foundations-colors--docs', note: 'Semantic tokens' },
  { label: 'Typography', id: 'foundations-typography--docs', note: '12 formats' },
  {
    label: 'Spacing & Radius',
    id: 'foundations-spacing-radius--docs',
    note: 'Dimension scales',
  },
  { label: 'Effects', id: 'foundations-effects--docs', note: 'Shadows' },
];

function FoundationsPointer() {
  return (
    <Section
      id="foundations"
      eyebrow="Foundations"
      title="The token layer"
      lead="Colour, typography, dimension, and effects are documented as live, complete reference pages — every token rendered from its real utility and labelled by name, value, and role."
    >
      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
        {FOUNDATIONS.map((f) => (
          <a
            key={f.id}
            href={`/?path=/docs/${f.id}`}
            target="_top"
            className="group/link flex flex-col gap-sm corner-lg border border-border bg-surface px-xl py-lg transition-colors hover:border-primary hover:bg-accent-fill"
          >
            <span className="flex items-center justify-between gap-md text-format-body-strong text-ink group-hover/link:text-accent-ink">
              {f.label}
              <RiArrowRightLine
                aria-hidden
                className="size-4 text-muted transition-transform group-hover/link:translate-x-0.5 group-hover/link:text-primary"
              />
            </span>
            <span className="text-format-data-sm text-muted">{f.note}</span>
          </a>
        ))}
      </div>
    </Section>
  );
}

// ── Components index ─────────────────────────────────────────────────────────

// Each entry → its Autodocs page. IDs verified against the running Storybook's
// /index.json; links break out of the docs iframe to the manager (target=_top).
type Entry = { label: string; id: string };
type Group = { name: string; entries: Entry[] };

const GROUPS: Group[] = [
  {
    name: 'Inputs & Forms',
    entries: [
      { label: 'Input', id: 'ui-input--docs' },
      { label: 'Textarea', id: 'ui-textarea--docs' },
      { label: 'Input Group', id: 'ui-inputgroup--docs' },
      { label: 'Select', id: 'ui-select--docs' },
      { label: 'Label', id: 'ui-label--docs' },
      { label: 'Field', id: 'ui-field--docs' },
      { label: 'Checkbox', id: 'ui-checkbox--docs' },
      { label: 'Switch', id: 'ui-switch--docs' },
      { label: 'Slider', id: 'ui-slider--docs' },
      { label: 'Radio Group', id: 'ui-radiogroup--docs' },
      { label: 'Choice Card', id: 'ui-choicecards-choicecardradio--docs' },
    ],
  },
  {
    name: 'Actions & Status',
    entries: [
      { label: 'Button', id: 'ui-button--docs' },
      { label: 'Badge', id: 'ui-badge--docs' },
      { label: 'Kbd', id: 'ui-kbd--docs' },
    ],
  },
  {
    name: 'Overlays',
    entries: [
      { label: 'Dialog', id: 'ui-dialog--docs' },
      { label: 'Command', id: 'ui-command--docs' },
      { label: 'Popover', id: 'ui-popover--docs' },
      { label: 'Tooltip', id: 'ui-tooltip--docs' },
    ],
  },
  {
    name: 'Navigation',
    entries: [
      { label: 'Breadcrumb', id: 'ui-breadcrumb--docs' },
      { label: 'Separator', id: 'ui-separator--docs' },
    ],
  },
  {
    name: 'Data & Lists',
    entries: [
      { label: 'Table', id: 'ui-table--docs' },
      { label: 'Item', id: 'ui-item--docs' },
    ],
  },
];

// Break out of the docs iframe to the Storybook manager.
function docHref(id: string) {
  return `/?path=/docs/${id}`;
}

function ComponentsIndex() {
  return (
    <Section
      id="components"
      eyebrow="Components"
      title="Twenty-two primitives"
      lead="The shadcn/ui base, re-clothed in the Agentport tokens and aligned to the denser radix-nova baseline. Each links into its Autodocs page."
    >
      <div className="flex flex-col gap-3xl">
        {GROUPS.map((group) => (
          <div
            key={group.name}
            className="grid gap-lg lg:grid-cols-[12rem_1fr] lg:gap-2xl"
          >
            <div className="lg:pt-md">
              <Eyebrow>{group.name}</Eyebrow>
            </div>
            <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
              {group.entries.map((entry) => (
                <a
                  key={entry.id}
                  href={docHref(entry.id)}
                  target="_top"
                  className="group/link flex items-center justify-between gap-md corner-lg border border-border bg-surface px-xl py-lg text-format-body-strong text-ink transition-colors hover:border-primary hover:bg-accent-fill hover:text-accent-ink"
                >
                  {entry.label}
                  <RiArrowRightLine
                    aria-hidden
                    className="size-4 text-muted transition-transform group-hover/link:translate-x-0.5 group-hover/link:text-primary"
                  />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-card-fill px-2xl py-3xl md:px-4xl">
      <div className="mx-auto flex max-w-[68rem] flex-col gap-2xl">
        <div className="grid gap-2xl sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-md">
            <Eyebrow>Getting started</Eyebrow>
            <p className="text-format-body text-ink text-pretty">
              Consume the library from{' '}
              <code className="text-format-data-sm text-ink">@agentport/ui</code>. Run
              the gate before you ship —{' '}
              <code className="text-format-data-sm text-ink">npm run check</code>{' '}
              (lint + test + typecheck).
            </p>
          </div>
          <div className="flex flex-col gap-md">
            <Eyebrow>Develop</Eyebrow>
            <ul className="flex flex-col gap-xs text-format-body text-ink">
              <li>
                <code className="text-format-data-sm text-ink">npm run test:stories</code> —
                every story in Chromium + axe
              </li>
              <li>
                <code className="text-format-data-sm text-ink">
                  npm run storybook
                </code>{' '}
                — components in isolation
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-md">
            <Eyebrow>Reference</Eyebrow>
            <div className="flex flex-wrap items-center gap-md">
              <Badge variant="secondary">Light mode</Badge>
              <Badge variant="outline">radix-nova</Badge>
              <Button asChild size="xs" variant="link">
                <a href={docHref('ui-button--docs')} target="_top">
                  Browse components
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-xl">
          <span className="text-format-eyebrow uppercase text-muted">
            Agentport DS
          </span>
        </div>
      </div>
    </footer>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function IntroLanding() {
  return (
    // Full-bleed: break out of the Storybook docs column to the full canvas width
    // (inline style sidesteps the DS mx-* @utility override). Hero spans edge to
    // edge; the body sections re-center via their own mx-auto max-w.
    <div
      className="bg-surface text-format-body"
      style={{ marginInline: 'calc(50% - 50vw)' }}
    >
      {/* Page-scoped: drop the docs container's top padding so the hero sits
          flush to the canvas top. Unmounts when you navigate away. */}
      <style>{`
        .sbdocs-wrapper { padding-top: 0 !important; }
        .sbdocs.sbdocs-content { padding-top: 0 !important; }
      `}</style>
      <Hero />
      <FoundationsPointer />
      <ComponentsIndex />
    </div>
  );
}

export default IntroLanding;
