import * as React from 'react'
import { Button, Modal, Table } from 'react-bootstrap'

interface Props {
}

export type TArtifact = {
    name: string,
    path: string,
    type: string
}

interface State {
    show: boolean,
    selected: number,
    artifacts: TArtifact[],
}

type TSelectCallback = (selectedArtifact: TArtifact) => void

export class ArtifactList extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { show: false, selected: -1, artifacts: [] }
        this._selectCallback = undefined
    }

    private _selectCallback: TSelectCallback
    
    public show(artifacts: TArtifact[], selectCallback: TSelectCallback) {
        this._selectCallback = selectCallback
        this.setState({ show: true, artifacts: artifacts })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }


    private handleClose() {
        this._selectCallback = undefined
        this.setShow(false)
    }

    private clickArtifact(index: number) {
        this.setState({selected: index})
    }

    private openSelectedArtifact(){
        if (! (this._selectCallback === undefined)) {
            this._selectCallback(this.state.artifacts[this.state.selected])
        }
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={()=>this.handleClose()} className="modal">
                <Modal.Header closeButton>
                    <Modal.Title>Generated Artifacts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Select from the list.</p>
                    <hr/>
                    <Table>
                        <thead>
                            <tr>
                                <td>Name</td><td>Type</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.artifacts.map((a: TArtifact, index: number) => 
                                    <tr key={index} className={this.state.selected==index ? "selectedModel" : ""} onClick={()=> this.clickArtifact(index)}>
                                        <td>{a.name}</td>
                                        <td>{a.type}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={()=>this.openSelectedArtifact()}>
                        Open Selected Artifact
                    </Button>
                    <Button variant="primary" onClick={()=>this.handleClose()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

