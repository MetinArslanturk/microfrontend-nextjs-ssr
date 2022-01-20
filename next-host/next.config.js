/** @type {import('next').NextConfig} */
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('./package.json').dependencies;

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {

    config.plugins.push(new ModuleFederationPlugin(
      {
        name: 'TestHost',
        shared: [
            {
              react: { 
                requiredVersion: deps.react,
                singleton: true,
                eager: true
              },
              'react-dom': {
                requiredVersion: deps['react-dom'],
                singleton: true,
                eager: true
              },
              '@emotion/styled': {
                requiredVersion: deps['@emotion/styled'],
                singleton: true,
                eager: true
              },
              '@emotion/react': {
                requiredVersion: deps['@emotion/react'],
                singleton: true,
                eager: true
              },
              '@emotion/cache': {
                requiredVersion: deps['@emotion/cache'],
                singleton: true,
                eager: true
              },
            },
          ]
      }
    ));
    // Important: return the modified config
    return config
  },
}

module.exports = nextConfig
