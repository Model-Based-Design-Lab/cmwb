import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { ModalFooter } from './ModalFooter'
import {ListOfItems } from '../Controls/ListOfItems'

interface Props {
    validate?: (l: string[])=>boolean
}

interface State {
    show: boolean
    header: string
    question: string
    modelItems: string[]
    itemList: string[],
    validate: (l: string[])=>boolean
}

export class ListOfItemsModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false,
            header: "", 
            question: "", 
            modelItems: [],
            itemList: [],
            validate: props.validate
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.listOfItems = React.createRef()
    }

    private _okCallback: (result: string[]) => void
    private _cancelCallback: () => void
    private listOfItems: React.RefObject<ListOfItems>
    
    public show(header: string, question: string, modelSequences: string[], validate: (l:string[])=> boolean, okCallback: (result: string[]) => void, cancelCallback: ()=>void) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.setState({ 
            show: true, 
            header: header, 
            question: question, 
            modelItems: modelSequences,
            itemList: [],
            validate
        })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        this.setShow(false)
        if (!(this._okCallback === undefined)) {
            this._okCallback(this.state.itemList)
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
            <Modal show={this.state.show} onHide={() => this.handleCloseCancel()} className="modal">
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListOfItems
                        ref={this.listOfItems}
                        modelItems={this.state.modelItems}
                        question={this.state.question} 
                        validate={this.state.validate}
                        onChange={(items: string[])=>this.setState({itemList: items})}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                    />
                </Modal.Body>
                <ModalFooter 
                    validate={()=>this.state.validate(this.state.itemList)}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                />
            </Modal>
        )
    }
}

