import React from "react"
import { Alert, Button } from "react-bootstrap"


interface Props {
}

interface State {
    show: boolean,
    header: string,
    text: string
    variant: string
}

export default class Notification extends React.Component<Props, State> {

    private timeout: NodeJS.Timeout

    constructor(props: any) {
        super(props)
        this.state = { show: false, header: "", text: "", variant: ""}
    }

    public showSuccess(header: string, text: string) {
        this.setState({ show: true, header: header, text: text, variant: "success"})
        this.timeout = setTimeout(()=>this.handleCloseOK(), 5000)
    }

    public showError(header: string, text: string) {
        this.setState({ show: true, header: header, text: text, variant: "danger"})
        this.timeout = setTimeout(()=>this.handleCloseOK(), 5000)
    }

    public showInfo(header: string, text: string) {
        this.setState({ show: true, header: header, text: text, variant: "info" })
        this.timeout = setTimeout(()=>this.handleCloseOK(), 5000)
    }

    private setShow(value: boolean) {
        this.setState({ show: value })
    }

    private handleCloseOK() {
        clearTimeout(this.timeout)
        this.setShow(false)
    }

    render() {
        return (
            <>
                <Alert show={this.state.show} variant={this.state.variant}>
                    <Alert.Heading>{this.state.header}</Alert.Heading>
                    <p>
                        {this.state.text}
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => this.handleCloseOK()} variant={`outline-${this.state.variant}`}>
                            OK
                </Button>
                    </div>
                </Alert>
            </>
        )
    }
}
