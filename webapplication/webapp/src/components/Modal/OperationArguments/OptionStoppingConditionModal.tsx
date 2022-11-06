import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { ModalFooter } from '../ModalFooter'
import { IStoppingConditions, StoppingCondition } from '../../Controls/StoppingCondition'
import { AdvancedOptions } from './AdvancedOptions'


interface Props {
    validate?: (sc: IStoppingConditions)=>boolean
}

interface State {
    show: boolean
    header: string
    question: string
    values: IStoppingConditions,
    hiddenOptions: string[]
    isTransientAnalysis: boolean
    advanced: boolean
    showAdvanced: boolean
    validate: (sc: IStoppingConditions)=>boolean
}

export class OptionStoppingConditionModal extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = {
            show: false,
            header: "",
            question: "",
            values: {
                confidenceLevel: "",
                absoluteErrorBound: "",
                relativeErrorBound: "",
                maxPathLength: "",
                numberOfRealizations: "",
                timeOut: "",
            },
            hiddenOptions: [],
            isTransientAnalysis: false,
            advanced: false,
            showAdvanced: true,
            validate: props.validate
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.stoppingCondition = React.createRef()
    }

    private _okCallback: ([advanced, result]: [boolean, string[]]) => void
    private _cancelCallback: () => void
    private stoppingCondition: React.RefObject<StoppingCondition>
    

    public show(header: string, question: string, initialValues: string[], hiddenOptions: string[], showAdvanced: boolean, validate: (sc: IStoppingConditions)=>boolean, okCallback: ([advanced, result]: [boolean, string[]]) => void, cancelCallback: () => void, isTransientAnalysis = false) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        const initialSc: IStoppingConditions = {
            confidenceLevel: initialValues[0],
            absoluteErrorBound: initialValues[1],
            relativeErrorBound: initialValues[2],
            maxPathLength: initialValues[3],
            numberOfRealizations: initialValues[4],
            timeOut: initialValues[5],
        }
        this.setState({
            show: true,
            header: header,
            question: question,
            values: initialSc,
            hiddenOptions: hiddenOptions?hiddenOptions:[],
            isTransientAnalysis: isTransientAnalysis,
            showAdvanced,
            validate,
            advanced: false
        })
        this.stoppingCondition.current?.setValues(initialSc)
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        this.setShow(false)
        if (!(this._okCallback === undefined)) {
            this._okCallback([this.state.advanced, [
                this.state.values.confidenceLevel,
                this.state.values.absoluteErrorBound,
                this.state.values.relativeErrorBound,
                this.state.values.maxPathLength,
                this.state.values.numberOfRealizations,
                this.state.values.timeOut
            ]])
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
            <Modal 
                show={this.state.show} 
                onHide={() => this.handleCloseCancel()} 
                className="modal"
                onEnter={()=>this.stoppingCondition.current.focus()}   
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StoppingCondition
                        ref={this.stoppingCondition}
                        question={this.state.question}
                        hiddenOptions={this.state.hiddenOptions}
                        isTransientAnalysis= {this.state.isTransientAnalysis}
                        initialValues={this.state.values}
                        validate={this.state.validate}
                        onChange={(values: IStoppingConditions)=>this.setState({values})}
                        onKeyUp={(e: any) => this.handleKeyUp(e)}
                    />
                    { (this.state.showAdvanced) &&
                        <AdvancedOptions onChange={value=>{this.setState({advanced: value})}}></AdvancedOptions>
                    }
                </Modal.Body>
                <ModalFooter 
                    validate={()=>this.state.validate(this.state.values)}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                />
            </Modal>
        )
    }
}

