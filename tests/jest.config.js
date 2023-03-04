module.exports = {
    displayName: 'shared',
    testEnvironment: 'node',
    testEnvironmentOptions: {
      NODE_ENV: 'test',
    },
    setupFiles: ["./jest.setup.js"],
    restoreMocks: true,
    coveragePathIgnorePatterns: ['node_modules', 'apis'],
    testPathIgnorePatterns: ["apis"]
  };
  