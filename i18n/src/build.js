import fs from 'fs-extra';
import shortUUID from 'short-uuid';

const isDev = process.env.NODE_ENV === 'development';

const config = JSON.parse(fs.readFileSync('src/config.json'));


const deployID = isDev ? 'development' : shortUUID.generate().toLowerCase();
const distBasePathName = isDev ? '.i18dev' : 'dist';

if (!fs.existsSync(distBasePathName)) {
    fs.mkdirSync(distBasePathName);
}

let previousDeployID = '';
let oldMetadata = null;
if (!isDev && fs.existsSync(distBasePathName + '/metadata.json')) {
    oldMetadata = JSON.parse(fs.readFileSync(distBasePathName + '/metadata.json'));
    previousDeployID = oldMetadata.last_deploy_id;
}

fs.readdirSync(distBasePathName).forEach(file => {
    if (file !== 'metadata.json' && file !== previousDeployID) {
        fs.removeSync(`${distBasePathName}/${file}`, {force: true});
    }
})


const targetDistPath = isDev ? distBasePathName : `${distBasePathName}/${deployID}`;

fs.mkdirSync(targetDistPath, { recursive: true });


fs.copySync('public/locales/', targetDistPath);

fs.readdirSync(targetDistPath).forEach((dirName) => {
    if (dirName === 'metadata.json') {
        return;
    }
    const commonJSONPath = targetDistPath + '/' + dirName + '/' + config.common_json_name + '.json';
    if(fs.existsSync(commonJSONPath)) {
        const commonJSON = fs.readFileSync(commonJSONPath);
        const commonJSContent = `if (typeof window !== 'undefined') {
    if (!window.${config.i18NClonesVarName}) {window.${config.i18NClonesVarName} = {};}
    if (!window.${config.i18NClonesVarName}['${dirName}']) {window.${config.i18NClonesVarName}['${dirName}'] = {};}
    window.${config.i18NClonesVarName}['${dirName}'].${config.common_json_name} = ${commonJSON};
    window.${config.i18NClonesVarName}['${dirName}'].${config.common_json_name}.__dep_ver = '${deployID}';
}`;

     fs.writeFileSync(targetDistPath + '/' + dirName + '/' + config.common_loader_js_name, commonJSContent);
     fs.writeFileSync(distBasePathName + '/metadata.json', JSON.stringify({last_deploy_id: deployID, appName: config.appName}));
    } else {
        throw Error('ERROR: '+ dirName + " does not include " + config.common_json_name + '.json');
    }
})



