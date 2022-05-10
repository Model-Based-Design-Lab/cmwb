import * as React from 'react'
import { Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap'

interface Props {
    question: string,
    items: [string,string][],
    onChange: (value: string)=>void
    onKeyUp: (e: any)=>void
}

interface State {
}

export class Selection extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { }
    }


    private select(item: string) {
        this.props.onChange(item)
    }


    render() {
        const dropDownItems = this.props.items.map(item => <Dropdown.Item key={item[0]} onSelect={()=>this.select(item[0])}>{item[1]}</Dropdown.Item>)
        return (
            <div>{this.props.question}
                    <hr/>
                    <DropdownButton id="dropdown-basic-button" title="Select">
                        {dropDownItems}
                    </DropdownButton>
            </div>
        )
    }

}

