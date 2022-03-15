import remoteApps from './remote-apps.json';


export type RemoteAppKeys = keyof typeof remoteApps;

export type RemoteAppSpecs = {
    pageProps: {
        appName: string;
        entryPath: string;
    };
    serverRendererPath: string;
}

export type I18NType = RemoteAppSpecs & {deployID: string}

export type RemoteAppProps = RemoteAppSpecs & {innerHTMLContent: string}
export type requiredRemoteAppsOfPage = {propName: RemoteAppKeys, app: RemoteAppSpecs, extraArgs: any}[];




export const REMOTE_APP_ENVS: {[K in RemoteAppKeys]: RemoteAppSpecs;} & {I18N: I18NType } = {
    RemoteButton: {
        pageProps: {
            appName: process.env.MF_REMOTE_BUTTON_APP_NAME as string,
            entryPath: process.env.MF_REMOTE_BUTTON_ENTRY_BASE_PATH + '/remoteEntry.js',
        },
        serverRendererPath: process.env.MF_REMOTE_BUTTON_SERVER_BASE_PATH + '/prerender'
    },
    I18N: {
        pageProps: {
            appName: 'I18N',
            entryPath: process.env.I18N_ENTRY_BASE_PATH as string
        },
        serverRendererPath: '',
        deployID: process.env.I18N_DEPLOY_ID as string
    }
} 
