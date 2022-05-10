import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { EditText } from '../../Controls/EditText'
import { ModalFooter } from '../ModalFooter'
import { AdvancedOptions } from './AdvancedOptions'

interface Props {
}

interface State {
    show: boolean,
    header: string,
    question: string,
    placeholder: string,
    value: string,
    advanced: boolean
    showAdvanced: boolean
    validate: (s: string)=>boolean,
}

export class OptionEditTextModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false, 
            header: "", 
            question: "", 
            value: "", 
            placeholder: "",
            advanced: false,
            showAdvanced: true,
            validate: (s: string)=>true 
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.editText = React.createRef()
    }

    private _okCallback: ([advanced, result]: [boolean, string]) => void
    private _cancelCallback: () => void
    private editText: React.RefObject<EditText>


    public show(header: string, question: string, placeholder: string, initialValue: string, showAdvanced: boolean, validate: (s: string) => boolean, okCallback: ([advanced, result]: [boolean, string]) => void, cancelCallback: () => void) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback        
        this.editText.current?.clear()
        this.setState({ 
            show: true, 
            header: header, 
            question: question, 
            value: initialValue, 
            placeholder, 
            validate,
            showAdvanced,
            advanced: false
        })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        if (this.state.validate(this.state.value)) {
            this.setShow(false)
            if (!(this._okCallback === undefined)) {
                this._okCallback([this.state.advanced, this.state.value])
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
                        onChange={(value: string)=>{this.setState({value: value})}}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                    ></EditText>
                    { (this.state.showAdvanced) &&
                        <AdvancedOptions onChange={value=>{this.setState({advanced: value})}}></AdvancedOptions>
                    }
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

