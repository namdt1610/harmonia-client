import pluginUnusedImports from 'eslint-plugin-unused-imports'

export default [
    {
        plugins: {
            unusedImports: pluginUnusedImports,
        },
        rules: {
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
]
