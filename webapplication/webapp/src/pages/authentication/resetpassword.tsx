import * as React from 'react'
import { Button, Container } from 'react-bootstrap'
import Notification from '../../components/Notification/Notification'
import { UserController } from '../../controller/usercontroller'

interface Props {
    email: string
}

interface State {
}

class ResetPassword extends React.Component<Props, State> {

    private email: string
    private notification: React.RefObject<Notification>

    constructor(props: any) {
        super(props)
        this.email = props.email
        this.notification = React.createRef()
    }
    
    static getInitialProps({query}: any) {
        return {
            email: query.email,
        }
    }

    private sendResetPasswordLink() {
        UserController.sendResetPasswordLink(this.email)            
        .then(() => {
            this.notification.current.showSuccess("Success", 'The email has been sent.')
        })
        .catch(error => {
            this.notification.current.showError("Error", `Failed to reset password: ${error}`)
        })
    }
    
    render() {
        return (
             <Container fluid>
                <Notification ref={this.notification} />
                <h1>Reset Password</h1>
                <p>To reset the password for the user with email address {this.email}, click the button below.</p>
                <p>An email will be sent to that email address with a link to set a new password.</p>
                <Button onClick={()=>this.sendResetPasswordLink()}>Reset Password</Button>
            </Container>
        )
    }

}

export default ResetPassword