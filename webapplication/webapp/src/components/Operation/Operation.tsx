import * as React from 'react'
import { Dropdown } from 'react-bootstrap'

interface Props {
    operations: any[],
    descriptions: Map<any,string>,
    callback: (op: any)=>void
}

interface State {
}

export class Operation extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { }
    }

    private selectOperation(op: string) {
        if (this.props.callback) {
            this.props.callback(op)
        }
    }

    render() {
        return (
            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select...
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {this.props.operations.map(o => (
                    <Dropdown.Item key={o} onClick={()=>this.selectOperation(o)}>{this.props.descriptions.get(o)}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
            </Dropdown>
        )
    }
}


