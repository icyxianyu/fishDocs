import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/node/cli.ts', 'src/node/index.ts'],
  bundle: true,
  splitting: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  shims: true,
  dts: true,
  clean: true
});
