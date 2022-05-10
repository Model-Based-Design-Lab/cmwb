import React from "react"
import { Tab, Tabs } from "react-bootstrap"
import { Operation } from "../../../../components/Operation/Operation"
import { DomFSA, DomLTL, DomRegEx, ModuleFSA } from "../../../../config/model"
import { IExternalCompModModel } from "../../../../database/modelsdbinterface"
import { makeOperation, GeneralOperations, OperationsOnAutomata, OperationsOnAutomataOnFiniteWords, OperationsOnBuechiAutomata, OperationsOnLTLFormulas, OperationsOnRegularExpressions, ConversionOperationsOnAutomata, OpFSADescriptions, OpFSA } from "../../../../domains/fsa/operations"
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

    public async getUserName() {
        return this.props.user.name
    }

    public async getUserId() {
        return this.props.user.id
    }

    private selectModel(model: IExternalCompModModel){
        this.setState({ selectedModelDomain: model.domain })
    }

    private selectOperation(op: OpFSA) {
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
            <ModuleIndex ref={this.moduleIndex} user={this.props.user} module={ModuleFSA} onSelect={m=>this.selectModel(m)} operations={
                <div style={{margin: "20px"}}>
                    <Tabs style={{width: "100%"}} defaultActiveKey="general" id="uncontrolled-tab-example" variant="pills">
                        {
                            (! this.state.operationActive) && 
                            <Tab eventKey="general" title="General Operations">
                                <div style={{height: "220px"}}>
                                    <h3>Create a Model</h3>
                                    <Operation operations={GeneralOperations} descriptions={OpFSADescriptions} callback={(op: OpFSA)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomFSA) &&
                            <Tab eventKey="automata" title="Operations on all Automata">
                                <div style={{height: "220px"}}>
                                    <h3>Operations</h3>
                                    <Operation operations={OperationsOnAutomata} descriptions={OpFSADescriptions} callback={(op: OpFSA)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomFSA) &&
                            <Tab eventKey="fsa" title="Operations on Automata on Finite Words">
                                <div style={{height: "220px"}}>
                                    <h3>Operations</h3>
                                    <Operation operations={OperationsOnAutomataOnFiniteWords} descriptions={OpFSADescriptions} callback={(op: OpFSA)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomFSA) &&
                            <Tab eventKey="buechi" title="Operations on B&uuml;chi Automata">
                                <div style={{height: "220px"}}>
                                    <h3>Operations</h3>
                                    <Operation operations={OperationsOnBuechiAutomata} descriptions={OpFSADescriptions} callback={(op: OpFSA)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomFSA) &&
                            <Tab eventKey="fsaconv" title="Conversion Operations on Automata">
                                <div style={{height: "220px"}}>
                                    <h3>Conversion</h3>
                                    <Operation operations={ConversionOperationsOnAutomata} descriptions={OpFSADescriptions} callback={(op: OpFSA)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomRegEx) &&
                            <Tab eventKey="regex" title="Operations on Regular Expressions">
                                <div style={{height: "220px"}}>
                                    <h3>Operations</h3>
                                    <Operation operations={OperationsOnRegularExpressions} descriptions={OpFSADescriptions} callback={(op: OpFSA)=>this.selectOperation(op)}/>
                                </div>
                            </Tab>
                        }
                        {
                            (! this.state.operationActive) && (this.state.selectedModelDomain == DomLTL) &&
                            <Tab eventKey="ltl" title="Operations on LTL Formulas">
                                <div style={{height: "220px"}}>
                                    <h3>Operations</h3>
                                    <Operation operations={OperationsOnLTLFormulas} descriptions={OpFSADescriptions} callback={(op: OpFSA)=>this.selectOperation(op)}/>
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


