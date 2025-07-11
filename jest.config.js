module.exports = {
  rootDir: 'test',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@test/(.*)$': '<rootDir>/$1',
    '^@src/(.*)$': '<rootDir>/../src/$1',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage-test',
  testEnvironment: 'node',
};