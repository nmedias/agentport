import * as React from 'react';

/**
 * Official Figma mark (five-colour), shared by the docs chrome.
 *
 * Ships without width/height so the caller decides the size: inside a Button the
 * cva rule `[&_svg:not([class*='size-'])]:size-4` sizes it (the 38×57 viewBox
 * letterboxes to 11×16 — the mark keeps its aspect ratio); standalone callers
 * pass `width`/`height` or a class. Decorative by default — the adjacent link
 * text carries the accessible name.
 */
export function FigmaMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 38 57" fill="none" aria-hidden="true" {...props}>
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  );
}

/** The DS Figma library — file "Agentport DS", page `Components` (`3126:2`). */
export const FIGMA_LIBRARY_URL =
  'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/Agentport-DS?node-id=3126-2';
