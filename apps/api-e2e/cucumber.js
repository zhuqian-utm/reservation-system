module.exports = {
  default: {
    // We register ts-node AND tsconfig-paths
    requireModule: [
      'ts-node/register',
      'tsconfig-paths/register'
    ],
    require: ['apps/api-e2e/src/steps/**/*.ts'],
    format: ['summary', 'progress-bar'],
    paths: ['apps/api-e2e/src/features/*.feature'],
    // This tells tsconfig-paths where to look for the aliases
    worldParameters: {
      baseUrl: 'http://localhost:3000/graphql'
    }
  }
};