const fetch = require("node-fetch");
const remoteAppsJSON = require("../remote-apps.json");
const fs = require("fs");
const path = require("path");

const envFilePath = path.resolve(__dirname, "../.env.local");
const envFile = fs.readFileSync(
  envFilePath,
  "utf8"
);

const fetchRemoteAppInfo = async (remoteApps) => {
  const allRemoteApps = await Promise.all(
    Object.keys(remoteApps).map((remoteAppKey) => {
      const remoteApp = remoteApps[remoteAppKey];
      return fetch(
        process.env[remoteApp.env_prefix + "_ROOT_PATH"] + "/metadata.json"
      )
        .then((resp) => resp.json())
        .then((data) => {
          return {
            remoteAppKey,
            env_prefix: remoteApp.env_prefix,
            type: remoteApp.type,
            ...data,
          };
        });
    })
  ).catch((err) => {
    console.log("Err", err);
  });

  return allRemoteApps;
};

const updateExistingOrAddNew = (input, key, newValue) => {
  const regex = new RegExp(`(${key})=(.+)`);

  const exists = regex.test(input);

  if (exists) {
    const result = input.replace(regex, `$1=${newValue}`);
    return result;
  } else {
    return `${input}\n${key}=${newValue}`;
  }
};

const updateEnvFile = (remoteAppInfos) => {
  let replacedEnvFile = envFile;
  for (const remoteAppInfo of remoteAppInfos) {
    const rootPath = process.env[remoteAppInfo.env_prefix + "_ROOT_PATH"];

    const basePath =
      remoteAppInfo.last_deploy_id !== "development"
        ? `${rootPath}/${remoteAppInfo.last_deploy_id}`
        : rootPath;

    replacedEnvFile = updateExistingOrAddNew(
      replacedEnvFile,
      `${remoteAppInfo.env_prefix}_ENTRY_BASE_PATH`,
      basePath
    );

    if (remoteAppInfo.type === "mf") {
      replacedEnvFile = updateExistingOrAddNew(
        replacedEnvFile,
        `${remoteAppInfo.env_prefix}_APP_NAME`,
        remoteAppInfo.appName
      );
    } else if (remoteAppInfo.type === "i18n") {
      replacedEnvFile = updateExistingOrAddNew(
        replacedEnvFile,
        `${remoteAppInfo.env_prefix}_DEPLOY_ID`,
        remoteAppInfo.last_deploy_id
      );
    }
  }
  return replacedEnvFile;
};

const prefillEnvVars = async () => {
  const remoteAppInfos = await fetchRemoteAppInfo(remoteAppsJSON);
  const finalEnvFile = updateEnvFile(remoteAppInfos);

  fs.writeFileSync(envFilePath, finalEnvFile);

  console.log("Successfully updated the env file.");
};

prefillEnvVars();
