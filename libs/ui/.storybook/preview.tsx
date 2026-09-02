import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { Controls, Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs/blocks';

import { ViewInFigma } from './blocks/view-in-figma';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    // Pin the Introduction landing first in the sidebar, then the component
    // libraries; everything else sorts after.
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Primitives', 'Colors', 'Typography', 'Spacing & Radius', 'Effects'],
          'UI',
          'UI Blocks',
          '*',
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      // Default Autodocs template + ViewInFigma directly under the component
      // description (reads `parameters.design.url` from the stories meta).
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description of="meta" />
          <ViewInFigma />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
    // addon-a11y runs axe-core on every story. test mode drives the Vitest story tests:
    //   'todo'  → violations reported (UI panel + test annotation), but DON'T fail the run
    //   'error' → violations FAIL `npm run test:stories` (production gate, after triage)
    //   'off'   → skip a11y in tests entirely
    a11y: { test: 'error' },
  },
};

export default preview;
