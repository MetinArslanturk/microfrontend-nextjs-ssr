import { appWithTranslation } from "../next-i18next";
import { useEffect, useRef, useContext } from "react";
import type { AppProps } from 'next/app'
import { useRouter } from "next/router";
import { GlobalContext, GlobalContextProvider } from "../components/GlobalContext";
import { i18nConfig } from "../utils/i18n-config";



function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const {locale} = router;
  const localeRef = useRef(locale);

  const {value } = useContext<any>(GlobalContext);
  const {eventBus} = value;

  useEffect(() => {
    let unsub: any;
    const callback = (type: string, data: any) => {
      console.log(`Received event ${type} with data ${JSON.stringify(data)}`);
      
    }
    unsub = eventBus.on("to_Container", callback);
    return () => {
      unsub && unsub();
    };
  }, [eventBus]);
  
  useEffect(() => {    
    if (localeRef.current !== locale) {
      const allListeners = Object.keys(eventBus.callbacks);

      allListeners.forEach((eventName: string) => {
        if (eventName !== 'to_Container') {
        eventBus.publish(eventName, "change_locale", {newLocale: locale, resources: window.i18NClones});
        }
      })
      localeRef.current = locale;
    }
  }, [locale, eventBus]);

  return <Component {...pageProps} />
}

const WrappedApp = (props: any) => <GlobalContextProvider><MyApp {...props} /></GlobalContextProvider>

export default appWithTranslation(WrappedApp, i18nConfig);
