/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {

  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/test/**',
    '!**/config/**'
  ],
  coverageDirectory: "coverage",
  roots: [
    "<rootDir>/src"
  ],
  testEnvironment: "node",
  transform: {
      '.*\\.ts$': 'ts-jest'
  },

};
