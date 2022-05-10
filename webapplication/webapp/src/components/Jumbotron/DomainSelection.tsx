import { faCube } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Jumbotron } from "react-bootstrap"
import { darkenColor } from "../../utils/format"

// properties for the component
interface Props {
    module: string
    color: string
    onClick?: ()=>void
}

interface State {
}


export class DomainSelection extends React.Component<Props,State> {
    
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    private clicked() {
        if (this.props.onClick) {
            this.props.onClick()
        }
    }

    render() {
        return (
            <Jumbotron style={{
                backgroundColor: this.props.color,
                textTransform: "capitalize",
                fontSize: "large",
                color: darkenColor(this.props.color),
                cursor: "pointer",
                height: '150px'
              }} onClick={()=>this.clicked()}>
                  <span >
                <FontAwesomeIcon className="w3-xxxlarge center" icon={faCube} color={darkenColor(this.props.color)} />
                {'  '}{this.props.module}
                </span>
            </Jumbotron>
        )
    }
}

