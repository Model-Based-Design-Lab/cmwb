import * as React from 'react'
import { Container, Form, FormControl, InputGroup } from 'react-bootstrap'

export const SimulationOptions = {
    Confidence: "confidence",
    AbsoluteErrorBound: "absoluteErrorBound",
    RelativeErrorBound: "relativeErrorBound",
    MaxPathLength: "maxPathLength",
    NumberOfRealizations: "numberOfRealizations",
    TimeOut: "timeOut"
}

enum EStoppingConditions {
    confidenceLevel,
    absoluteErrorBound,
    relativeErrorBound,
    maxPathLength,
    numberOfRealizations,
    timeOut
}

export interface IStoppingConditions {
    confidenceLevel: string
    absoluteErrorBound: string
    relativeErrorBound: string
    maxPathLength: string
    numberOfRealizations: string
    timeOut: string
}
interface Props {
    question: string
    hiddenOptions: string[]
    isTransientAnalysis: boolean
    initialValues: IStoppingConditions
    validate: (c: IStoppingConditions)=>boolean
    onChange: (values: IStoppingConditions)=>void
    onKeyUp: (e: any)=>void
}

interface State {
    values: IStoppingConditions
}

export class StoppingCondition extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { values: {
                confidenceLevel: "",
                absoluteErrorBound: "",
                relativeErrorBound: "",
                maxPathLength: "",
                numberOfRealizations: "",
                timeOut: ""
            }
        }
        this.confidenceTextControl = React.createRef()
        this.absoluteErrorTextControl = React.createRef()
        this.relativeErrorTextControl = React.createRef()
        this.pathLengthTextControl = React.createRef()
        this.numberOfRealizationsTextControl = React.createRef()
        this.timeOutTextControl = React.createRef()
    }

    private confidenceTextControl: React.RefObject<HTMLInputElement>
    private absoluteErrorTextControl: React.RefObject<HTMLInputElement>
    private relativeErrorTextControl: React.RefObject<HTMLInputElement>
    private pathLengthTextControl: React.RefObject<HTMLInputElement>
    private numberOfRealizationsTextControl: React.RefObject<HTMLInputElement>
    private timeOutTextControl: React.RefObject<HTMLInputElement>


    
    public focus() {
        this.confidenceTextControl.current.focus()
    }

    public setValues(values: IStoppingConditions) {
        this.setState({values})
    }

    

    private onChange(aspect: EStoppingConditions, value: string) {
        
        var newValues = {
            ...this.state.values
        };

        switch (aspect) {
            case EStoppingConditions.confidenceLevel:
                newValues.confidenceLevel = value
                break;
        
            case EStoppingConditions.absoluteErrorBound:
                newValues.absoluteErrorBound = value
                break;
        
            case EStoppingConditions.relativeErrorBound:
                newValues.relativeErrorBound = value
                break;
        
            case EStoppingConditions.maxPathLength:
                newValues.maxPathLength = value
                break;
        
            case EStoppingConditions.numberOfRealizations:
                newValues.numberOfRealizations = value
                break;
        
            case EStoppingConditions.timeOut:
                newValues.timeOut = value
                break;
        
            default:
                break;
        }
        
        this.setState({ values: newValues })

        this.props.onChange(newValues)
    }

    render() {
        return (
            <div>{this.props.question}
                    Leave individual criteria blank if you don't want to use that particular criterion. At least one stopping criterion is required.
                    <InputGroup className="mb-3" onKeyUp={this.props.onKeyUp}>
                        <div>
                            {!this.props.hiddenOptions.includes(SimulationOptions.Confidence) &&
                                <Container fluid>
                                    <Form.Label>Confidence level:</Form.Label>
                                    <FormControl
                                        ref={this.confidenceTextControl}
                                        placeholder="Confidence level (between 0 and 1)"
                                        onChange={e => this.onChange(EStoppingConditions.confidenceLevel, e.target.value)}
                                        type="text"
                                        value={this.state.values.confidenceLevel}
                                    />
                                </Container>
                            }
                            {!this.props.hiddenOptions.includes(SimulationOptions.AbsoluteErrorBound) &&
                                <Container fluid>
                                    <Form.Label>Absolute error bound:</Form.Label>
                                    <FormControl
                                        ref={this.absoluteErrorTextControl}
                                        placeholder="Absolute error bound"
                                        onChange={e => this.onChange(EStoppingConditions.absoluteErrorBound, e.target.value)}
                                        type="text"
                                        value={this.state.values.absoluteErrorBound}
                                    />
                                </Container>
                            }
                            {!this.props.hiddenOptions.includes(SimulationOptions.RelativeErrorBound) &&
                                <Container fluid>
                                    <Form.Label>Relative error bound:</Form.Label>
                                    <FormControl
                                        ref={this.relativeErrorTextControl}
                                        placeholder="Relative error bound"
                                        onChange={e => this.onChange(EStoppingConditions.relativeErrorBound, e.target.value)}
                                        type="text"
                                        value={this.state.values.relativeErrorBound}
                                    />
                                </Container>
                            }
                            {!this.props.hiddenOptions.includes(SimulationOptions.MaxPathLength) &&
                                <Container fluid>
                                    <Form.Label>Maximum path length:</Form.Label>
                                    <FormControl
                                        ref={this.pathLengthTextControl}
                                        placeholder="Maximum path length (mandatory)"
                                        onChange={e => this.onChange(EStoppingConditions.maxPathLength, e.target.value)}
                                        type="text"
                                        value={this.state.values.maxPathLength}
                                    />
                                </Container>
                            }
                            {!this.props.hiddenOptions.includes(SimulationOptions.NumberOfRealizations) && ! this.props.isTransientAnalysis &&
                                <Container fluid>
                                    <Form.Label>Maximum number of cycles:</Form.Label>
                                    <FormControl
                                        ref={this.numberOfRealizationsTextControl}
                                        placeholder="Maximum number of cycles"
                                        onChange={e => this.onChange(EStoppingConditions.numberOfRealizations, e.target.value)}
                                        type="text"
                                        value={this.state.values.numberOfRealizations}
                                    />
                                </Container>
                            }
                            {!this.props.hiddenOptions.includes(SimulationOptions.NumberOfRealizations) && this.props.isTransientAnalysis &&
                                <Container fluid>
                                    <Form.Label>Maximum number of paths:</Form.Label>
                                    <FormControl
                                        ref={this.numberOfRealizationsTextControl}
                                        placeholder="Maximum number of paths"
                                        onChange={e => this.onChange(EStoppingConditions.numberOfRealizations, e.target.value)}
                                        type="text"
                                        value={this.state.values.numberOfRealizations}
                                    />
                                </Container>
                            }
                            {!this.props.hiddenOptions.includes(SimulationOptions.TimeOut) &&
                                <Container fluid>
                                    <Form.Label>Time-out (sec.):</Form.Label>
                                    <FormControl
                                        ref={this.timeOutTextControl}
                                        placeholder="seconds"
                                        onChange={e => this.onChange(EStoppingConditions.timeOut, e.target.value)}
                                        type="text"
                                        value={this.state.values.timeOut}
                                    />
                                </Container>
                            }
                        </div>
                    </InputGroup>
                </div>
        )
    }
}

