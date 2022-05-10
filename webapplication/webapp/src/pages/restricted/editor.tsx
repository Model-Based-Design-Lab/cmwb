import * as React from 'react'
import { Spinner } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import IconButton, { closeIcon, downloadIcon, saveIcon } from '../../components/Buttons/IconButton'
import {CSREditor} from '../../components/Editor/CSREditor'
import { ArtifactList, TArtifact } from '../../components/Modal/ArtifactList'
import { Confirm } from '../../components/Modal/Confirm'
import Notification from '../../components/Notification/Notification'
import { languageIDs } from '../../cmwb-lang/config'
import { saveToFile } from '../../utils/utils'
import { getArtifactURL } from '../../artifacts/artifacts'
import { DomainExtensions, DomainNames } from '../../config/model'
import { MODELS_PAGE_URL } from '../../config/config'
import { historyPush, openInNewWindow } from '../../utils/routing'
import { ModelsController } from '../../controller/modelscontroller'
import { SelectionModal } from '../../components/Modal/SelectionModal'

interface Props {
    localMode: boolean
}

interface State {
    loading: boolean,
    initialModel: any
}

class Editor extends React.Component<Props, State> {

    private modelId: string
    private domain: string
    private editor: React.RefObject<CSREditor>
    private notification: React.RefObject<Notification>
    private confirmDialog: React.RefObject<Confirm>
    private selectionDialog: React.RefObject<SelectionModal>
    private artifactList: React.RefObject<ArtifactList>
    // private router: NextRouter

    constructor(props: any) {
        super(props)
        this.state = { loading: true, initialModel: undefined }
        this.modelId = props.query.modelId
        this.domain = props.query.domain
        this.editor = React.createRef()
        this.confirmDialog = React.createRef()
        this.selectionDialog = React.createRef()
        this.notification = React.createRef()
        this.artifactList = React.createRef()
        // this.router = props.router
        this.getModel(this.modelId)
        .then( (model: any) => {
            this.setState({loading: false, initialModel: model})
        })
    }

    private async getModel(modelId: string) {
        return await ModelsController.getModel(modelId)
    }

    private doClose() {
        // router push does not fully reload the page and I can't figure out how to get access to the session user, therefore, use window.location instead

        // this.router.push('models', undefined, {shallow: false})
        historyPush(MODELS_PAGE_URL.get(this.domain))
    }

    private close() {
        if (this.getContent() == this.state.initialModel.content) {
            this.doClose()
            return
        }
        this.confirmDialog.current.show(
            "Confirm close",
            `The model has changed. Are you sure you want to close without saving?`,
            () => {
                this.doClose()
            }
        )
    }

    private download() {
        saveToFile(this.getContent(), `${this.state.initialModel.name}.${DomainExtensions.get(this.domain)}`)
    }

    private getContent() {
        return this.editor.current.getContent()
    }

    private async saveModel() {
        const newContent = this.getContent()
        ModelsController.saveModel(this.modelId, newContent)
        .then(() => {
            this.notification.current.showSuccess("Save", "Model was saved successfully.")
            this.state.initialModel.content = newContent
        })
        .catch((reason: string) => this.notification.current.showError("Save", `An error occurred: ${reason}`))
    }

    private showArtifacts(artifacts: TArtifact[]) {
        this.artifactList.current.show(artifacts, (a: TArtifact) => this.openArtifact(a))
    }

    private openArtifact(a: TArtifact) {
        openInNewWindow(getArtifactURL(a))
    }

    static getInitialProps({ query } : {query: any}) {
        return { query }
    }

    render() {
        if(this.state.loading){
            return(
                <Container fluid>
                    <Spinner animation="border" variant="primary" />Getting model... please wait.
                </Container> 
            )
        }
        return (
            <Container fluid>
                <h1 className="capitalize">{DomainNames.get(this.domain)} Editor</h1>
                <CSREditor localMode={this.props.localMode} language={languageIDs.get(this.domain)} initialContent={this.state.initialModel.content} ref={this.editor}></CSREditor>
                <IconButton icon={saveIcon} label="Save" onClick={()=>{this.saveModel()}}></IconButton>{' '}
                <IconButton icon={downloadIcon} label="Download" onClick={()=>{this.download()}}></IconButton>{' '}
                <IconButton icon={closeIcon} label="Close" onClick={()=>{this.close()}}></IconButton>
                <Notification ref={this.notification}/>
                <Confirm ref={this.confirmDialog}></Confirm>
                <SelectionModal ref={this.selectionDialog}></SelectionModal>
                <ArtifactList ref={this.artifactList}></ArtifactList>
            </Container>
        )
    }

}

export default Editor
