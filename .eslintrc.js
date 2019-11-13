module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'prettier',
        'react',
        'react-hooks',
    ],
    rules: {
        '@typescript-eslint/ban-ts-ignore': 1,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-explicit-any': 1,
        '@typescript-eslint/no-unused-vars': [
            2,
            {
                argsIgnorePattern: '^_',
                ignoreRestSiblings: true,
                varsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/no-use-before-define': 1,
        'prettier/prettier': 2,
        'react-hooks/exhaustive-deps': 2,
        'react-hooks/rules-of-hooks': 2,
        'react/display-name': 1,
        'react/jsx-boolean-value': [2, 'never'],
        'react/jsx-key': 1,
        'react/prop-types': 0,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
}
