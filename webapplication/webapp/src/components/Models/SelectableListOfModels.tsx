import React from "react"
import { Container, Table } from "react-bootstrap"
import { ModelTypeNames } from "../../config/model"
import { IExternalCompModModel } from "../../database/modelsdbinterface"
import { dateAndTimeString } from "../../utils/utils"

// properties for the component
interface Props {
    // collection of models
    models: IExternalCompModModel[],
    // selected group
    groups?: string[],
    // optional selected model id
    selected?: string,
    // optional callback function on change of selection
    onSelect?: (modelId: string)=>void
    // optional callback function on double click
    onDoubleClick?: (modelId: string)=>void
}

interface State {
    models: any[],
    selected?: string
}

export class SelectableListOfModels extends React.Component<Props,State> {

    constructor(props: any) {
        super(props)
        this.state = {models: props.models, selected: props.selected}

        this.clickModel = this.clickModel.bind(this)
        this.selectCallback = props.onSelect
        this.doubleClickCallback = props.onDoubleClick
    }

    private selectCallback: (modelId: string)=>void
    private doubleClickCallback: (modelId: string)=>void

    public deselect(){
        this.setState({selected: undefined})
    }

    private clickModel(modelId: string) {
        this.setState({selected: modelId})
        if (this.selectCallback) this.selectCallback(modelId)
    }

    private doubleClickModel(modelId: string) {
        this.setState({selected: modelId})
        if (this.doubleClickCallback) this.doubleClickCallback(modelId)
    }

    private visibleModels() {
        if ( ! (this.props.groups === undefined)) {
            return this.state.models.filter((m: IExternalCompModModel)=>this.props.groups.includes(m.group))
        } else {
            return this.props.models
        } 
    }


    render() {
        return (
            <Container fluid>
                {/* <Table bordered hover size="sm"> */}
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Modified on</th>
                            <th>Owner</th>
                            <th>Group</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.models &&
                            this.visibleModels().map(model => (
                                <tr key={model.id} className={this.state.selected==model.id ? "selectedModel" : ""} onClick={()=> this.clickModel(model.id)} onDoubleClick={()=> this.doubleClickModel(model.id)}>
                                    <td>{model.name}</td>
                                    <td>{ModelTypeNames.get(model.domain)}</td>
                                    <td>{dateAndTimeString(model.modifiedAt)}</td>
                                    <td>{model.ownerName}</td>
                                    <td>{model.group}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Container>
        )
        }
  }

