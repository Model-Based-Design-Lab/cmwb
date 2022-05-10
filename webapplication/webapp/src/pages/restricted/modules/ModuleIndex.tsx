import React from "react"
import { Container } from "react-bootstrap"
import { AnalysisConsole } from "../../../components/Console/AnalysisConsole"
import ModelManager from "../../../components/Models/ModelManager"
import { IExternalCompModModel } from "../../../database/modelsdbinterface"
import { ProgressNote } from "../../../components/Progress/Progress"
import { DOWNLOADARTIFACT_PATH, IMAGEARTIFACT_PATH, OperationTimeout } from "../../../config/config"
import { Operation } from "../../../domains/operations"
import { openInNewWindow } from "../../../utils/routing"
import { allEmpty, isIdentifier, isMPInputSequence, isMPNumeric, isMPVector, removeWhiteSpace } from "../../../utils/utils"
import { OptionEditTextModal } from "../../../components/Modal/OperationArguments/OptionEditTextModal"
import { OptionMultiEditTextModal } from "../../../components/Modal/OperationArguments/OptionMultiEditTextModal"
import { OptionEditBooleanModal } from "../../../components/Modal/OperationArguments/OptionEditBooleanModal"
import { OptionSelectionModal } from "../../../components/Modal/OperationArguments/OptionSelectionModal"
import { OptionMultipleSelectionModal } from "../../../components/Modal/OperationArguments/OptionMultipleSelectionModal"
import { OptionStoppingConditionModal } from "../../../components/Modal/OperationArguments/OptionStoppingConditionModal"
import { OptionListOfItemsModal } from "../../../components/Modal/OperationArguments/OptionListOfItemsModal"
import { IStoppingConditions } from "../../../components/Controls/StoppingCondition"

interface Props {
    user: any
    module: string
    operations: any
    onSelect?: (model: IExternalCompModModel)=>void
}

interface State {
}

