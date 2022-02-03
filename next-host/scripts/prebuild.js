const shell = require("shelljs");
const fetch = require("node-fetch");
const allRemoteApps = require("./remote-apps.js");
const fetchRemoteAppInfo = require("./fetch-remote-apps");




const executeBuildScript = async (remoteApps) => {
    await fetchRemoteAppInfo(remoteApps, fetch);
    shell.exec(`yarn next:build`, {
        env: {
          ...process.env,
        }
      });
}

executeBuildScript(allRemoteApps);



