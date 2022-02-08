const commonI18NCache: any = {};

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const latestDeployID = process.env["I18N_DEPLOY_ID"];
    const i18nRootPath = process.env["I18N_ROOT_PATH"];
    const requredNSs = req.body.requiredI18NResources
    const targetLocale = req.body.targetLocale;
    
    const filteredRequiredNS = requredNSs.filter((reqNS: any) => reqNS.ns === 'common' || reqNS.deployID !== latestDeployID)
    
    if (filteredRequiredNS.length === 0) {
      res.status(200).json({ loadNamespaces: [] })
    } else {
      const loadNamespaces: any = [];
      await Promise.all(filteredRequiredNS.map((reqNS: any) => {
        const {ns: targetNS, deployID: targetDeployID} = reqNS;

        if (targetNS === 'common') {
          const findInCache = commonI18NCache[targetLocale]?.find((c: any) => c.deployID === targetDeployID);
          if (findInCache) {
            loadNamespaces.push({ns: targetNS, resources: findInCache.resources});
            return Promise.resolve();
          }
        }


        const basePath = targetDeployID !== "development"
        ? `${i18nRootPath}/${targetDeployID}`
        : i18nRootPath;
        
        return fetch(`${basePath}/${targetLocale}/${targetNS}.json`).then(res => res.json()).then(dt => {
          dt.__dep_ver = targetDeployID;

          if (targetNS === 'common') {
            if (!commonI18NCache[targetLocale]) { commonI18NCache[targetLocale] = []; }
            commonI18NCache[targetLocale].push({deployID: targetDeployID, resources: dt});
            if (commonI18NCache[targetLocale].length > 5) {
              commonI18NCache[targetLocale].shift();
            }
          }
          
          loadNamespaces.push({ns: targetNS, resources: dt});
        })
      }));

      return res.status(200).json({ loadNamespaces });
    }
  }
  }