import React from "react"
import { Button, Container } from "react-bootstrap"
import { ModelsController } from "../../controller/modelscontroller"

// properties for the component
interface Props {
    modelId: string
}

interface State {
}

export class Graph extends React.Component<Props,State> {
    
    constructor(props: any) {
        super(props)
        this.state = {}
        this.scriptsRemaining = 0
    }

    private scriptsRemaining: number
    private dotGraph: string

    public componentDidMount () {
        ModelsController.getDotGraph(this.props.modelId)
        .then(dotGraph => this.setGraph(dotGraph))

        this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js")
        this.loadScript("https://visjs.github.io/vis-network/standalone/umd/vis-network.min.js")
    }

    private loadScript(src: string) {
        this.scriptsRemaining += 1
        const script = document.createElement("script")
        script.src = src
        script.async = true;
        script.onload = () => { 
            this.scriptsRemaining -= 1
        }
        document.body.appendChild(script)
    }

    private setGraph(dotGraph: string) {
        // some required manipulations...
        dotGraph = dotGraph.replace(/\\n/g, '\n');
        dotGraph = dotGraph.replace(/peripheries\s\=\s2/g, 'color=green');
        dotGraph = dotGraph.replace(/\&epsilon\;/g, '#');
        dotGraph = decodeURIComponent(dotGraph.replace(/xlabel/g,'label'))
        this.dotGraph = dotGraph

        // load the graph
        this.loadGraph()

    }
    
    private loadGraph() {
        // make sure that the scripts are done loading
        if (this.scriptsRemaining > 0) {
            setTimeout(()=>{this.loadGraph()}, 500)
        }else {
            this.doLoadGraph()
        }

    }

    private doLoadGraph() {

        // create a network
        var container = document.getElementById('network');
        var options = {
            physics: {
                stabilization: false,
                barnesHut: {
                    springLength: 200
                }
            }
        };
        
        // use eval to avoid a compile time error on vis, which is dynamically loaded.
        var network = eval("new vis.Network(container, data, options)");
        
        // Provide a string with data in DOT language
        var parser = eval("vis.parseDOTNetwork")
        const data = parser(this.dotGraph)
        network.setData(data);
    }

    render() {

        return (
            <Container className="Graph">
                <div id="network" style={{width: "80vw", height: "80vh"}}></div>
            </Container>
        )
    }
}

