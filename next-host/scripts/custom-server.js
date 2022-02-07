// eslint-disable
const { createServer } = require('http');
const next = require('next');
const schedule = require('node-schedule');
const allRemoteApps = require("./remote-apps.js");
const {fetchRemoteAppInfo, setEnvVars} = require("./fetch-set-remote-apps");
const {purgeData} = require("./utils");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const locales = require("../next.config.js").i18n.locales;

const remoteAppsLastDeployIDs = {};


const checkUpdatedDeployIDsAndPurgeData = async (retryCount = 0) => {
  try {
    const data = await fetchRemoteAppInfo(allRemoteApps, fetch);
    let needsPurgeData = false; // This can be an array in future like whichPagesWillBePurged
    if (!data) {
      return;
    }
    data.forEach((remoteApp) => {
      if (
        remoteAppsLastDeployIDs[remoteApp.appName] !== remoteApp.last_deploy_id
      ) {
        setEnvVars(remoteApp);
        remoteAppsLastDeployIDs[remoteApp.appName] = remoteApp.last_deploy_id;
        needsPurgeData = true;
      }
    });

    if (needsPurgeData) {
      // PURGE ALL CACHED DATA (only related ones in future maybe)
      purgeData(app, locales);
    }
  } catch (err) {
    console.log(
      "Ups, something went wrong in checkUpdatedDeploy... I will retry 3 times with 5 seconds delay",
      err
    );
    if (retryCount < 3) {
      setTimeout(() => {
        checkUpdatedDeployIDsAndPurgeData(retryCount + 1);
      }, 5000);
    }
  }
};

const checkUpdatedDeployIDsAndPurgeDataInterval = () => {
  schedule.scheduleJob("*/5 * * * *", function () {
    checkUpdatedDeployIDsAndPurgeData();
  });
};


process.on('SIGINT', function () { 
  schedule.gracefulShutdown().then(() => {
    process.exit(0);
  });  
})


fetchRemoteAppInfo(allRemoteApps, fetch).then(data => {
  data.forEach(remoteApp => {
    setEnvVars(remoteApp);
    remoteAppsLastDeployIDs[remoteApp.appName] = remoteApp.last_deploy_id;
  });
  checkUpdatedDeployIDsAndPurgeDataInterval();
}).then(() => {
  app.prepare().then(()=>{

  }).then(() => {
    createServer((req, res) => {
  
      handle(req, res);
    }).listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000/');
    });
  });
})


