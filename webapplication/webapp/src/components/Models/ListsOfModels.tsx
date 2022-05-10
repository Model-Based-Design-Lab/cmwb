import React from "react"
import { Container } from "react-bootstrap"
import { isGuest } from "../../authentication/utils"
import { ModuleNames } from "../../config/model"
import { UserController } from "../../controller/usercontroller"
import { typePublic, typeScratch, typeUser } from "../../database/modelsdbinterface"
import { SimpleDropDown } from "../Controls/SimpleDropDown"
import { SelectableListOfModels } from "./SelectableListOfModels"

interface Props {
    user: any
    models: any[]
    module: string
    accessibleGroups: string[]
    selected?: string
    onSelect?: (modelId: string)=>void
    onDoubleClick?: (modelId: string)=>void
}

interface State {
    models: any[],
    selected?: string,
    selectedGroup: string,
    groups: string[]
}

export class ListsOfModels extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
                
        this.state = { models: props.models, selected: props.selected, selectedGroup: props.user.group, groups: props.accessibleGroups }
        this.selectCallback = props.onSelect
        this.doubleClickCallback = props.onDoubleClick
        this.publicListRef = React.createRef()
        this.userListRef = React.createRef()
        this.scratchListRef = React.createRef()

        this.getActiveGroup()
        .then(g=>{this.setState({selectedGroup: g})})

    }

    private publicListRef: React.RefObject<SelectableListOfModels>
    private userListRef: React.RefObject<SelectableListOfModels>
    private scratchListRef: React.RefObject<SelectableListOfModels>

    private selectCallback: (modelId: string)=>void
    doubleClickCallback: (modelId: string)=>void

    private doSelectCallback(modelId: string) {
        if (this.selectCallback) {
            this.selectCallback(modelId)
        }
    }

    private doDoubleClickCallback(modelId: string) {
        if (this.doubleClickCallback) {
            this.doubleClickCallback(modelId)
        }
    }

    private selectPublicModel(modelId: string) {
        this.setState({selected: modelId})
        // guest don't have user list
        if (this.userListRef.current) this.userListRef.current.deselect()
        this.scratchListRef.current.deselect()
        this.doSelectCallback(modelId)
    }

    private selectUserModel(modelId: string) {
        this.setState({selected: modelId})        
        this.publicListRef.current.deselect()
        this.scratchListRef.current.deselect()
        this.doSelectCallback(modelId)
    }

    private selectScratchModel(modelId: string) {
        this.setState({selected: modelId})        
        this.publicListRef.current.deselect()
        if (this.userListRef.current) this.userListRef.current.deselect()
        this.doSelectCallback(modelId)
    }

    private doubleClickModel(modelId: string) {
        this.doDoubleClickCallback(modelId)
    }

    private selectGroup(g: string) {
        this.setState({selectedGroup: g})
        UserController.setActiveGroup(g)
    }

    private async getActiveGroup() {
        return UserController.getActiveGroup()
    }


    render() {
        const guest = isGuest(this.props)
        return (
            <Container fluid>
                <h1 className="capitalize">{ModuleNames.get(this.props.module)} Models</h1>
                <hr />
                <p>Select group of public models:</p>
                { (this.props.accessibleGroups) && (this.props.accessibleGroups.length == 0) &&
                    <p>Groups are being loaded.</p>
                }
                <SimpleDropDown items={this.props.accessibleGroups} selected={this.state.selectedGroup} onChange={g => this.selectGroup(g)}></SimpleDropDown>
                <h2>Public Models in {this.state.selectedGroup}</h2>
                <SelectableListOfModels 
                    models={this.state.models.filter(m => m.type==typePublic)}
                    groups={[this.state.selectedGroup]}
                    selected="none" 
                    onSelect={id => this.selectPublicModel(id)} 
                    onDoubleClick={id=>this.doubleClickModel(id)} 
                    ref={this.publicListRef}/>
                <hr />
                {!guest && <h2>User Models</h2>}
                {!guest && <SelectableListOfModels models={this.state.models.filter(m => m.type==typeUser)} selected="none" onSelect={id => this.selectUserModel(id)} onDoubleClick={id=>this.doubleClickModel(id)} ref={this.userListRef}/>}
                {!guest && <hr />}
                <h2>Scratch Models</h2>
                <SelectableListOfModels models={this.state.models.filter(m => m.type==typeScratch)} selected="none" onSelect={id => this.selectScratchModel(id)} onDoubleClick={id=>this.doubleClickModel(id)} ref={this.scratchListRef}/>
            </Container>
        )
    }
}

