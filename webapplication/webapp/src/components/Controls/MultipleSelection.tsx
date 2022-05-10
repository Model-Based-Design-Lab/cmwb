import * as React from 'react'
import { ListGroup } from 'react-bootstrap'

interface Props {
    question: string,
    onChange: (values: string[])=>void
    onKeyUp: (e: any)=>void
    items: [string,string][]
    initialItems: string[]
}

interface State {
    selectedItems: string[]
}

export class MultipleSelection extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { selectedItems: props.initialItems }
    }

    private select(item: string) {
        var newItems: string[]
        if (this.state.selectedItems.includes(item)){
            newItems = this.state.selectedItems.filter(i=>i!=item)
        } else {
            newItems = this.state.selectedItems.concat([item])
        }
        this.setState({selectedItems: newItems}, ()=>this.props.onChange(this.state.selectedItems))
    }

    render() {
        const listGroupItems = this.props.items.map(item => <ListGroup.Item key={item[0]} active={this.state.selectedItems.includes(item[0])} onClick={()=>this.select(item[0])}>{item[1]}</ListGroup.Item>)
        return (
        <div>
            <p>{this.props.question}</p>
            <hr/>
            <ListGroup>
                {listGroupItems}
            </ListGroup>
        </div>
        )
    }


}

