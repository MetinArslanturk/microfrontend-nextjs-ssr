const microApps = {
  REMOTE_BUTTON: { type: "mf", env_prefix: "MF_REMOTE_BUTTON", nameInProps: "RemoteButton" }
}

export const pagesAndMicroAppRelations: any = {
    '/': [microApps.REMOTE_BUTTON],
};

export type MicroAppStruct = { type: 'mf' | 'i18n'; env_prefix: string, nameInProps: string };

export const getMicroAppsOfPage = async (pagePath: string) => {

  const microAppsOfPage = pagesAndMicroAppRelations[pagePath];
  if (microAppsOfPage) {
      const microAppsWithI18N = [...microAppsOfPage, {type: "i18n", env_prefix: "I18N"}];
    const res = await Promise.all(microAppsWithI18N.map((microApp: MicroAppStruct) => {
      const metadataJSONUrl = process.env[microApp.env_prefix + "_METADATA"];
      const serverRendererUrl = microApp.type === 'mf' ? process.env[microApp.env_prefix + "_SERVER_RENDERER"] : '';
      const rootPath = (metadataJSONUrl as string).replace(
        "/metadata.json",
        ""
      );
      return fetch(metadataJSONUrl as string)
        .then((resp) => resp.json())
        .then((data) => {
          return {
            ...microApp,
            ...data,
          };
        })
        .then((remoteApp) => {
          const basePath =
            remoteApp.last_deploy_id !== "development"
              ? `${rootPath}/${remoteApp.last_deploy_id}`
              : rootPath;
          return microApp.type === "mf"
            ? { appName: remoteApp.appName, basePath, serverRendererUrl }
            : { appName: remoteApp.appName, basePath, deployID: remoteApp.last_deploy_id };
        });
    }));

    

    return res;
  }
};


export const getPagePathsOfMicroApp = (microAppPrefix: string) => {
    const microAppPagePaths = Object.keys(pagesAndMicroAppRelations).filter(
        (pageName) =>
        pagesAndMicroAppRelations[pageName].some(
            (microApp: MicroAppStruct) => microApp.env_prefix === microAppPrefix
        )
    );
    return microAppPagePaths;
}
