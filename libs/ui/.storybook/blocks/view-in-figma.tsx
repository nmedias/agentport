import React from 'react';
import { useOf } from '@storybook/addon-docs/blocks';

/** Official Figma mark (five-colour), sized for inline text use. */
const FigmaLogo = () => (
  <svg width="11" height="16" viewBox="0 0 38 57" fill="none" aria-hidden="true">
    <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
    <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
    <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
    <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
    <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
  </svg>
);

/**
 * "View in Figma" link on every Autodocs page, rendered under the component description.
 * Reads `parameters.design` ({ type: 'figma', url }) from the stories meta; renders nothing
 * when the meta carries no Figma URL.
 */
export const ViewInFigma = () => {
  const resolved = useOf('meta');
  if (resolved.type !== 'meta') return null;
  const design = resolved.preparedMeta.parameters?.design as
    | { type?: string; url?: string }
    | undefined;
  if (!design || design.type !== 'figma' || !design.url) return null;
  return (
    <a
      href={design.url}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
      }}
    >
      <FigmaLogo />
      View in Figma
    </a>
  );
};
