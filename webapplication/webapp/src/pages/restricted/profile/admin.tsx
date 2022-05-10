import * as React from 'react'
import { FormControl, InputGroup, Spinner, Table } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { isAdmin } from '../../../authentication/utils'
import { SelectableListOfUsers } from '../../../components/Admin/SelectableListOfUsers'
import Notification from '../../../components/Notification/Notification'
import IconButton, { editIcon } from '../../../components/Buttons/IconButton'
import { ADMIN_USER_EDIT_PATH } from '../../../config/config'
import { UserController } from '../../../controller/usercontroller'
import { IExternalAccessGroup } from '../../../database/passwdbinterface'
import { historyPush } from '../../../utils/routing'


interface Props {
}

interface State {
    users: any[],
    selectedUser: string,
    groups: IExternalAccessGroup[],
    newGroupName: string,
    newGroupAccessCode: string
}

export default class Admin extends React.Component<Props,State> {

    constructor(props: any) {
        super(props)
        this.state = {users: [], selectedUser: null, groups: null, newGroupName: "",
            newGroupAccessCode: ""
        }

        this.groupNameTextControl = React.createRef()
        this.groupAccessCodeTextControl = React.createRef()
        this.notification = React.createRef()

        UserController.getUsers()
        .then((users: any[]) => {
            this.setState({users})
        })
        this.getGroups()

    }

    private groupNameTextControl: React.RefObject<HTMLInputElement>
    private groupAccessCodeTextControl: React.RefObject<HTMLInputElement>
    private notification: React.RefObject<Notification>

    private getGroups() {
        UserController.getAllFullGroups()
        .then((groups: IExternalAccessGroup[]) => {
            this.setState({groups})
        })
    }

    private editUser() {
        if (this.state.selectedUser) {
            historyPush(ADMIN_USER_EDIT_PATH,{ editUserId: this.state.selectedUser})
        }
    }

    private createGroup() {
        UserController.createAccessGroup(this.state.newGroupName, this.state.newGroupAccessCode)
        .then(() => {
            this.notification.current.showSuccess("Completed", "Updated User")
        // update list
        this.getGroups()
    })
        .catch (error => this.notification.current.showError("Delete", error.toString()))
    }

    render() {
        if (! isAdmin(this.props)) {
            return (
                <Container fluid>
                </Container>
            )
        }

        if (this.state.users.length == 0) {
            return (
                <Container fluid>
                    <Spinner animation="border" variant="primary" /><p>Getting users... please wait.</p>
                </Container>
            )
        }

        return (
            <Container fluid>
                <h1>Admin Page</h1>
                <h2>Groups</h2>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Access Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.groups &&
                            this.state.groups.map((group: IExternalAccessGroup) => (
                                <tr key={group.id}>
                                    <td>{group.name}</td>
                                    <td>{group.accessCode}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
                <p>New group:</p>
                <InputGroup className="mb-3">
                    <FormControl 
                        ref={this.groupNameTextControl}
                        placeholder={"Group Name"}
                        aria-label="modelName"
                        aria-describedby="basic-addon1"
                        onChange={e => this.setState({newGroupName: e.target.value})}
                        type="text"
                    />
                    <FormControl 
                        ref={this.groupAccessCodeTextControl}
                        placeholder={"Group Access Code"}
                        aria-label="modelName2"
                        aria-describedby="basic-addon1"
                        onChange={e => this.setState({newGroupAccessCode: e.target.value})}
                        type="text"
                    />                
                </InputGroup>
                <IconButton icon={editIcon} label='Create New Group' onClick={()=>this.createGroup()}/>
                <h2>Users</h2>
                <SelectableListOfUsers 
                    users={this.state.users} 
                    onSelect={(user: string)=>{this.setState({selectedUser: user})}}
                />
                <IconButton icon={editIcon} label='Edit User' onClick={()=>this.editUser()}/>{' '}
                <Notification ref={this.notification}/>
            </Container>
        )
    }
}