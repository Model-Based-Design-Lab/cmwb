import * as React from 'react'
import { Button, Form } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { Confirm } from '../../../components/Modal/Confirm'
import Notification from '../../../components/Notification/Notification'
import WelcomeMessage from '../../../components/Welcome/Welcome'
import { UserController } from '../../../controller/usercontroller'
import { historyPush } from '../../../utils/routing'

class DeleteAccount extends React.Component {

    private confirmDialog: React.RefObject<Confirm>
    private user: any
    private password: string
    private notification: React.RefObject<Notification>

    constructor(props: any) {
        super(props)
        this.user = props.user
        this.password=''
        this.confirmDialog = React.createRef()
        this.notification = React.createRef()
    }

    private doDeleteAccount() {
        this.confirmDialog.current.show(
                "Confirm deletion of the account",
                `Delete account ${this.user.email}. Are you sure?`,
                () => {
                    UserController.deleteAccount(this.user.email, this.password)
                    .then(() => {
                        this.notification.current.showSuccess("Success", 'The account has been deleted.')
                    })
                    .catch(error => {
                        this.notification.current.showError("Error", `Failed to delete account: ${error}`)
                    })
                }
            )
        }

    private doCancel() {
        historyPush('../profile')
    }
    

    public render() {
        return (
        <Container fluid>
            <Notification ref={this.notification} />
            <h1>Delete Account</h1>
            <WelcomeMessage user={this.user}/>
            <Form >
                <Form.Text>To delete your account with email {this.user.email}, fill in the fields below and click 'Submit'. Note that all models associated with this account will lso be deleted.</Form.Text>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Password" onChange={e => this.password = e.target.value }/>
                </Form.Group>
                <Button variant="primary" onClick={()=>this.doDeleteAccount()}>
                    Submit
                </Button>{' '}
                <Button variant="primary" onClick={()=>{this.doCancel()}}>
                    Cancel
                </Button>
            </Form>
            <Confirm ref={this.confirmDialog}></Confirm>
        </Container>
        )
    }

}

export default DeleteAccount
