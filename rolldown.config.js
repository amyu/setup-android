import {defineConfig} from 'rolldown'

const createConfig = (input, file) => ({
  input,
  output: {
    file,
    format: 'esm',
    sourcemap: true
  },
  platform: 'node',
  tsconfig: 'tsconfig.json'
})

export default defineConfig([
  createConfig('src/setup-android.ts', 'dist/setup/index.js'),
  createConfig('src/cleanup-android.ts', 'dist/cleanup/index.js')
])
