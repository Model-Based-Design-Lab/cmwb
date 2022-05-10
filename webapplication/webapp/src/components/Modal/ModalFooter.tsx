import * as React from 'react'
import { Button, Modal } from 'react-bootstrap'

interface Props {
    validate: ()=>boolean,
    okCallback: ()=>void,
    cancelCallback: ()=>void,
    noChoiceCallback?: ()=>void,
    isOptional?: boolean
    showOKButton?: boolean
}

interface State {
    validate: ()=>boolean,
    okCallback: ()=>void,
    cancelCallback: ()=>void
    noChoiceCallback: ()=>void,
    isOptional: boolean,
    showOKButton: boolean
}

export class ModalFooter extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        const isOptional = (this.props.isOptional===undefined)?false:true
        const showOKButton = (this.props.showOKButton===undefined)?true:this.props.showOKButton
        this.state = { 
            validate: this.props.validate,
            okCallback: this.props.okCallback,
            cancelCallback: this.props.cancelCallback,
            noChoiceCallback: this.props.noChoiceCallback,
            isOptional,
            showOKButton
        }
    }

    private handleCloseOK() {
        if (this.props.validate()) {
            if (!(this.state.okCallback === undefined)) {
                this.state.okCallback()
            }
        }
    }


    private handleCloseNoChoice() {
        if (this.props.validate()) {
            if (!(this.state.noChoiceCallback === undefined)) {
                this.state.noChoiceCallback()
            }
        }
    }

    private handleCloseCancel() {
        if (!(this.state.cancelCallback === undefined)) {
            this.state.cancelCallback()
        }
    }
                
    render() {
        return (
            <Modal.Footer>
                {this.state.isOptional && 
                    <Button variant="primary" onClick={() => this.handleCloseNoChoice()}>
                    No selection
                </Button>
                }
                {this.state.showOKButton && 
                    <Button variant="primary" disabled={! this.props.validate()} onClick={()=>this.handleCloseOK()}>
                        OK
                    </Button>
                }
                <Button variant="secondary" onClick={() => this.handleCloseCancel()}>
                    Cancel
                </Button>
            </Modal.Footer>
        )
    }
}

