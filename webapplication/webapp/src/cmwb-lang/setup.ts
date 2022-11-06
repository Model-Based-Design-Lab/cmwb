import * as monaco from 'monaco-editor'
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc'
import {
    MonacoLanguageClient,
    CloseAction,
    ErrorAction,
    MonacoServices,
    MessageTransports
  } from 'monaco-languageclient';
import { buildWorkerDefinition } from 'monaco-editor-workers'

import { DomainExtensions, DomDTMC, DomFSA, DomLTL, DomMPM, DomRegEx, DomSDF } from '../config/model'
import {fsaMonarchLanguage} from './fsa-language-mode'
import {dtmcMonarchLanguage} from './dtmc-language-mode'
import { ltlMonarchLanguage } from './ltl-language-mode'
import { regexMonarchLanguage } from './regex-language-mode'
import { sdfMonarchLanguage } from './sdf-language-mode'
import { mpmMonarchLanguage } from './mpm-language-mode'
import { createUrl } from './config';
import { BASE_PATH, BASE_URL } from '../config/config';


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

const createLanguageClient = (transports: MessageTransports, languageID: string): MonacoLanguageClient => {
    return new MonacoLanguageClient({
        name: 'Computational Modeling Language Client',
        clientOptions: {
            documentSelector: [languageID],
            // select error handlers
            errorHandler: {
                error: () => ({ action: ErrorAction.Continue }),
                closed: () => ({ action: CloseAction.Restart })
            }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: () => {
                return Promise.resolve(transports)
            }
        }
    })
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

    MonacoServices.install()


    // create the websocket and the language client to the LSP server
    const webSocket = new WebSocket(createUrl(localMode, wslspPath))
    webSocket.onopen = () => {
        const socket = toSocket(webSocket)
        const reader = new WebSocketMessageReader(socket)
        const writer = new WebSocketMessageWriter(socket)
        const languageClient = createLanguageClient({
            reader,
            writer
        }, languageID)
        languageClient.start()
        reader.onClose(() => languageClient.dispose())
        onLspConnect()
    }
    webSocket.onclose = () => {
        onLspDisconnect()
    }
}

export function setupLanguage(languageID: string) {
    // set how to find the workers
    buildWorkerDefinition(`${BASE_PATH}/monaco/workers`, `${BASE_URL}`, false)
    // register our language
    monaco.languages.register(languageExtensionPoint(languageID));
    // setup the monarch definition for syntax highlighting
    switch (languageID) {
        case DomainExtensions.get(DomFSA):
            monaco.languages.setMonarchTokensProvider(languageID, fsaMonarchLanguage)            
            break;
    
        case DomainExtensions.get(DomDTMC):
            monaco.languages.setMonarchTokensProvider(languageID, dtmcMonarchLanguage)            
            break;

        case DomainExtensions.get(DomLTL):
            monaco.languages.setMonarchTokensProvider(languageID, ltlMonarchLanguage)            
            break;
    
        case DomainExtensions.get(DomRegEx):
            monaco.languages.setMonarchTokensProvider(languageID, regexMonarchLanguage)            
            break;

        case DomainExtensions.get(DomSDF):
            monaco.languages.setMonarchTokensProvider(languageID, sdfMonarchLanguage)            
            break;

        case DomainExtensions.get(DomMPM):
            monaco.languages.setMonarchTokensProvider(languageID, mpmMonarchLanguage)            
            break;
                
        default:
           break;
    }

}
