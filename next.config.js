const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native-web/dist/apis/StyleSheet/registry': path.resolve(
        __dirname,
        'shims',
        'react-native-web-stylesheet-registry.js'
      ),
      'react-native-web/dist/apis/StyleSheet/registry.js': path.resolve(
        __dirname,
        'shims',
        'react-native-web-stylesheet-registry.js'
      )
    }
    return config
  }
}

module.exports = nextConfig
