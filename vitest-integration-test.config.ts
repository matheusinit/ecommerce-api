import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: [
      '**/__tests__/**/*.?(c|m)[jt]s?(x)',
      '**/?(*.){test,}.?(c|m)[jt]s?(x)'
    ],
    globalSetup: './test/global-setup.ts'
  }
})
