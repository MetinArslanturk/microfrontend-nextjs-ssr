import i18n, { Resource } from 'i18next'

import { InternalConfig, CreateClientReturn, InitPromise, I18n } from '../types'

let globalInstance: I18n

const nodeCreateClient = (config: InternalConfig, reInit?: boolean): CreateClientReturn => {
  
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

    
    initPromise = config.resourceFetcherFn(config).then((resources: Resource) => {
    
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
