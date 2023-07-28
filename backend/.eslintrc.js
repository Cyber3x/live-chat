module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        // to enforce using type for object type definitions, can be type or interface
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
}
