import * as React from 'react'
import { Container } from 'react-bootstrap'

class SignUp extends React.Component {

    private user: any

    constructor(props: any) {
        super(props)
        this.user = props.user
    }

    render() {
        return (
            <Container fluid>
                <h1>Email Verification</h1>
                <p>Dear {this.user.name},</p>
                <p>an email has been sent to: {this.user.email}.</p>
                <p>The email contains a link to verify your access to the supplied email address.</p>
                <p>Please go to the email and click on the link.</p>
            </Container>
        )
    }

}

export default SignUp