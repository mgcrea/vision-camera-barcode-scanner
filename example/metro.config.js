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

const linkedConfig = getLinkedPackagesConfig(__dirname);
linkedConfig.resolver.extraNodeModules['@babel/runtime'] = resolve(
  __dirname,
  'node_modules/@babel/runtime',
);
// console.log(linkedConfig.resolver.extraNodeModules);
// process.exit(1);
module.exports = mergeConfig(getDefaultConfig(__dirname), linkedConfig, config);
