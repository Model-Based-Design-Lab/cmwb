import * as React from 'react'
import { Button, Container, Form, Spinner } from 'react-bootstrap'
import { UserController } from '../../controller/usercontroller'

interface Props {
    userId: string
    verificationToken: string
}

interface State {
    verifying: boolean
    verificationResult: boolean
    passwordSet: boolean
    password1: string
    password2: string
}

class Verify extends React.Component<Props, State> {

    private userId: string
    private verificationToken: string
    private name: string

    constructor(props: any) {
        super(props)
        this.userId = props.userId
        this.verificationToken = props.verificationToken
        this.state={
            verifying: true,
            verificationResult: false,
            passwordSet: false,
            password1: "",
            password2: ""
        }
    }
    
    static getInitialProps({query}: any) {
        return {
            userId: query.userId,
            verificationToken: query.token
        }
    }

    componentDidMount() {
        UserController.verifyEmail(this.userId, this.verificationToken)
        .then( name => {
            this.name = name
            this.setState({verifying: false, verificationResult: true})
        })
        .catch(_error => {
            this.setState({verifying: false, verificationResult: false})
        })
    }

    private setPassword(){
        UserController.setPassword(this.userId, this.verificationToken, this.state.password1)
        .then(()=>{
            this.setState({passwordSet: true})
        })
        .catch(_error=>{
            window.alert("password set failed")
        })
    }

    private validatePasswords(){
        if (this.state.password1.length == 0 || 
            this.state.password2.length == 0 || 
            this.state.password1 != this.state.password2
            )
            {
                return false
            }
        return true
    }

// - check if token is correct for user and no more than 24h after sign uptime.
// - ask for password in duplicate
// - verify if they are the same
// - on submit make user final and go to login page

    render() {
        if (this.state.passwordSet) {
            return (
                <Container fluid>
                    <h1>Password Set</h1>
                    <p>Dear {this.name},</p>
                    <p>You have successfully set your password. You can now proceed to login.</p>
                </Container>
            )
        }
        if (this.state.verifying) {
            return (
                <Container fluid>
                    <Spinner animation="border" variant="primary" />Verifying user... please wait.
                </Container>)
        }
        if (this.state.verificationResult) {
            var passwordsValid = this.validatePasswords()
            var validation = <></>
            if (!passwordsValid) {
                validation = <p>Passwords must not be empty and must be the same.</p>
            }
            return (
                <Container fluid>
                    <h1>Email Verification Successful</h1>
                    <p>Welcome back {this.name}</p>
                    <Form>
                            <Form.Text>Please enter your password in the fields below.</Form.Text>
                            <Form.Group controlId="formPassword1">
                                <Form.Label>Enter Password</Form.Label>
                                <Form.Control name="password1" type="password" placeholder="Enter Password" onChange={e => this.setState({ password1: e.target.value })}/>
                            </Form.Group>
                            <Form.Group controlId="formPassword1">
                                <Form.Label>Enter Password again</Form.Label>
                                <Form.Control name="password2" type="password" placeholder="Retype Password"  onChange={e => this.setState({ password2: e.target.value })}/>
                            </Form.Group>
                            {validation}
                            <Button variant="primary" disabled={! passwordsValid} onClick={()=>{this.setPassword()}}>
                                Set Password
                        </Button>
                    </Form>
                </Container>
            )    
        }
        return (
            <Container fluid>
                <h1>Email Verification Failed :(</h1>
                <p>Unfortunately the email verification failed. Perhaps the verification token  has expired. Please try to sign up again.</p>
            </Container>
        )
    }

}

export default Verify