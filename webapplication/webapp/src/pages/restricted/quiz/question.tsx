import * as React from 'react'
import { Spinner } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import MarkdownQuizQuestion from '../../../components/Markdown/MarkdownQuizQuestion'
import { QuizController } from '../../../controller/quizcontroller'

interface Props {
    quiz: any
}

interface State {
    loading: boolean
}


class Question extends React.Component<Props, State> {


    constructor(props: any) {
        super(props)
        this.state = {loading: !this.props.quiz.initialized}
        if (this.props.quiz.initialized) {
            this.exercise = this.props.quiz.exercise
        }
    }

    private exercise: any

    public componentDidMount(){
        if (this.props.quiz) {
            if (! this.props.quiz.initialized) {
                QuizController.initializeExercise(this.props.quiz.exerciseName)
                .then(ex => {
                    this.exercise = ex
                    this.setState({loading: false})
                })
            }
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <Container fluid>
                    <Spinner animation="border" variant="primary" />Initializing Exercise... please wait.
                </Container>)
        }

        return (
            <Container fluid>
                <h1>Computational Modeling Workbench, Canvas Quiz</h1>
                <MarkdownQuizQuestion source={`${this.exercise.name}/${this.exercise.description}`}/>
            </Container>
        )
    }

}

export default Question

