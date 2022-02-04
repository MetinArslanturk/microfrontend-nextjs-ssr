import fs from 'fs-extra';
import shortUUID from 'short-uuid';


const config = JSON.parse(fs.readFileSync('src/config.json'));


const deployID = shortUUID.generate().toLowerCase();

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

let previousDeployID = '';
let oldMetadata = null;
if (fs.existsSync('dist/metadata.json')) {
    oldMetadata = JSON.parse(fs.readFileSync('dist/metadata.json'));
    previousDeployID = oldMetadata.last_deploy_id;
}

fs.readdirSync('dist').forEach(file => {
    if (file !== 'metadata.json' && file !== previousDeployID) {
        fs.removeSync(`dist/${file}`, {force: true});
    }
})


const targetDistPath = `dist/${deployID}`;

fs.mkdirSync(targetDistPath, { recursive: true });


fs.copySync('public/locales/', targetDistPath);

fs.readdirSync(targetDistPath).forEach((dirName) => {
    const commonJSONPath = targetDistPath + '/' + dirName + '/' + config.common_json_name + '.json';
    if(fs.existsSync(commonJSONPath)) {
        const commonJSON = fs.readFileSync(commonJSONPath);
        const commonJSContent = `if (typeof window !== 'undefined') {
    if (!window.${config.i18NClonesVarName}) {window.${config.i18NClonesVarName} = {};}
    if (!window.${config.i18NClonesVarName}['${dirName}']) {window.${config.i18NClonesVarName}['${dirName}'] = {};}
    window.${config.i18NClonesVarName}['${dirName}'].${config.common_json_name} = ${commonJSON};
}`;

     fs.writeFileSync(targetDistPath + '/' + dirName + '/' + config.common_loader_js_name, commonJSContent);
     fs.writeFileSync('dist/metadata.json', JSON.stringify({last_deploy_id: deployID, appName: config.appName}));
    } else {
        throw Error('ERROR: '+ dirName + " does not include " + config.common_json_name + '.json');
    }
})



