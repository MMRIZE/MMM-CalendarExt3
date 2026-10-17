import css from '@eslint/css'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import markdown from '@eslint/markdown'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  globalIgnores(['CX3_Shared/**']),
  {
    files: ['**/*.css'],
    languageOptions: { tolerant: true },
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
    rules: {
      'css/no-invalid-properties': 'off',
      'css/no-empty-blocks': 'off',
      'css/use-baseline': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: { js },
    extends: ['js/recommended', stylistic.configs.recommended],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
])
