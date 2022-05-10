import * as React from 'react'
import ReactMarkdown from 'react-markdown'

type Props = {
    source: string
}

type State = {
    content: string
}

export default class MarkdownQuizQuestion extends React.Component<Props, State> {
    
    constructor(props: any) {
        super(props)
        const markdownModule = require(`raw-loader!../../../exercises/${props.source}`)
        this.state = { content: markdownModule.default}        
    }

    render() {
      return (
        <div>
          <ReactMarkdown source={this.state.content} />
        </div>
      )
    }
  }

