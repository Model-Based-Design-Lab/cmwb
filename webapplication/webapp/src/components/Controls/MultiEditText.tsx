import * as React from 'react'
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap'

interface Props {
    question: string,
    placeholders: string[]
    labels: string[],
    validate: (s: string[])=>boolean
    onChange: (values: string[])=>void
    onKeyUp: (e: any)=>void
}

interface State {
    values: string[],
}

export class MultiEditText extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { values: [] }
        this._okCallback = undefined
        this._cancelCallback = undefined
        this.textControl = React.createRef()
    }

    private _okCallback: (result: string[]) => void
    private _cancelCallback: () => void
    private textControl: React.RefObject<HTMLInputElement>

    public focus() {
        this.textControl.current.focus()
    }

    private setValue(n: number, value: string) {
        var newValues =[...this.state.values]
        newValues[n] = value
        this.setState({ values: newValues })
        this.props.onChange(newValues)
    }

    render() {
        const indices = Array.from(Array(this.props.labels.length).keys())
        return (
            <div>{this.props.question}
                {
                            indices.map(n => (
                                <InputGroup className="mb-3" key={n.toString()}>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon3">
                                        {this.props.labels[n]}
                                    </InputGroup.Text>    
                                    </InputGroup.Prepend>
                                <FormControl 
                                ref={n==0 ? this.textControl : null}
                                placeholder={this.props.placeholders[n]}
                                aria-label={this.props.labels[n]}
                                aria-describedby="basic-addon1"
                                onChange={e => this.setValue(n, e.target.value)}
                                type="text"
                                value={this.state.values[n]}
                                onKeyUp={this.props.onKeyUp}
                                />    
                                </InputGroup>
                            ))
                }  
            </div>
        )
    }


}
