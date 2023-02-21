// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    coveragePathIgnorePatterns: ['/node_modules/'],
    globals: {
        window: {},
    },
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    testMatch: [
        '**/__tests__/**/(*.)+(spec|test).[jt]s?(x)',
        '**/test/**/(*.)+(spec|test).[jt]s?(x)',
    ],
    transformIgnorePatterns: ['/node_modules/'],
};
