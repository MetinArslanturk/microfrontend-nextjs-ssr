const fetchRemoteAppInfo = async (remoteApps, fetchFnc) => {
  const allRemoteApps = await Promise.all(
    remoteApps.map((remoteApp) => {
      return fetchFnc(process.env[remoteApp.env_prefix + "_METADATA"])
        .then((resp) => resp.json())
        .then((data) => {
          return {
            env_prefix: remoteApp.env_prefix,
            type: remoteApp.type,
            ...data,
          };
        });
    })
  ).catch((err) => {console.log('Err', err);});

  return allRemoteApps;
};

const setEnvVars = (remoteApp) => {
  if (remoteApp.type === "mf") {
    const basePath = process.env[remoteApp.env_prefix + "_METADATA"].replace(
      "/metadata.json",
      ""
    );
    process.env[remoteApp.env_prefix + "_BASE_PATH"] =
      remoteApp.last_deploy_id !== "development"
        ? `${basePath}/${remoteApp.last_deploy_id}`
        : basePath;
    process.env[remoteApp.env_prefix + "_APP_NAME"] = remoteApp.appName;
  } else if (remoteApp.type === "i18n") {
    const basePath = process.env[remoteApp.env_prefix + "_METADATA"].replace(
      "/metadata.json",
      ""
    );
    process.env[
      remoteApp.env_prefix + "_BASE_PATH"
    ] = `${basePath}/${remoteApp.last_deploy_id}`;
    process.env[
      remoteApp.env_prefix + "_DEPLOY_ID"
    ] = remoteApp.last_deploy_id;
  }
};

module.exports = { fetchRemoteAppInfo, setEnvVars };
