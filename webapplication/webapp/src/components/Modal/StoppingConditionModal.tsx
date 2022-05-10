import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { ModalFooter } from './ModalFooter'
import { IStoppingConditions, StoppingCondition } from '../Controls/StoppingCondition'

export const SimulationOptions = {
    Confidence: "confidence",
    AbsoluteErrorBound: "absoluteErrorBound",
    RelativeErrorBound: "relativeErrorBound",
    MaxPathLength: "maxPathLength",
    NumberOfRealizations: "numberOfRealizations",
    TimeOut: "timeOut"
}

interface Props {
    validate?: (sc: IStoppingConditions)=>boolean
}

interface State {
    show: boolean
    header: string
    question: string
    values: IStoppingConditions,
    // confidenceLevelValue: string
    // absoluteErrorBoundValue: string
    // relativeErrorBoundValue: string
    // maxPathLengthValue: string
    // numberOfRealizationsValue: string
    // timeOutValue: string
    hiddenOptions: string[]
    isTransientAnalysis: boolean
    validate?: (sc: IStoppingConditions)=>boolean
}

export class StoppingConditionModal extends React.Component<Props, State> {

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
            isTransientAnalysis: false
        }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.stoppingCondition = React.createRef()
    }

    private _okCallback: (result: string[]) => void
    private _cancelCallback: () => void
    private stoppingCondition: React.RefObject<StoppingCondition>


    public show(header: string, question: string, initialValues: string[], hiddenOptions: string[], okCallback: (result: string[]) => void, cancelCallback: () => void, isTransientAnalysis = false) {
        this._okCallback = okCallback
        this._cancelCallback = cancelCallback
        this.setState({
            show: true,
            header: header,
            question: question,
            values: {
                confidenceLevel: initialValues[0],
                absoluteErrorBound: initialValues[1],
                relativeErrorBound: initialValues[2],
                maxPathLength: initialValues[3],
                numberOfRealizations: initialValues[4],
                timeOut: initialValues[5],
            },
            hiddenOptions: hiddenOptions?hiddenOptions:[],
            isTransientAnalysis: isTransientAnalysis
        })
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        this.setShow(false)
        if (!(this._okCallback === undefined)) {
            this._okCallback([
                this.state.values.confidenceLevel,
                this.state.values.absoluteErrorBound,
                this.state.values.relativeErrorBound,
                this.state.values.maxPathLength,
                this.state.values.numberOfRealizations,
                this.state.values.timeOut
            ])
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
                onEnter={()=>{this.stoppingCondition.current.focus()}}                 
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
                    >
                    </StoppingCondition>
                </Modal.Body>
                <ModalFooter 
                    validate={()=>true}
                    okCallback={()=>this.handleCloseOK()}
                    cancelCallback={()=>this.handleCloseCancel()}
                >
                </ModalFooter>
            </Modal>
        )
    }
}

