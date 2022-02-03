const deps = require('./package.json').dependencies;
const metadata = require('./public/metadata.json');

module.exports = {
    config: {
        name: metadata.appName,
        filename: "remoteEntry.js",
        exposes: {
          [`./${metadata.appName}App`]: "./src/bootstrap",
        },
        shared: [
          {
            react: { requiredVersion: deps.react, singleton: true },
            "react-dom": { requiredVersion: deps["react-dom"], singleton: true },
            '@emotion/styled': {
              requiredVersion: deps['@emotion/styled'], singleton: true
            },
            '@emotion/react': {
              requiredVersion: deps['@emotion/react'], singleton: true
            },
            '@emotion/cache': {
              requiredVersion: deps['@emotion/cache'], singleton: true
            },
          },
        ],
      }
}