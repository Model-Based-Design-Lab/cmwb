import React from "react"
import { Dropdown } from "react-bootstrap"

// properties for the component
interface Props {
    items: string[]
    onChange: (value: string) => void
    selected: string
}

interface State {
    selectedItem: string
}



export class SimpleDropDown extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { selectedItem: props.items[0] }
    }

    private select(v: any){
        this.setState({selectedItem: v}, ()=>this.props.onChange(v))
    }

    render() {
        if (this.props.items === undefined) {
            return (
                <p>No items provided to SimpleDropDown.</p>
            )
        }
        return (
                <Dropdown onSelect={(eventKey: any, event: Object)=>{this.select(eventKey)}}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {this.props.selected}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            this.props.items.map((item, idx) => {
                                return (
                                    <Dropdown.Item key={idx} eventKey={item}>{item}</Dropdown.Item>
                                )
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
        )
    }
}

