import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { AdvancedOptions } from './AdvancedOptions'
import { EditBoolean } from '../../Controls/EditBoolean'
import { ModalFooter } from '../ModalFooter'

interface Props {
}

interface State {
    show: boolean,
    header: string,
    question: string,
    value: boolean
    advanced: boolean
    showAdvanced: boolean
}


export class OptionEditBooleanModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false, 
            header: "", 
            question: "", 
            value: false,
            advanced: false,
            showAdvanced: true
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.editBoolean = React.createRef()
    }

    private _okCallback: (result: [boolean, boolean]) => void
    private _cancelCallback: () => void
    private editBoolean: React.RefObject<EditBoolean>


    public show(header: string, question: string, defaultValue: boolean, showAdvanced: boolean, okCallback: ([advanced, result]: [boolean, boolean]) => void, cancelCallback: () => void) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.setState({ 
            show: true, 
            header, 
            question, 
            showAdvanced, 
            value: defaultValue,
            advanced: false
        })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        this.setShow(false)
        if (!(this._okCallback === undefined)) {
            this._okCallback([this.state.advanced, this.state.value])
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
            <Modal show={this.state.show} onHide={() => this.handleCloseCancel()} onEnter={()=>{this.editBoolean.current.focus()}} className="modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditBoolean 
                        ref={this.editBoolean}
                        question={this.state.question} 
                        onChange={(value: boolean)=>this.setState({value})}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                    ></EditBoolean>
                    { (this.state.showAdvanced) &&
                        <AdvancedOptions onChange={value=>{this.setState({advanced: value})}}></AdvancedOptions>
                    }
                </Modal.Body>
                <ModalFooter 
                    validate={()=>true}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                />
            </Modal>
        )
    }

}

