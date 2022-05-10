import React from "react"
import { Button, Container } from "react-bootstrap"

// properties for the component
interface Props {
}

interface State {
    text: string
}

const InitialText = "Analysis Output"

export class AnalysisConsole extends React.Component<Props,State> {
    
    constructor(props: any) {
        super(props)
        this.state = {text: InitialText}
    }

    public append(text: string) {
        this.setState({text: (this.state.text.concat(`\n${text}\n`))})
    }

    public clear() {
        this.setState({text: InitialText})
    }

    render() {
        return (
            <Container fluid className="AnalysisConsole">
            <pre className="AnalysisConsoleText" style={{maxHeight: "400px"}}>
                {this.state.text}
            </pre>
            <Button onClick={()=>this.clear()}>Clear</Button>
            </Container>
        )
    }
}

