module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@config/(.*)$': '<rootDir>/src/config/$1',
    },
  };
  