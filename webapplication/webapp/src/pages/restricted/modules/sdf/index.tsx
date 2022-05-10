import React from "react"
import { Tab, Tabs } from "react-bootstrap"
import { Operation } from "../../../../components/Operation/Operation"
import { DomMPM, DomSDF, ModuleSDF } from "../../../../config/model"
import { IExternalCompModModel } from "../../../../database/modelsdbinterface"
import { ConversionOperationsOnDataFlowModels, GeneralOperations, makeOperation, OperationsOnDataFlowModels, OperationsOnMaxPlusMatrices, OpSDF, OpSDFDescriptions } from "../../../../domains/sdf/operations"
import ModuleIndex from "../ModuleIndex"

interface Props {
    user: any
}

interface State {
    selectedModelDomain: string,
    operationActive: boolean
}

export class Index extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { selectedModelDomain: "", operationActive: false }
        this.moduleIndex = React.createRef()
    }

    private moduleIndex: React.RefObject<ModuleIndex>

    private selectModel(model: IExternalCompModModel){
        this.setState({ selectedModelDomain: model.domain })
    }

    private selectOperation(op: OpSDF) {
        this.setState({operationActive: true})
        makeOperation(op, this.moduleIndex.current)
        .then(operation => {
            return this.moduleIndex.current.executeOperation(operation)
        })
        .catch(error => {
            this.moduleIndex.current.processAnalysisResult(error)
        })
        .finally(()=>{
            this.setState({operationActive: false})
        })
    }

    render() {
        return (
            <ModuleIndex ref={this.moduleIndex} user={this.props.user} module={ModuleSDF} onSelect={m=>this.selectModel(m)} operations={
                <div style={{margin: "20px"}}>
                    <Tabs style={{width: "100%"}} defaultActiveKey="general" id="uncontrolled-tab-example" variant="pills">
                        {
                            (! this.state.operationActive) &&
                            <Tab eventKey="general" title="General Operations">
                                <div style={{height: "220px"}}>
                                    <h3>Create a Model</h3>
                                    <Operation operations={GeneralOperations} descriptions={OpSDFDescriptions} callback={(op: OpSDF)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomSDF) &&
                            <Tab eventKey="dataflow" title="Operations on Data Flow Models">
                                <div style={{height: "220px"}}>
                                    <h3>Analysis</h3>
                                    <Operation operations={OperationsOnDataFlowModels} descriptions={OpSDFDescriptions} callback={(op: OpSDF)=>this.selectOperation(op)}/>
                                    <h3>Conversion</h3>
                                    <Operation operations={ConversionOperationsOnDataFlowModels} descriptions={OpSDFDescriptions} callback={(op: OpSDF)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomMPM) &&
                            <Tab eventKey="maxplus" title="Operations on Max-Plus Matrices">
                                <div style={{height: "220px"}}>
                                    <h3>Analysis</h3>
                                    <Operation operations={OperationsOnMaxPlusMatrices} descriptions={OpSDFDescriptions} callback={(op: OpSDF)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                    </Tabs>
                </div>
            }/>
        )
    }
}

 export default Index
