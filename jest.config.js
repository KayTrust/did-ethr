/** @type {import('jest').Config} */
module.exports = {
    verbose: true,
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    moduleDirectories: [
        "node_modules",
        "src"
    ],
    setupFiles: ['<rootDir>/test/setup.js'],
    moduleFileExtensions: ['js', 'ts'],
    testMatch: ['<rootDir>/**/?(*.)+(spec|test).ts', "<rootDir>/**/__tests__/*.+(ts|tsx|js)"],
    testPathIgnorePatterns: ['.*\\.d\\.ts$'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
};