// See: https://rollupjs.org/introduction/

import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const createConfig = (input, file) => ({
  input,
  output: {
    esModule: true,
    file,
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript(),
    nodeResolve({preferBuiltins: true}),
    commonjs(),
    json()
  ]
})

export default [
  createConfig('src/setup-android.ts', 'dist/setup/index.js'),
  createConfig('src/cleanup-android.ts', 'dist/cleanup/index.js')
]
