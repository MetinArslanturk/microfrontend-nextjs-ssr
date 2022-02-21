import type { GetStaticProps } from "next";
import { useState, useContext } from "react";
import ContentLoader from "react-content-loader";
import DynamicRemoteApp from "../components/DynamicRemoteApp";
import styled from "@emotion/styled";
import { serverSideTranslations, useTranslation } from "../next-i18next";
import i18nConfig from "../next-i18next.config";
import { useRouter } from "next/router";
import { changeLocale } from "../utils/locale-changer";
import { GlobalContext } from "../components/GlobalContext";
import { getMicroAppsOfPage, MicroAppStruct, pagesAndMicroAppRelations } from "../utils/pages-microapps";
import { microAppPropExtractor } from "../utils/micro-app-prop-extractor";

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
  MFRemoteButtonInnerHTMLContent: string;
  MFRemoteButtonRemoteEntryPath: string;
  MFRemoteButtonAppName: string;
};

export const i18nNamespaces = ["common", "second"];

const Home = ({ MFRemoteButtonInnerHTMLContent, MFRemoteButtonRemoteEntryPath, MFRemoteButtonAppName }: Props) => {
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
          url: MFRemoteButtonRemoteEntryPath,
          scope: MFRemoteButtonAppName,
          module: `./${MFRemoteButtonAppName}App`,
        }}
        innerHTMLContent={MFRemoteButtonInnerHTMLContent}
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
  const microApps = pagesAndMicroAppRelations['/'].map((mApp: MicroAppStruct) =>  mApp.nameInProps);
  
  const microAppProps: any = {};
  const preReadyEmotionStyles: any = [];
  const allRequiredMicroApps = await getMicroAppsOfPage("/");


  const i18nData = (allRequiredMicroApps as any[]).find(
    (microApp) => microApp.appName === "I18N"
  );

  const { _nextI18Next, commoni18n } = await serverSideTranslations(
    locale,
    i18nConfig,
    i18nData.basePath,
    i18nData.deployID,
    i18nNamespaces
  );

  // Automatically creates initial props for all microApps based on app's name in microApps array
  // i.e. if you have a microApp called "RemoteButton" it will create props called
  // "MFRemoteButtonInnerHTMLContent", "MFRemoteButtonRemoteEntryPath", "MFRemoteButtonAppName"
  // MF{AppNameInProps}{propType} convention
  for (const microAppName of microApps) {
    const remoteMicroApp = (allRequiredMicroApps as any[]).find(
      (microApp) => microApp.appName === microAppName
    );
  
    if (remoteMicroApp) {
      await microAppPropExtractor(
        microAppName,
        microAppProps,
        remoteMicroApp,
        locale,
        _nextI18Next,
        commoni18n,
        preReadyEmotionStyles
      );
    }
  }


  return {
    props: {
      ...microAppProps,
      _nextI18Next,
      preReadyEmotionStyles,
    },
  };
};
export default Home;
