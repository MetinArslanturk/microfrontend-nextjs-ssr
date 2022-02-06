import React from "react";
import ReactDOMServer from "react-dom/server.js";
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'
import express from "express";
import appConfig from "../public/metadata.json";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from "../src/init-i18n";
import App from "../src/App.js";

const styleCache = createCache({key: appConfig.appName.toLowerCase()})
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(styleCache)

const PORT = process.env.PORT || 3003;
const app = express();

app.use(express.json())

app.post("/prerender", (req, res) => {
  
  const { resources, locale, appProps = null } = req.body;
  const i18n = initI18n(resources, locale);

  const html = ReactDOMServer.renderToString(
    React.createElement(
      CacheProvider,
      { value: styleCache },
      React.createElement(
            I18nextProvider,
            { i18n: i18n },
            React.createElement(App, appProps)
      )
)
  );
  const chunks = extractCriticalToChunks(html)
  const styles = constructStyleTagsFromChunks(chunks);
  const tagStartIndex = styles.indexOf('n="');
  const tagCloseIndex = styles.indexOf('">');
  const ids = styles.substring(tagStartIndex + 3, tagCloseIndex);
  const stylesStr = styles.slice(tagCloseIndex + 2, -8); 
  res.send({ content: html, appName: appConfig.appName, styleId: ids, styles: stylesStr });
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
