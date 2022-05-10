import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { ListOfItems } from '../../Controls/ListOfItems'
import { ModalFooter } from '../ModalFooter'
import { AdvancedOptions } from './AdvancedOptions'

interface Props {
    validate?: (l: string[])=>boolean
}

interface State {
    show: boolean
    header: string
    question: string
    modelItems: string[]
    itemList: string[]
    advanced: boolean
    showAdvanced: boolean
    validate: (l: string[])=>boolean
}

export class OptionListOfItemsModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            show: false,
            header: "", 
            question: "", 
            modelItems: [],
            itemList: [],
            advanced: false,
            showAdvanced: true,
            validate: props.validate
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.listOfItems = React.createRef()
    }

    private _okCallback: ([advanced,result]: [boolean,string[]]) => void
    private _cancelCallback: () => void
    private listOfItems: React.RefObject<ListOfItems>
    
    public show(header: string, question: string, modelSequences: string[], showAdvanced: boolean, validate: (l:string[])=> boolean, okCallback: (result: [boolean,string[]]) => void, cancelCallback: ()=>void) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.setState({ 
            show: true, 
            header: header, 
            question: question, 
            modelItems: modelSequences,
            itemList: [],
            showAdvanced,
            validate,
            advanced: false
        })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        this.setShow(false)
        if (!(this._okCallback === undefined)) {
            this._okCallback([this.state.advanced, this.state.itemList])
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
                    >
                    </ListOfItems>
                    { (this.state.showAdvanced) &&
                        <AdvancedOptions onChange={value=>{this.setState({advanced: value})}}></AdvancedOptions>
                    }
                </Modal.Body>
                <ModalFooter 
                    validate={()=>this.state.validate(this.state.itemList)}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                >
                </ModalFooter>
            </Modal>
        )
    }
}

