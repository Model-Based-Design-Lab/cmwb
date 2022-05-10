import * as React from 'react'
import { Button, Form } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Notification from '../../../components/Notification/Notification'
import WelcomeMessage from '../../../components/Welcome/Welcome'
import { UserController } from '../../../controller/usercontroller'
import { historyPush } from '../../../utils/routing'

interface Props {
    userId: string
}

interface State {
    oldPassword: string
    newPassword1: string
    newPassword2: string
}

class ChangePassword extends React.Component<Props, State> {

    private user: any
    private notification: React.RefObject<Notification>

    constructor(props: any) {
        super(props)
        this.user = props.user
        this.state = {oldPassword: '', newPassword1: '', newPassword2: ''}
        this.notification = React.createRef()
    }

    private doChangePassword() {
        UserController.changePassword(this.user.id, this.state.oldPassword, this.state.newPassword1)
        .then(() => {
            this.notification.current.showSuccess("Success", 'The password has been changed.')
        })
        .catch(error => {
            this.notification.current.showError("Error", `Failed to change password: ${error}`)
        })
    }

    private validatePasswords(){
        if (this.state.newPassword1.length == 0 || 
            this.state.newPassword2.length == 0 || 
            this.state.newPassword1 != this.state.newPassword2
            )
            {
                return false
            }
        return true
    }

    private doCancel() {
        historyPush('../profile')
    }


    public render() {
        var passwordsValid = this.validatePasswords()
        var validation = <></>
        if (!passwordsValid) {
            validation = <p>Passwords must not be empty and must be the same.</p>
        }
        return (
        <Container fluid>
            <Notification ref={this.notification} />
            <h1>Change Password</h1>
            <WelcomeMessage user={this.user}/>
            <Form>
                <Form.Group controlId="formCurrentPassword">
                    <Form.Label>Enter Current Password</Form.Label>
                    <Form.Control name="currentPassword" type="password" placeholder="Enter Current Password" onChange={e => this.setState({ oldPassword: e.target.value })}/>
                </Form.Group>
                <Form.Text>Please enter your new password in the fields below.</Form.Text>
                <Form.Group controlId="formPassword1">
                    <Form.Label>Enter New Password</Form.Label>
                    <Form.Control name="password1" type="password" placeholder="Enter Password" onChange={e => this.setState({ newPassword1: e.target.value })}/>
                </Form.Group>
                <Form.Group controlId="formPassword2">
                    <Form.Label>Enter New Password again</Form.Label>
                    <Form.Control name="password2" type="password" placeholder="Retype New Password"  onChange={e => this.setState({ newPassword2: e.target.value })}/>
                </Form.Group>
                {validation}
                <Button variant="primary" disabled={! passwordsValid} onClick={()=>{this.doChangePassword()}}>
                    Set Password
                </Button>{' '}
                <Button variant="primary" onClick={()=>{this.doCancel()}}>
                    Cancel
                </Button>
            </Form>
        </Container>
        )
    }

}

export default ChangePassword
