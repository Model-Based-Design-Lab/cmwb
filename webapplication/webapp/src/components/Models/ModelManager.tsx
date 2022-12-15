import * as React from 'react'
import Container from 'react-bootstrap/Container'
import { ListsOfModels } from '../../components/Models/ListsOfModels'
import { Spinner } from 'react-bootstrap'
import { Confirm } from '../../components/Modal/Confirm'
import IconButton, { deleteIcon, openIcon, publishIcon, scratchIcon, unscratchIcon, renameIcon, unpublishIcon, handIcon } from '../../components/Buttons/IconButton'
import Notification from '../../components/Notification/Notification'
import WelcomeMessage from '../../components/Welcome/Welcome'
import { BASE_PATH_RESTRICTED, EDITOR_PATH, GeneralGroup, ValidModelNameRegEx } from '../../config/config'
import { Preview } from '../Preview/Preview'
import { historyPush } from '../../utils/routing'
import { ModelsController } from '../../controller/modelscontroller'
import { IExternalCompModModel } from '../../database/modelsdbinterface'
import { DomDTMC, DomMPM, DomSDF } from '../../config/model'
import { DTMCAnalysisController } from '../../controller/dtmcanalysiscontroller'
import { MPMAnalysisController } from '../../controller/mpmanalysiscontroller'
import { SDFAnalysisController } from '../../controller/sdfanalysiscontroller'
import { isGuest } from '../../authentication/utils'
import { EditTextModal } from '../Modal/EditTextModal'
import { UserController } from '../../controller/usercontroller'
import { SelectionModal } from '../Modal/SelectionModal'

// export const  MODELS_PAGE_URL = `${BASE_URL}${BASE_PATH_RESTRICTED}/models`
export const  MODELS_PAGE_URL = `${BASE_PATH_RESTRICTED}/models`

interface Props {
    user: any
    module: string
    onSelect?: (model: IExternalCompModModel)=>void
}

interface State {
    models: any[],
    accessibleGroups: string[],
    loading: boolean
    selectedModel: string
    user: any
}

class ModelManager extends React.Component<Props, State> {

    private modelMap: Map<string, any>
    private confirmDialog: React.RefObject<Confirm>
    private modelNameEditTextDialog: React.RefObject<EditTextModal>
    private emailEditTextDialog: React.RefObject<EditTextModal>
    private modelSelectGroupDialog: React.RefObject<SelectionModal>
    private notification: React.RefObject<Notification>
    private preview: React.RefObject<Preview>
    private isGuest: boolean
    private user: string

    constructor(props: any) {
        super(props)
        this.state = { models: [], accessibleGroups:[], loading: true, selectedModel: "none", user: props.user }
        this.confirmDialog = React.createRef()
        this.modelNameEditTextDialog = React.createRef()
        this.emailEditTextDialog = React.createRef()
        this.modelSelectGroupDialog = React.createRef()
        this.notification = React.createRef()
        this.preview = React.createRef()
        this.isGuest = props.user.isGuest
        this.user = props.user.id
        this.getModels()
            .then(models => this.setModels(models))
        this.getAccessibleGroups()
            .then(groups => this.setState({accessibleGroups: groups}))
    }

    public getSelectedModel() {
        return this.state.selectedModel
    }

    public getSelectedModelName() {
        const model: IExternalCompModModel = this.modelMap.get(this.state.selectedModel)
        return model.name
    }

    public async getSelectedModelStates(): Promise<string[]> {
        const model: IExternalCompModModel = this.modelMap.get(this.state.selectedModel)
        // for now only needed for DTMC
        if (model.domain != DomDTMC) return []
        const stateList = await DTMCAnalysisController.getStates(model.id)
        return stateList.split(',').map(s=>s.trim())
    }

    public async getSelectedModelRecurrentStates(): Promise<string[]> {
        const model: IExternalCompModModel = this.modelMap.get(this.state.selectedModel)
        // only for DTMC!
        if (model.domain != DomDTMC) return []
        const stateList = await DTMCAnalysisController.getRecurrentStates(model.id)
        return stateList.split(',').map(s=>s.trim())
    }
    
    public async getSelectedModelEventSequences(): Promise<string[]> {
        const model: IExternalCompModModel = this.modelMap.get(this.state.selectedModel)
        // only for MPM!
        if (model.domain != DomMPM) return []
        const eventSequenceList = await MPMAnalysisController.getEventSequences(model.id)
        return eventSequenceList.split(',').map(s=>s.trim()).filter(s=>s.length>0)
    }

    public async getSelectedModelMatrices(): Promise<string[]> {
        const model: IExternalCompModModel = this.modelMap.get(this.state.selectedModel)
        // only for MPM!
        if (model.domain != DomMPM) return []
        const matrixList = await MPMAnalysisController.getMatrices(model.id)
        return matrixList.split(',').map(s=>s.trim()).filter(s=>s.length>0)
    }

