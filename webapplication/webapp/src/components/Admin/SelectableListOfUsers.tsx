import React from "react"
import { Container, Table } from "react-bootstrap"
import { dateAndTimeString } from "../../utils/utils"

// properties for the component
interface Props {
    // collection of users
    users: any[],
    // optional selected user id
    selected?: string,
    // optional callback function on change of selection
    onSelect?: (userId: string)=>void
    // optional callback function on double click
    onDoubleClick?: (userId: string)=>void
}

interface State {
    users: any[],
    selected?: string
}

export class SelectableListOfUsers extends React.Component<Props,State> {

    constructor(props: any) {
        super(props)
        this.state = {users: props.users, selected: props.selected}

        this.clickUser = this.clickUser.bind(this)
        this.selectCallback = props.onSelect
        this.doubleClickCallback = props.onDoubleClick
    }

    private selectCallback: (userId: string)=>void
    private doubleClickCallback: (userId: string)=>void

    public deselect(){
        this.setState({selected: undefined})
    }

    private clickUser(userId: string) {
        this.setState({selected: userId})
        if (this.selectCallback) this.selectCallback(userId)
    }

    private doubleClickUser(userId: string) {
        this.setState({selected: userId})
        if (this.doubleClickCallback) this.doubleClickCallback(userId)
    }


    render() {
        return (
            <Container fluid>
                {/* <Table bordered hover size="sm"> */}
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Registered on</th>
                            <th>Group</th>
                            <th>Admin?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users &&
                            this.state.users.map(user => (
                                <tr key={user.id} className={this.state.selected==user.id ? "selectedUser" : ""} onClick={()=> this.clickUser(user.id)} onDoubleClick={()=> this.doubleClickUser(user.id)}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{dateAndTimeString(user.createdAt)}</td>
                                    <td>{user.group}</td>
                                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Container>
        )
        }
  }

