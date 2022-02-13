module.exports = {
    env: {
        node: true
    },
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['ordered-imports'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:ordered-imports/recommended'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-shadow': 'warn',
        indent: ['warn', 4],
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/strict-boolean-expressions': 0,
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'semi': 'warn',
    }
};
