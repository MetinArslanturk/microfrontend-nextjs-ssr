const { promises, constants } = require('fs');

const checkExists = async (filePath) => {
    return promises.access(filePath, constants.F_OK)
             .then(() => true)
             .catch(() => false)
  }
  
  const purgeDirectory = async (dirPath) => {
    await checkExists(dirPath) && await promises.rm(dirPath, { recursive: true, force: true });
  }
  
  const purgeHtmlAndJsonFile = async (filePath) => {
    const fullPathHTML = `${filePath}.html`;
    const fullPathJSON = `${filePath}.json`;
    await checkExists(fullPathHTML) && await promises.unlink(fullPathHTML);
    await checkExists(fullPathJSON) && await promises.unlink(fullPathJSON);
  }
  
  const purgeData = async (app, locales) => {
    console.log("Starting to purge data...");
    for (const locale of locales) {
      const fullPath = ".next/server/pages/" + locale;
      await purgeDirectory(fullPath);
      await purgeHtmlAndJsonFile(fullPath);
    }
    try {
      await app.server.incrementalCache.cache.reset();
      console.log(`Cache successfully purged`);
    } catch (err) {
      console.error(`Could not purge cache - ${err}`);
    }
  };

  module.exports = {checkExists, purgeDirectory, purgeHtmlAndJsonFile, purgeData};