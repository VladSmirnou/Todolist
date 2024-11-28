import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintReact from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: [
            '**/node_modules/',
            '**/.storybook/',
            '.yarn/',
            '.git/',
            'coverage',
            'dist',
            'eslint.config.js',
            'jest.config.ts',
        ],
    },
    {
        settings: {
            react: {
                version: '18.3.1',
            },
        },
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.node.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            // default
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            // --------
            // additional
            '@typescript-eslint': tseslint.plugin,
            react: eslintReact,
            prettier: prettierPlugin,
            // --------
        },
        files: ['**/*.{ts,tsx}'],
        rules: {
            ...eslintReact.configs.recommended.rules,
            ...eslintReact.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            ...eslintConfigPrettier.rules,
            ...prettierPlugin.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
);
