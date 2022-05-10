import * as React from 'react'
import { Button, Modal } from 'react-bootstrap'

interface Props {
}

interface State {
    show: boolean,
    header: string,
    question: string
}

export class Confirm extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { show: false, header: "", question: "" }
        this._okCallback = undefined
    }

    private _okCallback: () => void

    public show(header: string, question: string, okCallback: () => void) {
        this._okCallback = okCallback
        this.setState({ show: true, header: header, question: question })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        this.setShow(false)
        if (! (this._okCallback === undefined)) {
            this._okCallback()
            this._okCallback = undefined
        }
    }

    private handleCloseCancel() {
        this.setShow(false)
        this._okCallback = undefined
    }


    render() {
        return (
            <Modal show={this.state.show} onHide={()=>this.handleCloseCancel()} className="modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.state.question}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.handleCloseOK()}>
                        OK
                    </Button>
                    <Button variant="primary" onClick={()=>this.handleCloseCancel()}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

