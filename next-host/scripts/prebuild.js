const shell = require("shelljs");
const fetch = require("node-fetch");
const allRemoteApps = require("./remote-apps.js");
const {fetchRemoteAppInfo, setEnvVars} = require("./fetch-set-remote-apps");




const executeBuildScript = async (remoteApps) => {
    const data = await fetchRemoteAppInfo(remoteApps, fetch);
    data.forEach(remoteApp => {
      setEnvVars(remoteApp);
    });
    
    shell.exec(`yarn next:build`, {
        env: {
          ...process.env,
        }
      });
}

executeBuildScript(allRemoteApps);



