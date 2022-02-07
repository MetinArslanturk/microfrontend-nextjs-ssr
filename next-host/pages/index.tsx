import type { GetStaticProps } from "next";
import { useState, useEffect, useRef } from "react";
import ContentLoader from "react-content-loader";
import DynamicRemoteApp from "../components/DynamicRemoteApp";
import styled from "@emotion/styled";
import { serverSideTranslations, useTranslation } from "../next-i18next";
import i18nConfig from "../next-i18next.config";
import { useRouter } from "next/router";
// @ts-ignore
import EventStream from "eventing-bus/lib/event_stream";
import { postData } from "../utils/fetch";
import { changeLocale } from "../utils/locale-changer";

const Button = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

const SkeletonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
`

type Props = {
  innerHTMLContent: string;
  MFRemoteButtonRemoteEntryPath: string;
  MFRemoteButtonAppName: string;
};

export const i18nNamespaces = ["common", "second"];

const Home = ({ innerHTMLContent, MFRemoteButtonRemoteEntryPath, MFRemoteButtonAppName }: Props) => {
  console.log('Home rendered');
  const { t } = useTranslation('second');
  const remoteButtoneventBusRef = useRef(new EventStream());
  const router = useRouter();
  const {locale} = router;

  const currentLocaleRef = useRef(locale);
  
  const [parentCounter, setParentCounter] = useState(0);


  useEffect(() => {    
    if (currentLocaleRef.current !== locale) {
      const microAppEventBus = remoteButtoneventBusRef.current;
      microAppEventBus.publish("microAppParentEventsBus", "change_locale", {newLocale: locale, resources: window.i18NClones});
      currentLocaleRef.current = locale;
    }
  }, [locale])

  return (
    <div>
      <p>Hello from NextJS</p>
      This text comes from i18n(common): {t('test text', {ns: 'common'})} <br />
      This text also comes from i18n(second): {t("second text", {ns: 'second'})} <br />
      <div>
        I am parent counter: {parentCounter}{" "}
        <Button onClick={() => setParentCounter((pc) => pc + 1)}>
          Increase Parent
        </Button>
      </div>
      <DynamicRemoteApp
        // We are providing this dynamically, so this can be fetched with getStaticProps or on runtime at client side
        // this will be CDN host probably
        remoteAppInfo={{
          url: MFRemoteButtonRemoteEntryPath,
          scope: MFRemoteButtonAppName,
          module: `./${MFRemoteButtonAppName}App`,
        }}
        innerHTMLContent={innerHTMLContent}
        skeletonThreshold={500}
        skeleton={
          <SkeletonWrapper>
            <ContentLoader
              speed={1}
              width={380}
              height={84}
              viewBox="0 0 380 84"
              backgroundColor="#f6f6ef"
              foregroundColor="#e8e8e3"
            >
              <rect x="0" y="4" rx="0" ry="0" width="210" height="13" />
              <rect x="220" y="4" rx="0" ry="0" width="50" height="13" />
            </ContentLoader>
          </SkeletonWrapper>
        }
        eventBus={remoteButtoneventBusRef.current}
        locale={locale}
      />

<button onClick={() => {
       changeLocale(router, 'en-US')
        
      }}>en-US</button>{' '}
      <button onClick={() => {
       changeLocale(router, 'es-MX')
        
      }}>es-MX</button>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({locale}) => {
  locale = locale as string;
  const { _nextI18Next, commoni18n } = await serverSideTranslations(
    locale,
    i18nConfig,
    process.env.I18N_BASE_PATH as string,
    process.env.I18N_DEPLOY_ID as string,
    i18nNamespaces
  );

  const preReadyEmotionStyles = [];
  let preRender: {appName?: string, styleId?: string, styles?: string, content?: string} = {};

  try {
  // This will be an express server in your custom host
  preRender = await postData(process.env.MF_REMOTE_BUTTON_SERVER + '/prerender', {
    locale,
    resources: {
      [locale]: {
      ..._nextI18Next.initialI18nStore[locale],
      common: commoni18n
      }
    }
  })
} catch (err) {}

  preReadyEmotionStyles.push({
    key: preRender.appName,
    styleId: preRender.styleId,
    styles: preRender.styles,
  });

  return {
    props: {
      _nextI18Next,
      MFRemoteButtonRemoteEntryPath: process.env.MF_REMOTE_BUTTON_BASE_PATH + '/remoteEntry.js',
      MFRemoteButtonAppName: process.env.MF_REMOTE_BUTTON_APP_NAME,
      innerHTMLContent: preRender.content,
      preReadyEmotionStyles,
    },
  };
};
export default Home;
