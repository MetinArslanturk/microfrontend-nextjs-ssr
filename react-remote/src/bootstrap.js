import React from "react";
import ReactDOM from "react-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { I18nextProvider } from 'react-i18next';
import appConfig from "../public/metadata.json";
import { initI18n } from "./init-i18n";
import App from "./App";

const styleCache = createCache({
  key: appConfig.appName.toLowerCase(),
});

// Mount function to start up the app
const mount = (el, initialProps, noHydrate) => {
  const renderOrHydrate = noHydrate ? ReactDOM.render : ReactDOM.hydrate;
  const i18n = initI18n(initialProps.resources, initialProps.locale);
  renderOrHydrate(
    <CacheProvider value={styleCache}>
      <I18nextProvider i18n={i18n}>
      <App {...initialProps.appProps}/>
      </I18nextProvider>
    </CacheProvider>,
    el
  );
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#remote_root");
  if (devRoot) {
    mount(devRoot, {resources: {
      'en-US': {
        common: {
          "test text": "Remote server 'common' test text"
        }
      }
    }, locale: 'en-US'}, true);
  }
}

// We are running through container
// and we should export the mount function
export { mount };
