import type { Config } from 'jest';
const config: Config = {
  verbose: true,
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  modulePaths: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^Env$': '<rootDir>/src/Env.ts',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@reducers/(.*)$': '<rootDir>/src/reducers/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',

    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  globals: {
    fetch: global.fetch,
  },
};

export default config;
