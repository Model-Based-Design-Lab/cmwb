import React from "react"
import { Container } from "react-bootstrap"
import { ModelsController } from "../../controller/modelscontroller"
import { stripSvg } from "../../utils/utils"
import { SVGViewer } from "../Modal/SVGViewer"

// properties for the component
interface Props {
}

interface State {
    modelId: string
    loading: boolean
    failed: boolean
    imageSvg: string
    fullImageSvg: string
}

type TStateColorMap = Map<string,string>

const ColorPalette: string[] = [
    "#FBB4AE",
    "#B3CDE3",
    "#CCEBC5",
    "#DECBE4",
    "#FED9A6",
    "#FFFFCC",
    "#f0f0f0", "#c5d5c5", "#9fa9a3", "#e3e0cc", "#eaece5", "#b2c2bf", "#c0ded9", "#3b3a30", "#e4d1d1", "#b9b0b0", "#d9ecd0", "#77a8a8", "#f0efef", "#ddeedd", "#c2d4dd", "#b0aac0", "#c8c3cc", "#563f46", "#8ca3a3", "#484f4f", "#e0e2e4", "#c6bcb6", "#96897f", "#625750", "#7e4a35", "#cab577", "#dbceb0", "#838060", "#bbab9b", "#8b6f47", "#d4ac6e", "#4f3222", "#686256", "#c1502e", "#587e76", "#a96e5b", "#454140", "#bd5734", "#a79e84", "#7a3b2e", "#bccad6", "#8d9db6", "#667292", "#f1e3dd", "#cfe0e8", "#b7d7e8", "#87bdd8", "#daebe8", "#fbefcc", "#f9ccac", "#f4a688", "#e0876a", "#fff2df", "#d9ad7c", "#a2836e", "#674d3c", "#f9d5e5", "#eeac99", "#e06377", "#c83349", "#5b9aa0", "#d6d4e0", "#b8a9c9", "#622569", "#96ceb4", "#ffeead", "#ffcc5c", "#ff6f69", "#588c7e", "#f2e394", "#f2ae72", "#d96459"
]

class PreviewAnimation {

    constructor(svgNode: SVGSVGElement) {
        const graphNode = svgNode.getElementsByTagName("g")[0]
        const states = graphNode.getElementsByClassName("node")
        this.makeSvgStateMap(states)
    }

    public setColor(nodeName: string, color: string) {
        var node = (this.nodeMap.get(nodeName).getElementsByTagName("ellipse"))[0]
        const oldColor = node.getAttribute("fill")
        node.setAttribute("fill", color)
        return oldColor
    }

    public getColor(nodeName: string) {
        var node = (this.nodeMap.get(nodeName).getElementsByTagName("ellipse"))[0]
        return node.getAttribute("fill")
    }

    private async delay(ms: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(()=>resolve(), ms))
    }

    public async setStateSequence(states: string[]) {
        var oldColor: string
        for (var i = 0; i < states.length; i++) {
            oldColor = this.setColor(states[i], "black")
            await this.delay(100)
            this.setColor(states[i], "yellow")
            await this.delay(500)
            this.setColor(states[i], oldColor)
        }

    }

    public async setSetOfStates(states: string[]) {
        return this.setPartitioning([states])
    }

    public async setPartitioning(partitioning: string[][]) {
        const oldColors = this.getCurrentColorMap()
        const partitioningColors = this.makePartitioningColorMap(partitioning)

        for (var i = 0; i < 8; i++) {
            this.setColorsTo(partitioningColors)
            await this.delay(1000)
            this.setColorsTo(oldColors)
            await this.delay(500)
        }

    }

    private nodeMap: Map<string, Element>

    private getCurrentColorMap(): TStateColorMap {
        var result = new Map<string,string>()
        this.nodeMap.forEach((_node, stateName) => result.set(stateName, this.getColor(stateName)))
        return result
    }

    private setColorsTo(colorMap: TStateColorMap) {
        colorMap.forEach((color, state) => this.setColor(state, color))
    }


    private makePartitioningColorMap(partitioning: string[][]): TStateColorMap {
        var result = new Map<string,string>()
        var i = 0
        partitioning.forEach(part => {
            part.forEach(s => result.set(s, ColorPalette[i]))
            i += 1
        })
        return result
    }

    private makeSvgStateMap(states: HTMLCollectionOf<Element>) {
        this.nodeMap = new Map()
        for (var i=0; i < states.length; i++) {
            const text = (states[i].getElementsByTagName("title")[0]).innerHTML
            const name = (text.split(/(\s+)/))[0]
            this.nodeMap.set(name, states[i])
        }
    }



}


export class Preview extends React.Component<Props,State> {
    
    constructor(props: any) {
        super(props)
        this.previewNode = React.createRef()
        this.svgViewerRef = React.createRef()
            this.state = {modelId: "", loading: false, failed: false, imageSvg: "", fullImageSvg: ""}
    }

    private previewNode: React.RefObject<HTMLDivElement>
    private svgViewerRef: React.RefObject<SVGViewer>

    public setModel(modelId: string) {
        this.setState({modelId: modelId, loading: true, failed: false})
        this.loadPreview(modelId)
    }

    public setAnimationStateSequence(states: string[]){
        var animator = new PreviewAnimation(this.getSVGNode())
        animator.setStateSequence(states)
    }

    public setAnimationSetOfStates(states: string[]){
        var animator = new PreviewAnimation(this.getSVGNode())
        animator.setSetOfStates(states)
    }

    public setAnimationPartitioning(partitioning: string[][]){
        var animator = new PreviewAnimation(this.getSVGNode())
        animator.setPartitioning(partitioning)
    }


    private async loadPreview(modelId: string){
        try {
            const previewPath = await ModelsController.getPreview(modelId)
            await this.getPreviewImage(previewPath)
            this.setState({modelId: modelId, loading: false, failed: false})
        } catch (error) {
            this.setState({modelId: modelId, loading: false, failed: true})
        }        
    }

    private async getPreviewImage(previewPath: string){
        try {
            const previewImg = await ModelsController.getPreviewImg(previewPath)
            this.setState({fullImageSvg: stripSvg(previewImg, "75vw", "75vh"), imageSvg: stripSvg(previewImg, "100%", "100%")})
        } catch (error) {
            this.setState({loading: false, failed: true})
        }
    }

    private getSVGNode() {
        return this.previewNode.current.getElementsByTagName("svg")[0]
    }


    private click() {
        this.svgViewerRef.current.show("Preview", this.state.fullImageSvg, () => {})
    }

    render() {
        var content: JSX.Element
        if (this.state.modelId == "") {
            content = <p>No model selected.</p>
        } else {
            if (this.state.loading) {
                content = <p>Loading preview...</p>
            } else {
                if (this.state.failed) {
                    content = <p>Failed to make preview...</p>
                } else {
                    content = <div style={{width: "70vw", height: "20vh"}} ref={this.previewNode} id="previewImage" dangerouslySetInnerHTML={{ __html: this.state.imageSvg }}></div>
                }
            }
        }

        return (
            <Container fluid className="Preview" onClick={()=>this.click()}>
                <div style={{ cursor: "pointer" }}>
                <div onClick={e => e.stopPropagation()}>
                <SVGViewer ref={this.svgViewerRef} />
                </div>
                {content}
                </div>
            </Container>
        )
    }
}

