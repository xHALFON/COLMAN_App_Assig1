export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.m?[tj]sx?$': 'babel-jest',
    },
    testMatch: ['<rootDir>/tests/**/*.test.js'], // Match all test files
    collectCoverage: true,
    collectCoverageFrom: [
      'controllers/**/*.js',
      'middleware/**/*.js',
      'routes/**/*.js',
      'models/**/*.js',
    ],
  };
  