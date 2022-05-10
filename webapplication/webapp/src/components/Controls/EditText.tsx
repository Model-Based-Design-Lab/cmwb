import * as React from 'react'
import { FormControl, InputGroup } from 'react-bootstrap'

interface Props {
    question: string,
    placeholder: string
    validate: (s: string)=>boolean
    onChange: (value: string)=>void
    onKeyUp?: (e: any)=>void
}

interface State {
    value: string
}

// TODO: validation function color background red if invalid
export class EditText extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            value: "" 
        }
        this.textControl = React.createRef()
    }

    private textControl: React.RefObject<HTMLInputElement>
        
    public focus() {
        this.textControl.current.focus()
    }

    public clear() {
        this.setState({value: ""})
    }

    private onChange(value: string) {
        this.setState({ value })
        this.props.onChange(value)
    }

    render() {
        return (
            <div>{this.props.question}
                <InputGroup className="mb-3">
                    <FormControl 
                        ref={this.textControl}
                        placeholder={this.props.placeholder}
                        aria-label="modelName"
                        aria-describedby="basic-addon1"
                        onChange={e => this.onChange(e.target.value)}
                        type="text"
                        value={this.state.value}
                        onKeyUp={this.props.onKeyUp}
                    />
                </InputGroup>
            </div>
        )
    }
}

