const fs = require('fs-extra');
const shortUUID = require('short-uuid');
const metadata = require('./public/metadata.json');

const deployID = shortUUID.generate().toLowerCase();

fs.mkdirSync(`dist/${deployID}`, { recursive: true });

fs.readdirSync('dist').forEach((fileName) => {
    if (fileName !== deployID) {
        fs.moveSync(`dist/${fileName}`, `dist/${deployID}/${fileName}`);
    }
});


metadata.last_deploy_id = deployID;


fs.writeFileSync('dist/metadata.json', JSON.stringify(metadata));