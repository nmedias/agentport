import type { Preview } from '@storybook/react-vite';
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
    // addon-a11y runs axe-core on every story. test mode drives the Vitest story tests:
    //   'todo'  → violations reported (UI panel + test annotation), but DON'T fail the run
    //   'error' → violations FAIL `npm run test:stories` (production gate, after triage)
    //   'off'   → skip a11y in tests entirely
    a11y: { test: 'error' },
  },
};

export default preview;
