import * as React from 'react'
import { Button, Form, FormControl, InputGroup, Modal } from 'react-bootstrap'

interface Props {
    question: string,
    onChange: (value: boolean)=>void
    onKeyUp: (e: any)=>void
}

interface State {
    value: boolean
}

export class EditBoolean extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            value: false
        }
        this.checkboxControl = React.createRef()
    }

    private checkboxControl: React.RefObject<HTMLInputElement>


    public focus() {
        this.checkboxControl.current.focus()
    }

    private onChange(value: boolean) {
        this.setState({ value })
        this.props.onChange(value)
    }


    render() {
        return (
            <div>{this.props.question}
                <InputGroup className="mb-3">
                    <Form.Check 
                        ref={this.checkboxControl} 
                        type="checkbox"  
                        label="" 
                        checked={this.state.value} 
                        onChange={e => this.onChange((e.target as HTMLInputElement).checked)} 
                        onKeyUp={this.props.onKeyUp}
                        />
                </InputGroup>
            </div>
        )
    }

}

