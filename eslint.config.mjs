import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import airbnbConfig from 'eslint-config-airbnb';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react: reactPlugin,
      prettier: prettierPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
    },
    rules: {
      ...airbnbConfig.rules,
      'react/prop-types': 'off',
      'prettier/prettier': 'error',
      'react/require-default-props': 'off',
      'react/destructuring-assignment': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
      'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    },
  },
];
