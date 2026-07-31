import {defineConfig} from 'rolldown'

const createConfig = (input: string, file: string) => ({
  input,
  output: {
    file,
    format: 'esm' as const,
    sourcemap: true
  },
  platform: 'node' as const,
  tsconfig: 'tsconfig.json'
})

export default defineConfig([
  createConfig('src/setup-android.ts', 'dist/setup/index.js'),
  createConfig('src/cleanup-android.ts', 'dist/cleanup/index.js')
])