export class ModuleIndex extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { }
        this.modelManager = React.createRef()
        this.modalEditText = React.createRef()
        this.modalEditBoolean = React.createRef()
        this.modalMultiEditText = React.createRef()
        this.modalSelection = React.createRef()
        this.modalMultipleSelection = React.createRef()
        this.modalStoppingCondition = React.createRef()
        this.modalSelectListOfItems = React.createRef()
        this.analysisConsole = React.createRef()
        this.progressNote = React.createRef()
    }

    private modelManager: React.RefObject<ModelManager>
    private modalEditText: React.RefObject<OptionEditTextModal>
    private modalEditBoolean: React.RefObject<OptionEditBooleanModal>
    private modalMultiEditText: React.RefObject<OptionMultiEditTextModal>
    private modalSelection: React.RefObject<OptionSelectionModal>
    private modalMultipleSelection: React.RefObject<OptionMultipleSelectionModal>
    private modalStoppingCondition: React.RefObject<OptionStoppingConditionModal>
    private modalSelectListOfItems: React.RefObject<OptionListOfItemsModal>
    private analysisConsole: React.RefObject<AnalysisConsole>
    private progressNote: React.RefObject<ProgressNote>

    public async getText(question: string, placeholder: string, showAdvanced: boolean, validate = (t: string) => true) {
        return new Promise<[boolean,string]>((resolve, reject) => {
            this.modalEditText.current.show("Question", question, placeholder, "", showAdvanced, validate,([advanced, result]: [boolean, string]) => resolve([advanced, result]), ()=>reject())
        })
    }

    public async getNumber(question: string, placeholder: string, showAdvanced: boolean, validate: (s: string)=>boolean): Promise<[boolean, string]> {
        return new Promise((resolve, reject) => {
            this.modalEditText.current.show("Enter a number", question, placeholder, "", showAdvanced, validate, result => resolve(result), ()=>reject())
        })
    }

    public async getBoolean(question: string, defaultValue: boolean, showAdvanced: boolean) {
        return new Promise<[boolean,boolean]>((resolve, reject) => {
            this.modalEditBoolean.current.show("Yes/No", question, defaultValue, showAdvanced,  result => resolve(result), ()=>reject())
        })
    }

    public async getMPNumber(question: string, placeholder: string, showAdvanced: boolean) {
        return new Promise<[boolean,string]>((resolve, reject) => {
            this.modalEditText.current.show("Enter a number or '-inf'", question, placeholder, "", showAdvanced, (n: string) => isMPNumeric(n), result => resolve(result), ()=>reject())
        })
    }

    public async getMPVector(question: string, placeholder: string, showAdvanced: boolean, mandatory: boolean=false) {
        var validate = (v: string) => (v=="") || isMPVector(v)
        if (mandatory) {
            validate = (v: string) => isMPVector(v)
        }
        return new Promise<[boolean,string]>((resolve, reject) => {
            this.modalEditText.current.show("Enter a max-plus vector", question, placeholder, "", showAdvanced, validate, ([advanced, result]) => resolve([advanced, result.replace(/\s/g, "")]), ()=>reject())
        })
    }

    public async getUserName(): Promise<string> {
        return this.props.user.name
    }

    public refreshModels() {
        this.modelManager.current.refreshModels()
    }

    public async getUserId() {
        return this.props.user.id
    }

    public async getSelectedModelId() {
        return this.modelManager.current.getSelectedModel()
    }

    public async getSelectedModelName() {
        return this.modelManager.current.getSelectedModelName()
    }
    
    public async getChooseModelId(question: string, domain: string, showAdvanced: boolean): Promise<[boolean,string]> {
        return new Promise((resolve, reject) => {
            const items: [string,string][] = this.modelManager.current.allModelsOfDomain(domain).map(m=>[m.id, m.name])
            this.modalSelection.current.showValues("Select Model", question, items, showAdvanced, result => resolve(result), ()=>reject())
        })
    }

    public async getChooseState(question: string, showAdvanced: boolean): Promise<[boolean, string]> {
        const states: string[] = await this.modelManager.current.getSelectedModelStates()
        return new Promise((resolve, reject) => {
            this.modalSelection.current.show("Select State", question, states, showAdvanced, result => resolve(result), ()=>reject())
        })
    }

    public async getChooseRecurrentState(question: string, showAdvanced: boolean, optional: boolean = true): Promise<[boolean,string]> {
        const noChoice = "No preference"
        const states: string[] = await this.modelManager.current.getSelectedModelRecurrentStates()
        return new Promise((resolve, reject) => {
            states.unshift(noChoice)
            this.modalSelection.current.show("Select State", question, states, showAdvanced, result => resolve(result[1]==noChoice?[result[0],""]:result), ()=>reject(), true)
        })
    }

    public async getChooseStateSet(question: string, showAdvanced: boolean, isOptional: boolean = false): Promise<[boolean, string[]]> {
        const states: string[] = await this.modelManager.current.getSelectedModelStates()
        return new Promise((resolve, reject) => {
            this.modalMultipleSelection.current.show("Select States", question, states, showAdvanced, result => resolve(result), ()=>reject(), [], isOptional)
        })
    }
    
    public async getChooseStoppingConditions(question: string, initialValues: string[], showAdvanced: boolean, validate: (sc: IStoppingConditions)=>boolean, hiddenOptions?: string[], isTransientAnalysis: boolean = false) {
        return new Promise<[boolean,string[]]>((resolve, reject) => {
            this.modalStoppingCondition.current.show("Select stopping criteria", question, initialValues, hiddenOptions, showAdvanced, validate, result => resolve(result), ()=>reject(), isTransientAnalysis)
        })
    }

    public async getListOfEventSequenceNames(question: string, showAdvanced: boolean) {
        const eventSequences: string[] = await this.modelManager.current.getSelectedModelEventSequences()
        if (eventSequences.length == 0) {
            throw new Error("The model has no event sequences.")
        }
        return new Promise<[boolean,string[]]>((resolve, reject) => {
            this.modalSelectListOfItems.current.show("Select list of event sequences", question, eventSequences, showAdvanced, l=>true, result => resolve(result), ()=>reject())
        })
    }

    public async getListOfEventAndVectorSequences(question: string, showAdvanced: boolean) {
        const eventSequences: string[] = await this.modelManager.current.getSelectedModelEventSequences()
        const vectorSequences: string[] = await this.modelManager.current.getSelectedModelVectorSequences()
        if (eventSequences.length + vectorSequences.length == 0) {
            throw new Error("The model has no event or vector sequences.")
        }
        return new Promise<[boolean,string[]]>((resolve, reject) => {
            this.modalSelectListOfItems.current.show("Select list of event and vector sequences", question, eventSequences.concat(vectorSequences), showAdvanced, l=>true, result => resolve(result), ()=>reject())
        })
    }

    public async getListOfMatricesAndVectorSequences(question: string, showAdvanced: boolean): Promise<[boolean,{matrices:string[],vectorSequences:string[]}]> {
        const matrices: string[] = await this.modelManager.current.getSelectedModelMatrices()
        const vectorSequences: string[] = await this.modelManager.current.getSelectedModelVectorSequences()
        if (matrices.length == 0) {
            throw new Error("The model has no matrices.")
        }
        return new Promise((resolve, reject) => {
            this.modalSelectListOfItems.current.show("Select list of matrices and vector sequences", question, matrices.concat(vectorSequences), showAdvanced, l=>true, ([advanced,result]:[boolean,string[]]) => {
                // result is a list of strings
                var matricesAndVectorSequences: {matrices: string[], vectorSequences: string[]}
                matricesAndVectorSequences = {
                    matrices: result.filter(n => matrices.includes(n)), 
                    vectorSequences: result.filter(n => vectorSequences.includes(n))
                }
                resolve([advanced,matricesAndVectorSequences])
            }, ()=>reject())
        })
    }

    public async getEventSequenceName(question: string, showAdvanced: boolean) {
        const eventSequences: string[] = await this.modelManager.current.getSelectedModelEventSequences()
        if (eventSequences.length == 0) {
            throw new Error("The model has no event sequences.")
        }
        return new Promise<[boolean,string]>((resolve, reject) => {
            this.modalSelection.current.show("Select Event Sequence", question, eventSequences, showAdvanced, result => resolve(result), ()=>reject())
        })
    }

    public async getMatrixName(question: string, showAdvanced: boolean): Promise<[boolean, string]> 
    // ask for a matrix name if the model defines more than one matrix. Otherwise immediately 
    // return the one matrix, or an error if the model contains no matrices.
    {
        const matrices: string[] = await this.modelManager.current.getSelectedModelMatrices()
        if (matrices.length == 0) {
            throw new Error("The model has no matrices.")
        }
        if (matrices.length == 1) {
            return [false, matrices[0]]
        }
        return new Promise<[boolean,string]>((resolve, reject) => {
            this.modalSelection.current.show("Select Matrix", question, matrices, showAdvanced, result => resolve(result), ()=>reject())
        })
    }

    public async getInputSequences(question: string, placeholder: string, showAdvanced: boolean, mandatory: boolean = false): Promise<[boolean,string]> {
        const inputLabels: string[] = await this.modelManager.current.getSelectedModelInputLabels()
        if (inputLabels.length == 0) {
            return [showAdvanced,""]
        }

        const validateSingle = (s: string) => isMPInputSequence(s) || isIdentifier(s)

        const validateAll= (values: string[]) => {
            return values.reduce((valid, s) => (valid && validateSingle(s)), true)
            }

        const validate = (values: string[]) => validateAll(values) || ( (!mandatory) && allEmpty(values))


        const okCallbackInputSequences = (resolve: any) => (
            (results: [boolean,string[]]) => {
                const [advanced, result] = results
                var res = []
                for (var n=0; n<inputLabels.length; n++) {
                    const trace = removeWhiteSpace(result[n])
                    if (trace.length > 0) {
                        res.push(`${inputLabels[n]}=${trace}`)
                    }
                }
                resolve([advanced, res.join(',')])
            }
        )

        return new Promise<[boolean,string]>((resolve, reject) => {
            this.modalMultiEditText.current.show("Enter input sequences", question, inputLabels, Array(inputLabels.length).fill(placeholder), Array(inputLabels.length).fill(""), validate, showAdvanced, okCallbackInputSequences(resolve), ()=>reject())
        })
    }

    public async getInitialStateSDF(question: string, placeholder: string, showAdvanced: boolean, mandatory: boolean = false): Promise<[boolean,string]> {
        const stateLabels: string[] = await this.modelManager.current.getSelectedModelStateLabels()
        if (stateLabels.length == 0) {
            return [false, ""]
        }
        const validateSingle = (s: string) => isMPNumeric(s)

        const validateAll= (values: string[]) => {
            return values.reduce((valid, s) => (valid && validateSingle(s)), true)
            }

        const validate = (values: string[]) => validateAll(values) || ( (!mandatory) && allEmpty(values))

        return new Promise((resolve, reject) => {
            this.modalMultiEditText.current.show("Enter time stamp values.", question, stateLabels, Array(stateLabels.length).fill(placeholder), Array(stateLabels.length).fill(""), validate, showAdvanced, results => {
                const [advanced, result] = results
                var res = []
                for (var n=0; n<stateLabels.length; n++) {
                    res.push(`${result[n]==""?"0":result[n]}`)
                }
                resolve([advanced, `[${res.join(',')}]`])
            }, ()=>reject())
        })
    }

    public getModelName(modelId: string) {
        return this.modelManager.current.getModelName(modelId)
    }

    public processAnalysisResult(result: string) {
        if (! (result === undefined)) {
            this.analysisConsole.current.append(result)
        }
    }

    public processAnalysisResultImage(name: string, artifact: string) {
        openInNewWindow(IMAGEARTIFACT_PATH, {artifactName: name, artifactPath: artifact})
    }

    public processDownloadArtifact(name: string, artifact: string, mimeType: string, fileName: string) {
        openInNewWindow(DOWNLOADARTIFACT_PATH, {artifactName: name, artifactPath: artifact, mimeType, fileName})
    }

    public setAnimationStateSequence(states: string[]){
        this.modelManager.current.setAnimationStateSequence(states)
    }

    public setAnimationSetOfStates(states: string[]){
        this.modelManager.current.setAnimationSetOfStates(states)
    }

    public setAnimationPartitioning(partitioning: string[][]){
        this.modelManager.current.setAnimationPartitioning(partitioning)
    }


    private startOperationTimeout(onCancel: ()=>void, onTimeout: ()=>void) {
        this.progressNote.current.show(onCancel, onTimeout)
    }

    private abortOperationTimeout() {
        this.progressNote.current.stop()
    }

    public async executeOperation(op: Operation) {
        this.startOperationTimeout(()=>op.cancel(), ()=>op.timeout())
        try {
            await op.execute()            
        } catch (error) {
            this.processAnalysisResult(error)
        }
        this.abortOperationTimeout()    
    }

    render() {
        return (
            <Container fluid>
                <ModelManager module={this.props.module} user={this.props.user} ref={this.modelManager} onSelect={this.props.onSelect}/>
                <ProgressNote ref={this.progressNote} message="Operation in progress." timeout={OperationTimeout}></ProgressNote>
                <AnalysisConsole ref={this.analysisConsole}></AnalysisConsole>               
                {this.props.operations}
                <OptionEditTextModal ref={this.modalEditText}></OptionEditTextModal>
                <OptionEditBooleanModal ref={this.modalEditBoolean}></OptionEditBooleanModal>
                <OptionMultiEditTextModal ref={this.modalMultiEditText}></OptionMultiEditTextModal>
                <OptionSelectionModal ref={this.modalSelection}></OptionSelectionModal>
                <OptionMultipleSelectionModal ref={this.modalMultipleSelection}></OptionMultipleSelectionModal>
                <OptionStoppingConditionModal ref={this.modalStoppingCondition}></OptionStoppingConditionModal>
                <OptionListOfItemsModal ref={this.modalSelectListOfItems}></OptionListOfItemsModal>                
            </Container>
        )
    }
}

 export default ModuleIndex


