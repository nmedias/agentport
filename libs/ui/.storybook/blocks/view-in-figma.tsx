import React from 'react';
import { useOf } from '@storybook/addon-docs/blocks';

import { FigmaMark } from '../../src/docs/FigmaMark';

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
      <FigmaMark width={11} height={16} />
      View in Figma
    </a>
  );
};