    public async getSelectedModelInputLabels(): Promise<string[]> {
        const model: IExternalCompModModel = this.modelMap.get(this.state.selectedModel)
        // only for MPM or SDF!
        var inputLabels: string
        switch (model.domain) {
            case DomMPM:
                inputLabels = await MPMAnalysisController.getInputLabels(model.id)
                return inputLabels.split(',').map((s: string)=>s.trim()).filter((s: string)=>s.length>0)
                break;

            case DomSDF:
                inputLabels = await SDFAnalysisController.getInputLabels(model.id)
                return inputLabels.split(',').map((s: string)=>s.trim()).filter((s: string)=>s.length>0)
                break;
            
            default:
                return []
                break;
        }
    }

    public async getSelectedModelStateLabels(): Promise<string[]> {
        const model: IExternalCompModModel = this.modelMap.get(this.state.selectedModel)
        // only for SDF!
        switch (model.domain) {
            case DomSDF:
                const stateLabels = await SDFAnalysisController.getStateLabels(model.id)
                return stateLabels.split(',').map((s: string)=>s.trim()).filter((s: string)=>s.length>0)
                break;
            
            default:
                return []
                break;
        }
    }

    public async getSelectedModelVectorSequences(): Promise<string[]> {
        const model: IExternalCompModModel = this.modelMap.get(this.state.selectedModel)
        // only for MPM!
        if (model.domain != DomMPM) return []
        const vectorSequenceList = await MPMAnalysisController.getVectorSequences(model.id)
        return vectorSequenceList.split(',').map(s=>s.trim()).filter(s=>s.length>0)
    }


    public allModelsOfDomain(domain: string) {
        return this.state.models.filter(m=>m.domain == domain)
    }

    public getModelName(modelId: string) {
        return this.modelMap.get(modelId).name
    }


    private selectModel(modelId: string) {
        if (this.state.selectedModel != modelId) {
            this.preview.current.setModel(modelId)
            this.setState({ selectedModel: modelId }, ()=>{
                if (this.props.onSelect){
                    this.props.onSelect(this.modelMap.get(modelId))
                }    
            })
        }
    }

    private isModelSelected(): boolean {
        return this.state.selectedModel != "none"
    }

    private modelsToMap(models: any[]) {
        this.modelMap = models.reduce(function (map: { [x: string]: any }, model: { id: string }) {
            map.set(model.id, model)
            return map
        }, new Map<string, any>())
    }

    private async getModels(): Promise<any[]> {
        try {
            if (this.isGuest) {
                return await ModelsController.getModulePublicModels(this.props.module)
            }
            return await ModelsController.getModuleModelsForUser(this.user, this.props.module)
        } catch (error) {
            return []
        }
    }

    private async getAccessibleGroups(): Promise<string[]> {
        try {
            if (this.isGuest) {
                return [GeneralGroup]
            }
            return await UserController.getUserGroups()
        } catch (error) {
            return []
        }
    }

    private async setModels(newModels: any[]): Promise<void> {
        this.modelsToMap(newModels)
        return new Promise((resolve, _reject) => {
            this.setState({ models: newModels, loading: false }, ()=>resolve())
        })
    }

    public async refreshModels() {
        const currentModel = this.state.selectedModel
        this.setState({ loading: true, selectedModel: "none" })
        const newModels: any[] = await this.getModels()
        this.setModels(newModels)
        .then(()=> {
            if (this.modelMap.has(currentModel)) {
                this.selectModel(currentModel)
            }
        })
    }

    private openModel() {
        if (this.isModelSelected()) {
            this.doOpenModel(this.state.selectedModel)
        }
    }

    private doOpenModel(modelId: string) {
        historyPush(EDITOR_PATH,{ modelId: modelId, domain: this.domainOfModel(modelId)})
    }

    private domainOfModel(modelId: string) {
        const model = this.state.models.find(m => m.id == modelId)
        return model?.domain
    }

    private deleteModel() {
        if (this.isModelSelected()) {
            this.confirmDialog.current.show(
                "Confirm deletion",
                `Delete model ${this.modelMap.get(this.state.selectedModel).name}. Are you sure?`,
                () => {
                    ModelsController.deleteModel(this.state.selectedModel)
                    .then(() => this.refreshModels())                        
                    .catch (error => this.notification.current.showError("Delete", error.toString()))
                }
            )
        }
    }

    private deleteAllScratchModels() {
        this.confirmDialog.current.show(
            "Confirm deletion",
            `Delete all scratch models. Are you sure?`,
            () => {
                ModelsController.deleteScratchModuleModels(this.props.module)
                .then(() => this.refreshModels())                        
                .catch (error => this.notification.current.showError("Delete", error.toString()))
            }
        )
    }

    private publishModel() {
        if (this.isModelSelected()) {
            ModelsController.publishModel(this.state.selectedModel)
            .then(() => this.refreshModels())
            .catch (error => this.notification.current.showError("Publish", error.toString()))
        }
    }

    private unpublishModel() {
        if (this.isModelSelected()) {
            ModelsController.unpublishModel(this.state.selectedModel)
            .then(() => this.refreshModels())
            .catch (error => this.notification.current.showError("Unpublish", error.toString()))
        }
    }

    private scratchModel() {
        if (this.isModelSelected()) {
            ModelsController.scratchModel(this.state.selectedModel)
            .then(() => this.refreshModels())
            .catch (error => this.notification.current.showError("Scratch", error.toString()))
        }
    }

