import * as React from 'react'
import { Button, Dropdown, Modal } from 'react-bootstrap'
import { ModalFooter } from './ModalFooter'
import { Selection } from '../Controls/Selection'


interface Props {
}

interface State {
    show: boolean,
    header: string,
    question: string,
    items: [string,string][],
    showOKButton: boolean
}

export class SelectionModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { show: false, header: "", question: "", items: [], showOKButton: false }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private _okCallback: (selectedItem: string) => void
    private _cancelCallback: () => void

    public show(header: string, question: string, items: string[], okCallback: (selectedItem: string) => void, cancelCallback: ()=>void, showOKButton: boolean = false) {
        this.showValues(header, question, items.map(m=>[m, m]), okCallback, cancelCallback, showOKButton)
    }

    public showValues(header: string, question: string, items: [string,string][], okCallback: (selectedItem: string) => void, cancelCallback: ()=>void, showOKButton: boolean = false) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.setState({ show: true, header: header, question: question, items: items, showOKButton })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private select(item: string) {
        this.setShow(false)
        if (! (this._okCallback === undefined)) {
            this._okCallback(item)
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
    }

    private handleCloseOK() {
        this.setShow(false)
        if (! (this._okCallback === undefined)) {
            this._okCallback("")
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
                </Modal.Body>
                <ModalFooter 
                    validate={()=>true}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                    showOKButton={this.state.showOKButton}
                />
            </Modal>
        )
    }
}

