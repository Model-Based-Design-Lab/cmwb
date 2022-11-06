import * as React from 'react'
import Notification from '../components/Notification/Notification'
import { Button, Container, Form, Tab, Tabs } from 'react-bootstrap'
import { historyPush } from '../utils/routing'

interface Props {
    localMode: boolean
}

interface State {
    email: string
    name: string
}


class Login extends React.Component<Props, State> {

    private notification: React.RefObject<Notification>
    private flashMessage: string = ""

    // check if there is a failure message from a previous login attempt
    static async getInitialProps(context: any) {
        let iProps: any = {}
        if (context.req) {
            const flash = context.req.flash()
            if (flash.message) iProps.flashMessage = flash.message
        }
        return iProps
    }

    constructor(props: any) {
        super(props)
        this.state = {email: "", name: ""}
        this.notification = React.createRef()
        if (props.flashMessage) {
            this.flashMessage = props.flashMessage
        }
    }

    // flash the pending error message
    componentDidMount() {
        if (this.flashMessage != "") {
            this.notification.current.showError("Error", this.flashMessage)
        }
    }

    private resetPassword() {
        historyPush('authentication/resetpassword',{ email: this.state.email })
    }


    render() {
        if (this.props.localMode) {
            return this.localRender()
        }
        return (
            <Container fluid>
                <Notification ref={this.notification} />
                <Tabs style={{width: "100%"}} defaultActiveKey="login" id="uncontrolled-tab-example">
                    <Tab eventKey="login" title="Sign In">
                        <Form method="post">
                            <Form.Text>Provide your email and password to login. You can register by switching to the sign up tab, or login as a guest on the Guest Login tab. If you forgot your password, click on the 'forgot password' link below to reset your password.</Form.Text>
                            <Form.Group controlId="formSignInEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control name="email" type="email" placeholder="Enter email" autoComplete='email' onChange={e => this.setState({ email: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formSignInPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" type="password" autoComplete='current-password' placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                        <p>Forgot password? Fill in the email address and use the button below to send a reset link to this address.</p>
                        <Button onClick={()=>this.resetPassword()}>Reset Password</Button>
                    </Tab>
                    <Tab eventKey="signup" title="Sign Up">
                        <Form.Text>Use this form to sign up to the Computational Modeling Workbench website.</Form.Text>
                        <Form method="post" action="signup">
                            <Form.Group controlId="formSignUpEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control name="email" type="email" autoComplete='email' placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group controlId="formSignUpName">
                                <Form.Label>Your Name</Form.Label>
                                <Form.Control name="name" autoComplete='name' placeholder="Name" />
                            </Form.Group>
                            <Form.Group controlId="formSignUpAccessCode">
                                <Form.Label>Workbench Access Code</Form.Label>
                                <Form.Control name="accesscode" placeholder="Access Code" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Sign Up
                            </Button>
                        </Form>
                    </Tab>
                    <Tab eventKey="guestlogin" title="Guest Login">
                        <Form.Text>Login as a guest to the Computational Modeling Workbench website by clicking on the button below.</Form.Text>
                        <Form method="post" action="guestlogin">
                            <Form.Control name="email" type="hidden" value="none" />
                            <Form.Control name="password" type="hidden" value="none" />
                            <Button variant="primary" type="submit">
                                Enter as a guest
                            </Button>
                        </Form>
                    </Tab>
                </Tabs >
            </Container>
        )
    }

    localRender() {
        return (
            <Container fluid>
                <Notification ref={this.notification} />
                <Form method="post">
                    <Form.Text>Provide your username and displayed name to login.</Form.Text>
                    <Form.Group controlId="formSignInEmail">
                        <Form.Label>User name</Form.Label>
                        <Form.Control name="email" type="email" placeholder="Enter username" onChange={e => this.setState({ email: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="formSignInEmail">
                        <Form.Label>Enter your name</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Enter your name" onChange={e => this.setState({ name: e.target.value })} />
                    </Form.Group>
                    <Form.Control name="password" type="hidden" defaultValue="default" />
                    <Form.Control name="isLocal" type="hidden" defaultValue="true" />
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        )

    }


}

export default Login
