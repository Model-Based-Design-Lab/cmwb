import * as React from 'react'
import { Button, Dropdown, Modal } from 'react-bootstrap'
import { ModalFooter } from '../ModalFooter'
import { Selection } from '../../Controls/Selection'
import { AdvancedOptions } from './AdvancedOptions'


interface Props {
}

interface State {
    show: boolean,
    header: string,
    question: string,
    items: [string,string][],
    showOKButton: boolean,
    advanced: boolean
    showAdvanced: boolean
}

export class OptionSelectionModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false, 
            header: "", 
            question: "", 
            items: [], 
            showOKButton: false,
            advanced: false,
            showAdvanced: true
         }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private _okCallback: ([advanced, selectedItem]: [boolean, string]) => void
    private _cancelCallback: () => void

    public show(header: string, question: string, items: string[], showAdvanced: boolean, okCallback: ([advanced, selectedItem]: [boolean, string]) => void, cancelCallback: ()=>void, showOKButton: boolean = false) {
        this.showValues(header, question, items.map(m=>[m, m]), showAdvanced, okCallback, cancelCallback, showOKButton)
    }

    public showValues(header: string, question: string, items: [string,string][], showAdvanced: boolean, okCallback: ([advanced, selectedItem]: [boolean, string]) => void, cancelCallback: ()=>void, showOKButton: boolean = false) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.setState({ 
            show: true, 
            header, 
            question, 
            items, 
            showAdvanced, 
            showOKButton,
            advanced: false
        })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private select(item: string) {
        this.setShow(false)
        if (! (this._okCallback === undefined)) {
            this._okCallback([this.state.advanced, item])
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private handleCloseOK() {
        this.setShow(false)
        if (! (this._okCallback === undefined)) {
            this._okCallback([this.state.advanced, ""])
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private handleCloseCancel() {
        this.setShow(false)
        if (! (this._cancelCallback === undefined)) {
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
        const dropDownItems = this.state.items.map(item => <Dropdown.Item key={item[0]} onSelect={()=>this.select(item[0])}>{item[1]}</Dropdown.Item>)
        return (
            <Modal show={this.state.show} onHide={()=>this.handleCloseCancel()} className="modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Selection
                        question={this.state.question}
                        onChange={item => this.select(item)}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                        items={this.state.items}
                    ></Selection>
                    { (this.state.showAdvanced) &&
                        <AdvancedOptions onChange={value=>{this.setState({advanced: value})}}></AdvancedOptions>
                    }
                </Modal.Body>
                <ModalFooter 
                    validate={()=>true}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                    showOKButton={this.state.showOKButton}
                >
                </ModalFooter>
            </Modal>
        )
    }
}

