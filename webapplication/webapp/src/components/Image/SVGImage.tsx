import React from "react"
import { Container } from "react-bootstrap"
import { stripSvg } from "../../utils/utils"

// properties for the component
interface Props {
    imageData: string
}

interface State {
    svgData: string
}


export class SVGImage extends React.Component<Props,State> {
    
    constructor(props: any) {
        super(props)

        this.state = {svgData: stripSvg(props.imageData)}
    }

    render() {
        return (
            <Container className="SVGImage">
                <div dangerouslySetInnerHTML={{ __html: this.state.svgData }}></div>
            </Container>
        )
    }
}

