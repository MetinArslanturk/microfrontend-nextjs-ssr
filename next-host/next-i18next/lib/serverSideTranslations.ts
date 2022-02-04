import { createConfig } from './config/createConfig'
import createClient from './createClient/node'

import { globalI18n } from './appWithTranslation'

import { UserConfig, SSRConfig } from './types'
import { FallbackLng } from 'i18next'

let globalLastDeployId : string = '';

const getFallbackLocales = (fallbackLng: false | FallbackLng) => {
  if (typeof fallbackLng === 'string') {
    return [fallbackLng]
  }
  if (Array.isArray(fallbackLng)) {
    return fallbackLng
  }
  if (typeof fallbackLng === 'object' && fallbackLng !== null) {
    return Object
      .values(fallbackLng)
      .reduce((all, locales) => [...all, ...locales],[])
  }
  return []
}


export const serverSideTranslations = async (
  initialLocale: string,
  i18Config: UserConfig,
  i18nBasePath: string,
  i18nDeployId: string,
  namespacesRequired: string[] = [],
  configOverride: UserConfig | null = null,
): Promise<SSRConfig> => {
  if (typeof initialLocale !== 'string') {
    throw new Error('Initial locale argument was not passed into serverSideTranslations')
  }

  let userConfig = configOverride

  if (!userConfig) {
    userConfig = i18Config
  }

  if (userConfig === null) {
    throw new Error('next-i18next was unable to find a user config')
  }

  const config = createConfig({
    ...userConfig,
    lng: initialLocale,
  })

  const {
    fallbackLng,
    reloadOnPrerender,
  } = config

  if (reloadOnPrerender) {
    await globalI18n?.reloadResources()
  }


  let reInit = false;  


  if (!globalLastDeployId || globalLastDeployId !== i18nDeployId || i18nDeployId === 'development') {
    reInit = true;
    // @ts-ignore
    globalLastDeployId = i18nDeployId;
  }

  const { i18n, initPromise } = createClient(
    {
      ...config,
      lng: initialLocale,
    },
    i18nBasePath,
    reInit
  );

  await initPromise;

  

  const initialI18nStore: Record<string, any> = {
    [initialLocale]: {},
  }

  getFallbackLocales(fallbackLng).forEach((lng: string) => {
    initialI18nStore[lng] = {}
  })


  let commoni18n = {};

  namespacesRequired.forEach((ns) => {
    for (const locale in initialI18nStore) {
      if (ns !== "common") {
        initialI18nStore[locale][ns] =
          (i18n.services.resourceStore.data[locale] || {})[ns] || {};
      } else {
        commoni18n = (i18n.services.resourceStore.data[locale] || {})[ns] || {};
      }
    }
  })
  

  return {
    _nextI18Next: {
      initialI18nStore,
    },
    translationDeployId: globalLastDeployId,
    commoni18n

  }
}
