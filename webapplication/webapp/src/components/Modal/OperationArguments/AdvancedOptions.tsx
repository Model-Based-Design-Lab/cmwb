import * as React from 'react'
import { Form, InputGroup } from 'react-bootstrap'

interface Props {
    onChange: (value: boolean)=>void
}

interface State {
    value: boolean
}

export class AdvancedOptions extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = {value: false}
        this.checkboxControl = React.createRef()
    }

    private changeState(value: boolean) {
        this.setState({ value })
        this.props.onChange(value)
    }

    private checkboxControl: React.RefObject<HTMLInputElement>

    render() {
        return (
            <div>
            <hr></hr>

<InputGroup className="mb-3">
                <div>Check to include advanced options in following dialogs:&nbsp;</div>
                <Form.Check 
                    ref={this.checkboxControl} 
                    type="checkbox"  
                    label="" 
                    checked={this.state.value} 
                    onChange={e => this.changeState((e.target as HTMLInputElement).checked)} 
                />
            </InputGroup>
            </div>
        )
    }
}

