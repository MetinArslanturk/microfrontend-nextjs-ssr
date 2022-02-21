import { postData } from "./fetch";

export const microAppPropExtractor = async (
    microAppPropPrefix: string,
    microAppProps: any,
    microApp: any,
    locale: string,
    _nextI18Next: any,
    commoni18n: any,
    preReadyEmotionStyles: any
  ) => {
    microAppProps[`MF${microAppPropPrefix}RemoteEntryPath`] =
      microApp.basePath + "/remoteEntry.js";
    microAppProps[`MF${microAppPropPrefix}AppName`] = microApp.appName;
  
    let preRender: {
      appName?: string;
      styleId?: string;
      styles?: string;
      content?: string;
    } = {};
  
    try {
      // This will be an express server in your custom host
      preRender = await postData(microApp.serverRendererUrl + "/prerender", {
        locale,
        resources: {
          [locale]: {
            ..._nextI18Next.initialI18nStore[locale],
            common: commoni18n,
          },
        },
      });
  
      if (preRender) {
        preReadyEmotionStyles.push({
          key: preRender.appName,
          styleId: preRender.styleId,
          styles: preRender.styles,
        });
  
        microAppProps[`MF${microAppPropPrefix}InnerHTMLContent`] =
          preRender.content;
      }
      return;
    } catch (err) {}
  };