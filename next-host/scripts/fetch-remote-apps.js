const fetchRemoteAppInfo = async (remoteApps, fetchFnc) => {
    const allRemoteApps = await Promise.all(remoteApps.map(remoteApp => {
        return fetchFnc(process.env[remoteApp.env_prefix + '_METADATA']).then(resp => resp.json()).then(data => {
            if (remoteApp.type === 'mf') {
                const basePath = process.env[remoteApp.env_prefix + '_METADATA'].replace('/metadata.json', '');
                process.env[remoteApp.env_prefix + '_BASE_PATH'] = data.last_deploy_id !== 'development' ? `${basePath}/${data.last_deploy_id}` : basePath;
            } else if (remoteApp.type === 'i18n') {
                const basePath = process.env[remoteApp.env_prefix + '_METADATA'].replace('/metadata.json', '');
                process.env[remoteApp.env_prefix + '_BASE_PATH'] = `${basePath}/${data.last_deploy_id}`;
            }
            
            return {type: remoteApp.type, ...data};
        })
    }));

    return allRemoteApps;
}

module.exports = fetchRemoteAppInfo;