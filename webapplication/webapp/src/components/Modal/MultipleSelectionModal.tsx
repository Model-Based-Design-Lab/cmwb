import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { ModalFooter } from './ModalFooter'
import { MultipleSelection } from '../Controls/MultipleSelection'
interface Props {
}

interface State {
    show: boolean
    header: string
    question: string
    items: [string,string][]
    selectedItems: string[]
    isOptional: boolean
}

export class MultipleSelectionModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false, 
            header: "", 
            question: "", 
            items: [], 
            selectedItems:[], 
            isOptional: false 
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private _okCallback: (selectedItems: string[]) => void
    private _cancelCallback: () => void

    public show(header: string, question: string, items: string[], okCallback: (selectedItems: string[]) => void, cancelCallback: ()=>void, initialItems: string[]=[], isOptional: boolean = false) {
        this.showValues(header, question, items.map(m=>[m, m]), okCallback, cancelCallback, initialItems, isOptional)
    }

    public showValues(header: string, question: string, items: [string,string][], okCallback: (selectedItems: string[]) => void, cancelCallback: ()=>void, initialItems: string[]=[], isOptional: boolean = false) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.setState({ show: true, header: header, question: question, items: items, selectedItems:initialItems, isOptional })
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
            this._okCallback(this.state.selectedItems)
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private handleCloseNoChoice() {
        this.setShow(false)
        if (! (this._okCallback === undefined)) {
            this._okCallback(null)
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
                        initialItems={this.state.selectedItems}
                        onChange={selectedItems => this.setState({selectedItems})}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                        items={this.state.items}
                    ></MultipleSelection>
                </Modal.Body>
                <ModalFooter 
                    validate={()=>true}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                    isOptional={this.state.isOptional}
                >
                </ModalFooter>
            </Modal>
        )
    }
}

