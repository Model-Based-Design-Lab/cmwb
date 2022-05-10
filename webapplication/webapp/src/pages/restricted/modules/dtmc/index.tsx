import React from "react"
import { Tab, Tabs } from "react-bootstrap"
import { Operation } from "../../../../components/Operation/Operation"
import { DomDTMC, ModuleDTMC } from "../../../../config/model"
import { IExternalCompModModel } from "../../../../database/modelsdbinterface"
import { makeOperation, GeneralOperations, OperationsOnMarkovChains, SimulationOperationsOnMarkovChains, ConversionOperationsOnMarkovChains, OpDTMC, OpDTMCDescriptions } from "../../../../domains/dtmc/operations"
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

    private selectOperation(op: OpDTMC) {
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

    private selectModel(model: IExternalCompModModel){
        this.setState({ selectedModelDomain: model.domain })
    }


    render() {
        return (
            <ModuleIndex ref={this.moduleIndex} user={this.props.user} module={ModuleDTMC} onSelect={m=>this.selectModel(m)} operations={
                <div style={{margin: "20px"}}>
                    <Tabs style={{width: "100%"}} defaultActiveKey="general" id="uncontrolled-tab-example" variant="pills">
                        {
                            (! this.state.operationActive) && 
                            <Tab eventKey="general" title="General Operations">
                                <div style={{height: "220px"}}>
                                    <h3>Create a Model</h3>
                                    <Operation operations={GeneralOperations} descriptions={OpDTMCDescriptions} callback={(op: OpDTMC)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomDTMC) &&
                            <Tab eventKey="markovchains" title="Operations on Markov Chains">
                                <div style={{height: "220px"}}>
                                    <h3>Operations</h3>
                                    <Operation operations={OperationsOnMarkovChains} descriptions={OpDTMCDescriptions} callback={(op: any)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomDTMC) &&
                            <Tab eventKey="simulation" title="Simulation-based Operations on Markov Chains">
                                <div style={{height: "220px"}}>
                                    <h3>Operations</h3>
                                    <Operation operations={SimulationOperationsOnMarkovChains} descriptions={OpDTMCDescriptions} callback={(op: any)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomDTMC) &&
                            <Tab eventKey="conversion" title="Conversion Operations on Markov Chains">
                                <div style={{height: "220px"}}>
                                    <h3>Conversions</h3>
                                    <Operation operations={ConversionOperationsOnMarkovChains} descriptions={OpDTMCDescriptions} callback={(op: any)=>this.selectOperation(op)}/>
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





