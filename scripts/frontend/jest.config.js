/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  maxWorkers: 2,
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/assets/**',
    '!**/build/**',
    '!**/.erb/**',
    '!**/node_modules/**',
    '!**/*.d.ts',
    '!**/*.config.ts',
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/.erb/mocks/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(svg)$': '<rootDir>/__mocks__/svgMock.js',
    'react-markdown': '<rootDir>/__test__/mocks/react-markdown.js',
  },
  resolver: undefined,
  testRegex: '.test.tsx?$',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testPathIgnorePatterns: ['build', '.erb'],
  transformIgnorePatterns: ['node_modules/(?!@snowflake)'],
  coverageReporters: [
    'html',
    'json',
    'lcov',
    ['text-summary', { file: 'text-summary.txt' }],
    ['cobertura', { file: 'cobertura.xml' }],
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 16,
      lines: 18,
      statements: 19,
    },
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  reporters: [
    'default',
    ['jest-trx-results-processor', { outputFile: 'coverage/test-results.trx' }],
    ['jest-sonar', { outputDirectory: 'coverage', outputName: 'ut_report.xml' }],
  ],
};

module.exports = config;
