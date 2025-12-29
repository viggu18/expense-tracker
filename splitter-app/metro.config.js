const { getDefaultConfig } = require('expo/metro-config');
const { resolver } = getDefaultConfig(__dirname);

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('db');
config.resolver.sourceExts.push('svg');

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
};

module.exports = config;
