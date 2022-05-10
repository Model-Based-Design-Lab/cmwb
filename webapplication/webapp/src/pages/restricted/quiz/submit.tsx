import * as React from 'react'
import { Button, Form } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import IconButton, { cancelIcon, submitIcon } from '../../../components/Buttons/IconButton'
import { BASE_PATH_RESTRICTED } from '../../../config/config'
import { QuizController } from '../../../controller/quizcontroller'
import { historyPush } from '../../../utils/routing'

interface Props {
    quiz: any
}

interface State {
    results: Map<string,boolean>
    submitted: boolean
}


class Canvas extends React.Component<Props, State> {

    constructor(props: any) {
        super(props)
        this.answers = this.props.quiz.exercise.answers
        var results = new Map<string,boolean>()
        for (var i=0; i<this.answers.length; i++) {
            results.set(`${i}`, false)
        }
        this.state = {results: results, submitted: false}
    }

    private answers: any[]

    private setResult(i: number, res: boolean) {
        var results = this.state.results
        results.set(`${i}`, res)
        this.setState({results})
    }

    private determineScore() {
        var count = 0
        var total = 0
        this.state.results.forEach((value: boolean, _key: string) => {
            if (value) count++
            total++
        })
        return Math.round(count / total * 100)
    }

    private submit() {
        const w = window.opener
        if (!w) {
            window.alert("The connection to Canvas is lost.")
            return
        }
        w.postMessage({result: this.determineScore()}, "*")
        this.setState({submitted: true})
        this.cancelExercise()
    }

    private cancelExercise() {
        QuizController.endExercise()
        .then(() => {
            historyPush(BASE_PATH_RESTRICTED)

        })
    }

    private multipleChoiceElement(a: any, i: number) {
        return (

            <Form.Group key={`${i}`} controlId={`${i}`}>
                <Form.Label>{a.question}</Form.Label>
                {a.choices.map((c: string, k: number) => (
                    <Form.Check label={c} name= {`${i}`} type="radio" id={`${k}`} onClick={()=>{this.setResult(i, a.solution == k)}} />
                ))}
            </Form.Group>
        )
    }

    render() {

        if (this.state.submitted) {
            return (
                <Container fluid>
                <h1>Canvas Quiz Answers</h1>
                <p>Your answers have been submitted. You can now return to Canvas.</p>
                </Container>
            )
        }

        var i = 0
        const answers = this.answers.map(a => {
            switch (a.type) {
                case "multipleChoice":
                    return this.multipleChoiceElement(a, i)
                    break;
            
                default:
                    return <p key={i}>Unknown</p>
                    break;
            }
            i++
        })
        return (
            <Container fluid>
                <h1>Canvas Quiz Answers</h1>
                <p>Enter your results on this page and then click on 'Submit' to submit them to Canvas.</p>
                {answers}
                <IconButton label="Submit" icon={submitIcon} onClick={()=>this.submit()}/>{' '}
                <IconButton label="End exercise without submitting" icon={cancelIcon} onClick={()=>this.cancelExercise()}/>
            </Container>
        )
    }

}

export default Canvas
