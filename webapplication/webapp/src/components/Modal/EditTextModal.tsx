import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { ModalFooter } from './ModalFooter'
import { EditText } from '../Controls/EditText'

interface Props {
    placeholder?: string
    validate?: (s: string)=>boolean
}

interface State {
    show: boolean,
    header: string,
    question: string,
    placeholder: string,
    value: string,
    validate: (s: string)=>boolean
}

// TODO: factor out common code of modal windows in superclass

// a modal window for text input
// props:
// placeholder: a text shown if the edit input is empty to explain the purpose
// it is activated with the show method, providing 
// header: string
// question: string
// placeholder: string
// initialValue: string
// validate: (s: string)
export class EditTextModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false, 
            header: "", 
            question: "", 
            value: "", 
            placeholder: props.placeholder,
            validate: props.validate 
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.editText = React.createRef()
    }

    private _okCallback: (result: string) => void
    private _cancelCallback: () => void
    private editText: React.RefObject<EditText>


    public show(header: string, question: string, placeholder: string, initialValue: string, validate: (s: string) => boolean, okCallback: (result: string) => void, cancelCallback: () => void) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.editText.current?.clear()
        this.setState({ show: true, header: header, question: question, value: initialValue, placeholder: placeholder, validate: validate })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        if (this.state.validate(this.state.value)) {
            this.setShow(false)
            if (!(this._okCallback === undefined)) {
                this._okCallback(this.state.value)
            }
            this._okCallback = undefined
            this._cancelCallback = undefined
        }
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
            <Modal show={this.state.show} onHide={() => this.handleCloseCancel()} onEnter={()=>{this.editText.current.focus()}} className="modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditText 
                        ref={this.editText}
                        question={this.state.question} 
                        placeholder={this.state.placeholder} 
                        validate={this.state.validate}
                        onChange={(value: string)=>this.setState({value})}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                    ></EditText>
                </Modal.Body>
                <ModalFooter 
                    validate={()=>this.state.validate(this.state.value)}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                >
                </ModalFooter>
            </Modal>
        )
    }
}

