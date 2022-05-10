import * as React from 'react'
import { Button, Form, FormControl, InputGroup, Modal } from 'react-bootstrap'

interface Props {
    question: string,
    validate: (l: string[])=>boolean
    onChange: (items: string[])=>void
    onKeyUp: (e: any)=>void,
    modelItems: string[]
}

interface State {
    itemList: string[]
}

export class ListOfItems extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { 
            itemList: []
        }
    }

    private addItem(s: string) {
        this.setState({
            itemList: this.state.itemList.concat([s])
            }, 
        ()=>this.props.onChange(this.state.itemList)
        )
    }

    private removeLast() {
        this.setState({
            itemList: this.state.itemList.slice(0,-1)
        }, 
        ()=>this.props.onChange(this.state.itemList)
        )
    }

    public focus() {
        // nothing to focus on?
    }


    render() {
        return (
            <div>{this.props.question}
                <InputGroup className="mb-3">
                    <div>
                        <p>Click buttons to add an item to the list.</p>
                        {
                            this.props.modelItems.map(s => <Button key={s} style={{"margin": "5px"}} onClick={()=>this.addItem(s)}>{s}</Button>)
                        }
                            <div>
                            <Button onClick={()=>this.removeLast()}>Remove last</Button>
                        </div>
                        </div>
                </InputGroup>
                <p>List of items:</p>
                {
                    this.state.itemList.length == 0 ? (
                        <p>No items selected.</p>
                    ) : (
                        <p>{this.state.itemList.join(", ")}</p>
                    )
                }
            </div>
        )
    }
}

