import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['src', '!src/**/*.spec.*', '!src/**/*.test.*'],
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: !options.watch
}))
