const deps = require('./package.json').dependencies;

module.exports = {
    config: {
        name: "TestRemote",
        filename: "remoteEntry.js",
        exposes: {
          "./RemoteButtonApp": "./src/bootstrap",
        },
        shared: [
          {
            react: { requiredVersion: deps.react, singleton: true },
            "react-dom": { requiredVersion: deps["react-dom"], singleton: true },
            'eventing-bus': { requiredVersion: deps['eventing-bus'], singleton: true },
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