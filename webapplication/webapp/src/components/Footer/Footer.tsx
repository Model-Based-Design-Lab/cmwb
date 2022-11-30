import React from "react"
import { BASE_PATH } from "../../config/config"

// properties for the component
interface Props {
}

interface State {
}

export class Footer extends React.Component<Props,State> {
    
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="cmwb footer">
                <div className="cmwb hrule"/>
                <div className="cmwb foottext">
                    Computational Modeling Workbench
                </div>
                <span className="cmwb align-right">
                    <a href="https://computationalmodeling.info/wp/model-based-design-lab/"><img height="38px" src={`${BASE_PATH}/img/mbdlogo.png`}></img></a>
                    <a href="https://www.tue.nl/en/research/research-groups/electronic-systems/"><img height="38px" src={`${BASE_PATH}/img/logo-es.png`}></img></a>
                </span>
            </div>
        )
    }
}

