import i18n from 'i18next'

import { InternalConfig, CreateClientReturn, InitPromise, I18n } from '../types'

let globalInstance: I18n

const nodeCreateClient = (config: InternalConfig, i18HostBaseUrl?: string, reInit?: boolean): CreateClientReturn => {
  
  let instance: I18n
  if (!globalInstance || reInit) {
    globalInstance = i18n.createInstance(config)
    instance = globalInstance
  } else {
    instance = globalInstance.cloneInstance({
      ...config
    })
  }
  let initPromise: InitPromise

  if (!instance.isInitialized) {
    console.log('Initializing i18next instance');

    const resources: any = {};
    

    initPromise = Promise.all(
      config.locales.map((locale) => {
        return Promise.all(
          config.allTranslations?.map((t) => {
            return fetch(
              `${i18HostBaseUrl}/${locale}/${t}.json`
            )
              .then((res) => res.json())
              .then((d) => ({ key: t, data: d }));
          }) as any
        ).then((reduced) => {
          const allData: any = {};
          reduced.forEach((r) => {
            allData[r.key] = r.data;
          });
          
          resources[locale] = allData;
          return true;
        });
      })
    ).then(() => {
      return instance.init({
        ...config,
        resources,
      });
    });
      
  } else {
    initPromise = Promise.resolve(i18n.t)
  }

  return { i18n: instance, initPromise }
}

export default nodeCreateClient;
