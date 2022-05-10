import * as React from 'react'
import { Container, Spinner } from 'react-bootstrap'
import IconButton, { downloadIcon } from '../../../components/Buttons/IconButton'
import { SVGImage } from '../../../components/Image/SVGImage'
import { ModelsController } from '../../../controller/modelscontroller'
import { FileExtensionSVG, MimeTypeSVG } from '../../../utils/filetypes'
import { saveToFile } from '../../../utils/utils'

interface Props {
}

interface State {
    loading: boolean,
    artifactName: string,
    artifactContent: string
}

class ImageArtifact extends React.Component<Props, State> {

    private artifactPath: string

    constructor(props: any) {
        super(props)
        this.state = {loading: true, artifactName: props.query.artifactName, artifactContent: ""}
        this.artifactPath = props.query.artifactPath
        this.getArtifact()
        .then( (artifactContent: string) => {
            this.setState({loading: false, artifactContent: artifactContent})
        })
    }

    private async getArtifact() {
        return await ModelsController.getArtifact(this.artifactPath)
    }

    static getInitialProps({ query } : {query: any}) {
        return { query }
    }

    private download() {
        saveToFile(this.state.artifactContent, `${this.state.artifactName}.${FileExtensionSVG}`, MimeTypeSVG)
    }

    render() {
        if(this.state.loading){
            return(
                <Container fluid>
                    <h1>{this.state.artifactName}</h1>
                    <Spinner animation="border" variant="primary" />Getting image data ... please wait.
                </Container> 
            )
        }
        return (
            <Container fluid>
                    <h1>{this.state.artifactName}</h1>
                    <SVGImage imageData={this.state.artifactContent}></SVGImage>
                    <IconButton label="Download Image" icon={downloadIcon} onClick={()=>this.download()}/>
            </Container>
        )
    }

}

export default ImageArtifact
