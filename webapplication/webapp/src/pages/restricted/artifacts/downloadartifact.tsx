import * as React from 'react'
import { Container } from 'react-bootstrap'
import IconButton, { downloadIcon } from '../../../components/Buttons/IconButton';
import { ModelsController } from '../../../controller/modelscontroller';
import { saveToFile } from '../../../utils/utils';

interface Props {
}

interface State {
    artifactName: string,
    artifactPath: string,
    artifactContent: string,
    mimeType: string,
    fileName: string,
    loading: boolean
}

class DownloadArtifact extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            artifactName: props.query.artifactName,
            artifactPath: props.query.artifactPath,
            artifactContent: "",
            mimeType: props.query.mimeType,
            fileName: props.query.fileName,
            loading: true
        }
        ModelsController.getArtifact(props.query.artifactPath)
        .then(content => {
            this.setState({
                artifactContent: content,
                loading: false
            })
        })
    }

    private download() {
        saveToFile(this.state.artifactContent, this.state.fileName, this.state.mimeType)
    }

    static getInitialProps({ query } : {query: any}) {
        return { query }
    }

    render() {
        if (this.state.loading) {
            return (
                <Container fluid>
                    <h1>{this.state.artifactName}</h1>
                    <p>Loading data. Please wait.</p>
                </Container>
            )    
        }
        return (
            <Container fluid>
                <h1>{this.state.artifactName}</h1>
                <IconButton icon={downloadIcon} label="Download" onClick={()=>this.download()}></IconButton>
            </Container>
        )
    }

}

export default DownloadArtifact
