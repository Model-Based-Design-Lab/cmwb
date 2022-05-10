import { editor } from 'monaco-editor-core'
import React from 'react'
import { Container } from 'react-bootstrap'
import {createModel, installEditor, setupLanguage} from '../../cmwb-lang/setup'
import { CONTAINER_WSLSP_PATH, WSLSP_PATH } from '../../config/config'

export interface IEditorProps {
    localMode: boolean,
    language: string,
    initialContent: string,
    onSetEditor?: (editor: any)=>void
}

interface State {
    lspConnected: boolean
}

class Editor extends React.Component<IEditorProps, State> {

    private domNodeRef: any
    private language: string
    private initialContent: string
    private model: editor.ITextModel
    private onSetEditor: (editor: any)=>void

    constructor(props: IEditorProps) {
        super(props)

        this.language = props.language
        this.initialContent = props.initialContent
        this.onSetEditor = props.onSetEditor
        this.domNodeRef = React.createRef()
        this.state = {lspConnected: false}
        }

        componentDidMount() {
            const divNode = this.domNodeRef.current
            if (divNode) {
                setupLanguage(this.language)

                // check if there already is a Monaco model to re-use or not
                const models = monaco.editor.getModels()
                if (models.length == 0) {
                    this.model = createModel(this.language, "model")
                } else {
                    this.model = models[0]
                }
                this.model.setValue(this.initialContent)
                const path = this.props.localMode?CONTAINER_WSLSP_PATH:WSLSP_PATH
                installEditor(divNode, this.model, this.language, this.props.localMode, path, ()=>this.lspConnect(), ()=>this.lspDisconnect())
            }    
            if (this.onSetEditor) this.onSetEditor(this)
        }

        public getContent() {
            return this.model.getValue()
        }
        
        private lspConnect(){
            this.setState({lspConnected: true})
        }

        private lspDisconnect(){
            this.setState({lspConnected: false})
        }

        render() {
            return (
                <Container fluid>
                    <div ref={this.domNodeRef} style={{ height: '70vh', width: '80vw', margin: '10px' }}></div>
                    {(! this.state.lspConnected) &&  <p className="warning" style={{ width: '80vw', margin: '10px' }}>Not connected to the language server.</p>}
                    {(this.state.lspConnected) &&  <p className="success" style={{ width: '80vw', margin: '10px' }}>Connected to the language server.</p>}
                </Container>
            )
        }
}

 export default Editor
 