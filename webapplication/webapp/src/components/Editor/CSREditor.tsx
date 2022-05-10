import React from 'react'
import dynamic from 'next/dynamic'
import { IEditorProps } from './Editor'

// make a dynamically loading version that will de rendered client side
// this is needed to prevent running the monaco editor module code server side
// because next js will try to apply server-side rendering
const DynamicComponentWithNoSSR = dynamic(() => import('./Editor'), {
    ssr: false
})

interface State {
}

export class CSREditor extends React.Component<IEditorProps, State> {

    private editor: any

    constructor(props: IEditorProps) {
        super(props)
    }

    public getContent() {
        return this.editor.getContent()
    }

    render() {
        return <DynamicComponentWithNoSSR localMode={this.props.localMode} language={this.props.language} initialContent={this.props.initialContent} onSetEditor={(e)=>{this.editor = e}}/>
    }

}


