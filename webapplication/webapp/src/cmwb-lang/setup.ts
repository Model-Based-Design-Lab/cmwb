import * as monaco from 'monaco-editor-core'
import { createUrl } from './config'
import { BASE_PATH, CONTAINER_WSLSP_PATH, WSLSP_PATH } from '../config/config'
import {fsaMonarchLanguage} from './fsa-language-mode'
import {dtmcMonarchLanguage} from './dtmc-language-mode'
import { MessageConnection } from 'vscode-jsonrpc'
import {
    MonacoLanguageClient,
    CloseAction,
    ErrorAction,
    MonacoServices,
    createConnection
  } from 'monaco-languageclient'
  import {listen} from 'vscode-ws-jsonrpc'
import ReconnectingWebSocket from '../utils/reconnectingwebsocket/reconnecting-websocket'
import { DomainExtensions, DomDTMC, DomFSA, DomLTL, DomMPM, DomRegEx, DomSDF } from '../config/model'
import { ltlMonarchLanguage } from './ltl-language-mode'
import { regexMonarchLanguage } from './regex-language-mode'
import { sdfMonarchLanguage } from './sdf-language-mode'
import { mpmMonarchLanguage } from './mpm-language-mode'


const languageExtensionPoint: (language: string) => monaco.languages.ILanguageExtensionPoint =  (language: string) => {
    return {
        id: language,
        aliases: [
            language
        ],
        extensions: [`.${language}`],
        mimetypes: [
            `text/${language}`
        ]
    }
}

export const createLanguageClient = (connection: MessageConnection, languageID: string) => new MonacoLanguageClient({
    name: 'Computational Modeling Language Client',
    clientOptions: {
        documentSelector: [languageID],
        errorHandler: {
            error: () => ErrorAction.Continue,
            closed: () => CloseAction.DoNotRestart
        }
    },
    connectionProvider: {
        get: (errorHandler, closeHandler) => Promise.resolve(createConnection(connection, errorHandler, closeHandler))
    }
})

// const createWebSocket = (url: string) => new WebSocket(url, undefined)
const createWebSocket = (url: string, onConnect: ()=>void, onDisconnect: ()=>void) => {
    var s = new ReconnectingWebSocket(url, undefined)
    s.addEventListener('open', () => {
        onConnect()
    });
    s.addEventListener('close', () => {
        onDisconnect()
    });
    s.addEventListener('error', () => {
        onDisconnect()
    });
    return s
}

const modelUri = (name: string, languageID: string) => monaco.Uri.parse(`inmemory:/models/${name}.${languageID}`)

export const createModel = (languageID: string, name: string) => monaco.editor.createModel("", languageID, modelUri(name, languageID))

// install editor on model on a div node for the given language
// setup language client with websocket connection to LSP server
export const installEditor = (
        divNode: HTMLElement, 
        model: monaco.editor.ITextModel, 
        languageID: string,
        localMode: boolean,
        wslspPath: string,
        onLspConnect: ()=>void,
        onLspDisconnect: ()=>void
    ) => {
    // create the editor
    const editor = monaco.editor.create(divNode, {
        model: model,
        language: languageID,
        minimap: { enabled: true },
        autoIndent: "brackets"
    })
    
    // type cast the editor due incompatibilities between the monaco-editor-core and monaco-languageclient versions
    // hopefully this works, see readme.md
    var mEditor: globalThis.monaco.editor.IStandaloneCodeEditor 
    mEditor = editor as globalThis.monaco.editor.IStandaloneCodeEditor
    
    // setup the language client to the editor
    MonacoServices.install(mEditor)
    
    // create the websocket from the language client to the LSP server
    listen({
        webSocket: createWebSocket(createUrl(localMode, wslspPath), onLspConnect, onLspDisconnect),
        onConnection: connection => {
          const languageClient = createLanguageClient(connection, languageID).start()
          connection.onClose(() => languageClient.dispose())
        }
      })
}

export function setupLanguage(language: string) {

    // tell Monaco how to find the editor worker
    (window as any).MonacoEnvironment = {
        getWorkerUrl: function (_moduleId: any, _label: any) {
            // return BASE_PATH+'/_next/static/chunks/editor.worker.js'
            return BASE_PATH+'/monaco/editor.worker.js'
        }
    }

    // register our language
    monaco.languages.register(languageExtensionPoint(language))
    // setup the monarch definition for syntax highlighting
    switch (language) {
        case DomainExtensions.get(DomFSA):
            monaco.languages.setMonarchTokensProvider(language, fsaMonarchLanguage)            
            break;
    
        case DomainExtensions.get(DomDTMC):
            monaco.languages.setMonarchTokensProvider(language, dtmcMonarchLanguage)            
            break;

        case DomainExtensions.get(DomLTL):
            monaco.languages.setMonarchTokensProvider(language, ltlMonarchLanguage)            
            break;
    
        case DomainExtensions.get(DomRegEx):
            monaco.languages.setMonarchTokensProvider(language, regexMonarchLanguage)            
            break;

        case DomainExtensions.get(DomSDF):
            monaco.languages.setMonarchTokensProvider(language, sdfMonarchLanguage)            
            break;

        case DomainExtensions.get(DomMPM):
            monaco.languages.setMonarchTokensProvider(language, mpmMonarchLanguage)            
            break;
                
        default:
           break;
    }
}
