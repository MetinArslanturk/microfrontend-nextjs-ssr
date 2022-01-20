import React from "react";
import ReactDOMServer from "react-dom/server.js";
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'
import express from "express";
import appConfig from "../micro-app-config.json";
import App from "../src/App.js";


process.env.NODE_ENV = process.env.NODE_ENV || "development";

const cache = createCache({key: appConfig.appName})
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)

const PORT = process.env.PORT || 3002;
const app = express();

app.get("/prerender", (req, res) => {
  const html = ReactDOMServer.renderToString(
    React.createElement(
      CacheProvider,
      { value: cache },
      React.createElement(App, null)
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
