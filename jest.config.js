module.exports = {
    projects: [
        '<rootDir>/tests/jest.config.js',
    ],
    globalSetup: './jest.setup.js',
    globalTeardown: './jest.teardown.js',
    coverageReporters: ['json-summary', 'text', 'lcov', 'clover', 'html'],
};
