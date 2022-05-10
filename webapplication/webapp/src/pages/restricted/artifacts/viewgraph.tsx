import React, { Component } from 'react'
import { Graph } from '../../../components/Graph/Graph'

class ViewGraph extends Component {

    constructor(props: any) {
        super(props)
        this.modelId = props.query.modelId
    }

    private modelId: string

    static getInitialProps({ query }: { query: any }) {
        return { query }
    }

    render() {
        return (
            <Graph modelId={this.modelId}></Graph>
        )
    }
}

export default ViewGraph