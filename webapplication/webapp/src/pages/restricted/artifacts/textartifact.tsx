import * as React from 'react'
import { Container, Spinner } from 'react-bootstrap'
import { ModelsController } from '../../../controller/modelscontroller'

interface Props {
}

interface State {
    loading: boolean,
    artifactName: string
    artifactText: string
}

class TextArtifact extends React.Component<Props, State> {

    private artifactPath: string

    constructor(props: any) {
        super(props)
        this.state = {loading: true, artifactName: props.query.artifactName, artifactText: ""}
        this.artifactPath = props.query.artifactPath
        this.getArtifact()
        .then( (artifactText: string) => {
            this.setState({loading: false, artifactText: artifactText})
        })
    }

    private async getArtifact() {
        return await ModelsController.getArtifact(this.artifactPath)
    }

    static getInitialProps({ query } : {query: any}) {
        return { query }
    }

    render() {
        if(this.state.loading){
            return(
                <Container fluid>
                    <Spinner animation="border" variant="primary" />Getting artifact {this.state.artifactName}... please wait.
                </Container> 
            )
        }
        return (
            <Container fluid>
                <h1>Artifact {this.state.artifactName}</h1>
                <pre style={{color: "white"}}>
                    {this.state.artifactText}
                </pre>
            </Container>
        )
    }

}

export default TextArtifact
