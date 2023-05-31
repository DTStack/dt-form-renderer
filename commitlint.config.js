module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'test',
                'build',
                'ci',
                'chore',
            ],
        ],
        'scope-case': [0, 'always', 'camel-case'],
        'scope-empty': [2, 'never'],
        'scope-enum': [2, 'always', ['core', 'playground', 'base']],
    },
};
