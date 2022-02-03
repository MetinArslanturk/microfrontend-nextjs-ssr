import type { GetStaticProps } from "next";
import { useState } from "react";
import ContentLoader from "react-content-loader";
import DynamicRemoteApp from "../components/DynamicRemoteApp";
import styled from "@emotion/styled";

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

const Home = ({ innerHTMLContent, MFRemoteButtonRemoteEntryPath, MFRemoteButtonAppName }: Props) => {
  console.log('Home rendered');
  
  const [parentCounter, setParentCounter] = useState(0);

  return (
    <div>
      <p>Hello from NextJS</p>
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
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {  
  
  const preReadyEmotionStyles = [];
  // This will be an express server in your custom host
  const preRender = await fetch(process.env.MF_REMOTE_BUTTON_SERVER + '/prerender').then((res) =>
    res.json()
  );

  preReadyEmotionStyles.push({
    key: preRender.appName,
    styleId: preRender.styleId,
    styles: preRender.styles,
  });

  return {
    props: {
      MFRemoteButtonRemoteEntryPath: process.env.MF_REMOTE_BUTTON_BASE_PATH + '/remoteEntry.js',
      MFRemoteButtonAppName: process.env.MF_REMOTE_BUTTON_APP_NAME,
      innerHTMLContent: preRender.content,
      preReadyEmotionStyles,
    },
  };
};
export default Home;
