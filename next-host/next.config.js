/** @type {import('next').NextConfig} */
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
const nexti18nextConfig = require("./next-i18next.config.json");

const nextConfig = {
  reactStrictMode: true,
  i18n: nexti18nextConfig.i18n,
  webpack: (config) => {
    config.plugins.push(
      new ModuleFederationPlugin({
        name: "TestHost",
        shared: [
          {
            react: {
              requiredVersion: deps.react,
              singleton: true,
              eager: true,
            },
            "react-dom": {
              requiredVersion: deps["react-dom"],
              singleton: true,
              eager: true,
            },
            "@emotion/styled": {
              requiredVersion: deps["@emotion/styled"],
              singleton: true,
              eager: true,
            },
            "@emotion/react": {
              requiredVersion: deps["@emotion/react"],
              singleton: true,
              eager: true,
            },
            "@emotion/cache": {
              requiredVersion: deps["@emotion/cache"],
              singleton: true,
              eager: true,
            },
            i18next: {
              requiredVersion: deps["i18next"],
              singleton: true,
              eager: true,
            },
            "react-i18next": {
              requiredVersion: deps["react-i18next"],
              singleton: true,
              eager: true,
            },
          },
        ],
      })
    );
    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
