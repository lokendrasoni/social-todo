module.exports = {
    testEnvironment: 'node',
    testEnvironmentOptions: {
      NODE_ENV: 'test',
    },
    setupFiles: ["./jest.setup.js"],
    restoreMocks: true,
    coveragePathIgnorePatterns: ['node_modules', './tests/db.js']
};
