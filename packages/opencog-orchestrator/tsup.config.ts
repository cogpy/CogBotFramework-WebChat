import { defineConfig } from 'tsup';
import { createRequire } from 'node:module';

const { resolve } = createRequire(import.meta.url);

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disable DTS for now due to RxJS import issues
  clean: true,
  external: ['react', 'react-dom'],
  sourcemap: true,
  target: 'es2020',
  minify: false,
  splitting: false,
  bundle: true
});