    private unscratchModel() {
        if (this.isModelSelected()) {
            ModelsController.unscratchModel(this.state.selectedModel)
            .then(() => this.refreshModels())
            .catch (error => this.notification.current.showError("Unscratch", error.toString()))
        }
    }

    private renameModel() {
        if (this.isModelSelected()) {
            this.modelNameEditTextDialog.current.show(
                "Rename Model",
                `Please provide a name for model ${this.modelMap.get(this.state.selectedModel).name}`, 
                "ModelName",
                this.modelMap.get(this.state.selectedModel).name,
                (n: string) => ValidModelNameRegEx.test(n),
                (name) => {
                    ModelsController.renameModel(this.state.selectedModel, name)
                    .then(() => this.refreshModels())
                    .catch (error => this.notification.current.showError("Rename", error.toString()))
                },
                ()=>{}
            )
        }
    }

    // TODO: enable/disable buttons based on model selection
    private changeGroupOfModel() {
        if (this.isModelSelected()) {
            this.modelSelectGroupDialog.current.show(
                "Group",
                "Select Group of Model",
                this.state.accessibleGroups,
                (g: string) => {
                    ModelsController.setGroupOfModel(this.state.selectedModel, g)
                    .then(() => this.refreshModels())
                    .catch (error => this.notification.current.showError("Set Group", error.toString()))
                },
                ()=>true,
                false
            )
        }
    }

    private handoverModel() {
        if (this.isModelSelected()) {
            this.emailEditTextDialog.current.show(
                "Handover Model",
                `Please provide an email address of a user to hand over model ${this.modelMap.get(this.state.selectedModel).name} to`,
                "Email address",
                "",
                (ea:string)=>ea!='',
                (userEmail) => {
                    ModelsController.handoverModel(this.state.selectedModel, userEmail)
                    .then((message: string) => {
                        this.refreshModels()
                        .then(() => {
                            this.notification.current.showSuccess("Completed", message)
                        })
                    })
                    .catch (error => this.notification.current.showError("Rename", error.toString()))
                },
                ()=>{}
            )
        }
    }


    public setAnimationStateSequence(states: string[]){
        this.preview.current.setAnimationStateSequence(states)
    }

    public setAnimationSetOfStates(states: string[]){
        this.preview.current.setAnimationSetOfStates(states)
    }

    public setAnimationSetOfActors(states: string[]){
        this.preview.current.setAnimationSetOfActors(states)
    }

    public setAnimationPartitioning(partitioning: string[][]){
        this.preview.current.setAnimationPartitioning(partitioning)
    }


    public render() {
        if (this.state.loading) {
            return (
                <Container fluid>
                    <Spinner animation="border" variant="primary" />Getting models... please wait.
                </Container>)
        }
        const guest = isGuest(this.props)
        return (
            <Container fluid>
                <WelcomeMessage user={this.state.user}/>
                <ListsOfModels 
                    models={this.state.models} 
                    accessibleGroups={this.state.accessibleGroups}
                    module={this.props.module} 
                    selected={this.state.selectedModel} 
                    onSelect={modelId => this.selectModel(modelId)} 
                    onDoubleClick={_modelId => this.openModel()} 
                    user={this.props.user} />
                <Preview ref={this.preview}></Preview>
                <IconButton icon={openIcon} label="Open" onClick={() => this.openModel()}></IconButton>{' '}
                <IconButton icon={deleteIcon} label="Delete" onClick={() => this.deleteModel()}></IconButton>{' '}
                {!guest && <IconButton icon={publishIcon} label="Publish" onClick={() => this.publishModel()}></IconButton>}{' '}
                {!guest && <IconButton icon={unpublishIcon} label="Unpublish" onClick={() => this.unpublishModel()}></IconButton>}{' '}
                {!guest && <IconButton icon={scratchIcon} label="Scratch" onClick={() => this.scratchModel()}></IconButton>}{' '}
                {!guest && <IconButton icon={unscratchIcon} label="Unscratch" onClick={() => this.unscratchModel()}></IconButton>}{' '}
                <IconButton icon={renameIcon} label="Rename" onClick={() => this.renameModel()}></IconButton>{' '}
                <IconButton icon={renameIcon} label="Change Group" onClick={() => this.changeGroupOfModel()}></IconButton>{' '}
                <IconButton icon={handIcon} label="Hand Over" onClick={() => this.handoverModel()}></IconButton>{' '}
                <IconButton icon={deleteIcon} label="Delete All Scratch Models" onClick={() => this.deleteAllScratchModels()}></IconButton>{' '}
                <Confirm ref={this.confirmDialog}></Confirm>
                <EditTextModal placeholder="Model Name" ref={this.modelNameEditTextDialog}></EditTextModal>
                <EditTextModal placeholder="Email Address" ref={this.emailEditTextDialog}></EditTextModal>
                <SelectionModal ref={this.modelSelectGroupDialog}></SelectionModal>
                <Notification ref={this.notification}/>
            </Container>
        )
    }

}


export default ModelManager
