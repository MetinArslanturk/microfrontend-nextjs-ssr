import React from "react";
import ReactDOM from "react-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import appConfig from "../public/metadata.json";
import App from "./App";

const styleCache = createCache({
  key: appConfig.appName,
});

// Mount function to start up the app
const mount = (el, initialProps, noHydrate) => {
  const renderOrHydrate = noHydrate ? ReactDOM.render : ReactDOM.hydrate;
  
  renderOrHydrate(
    <CacheProvider value={styleCache}>
      <App {...initialProps}/>
    </CacheProvider>,
    el
  );
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#remote_root");
  if (devRoot) {
    mount(devRoot, {}, true);
  }
}

// We are running through container
// and we should export the mount function
export { mount };
