import { Resource } from "i18next";
import nextI18NConfig from "../next-i18next.config.json";
import { InternalConfig } from "../next-i18next/lib/types";
import { REMOTE_APP_ENVS } from "../remote-app-env-extractor";


const resourceFetcher = (config: InternalConfig ): Promise<Resource> => {

    const {I18N} = REMOTE_APP_ENVS;

    const i18nHostBaseUrl = I18N.pageProps.entryPath;
    const i18nDeployId = I18N.deployID;

    const resources: Resource = {};
    

    const resolverPromise = Promise.all(
      config.locales.map((locale: string) => {
        return Promise.all(
          config.allNamespaces?.map((t) => {
            return fetch(
              `${i18nHostBaseUrl}/${locale}/${t}.json`
            )
              .then((res) => res.json())
              .then((d) => ({ key: t, data: d }));
          }) as any
        ).then((reduced) => {
          const allData: any = {};
          reduced.forEach((r) => {
            r.data.__dep_ver = i18nDeployId;
            allData[r.key] = r.data;
          });
          
          resources[locale] = allData;
          return true;
        });
      })
    ).then(() => {
        return resources;
    });

    return resolverPromise;
}


export const i18nConfig = {i18n: nextI18NConfig.i18n, resourceFetcherFn: resourceFetcher}