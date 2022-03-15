import type { GetStaticProps } from "next";
import { useState, useContext } from "react";
import ContentLoader from "react-content-loader";
import DynamicRemoteApp from "../components/DynamicRemoteApp";
import styled from "@emotion/styled";
import { serverSideTranslations, useTranslation } from "../next-i18next";
import i18nConfig from "../next-i18next.config";
import { useRouter } from "next/router";
import { postData } from "../utils/fetch";
import { changeLocale } from "../utils/locale-changer";
import { GlobalContext } from "../components/GlobalContext";
import { RemoteAppKeys, requiredRemoteAppsOfPage, REMOTE_APP_ENVS, RemoteAppProps } from "../remote-app-env-extractor";

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
  [key in RemoteAppKeys]: RemoteAppProps
};

export const i18nNamespaces = ["common", "second"];

const Home = ({ RemoteButton }: Props) => {
  console.log('Home rendered');
  const { t } = useTranslation('second');
  const router = useRouter();
  const {locale} = router;

  const {value } = useContext<any>(GlobalContext);
  const {eventBus} = value;
  const [parentCounter, setParentCounter] = useState(0);


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
          url: RemoteButton.pageProps.entryPath,
          scope: RemoteButton.pageProps.appName,
          module: `./${RemoteButton.pageProps.appName}App`,
        }}
        innerHTMLContent={RemoteButton.innerHTMLContent}
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
        eventBus={eventBus}
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
  const preReadyEmotionStyles: any = [];
  const allRemoteAppProps = {} as {[key in RemoteAppKeys]: RemoteAppProps};


  const {I18N, RemoteButton} = REMOTE_APP_ENVS;


  const remoteAppsToRenderSSR: requiredRemoteAppsOfPage = [
    {propName: 'RemoteButton', app: RemoteButton, extraArgs: {}}
  ];



  const { _nextI18Next, commoni18n } = await serverSideTranslations(
    locale,
    i18nConfig,
    I18N.pageProps.entryPath,
    I18N.deployID,
    i18nNamespaces
  );


  for (const remoteApp of remoteAppsToRenderSSR) {
    try {
      // This will be an express server in your custom host
      const response = await postData(remoteApp.app.serverRendererPath, {
        locale,
        resources: {
          [locale]: {
          ..._nextI18Next.initialI18nStore[locale],
          common: commoni18n
          }
        },
        ...remoteApp.extraArgs,
      });
      
      preReadyEmotionStyles.push({
        key: response.appName,
        styleId: response.styleId,
        styles: response.styles,
      });

      allRemoteAppProps[remoteApp.propName] = {...remoteApp.app, innerHTMLContent: response.content};
    } catch (err) {
      throw Error('Failed while taking pre-render results of remote-app: ' + err);
    }
  }

  


  return {
    props: {
      _nextI18Next,
      preReadyEmotionStyles,
      ...allRemoteAppProps,
    },
  };
};
export default Home;
