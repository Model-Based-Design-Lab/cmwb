import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { MultiEditText } from '../../Controls/MultiEditText'
import { ModalFooter } from '../ModalFooter'
import { AdvancedOptions } from './AdvancedOptions'

interface Props {
}

interface State {
    show: boolean,
    header: string,
    question: string,
    placeholders: string[],
    labels: string[],
    values: string[],
    advanced: boolean
    showAdvanced: boolean
    validate: (s: string[])=>boolean
}

export class OptionMultiEditTextModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false, 
            header: "", 
            question: "", 
            values: [], 
            placeholders: [],
            labels: [],
            advanced: false,
            showAdvanced: true,
            validate: (s: string[])=>true 
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.multiEditText = React.createRef()
    }

    private _okCallback: ([advanced, result]: [boolean, string[]]) => void
    private _cancelCallback: () => void
    private multiEditText: React.RefObject<MultiEditText>


    public show(header: string, question: string, labels: string[], placeholders: string[], initialValues: string[], validate: (s: string[]) => boolean, showAdvanced: boolean, okCallback: ([advanced, result]: [boolean, string[]]) => void, cancelCallback: () => void) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback        
        this.setState({ 
            show: true, 
            header, 
            question, 
            labels, 
            values: initialValues, 
            placeholders, 
            validate, 
            showAdvanced,
            advanced: false })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        if (this.state.validate(this.state.values)) {
            this.setShow(false)
            if (!(this._okCallback === undefined)) {
                this._okCallback([this.state.advanced, this.state.values])
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
                        onChange={(values: string[])=>{this.setState({values: values})}}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                    ></MultiEditText>
                    { (this.state.showAdvanced) &&
                        <AdvancedOptions onChange={value=>{this.setState({advanced: value})}}></AdvancedOptions>
                    }
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

