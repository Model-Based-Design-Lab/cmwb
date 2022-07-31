import * as React from 'react'
import { Button, Spinner, Table } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { isAdmin } from '../../../authentication/utils'
import { Confirm } from '../../../components/Modal/Confirm'
import Notification from '../../../components/Notification/Notification'
import { ADMIN_USER_EDIT_PATH, GeneralGroup, NoneGroup } from '../../../config/config'
import { UserController } from '../../../controller/usercontroller'
import { IExternalPasswordUser } from '../../../database/passwdbinterface'
import { dateAndTimeString } from '../../../utils/utils'
import { historyPush } from '../../../utils/routing'
import { MultipleSelectionModal } from '../../../components/Modal/MultipleSelectionModal'
import { EditTextModal } from '../../../components/Modal/EditTextModal'


interface Props {
}

interface State {
    userId: string
    user: IExternalPasswordUser
    allGroups: string[]
}

export default class AdminEditUser extends React.Component<Props,State> {

    constructor(props: any) {
        super(props)

        const editUserId = props.query.editUserId

        this.state = {
            user: null,
            userId: editUserId,
            allGroups: []
        }

        this.modalMultipleSelection = React.createRef()
        this.confirmDialog = React.createRef()
        this.notification = React.createRef()
        this.modalEditText = React.createRef()

        UserController.getUser(editUserId)
        .then((user: any) => this.setState({user}))

        UserController.getAllGroups()
        .then((groups: string[]) => this.setState({allGroups: groups}))

    }

    private modalMultipleSelection: React.RefObject<MultipleSelectionModal>
    private confirmDialog: React.RefObject<Confirm>
    private notification: React.RefObject<Notification>
    private modalEditText: React.RefObject<EditTextModal>


    static getInitialProps({ query }: { query: any }) {
        return { query }
    }


    private listOfGroups(l: string[]) {
        return l.join(", ")
    }
     
    private setAccessibleGroups(groups: string[]) {
        // ensure that general is included
        groups = groups.filter(g=>this.state.allGroups.includes(g))
        if (! groups.includes(GeneralGroup)) {
            groups = groups.concat(GeneralGroup)
        }
        // ensure that own group is included
        if (! groups.includes(this.state.user.group)) {
            if (this.state.user.group != NoneGroup) {
                groups = groups.concat(this.state.user.group)
            }
        }
        var user = this.state.user
        user.accessibleGroups = groups
        this.updateUser(user)
    }
     
    private selectAccessibleGroups() {
        this.modalMultipleSelection.current.show("Select Groups", "Select Accessible Groups", this.state.allGroups, result => this.setAccessibleGroups(result), ()=>{}, this.state.user.accessibleGroups)
    }

    private changeUserName() {
        this.modalEditText.current.show("User Name", "Provide User Name", "UserName", this.state.user.name, n=>true,result => this.setUserName(result), ()=>null)
    }

    private deleteUser() {
        // confirm
        this.confirmDialog.current.show(
            "Confirm deletion",
            `Delete user ${this.state.user.name}. Are you sure?`,
            () => {
                UserController.deleteAccount(this.state.user.email, "admin")
                .then(() => historyPush(ADMIN_USER_EDIT_PATH)
                )                        
                .catch (error => this.notification.current.showError("Delete", error.toString()))
            }
        )
    }

    private updateUser(user: IExternalPasswordUser) {
        this.setState({user})
        UserController.updateUser(user)
        .then(() => this.notification.current.showSuccess("Completed", "Updated User"))
        .catch (error => this.notification.current.showError("Delete", error.toString()))
    }

    private toggleUserAdmin() {
        var user = this.state.user
        user.isAdmin = ! user.isAdmin
        this.updateUser(user)
    }

    private setUserName(n: string) {
        var user = this.state.user
        user.name = n
        this.updateUser(user)
    }

    render() {
        if (! isAdmin(this.props)) {
            return (
                <Container fluid>
                </Container>
            )
        }

        if (this.state.user==null) {
            return (
                <Container fluid>
                    <Spinner animation="border" variant="primary" /><p>Getting user data... please wait.</p>
                </Container>
            )
        }

        return (
            <Container fluid>
                <h1>Editing data for User: {this.state.user.name} </h1>
                <Table striped bordered hover size="sm">
                    <tbody>
                        <tr><td>Name</td><td>{this.state.user.name}</td></tr>
                        <tr><td>E-mail</td><td>{this.state.user.email}</td></tr>
                        <tr><td>ID</td><td>{this.state.user.id}</td></tr>
                        <tr><td>Administrator</td><td>{this.state.user.isAdmin?"Yes":"No"}</td></tr>
                        <tr><td>Signed up</td><td>{dateAndTimeString(this.state.user.createdAt)}</td></tr>
                        <tr><td>Group</td><td>{this.state.user.group}</td></tr>
                        <tr><td>Access to groups</td><td>{this.listOfGroups(this.state.user.accessibleGroups)}</td></tr>
                    </tbody>
                </Table>
                <Button onClick={()=>this.deleteUser()}>Delete User</Button>{' '}
                <Button onClick={()=>this.toggleUserAdmin()}>Make Admin User</Button>{' '}
                <Button onClick={()=>this.selectAccessibleGroups()}>Change accessible groups</Button>{' '}
                <Button onClick={()=>this.changeUserName()}>Change Visible name</Button>
                <MultipleSelectionModal ref={this.modalMultipleSelection}></MultipleSelectionModal>
                <EditTextModal placeholder={"User Name"} ref={this.modalEditText}></EditTextModal>
                <Confirm ref={this.confirmDialog}></Confirm>
                <Notification ref={this.notification}/>
            </Container>
        )
    }
}

