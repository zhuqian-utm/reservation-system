const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  // Fix for the absolute path template
  if (process.env.NODE_ENV !== 'production') {
    config.output.devtoolModuleFilenameTemplate = '[absolute-resource-path]';
  }

  // Ensure we aren't cleaning the folder in a way that breaks the watcher
  config.output.clean = true;

  return config;
});
