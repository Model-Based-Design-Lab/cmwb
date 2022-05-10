import * as React from 'react'
import { Button, ProgressBar, Spinner } from 'react-bootstrap'

interface Props {
    message: string,
    timeout: number,
}

interface State {
    visible: boolean,
    timeRemaining: number
}

export class ProgressNote extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.state = { visible: false, timeRemaining: props.timeout }
        this.timer = null
        this.timeoutCallback = null
        this.cancelCallback = null
    }

    private timer: NodeJS.Timeout
    private timeoutCallback: ()=>void
    private cancelCallback: ()=>void

    public show(onCancel?: ()=>void, onTimeout?: ()=>void) {
        this.cancelCallback = onCancel
        this.timeoutCallback = onTimeout
        this.timer = setTimeout(()=>this.timerTick(), 1000)
        this.setState({timeRemaining: this.props.timeout, visible: true})
    }

    public stop() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.setState({visible: false})
    }

    private timerTick() {
        if (this.state.timeRemaining == 0) {
            this.doTimeout()
        } else {
            this.timer = setTimeout(()=>this.timerTick(), 1000)
            this.setState({timeRemaining: this.state.timeRemaining - 1})
        }
    }

    private doTimeout() {
        if (this.timeoutCallback) {
            this.timeoutCallback()
        }
        this.clearCallbacks()
        this.setState({visible: false})
    }

    private doCancel() {
        if (this.cancelCallback) {
            this.cancelCallback()
        }
        this.clearCallbacks()
        this.setState({visible: false})
    }

    private clearCallbacks(){
        this.cancelCallback = null
        this.timeoutCallback = null
    }

    public componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    

    render() {
        if (! this.state.visible) return <div></div>
        return (
            <div className="ProgressNote">
                <p>{this.props.message}</p>
                <Spinner animation="border" variant="primary"></Spinner>
                <p>Remaining time until timeout.</p> 
                <ProgressBar animated now={100 * this.state.timeRemaining / this.props.timeout} label={`${this.state.timeRemaining} seconds`}></ProgressBar>
                {
                    this.cancelCallback && (
                        <Button variant="primary" onClick={()=>this.doCancel()}>Cancel</Button>
                    )
                }
            </div>
        )
    }
}


