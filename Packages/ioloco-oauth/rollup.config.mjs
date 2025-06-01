import path from 'path'
import alias from '@rollup/plugin-alias'
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import preserveDirectives from 'rollup-plugin-preserve-directives'
import filesize from 'rollup-plugin-filesize' // Add this to visualize bundle sizes
import analyze from 'rollup-plugin-analyzer' // Add this for bundle analysis
import packageJson from './package.json' assert { type: 'json' }

// =====================================================================================================================

const rootDir = path.resolve('./src')

const sharedAlias = alias({
  entries: [
    { find: '@', replacement: `${rootDir}` },
    { find: '@Queries', replacement: `${rootDir}/@Queries` },
    { find: '@Types', replacement: `${rootDir}/@Types` },
    { find: 'OAuth', replacement: `${rootDir}/OAuth` },
    { find: 'Error', replacement: `${rootDir}/Error` }
  ]
})

// Make all dependencies external
const dependencies = Object.keys(packageJson.dependencies || {})
const peerDependencies = Object.keys(packageJson.peerDependencies || {})
const external = [...dependencies, ...peerDependencies, 'zod', /^node:.*/]

// Enhanced Terser configuration for better minification
const terserOptions = {
  compress: {
    passes: 2, // Multiple compression passes
    pure_getters: true, // Assume getters are pure
    drop_console: true, // Remove console statements
    drop_debugger: true, // Remove debugger statements
    ecma: 2020, // Use modern ECMAScript features
    module: true, // Enable module-specific optimizations
    toplevel: true, // Allow top-level variable/function optimization
    unsafe_arrows: true, // More aggressive arrow function optimization
    unsafe_methods: true // Optimize method calls
  },
  mangle: {
    properties: {
      regex: /^_private_/ // Only mangle properties starting with _private_
    }
  },
  format: {
    comments: false, // Remove all comments
    ecma: 2020 // Use modern ECMAScript features
  }
}

// =====================================================================================================================
// =====================================================================================================================

const rollupConfigs = [
  // =========================================
  // SSR Bundle
  // =========================================
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      preserveModulesRoot: 'src',
      hoistTransitiveImports: false, // Reduce code duplication
      compact: true // Remove whitespace
    },
    external,
    plugins: [
      preserveDirectives({
        include: /\.[tj]sx?$/,
        exclude: 'node_modules/**'
      }),
      sharedAlias,
      nodeResolve({
        extensions: ['.ts', '.js'],
        preferBuiltins: true
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
        compilerOptions: {
          removeComments: true,
          target: 'es2020', // Use modern JS features
          importHelpers: true // Use shared helper functions
        }
      }),
      terser(terserOptions),
      filesize(), // Show file size information
      analyze({ summaryOnly: true }) // Show bundle analysis
    ]
  }
]

// =====================================================================================================================
// =====================================================================================================================

export default rollupConfigs
