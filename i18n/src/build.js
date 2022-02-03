import fs from 'fs-extra';
import shortUUID from 'short-uuid';
import path from 'path';


const config = JSON.parse(fs.readFileSync('src/config.json'));


const deployID = shortUUID.generate();

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

fs.readdirSync('dist').forEach(file => {
    if (file !== 'metadata.json') {
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
     fs.writeFileSync('dist/metadata.json', JSON.stringify({last_deploy_id: deployID}));
    } else {
        throw Error('ERROR: '+ dirName + " does not include " + config.common_json_name + '.json');
    }
})



