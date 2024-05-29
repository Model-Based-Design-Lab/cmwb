import * as React from 'react'
import { Table } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { isAdmin, isGuest } from '../../authentication/utils'
import IconButton, { adminIcon, deleteIcon, editIcon, logoutIcon, passwordIcon } from '../../components/Buttons/IconButton'
import Notification from '../../components/Notification/Notification'
import WelcomeMessage from '../../components/Welcome/Welcome'
import { IExternalPasswordUser } from '../../database/passwdbinterface'
import { historyPush } from '../../utils/routing'
import { dateAndTimeString } from '../../utils/utils'
import { UserController } from '../../controller/usercontroller'
import { EditTextModal } from '../../components/Modal/EditTextModal'
import { EditText } from '../../components/Controls/EditText'

interface Props {
    localMode: boolean
}

interface State {
    user: IExternalPasswordUser
    accessCode: string
    localSignupDate: string

}

export default class Profile extends React.Component<Props,State> {

    constructor(props: any) {
        super(props)
        this.state = {user: props.user, accessCode: "", localSignupDate: ""}
        this.notification = React.createRef()
        this.modalEditText = React.createRef()
    }

    private notification: React.RefObject<Notification>
    private modalEditText: React.RefObject<EditTextModal>

    private changePassword() {
        historyPush('./profile/changepassword')
    }
    
    private changeName() {
        this.modalEditText.current.show("User Name", "Provide User Name", "UserName", this.state.user.name, n=>true,result => this.setUserName(result), ()=>null)
    }

    private setUserName(n: string) {
        var user = this.state.user
        user.name = n
        this.updateUser(user)
    }

    private updateUser(user: IExternalPasswordUser) {
        this.setState({user})
        UserController.updateUser(user)
        .then(() => this.notification.current.showSuccess("Completed", "Updated User"))
        .catch (error => this.notification.current.showError("Delete", error.toString()))
    }

    private registerAccessCode() {
        UserController.registerAccessCode(this.state.accessCode)
        .then((newAccessibleGroups: string[]) => {
            this.notification.current.showSuccess("Completed", "Registered Access Code")
            this.state.user.accessibleGroups = newAccessibleGroups
            this.setState({user: this.state.user})
        })
        .catch (error => this.notification.current.showError("Register Access Code", error.toString()))
    }

    private deleteAccount() {
        historyPush('./profile/deleteaccount')
    }
    
    private logout() {
        historyPush('./logout')
    }
    
    private adminPage() {
        historyPush('./profile/admin')
    } 
    
    private listOfGroups(l: string[]) {
        if (l !== undefined) {
            return l.join(", ")
        } else {
            return ""
        }
    }
    
    public componentDidMount(): void {
        this.setState({localSignupDate: dateAndTimeString(this.state.user.createdAt)})
    }

    render() {
        if (this.props.localMode) {
            return this.localRender()
        }
        return (
            <Container fluid>
                <h1>Profile</h1>
                <WelcomeMessage user={this.state.user}/>
                {(!isGuest(this.props)) && <div>
                    <h2>Your Data</h2>
                    <Table striped bordered hover size="sm">
                        <tbody>
                            <tr><td>Name</td><td>{this.state.user.name}</td></tr>
                            <tr><td>E-mail</td><td>{this.state.user.email}</td></tr>
                            <tr><td>Signed up</td><td>{this.state.localSignupDate}</td></tr>
                            <tr><td>Group</td><td>{this.state.user.group}</td></tr>
                            <tr><td>Access to groups</td><td>{this.listOfGroups(this.state.user.accessibleGroups)}</td></tr>
                        </tbody>
                    </Table>
                <EditText question={"To gain access to another group, enter and submit access code"} placeholder={'access code'} validate={c=>c.length>0} onChange={c=>this.setState({accessCode: c})}></EditText>
                <p>Select one of the following.</p>
                <IconButton icon={logoutIcon} label='Log Out' onClick={()=>this.logout()}/>{' '}
                <IconButton icon={passwordIcon} label='Change Password' onClick={()=>this.changePassword()}/>{' '}
                <IconButton icon={editIcon} label='Change Name' onClick={()=>this.changeName()}/>{' '}
                <IconButton icon={deleteIcon} label='Delete Account' onClick={()=>this.deleteAccount()}/>{' '}
                <IconButton icon={passwordIcon} label='Register access code' onClick={()=>this.registerAccessCode()}/>{' '}
                {isAdmin(this.props) && <IconButton icon={adminIcon} label='Administrator Page' onClick={()=>this.adminPage()}/>}
                </div>}
                { isGuest(this.props) && <IconButton icon={logoutIcon} label='Log Out' onClick={()=>this.logout()}/>}
                <EditTextModal placeholder={"User Name"} ref={this.modalEditText}></EditTextModal>
                <Notification ref={this.notification}/>
    
            </Container>
        )
    }

    localRender() {
        return (
            <Container fluid>
                <h1>Profile</h1>
                <WelcomeMessage user={this.state.user}/>
                {(!isGuest(this.props)) && <div>
                    <h2>Your Data</h2>
                    <Table striped bordered hover size="sm">
                        <tbody>
                            <tr><td>Name</td><td>{this.state.user.name}</td></tr>
                            <tr><td>E-mail</td><td>{this.state.user.email}</td></tr>
                            <tr><td>Signed up</td><td>{dateAndTimeString(this.state.user.createdAt)}</td></tr>
                            <tr><td>Group</td><td>{this.state.user.group}</td></tr>
                            <tr><td>Access to groups</td><td>{this.listOfGroups(this.state.user.accessibleGroups)}</td></tr>
                        </tbody>
                    </Table>
                <p>Select one of the following.</p>
                <IconButton icon={logoutIcon} label='Log Out' onClick={()=>this.logout()}/>{' '}
                <IconButton icon={editIcon} label='Change Name' onClick={()=>this.changeName()}/>{' '}
                </div>}
                { isGuest(this.props) && <IconButton icon={logoutIcon} label='Log Out' onClick={()=>this.logout()}/>}
                <EditTextModal placeholder={"User Name"} ref={this.modalEditText}></EditTextModal>
                <Notification ref={this.notification}/>
    
            </Container>
        )
    }

}




