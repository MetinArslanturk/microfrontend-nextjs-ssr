import { appWithTranslation } from "../next-i18next";
import i18nConfig from "../next-i18next.config";
import type { AppProps } from 'next/app'


function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp, i18nConfig);
