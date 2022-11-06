import * as React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { ModalFooter } from '../ModalFooter'
import { MultipleSelection } from '../../Controls/MultipleSelection'
import { AdvancedOptions } from './AdvancedOptions'

interface Props {
}

interface State {
    show: boolean
    header: string
    question: string
    items: [string,string][]
    selectedItems: string[]
    isOptional: boolean
    advanced: boolean
    showAdvanced: boolean
}

export class OptionMultipleSelectionModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false, 
            header: "", 
            question: "", 
            items: [], 
            selectedItems:[], 
            isOptional: false,
            advanced: false,
            showAdvanced: true
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private _okCallback: ([advanced, selectedItems]: [boolean, string[]]) => void
    private _cancelCallback: () => void

    public show(header: string, question: string, items: string[], showAdvanced: boolean, okCallback: ([advanced, selectedItems]: [boolean, string[]]) => void, cancelCallback: ()=>void, initialItems: string[]=[], isOptional: boolean = false) {
        this.showValues(header, question, items.map(m=>[m, m]), showAdvanced, okCallback, cancelCallback, initialItems, isOptional)
    }

    public showValues(header: string, question: string, items: [string,string][], showAdvanced: boolean, okCallback: ([advanced, selectedItems]: [boolean, string[]]) => void, cancelCallback: ()=>void, initialItems: string[]=[], isOptional: boolean = false) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.setState({ 
            show: true, 
            header, 
            question, 
            items, 
            selectedItems:initialItems, 
            showAdvanced, 
            isOptional,
            advanced: false
        })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseCancel() {
        this.setShow(false)
        if (! (this._cancelCallback === undefined)) {
            this._cancelCallback()
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private handleCloseOK() {
        this.setShow(false)
        if (! (this._okCallback === undefined)) {
            this._okCallback([this.state.advanced, this.state.selectedItems])
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private handleCloseNoChoice() {
        this.setShow(false)
        if (! (this._okCallback === undefined)) {
            this._okCallback([this.state.advanced,[]])
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
            <Modal show={this.state.show} onHide={()=>this.handleCloseCancel()} className="modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MultipleSelection
                        question={this.state.question}
                        onChange={selectedItems => this.setState({selectedItems})}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                        initialItems={[]}
                        items={this.state.items}
                    ></MultipleSelection>
                    { (this.state.showAdvanced) &&
                        <AdvancedOptions onChange={value=>{this.setState({advanced: value})}}></AdvancedOptions>
                    }
                </Modal.Body>
                <ModalFooter 
                    validate={()=>true}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                    noChoiceCallback={()=>this.handleCloseNoChoice()}
                    isOptional={this.state.isOptional}
                />
            </Modal>
        )
    }
}



