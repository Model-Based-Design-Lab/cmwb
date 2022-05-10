import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { ModalFooter } from './ModalFooter'
import { MultiEditText } from '../Controls/MultiEditText'

interface Props {
    placeholders?: string[],
    labels?: string[],
    validate?: (s: string[])=>boolean
}

interface State {
    show: boolean,
    header: string,
    question: string,
    labels: string[],
    placeholders: string[],
    values: string[],
    validate: (s: string[])=>boolean
}

export class MultiEditTextModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false, 
            header: "", 
            question: "", 
            labels: this.props.labels, 
            values: [], 
            placeholders: props.placeholders, 
            validate: props.validate
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.multiEditText = React.createRef()
    }

    private _okCallback: (result: string[]) => void
    private _cancelCallback: () => void
    private multiEditText: React.RefObject<MultiEditText>

    public show(header: string, question: string, labels: string[], placeholders: string[], initialValues: string[], validate: (s: string[])=>boolean, okCallback: (result: string[]) => void, cancelCallback: ()=>void) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.setState({ show: true, header: header, question: question, labels: labels, values: initialValues, placeholders: placeholders, validate: validate })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        if (! this.state.validate(this.state.values)) return
        this.setShow(false)
        if (!(this._okCallback === undefined)) {
            this._okCallback(this.state.values)
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private handleCloseCancel() {
        this.setShow(false)
        if (!(this._cancelCallback === undefined)) {
            this._cancelCallback()
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private handleKeyUp(e: { key: string }) {
        if (e.key === 'Enter') {
          this.handleCloseOK()
        }
        if (e.key === 'Escape') {
            this.handleCloseCancel()
          }
      }

      render() {
        return (
            <Modal show={this.state.show} onHide={() => this.handleCloseCancel()} onEnter={()=>{this.multiEditText.current.focus()}} className="modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MultiEditText 
                        ref={this.multiEditText}
                        question={this.state.question} 
                        placeholders={this.state.placeholders}
                        labels={this.state.labels}
                        validate={this.state.validate}
                        onChange={(values: string[])=>this.setState({values})}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                    ></MultiEditText>
                </Modal.Body>
                <ModalFooter 
                    validate={()=>this.state.validate(this.state.values)}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                >
                </ModalFooter>
            </Modal>
        )
    }

}
