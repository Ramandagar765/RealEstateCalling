const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
    enableGlobalPackages: true,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    resolver: {
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'] //add here
    },
  },
  maxWorkers: 2,
  resetCache: false,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
