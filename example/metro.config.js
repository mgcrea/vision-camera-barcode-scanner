/* eslint-disable @typescript-eslint/no-var-requires */
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {resolve} = require('node:path');
const {
  getLinkedPackagesConfig,
} = require('@mgcrea/metro-plugin-linked-packages');
// const path = require('path');
// const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))];

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    unstable_enableSymlinks: true,
    // nodeModulesPaths,
  },
};

module.exports = mergeConfig(
  getDefaultConfig(__dirname),
  getLinkedPackagesConfig(__dirname),
  config,
);
const {blockList} = module.exports.resolver;
module.exports.resolver.blockList = new RegExp(
  `${blockList.source.slice(0, -2)}|\/.idea\/.*)$`,
);
