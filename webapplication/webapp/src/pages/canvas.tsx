import * as React from 'react'
import Container from 'react-bootstrap/Container'
import { isLoggedIn } from '../authentication/utils'
import { CANVAS_ORIGIN } from '../config/config'

// landing page for the LMS SCORM connection
// signal back via postMessage that we are initialized
// collect the exercise to perform from the query data
// store information in the session
// initialize the exercise if the user is logged in or 
// ask the user to login and initialize then


interface Props {
    quiz: any
}

interface State {
}


class Canvas extends React.Component<Props, State> {


    static async getInitialProps(context: any) {
        let iProps: any = {}
        context.req.session.quiz = {active: true, exerciseName: context.query.exercise, initialized: false}
        iProps.quiz = context.req.session.quiz
        return iProps
    }

    private windowOpener: any

    constructor(props: any) {
        super(props)
    }

    public componentDidMount () {
        this.listenToCanvas()
        if (this.windowOpener) {
            this.windowOpener.postMessage({initialized: true}, origin)
        } else {
            console.warn("No connection to LMS window")
        }
        this.initExerciseIfLoggedIn()
    }


    private initExerciseIfLoggedIn() {
        if (isLoggedIn(this.props)) {
            // console.log("Logged in!")
        } else {
            // console.log("Not logged in!")
        }
    }

    private listenToCanvas() {
        // what kind of messages do we expect from canvas?
        this.windowOpener = window.opener
        var origin = "*"
        window.addEventListener("message", (event) => {
            if (! event.origin.endsWith(CANVAS_ORIGIN)) return;
            origin = event.origin
            window.alert(event.data)
        }, false
        )
    }

    render() {
        return (
            <Container fluid>
                <h1>Computational Modeling Workbench, Canvas Quiz</h1>
                <p>Welcome to the Computational Modeling Workbench Canvas Quiz!</p>
                <p>Please go to the page 'Quiz Question' to read the details of the exercise.</p>
                <p>If you are not logged in yet, you first need to log in.</p>
            </Container>
        )
    }

}

export default Canvas
