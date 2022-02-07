import { NextRouter } from "next/router";
import { postData } from "./fetch";
import nextI18nextConfig from "../next-i18next.config";

export const changeLocale = (router: NextRouter, targetLocale: string) => {
    const {locale} = router;
    if (locale === targetLocale) {
      return;
    }
    const requiredI18NResources: {ns: string, deployID: string}[] = [];
    const currentResources = window.i18NClones[locale as string];
    const targetResources = window.i18NClones[targetLocale];
    Object.keys(currentResources).forEach(key => {
      const currentVer = currentResources[key].__dep_ver;
      if (targetResources && targetResources[key] && targetResources[key].__dep_ver === currentVer) {
        return;
      }

      requiredI18NResources.push({ns: key, deployID: currentVer});
    });

    
   if (requiredI18NResources.length > 0) {
      postData(`/api/i18n`, {requiredI18NResources, targetLocale}).then(res => {
        if (res.loadNamespaces.length > 0) {
          if (!window.i18NClones[targetLocale]) {
            window.i18NClones[targetLocale] = {};
          }

          res.loadNamespaces.forEach((loadNamespace: any) => {
            window.i18NClones[loadNamespace.locale][loadNamespace.ns] = loadNamespace.resources;
          });
          // change language without worries
          router.push(router.asPath, router.asPath, { locale: targetLocale });
        } else {
          // change language without worries
          router.push(router.asPath, router.asPath, { locale: targetLocale });
        }
      }).catch(err => {
        // something went wrong so go to current url in new locale with server router (like a real <a> tag) instead client router
        window.location.href = (targetLocale === nextI18nextConfig.i18n.defaultLocale ? '' : targetLocale) + router.asPath;
      })
   } else {
     // change language without worries
     router.push(router.asPath, router.asPath, { locale: targetLocale });
   }
  }