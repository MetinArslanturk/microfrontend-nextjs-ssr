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
        <App eventBus={initialProps.eventBus} {...initialProps.appProps}/>
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
    ReactDOM.render(<p>Loading i18n and initial data...</p>, devRoot);
    
    const i18nMetaDataUrl = process.env.I18N_METADATA;
    fetch(i18nMetaDataUrl).then(res => res.json()).then(data => {
      const i18nBaseUrl =
        data.last_deploy_id === "development"
          ? i18nMetaDataUrl.replace("/metadata.json", "")
          : i18nMetaDataUrl.replace(
              "/metadata.json",
              "/" + data.last_deploy_id
            );
      const i18nNamespaces = process.env.I18N_NAMESPACES.split(',');
      const lang = process.env.I18N_LANG;
      const i18nResources = {};
      return Promise.all(
        i18nNamespaces.map((ns) =>
          fetch(i18nBaseUrl + "/" + lang + "/" + ns + ".json")
            .then((translations) => translations.json())
            .then((t) => (i18nResources[ns] = t))
        )
      ).then(() => ({i18nResources, locale: lang}));
    }).then(resp => {
      const {i18nResources, locale} = resp;
      mount(devRoot, {resources: {
        [locale]: i18nResources
      },
      locale
    }, true);
    })

  }
}

// We are running through container
// and we should export the mount function
export { mount };
