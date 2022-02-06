export default function initialDataLoader(props) {
    const {i18nMetaDataUrl, i18nNamespaces, locale} = props;
    return fetch(i18nMetaDataUrl).then(res => res.json()).then(data => {
        const i18nBaseUrl =
          data.last_deploy_id === "development"
            ? i18nMetaDataUrl.replace("/metadata.json", "")
            : i18nMetaDataUrl.replace(
                "/metadata.json",
                "/" + data.last_deploy_id
              );
        
        const i18nResources = {};
        return Promise.all(
          i18nNamespaces.map((ns) =>
            fetch(i18nBaseUrl + "/" + locale + "/" + ns + ".json")
              .then((translations) => translations.json())
              .then((t) => (i18nResources[ns] = t))
          )
        ).then(() => ({resources: {
          [locale]: i18nResources
        },
         locale}));
      })
}