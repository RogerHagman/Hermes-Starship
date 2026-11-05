// Vite config for the Hermes Starship frontend.
// `npm run dev` serves the page and maps /fixtures/ to the repo's fixtures/ folder,
// the same layout the NAS container uses. `npm run single` makes a one-file preview.
import type { Connect, Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const FIXTURES = resolve(import.meta.dirname, '../fixtures');
const LIVE = resolve(import.meta.dirname, '../deploy/live');

// Serve ../fixtures at /fixtures and ../deploy/live at /live during development, like nginx on
// the NAS. Read-only: GET only.
function fixtures(): Plugin {
  const serve = (dir: string): Connect.NextHandleFunction => (req, res, next) => {
    const file = resolve(dir, basename((req.url ?? '').split('?')[0]));
    if (req.method !== 'GET' || !file.endsWith('.json') || !existsSync(file)) return next();
    res.setHeader('Content-Type', 'application/json');
    res.end(readFileSync(file));
  };
  return {
    name: 'starship-fixtures',
    configureServer(server) {
      server.middlewares.use('/fixtures', serve(FIXTURES));
      server.middlewares.use('/live', serve(LIVE));
    },
  };
}

// For the single-file preview, bake the fixtures into the page as window.FIXTURES.
function inlineFixtures(): Plugin {
  return {
    name: 'starship-inline-fixtures',
    transformIndexHtml(html) {
      const data: Record<string, unknown> = {};
      for (const f of readdirSync(FIXTURES).filter((n) => n.endsWith('.json'))) {
        data[f.replace('.json', '')] = JSON.parse(readFileSync(resolve(FIXTURES, f), 'utf8'));
      }
      const json = JSON.stringify(data).replace(/</g, '\\u003c');
      return html.replace('</head>', `<script>window.FIXTURES=${json}</script></head>`);
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), fixtures(), ...(mode === 'single' ? [inlineFixtures(), viteSingleFile()] : [])],
  base: './',
  // One page on the home network, about 125 kB gzipped. The Quarters room art sits inside the
  // bundle so CSS can light it, which takes the bundle past Vite's default 500 kB warning.
  build: {
    chunkSizeWarningLimit: 700,
    ...(mode === 'single' ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000 } : { outDir: 'dist' }),
  },
  server: { port: 8650 },
  test: { environment: 'jsdom' },
}));
