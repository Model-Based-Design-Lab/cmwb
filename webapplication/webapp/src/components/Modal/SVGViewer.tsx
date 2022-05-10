import * as React from 'react'
import { Button, Modal } from 'react-bootstrap'

interface Props {
}

interface State {
    show: boolean,
    header: string,
    imageSvg: string
}

export class SVGViewer extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { show: false, header: "", imageSvg: null}
        this._okCallback = undefined
    }

    private _okCallback: () => void

    public show(header: string, imageSvg: string, okCallback: () => void) {
        this._okCallback = okCallback
        this.setState({ show: true, header, imageSvg })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleClose() {
        this.setShow(false)
        if (! (this._okCallback === undefined)) {
            this._okCallback()
            this._okCallback = undefined
        }
    }

    render() {
        const content = <div style={{textAlign: "center"}} id="previewImage" dangerouslySetInnerHTML={{ __html: this.state.imageSvg }}></div>

        return (
            <Modal dialogClassName="modal-90w" show={this.state.show} onHide={()=>this.handleClose()} onClick={()=>this.handleClose()} className="modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>         
                    {content}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.handleClose()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

