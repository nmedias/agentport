/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import * as path from 'path';
import * as fs from 'fs';

// The lib build emits JS + .d.ts only — the DS token layer (src/styles/*.css) is not in
// the JS module graph, so it never reaches dist. Copy it into dist/styles/ on build so the
// package's `./styles` export resolves for a built/published consumer too. (Monorepo dev
// reads src live via the `agentport-monorepo` condition.) Build-only, dependency-free.
function copyDsStyles() {
  return {
    name: 'ap-copy-ds-styles',
    apply: 'build' as const,
    closeBundle() {
      const srcDir = path.resolve(import.meta.dirname, 'src/styles');
      const outDir = path.resolve(import.meta.dirname, 'dist/styles');
      fs.mkdirSync(outDir, { recursive: true });
      for (const file of fs.readdirSync(srcDir)) {
        if (file.endsWith('.css')) {
          fs.copyFileSync(path.join(srcDir, file), path.join(outDir, file));
        }
      }
    },
  };
}

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/ui',
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  plugins: [react(), tailwindcss(), dts({ entryRoot: 'src', tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json') }), copyDsStyles()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Entry points: the generic primitive surface (.) and the blocks layer
      // (./blocks + per-screen subpaths). The keys become the dist file paths
      // (dist/index.js, dist/blocks/index.js, …), matching package.json `exports`.
      entry: {
        index: 'src/index.ts',
        'blocks/index': 'src/blocks/index.ts',
        'blocks/explorer/index': 'src/blocks/explorer/index.ts',
      },
      name: '@agentport/ui',
      fileName: (_format, entryName) => `${entryName}.js`,
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const]
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react','react-dom','react/jsx-runtime']
    },
  },
  test: {
    // Shared defaults — inherited by every project below.
    watch: false,
    globals: true,
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
    projects: [
      {
        // Unit specs in jsdom (the existing  *.spec.tsx). extends: true pulls
        // in this file's react/tailwind plugins + the @ alias.
        extends: true,
        test: {
          name: '@agentport/ui',
          environment: 'jsdom',
          setupFiles: ['./src/test-setup.ts'],
          include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        },
      },
      {
        // Stories-as-tests in a real browser. storybookTest() turns each story
        // into a test; the browser runs via @vitest/browser-playwright (chromium).
        extends: true,
        plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
}));
