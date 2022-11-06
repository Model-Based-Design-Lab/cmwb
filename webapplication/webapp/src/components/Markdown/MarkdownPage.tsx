import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import { BASE_PATH, BASE_PATH_RESTRICTED } from '../../config/config'

type Props = {
    source: string
}

type State = {
    content: string
}

function contentSubstitutions(doc: string): string 
{
  var temp: string
  temp = doc.replace(/BASE_PATH/g, BASE_PATH)
  temp = temp.replace(/PUBLIC_STATIC_PATH/g, `${BASE_PATH}/api/static`)
  temp = temp.replace(/RESTRICTED_STATIC_PATH/g, `${BASE_PATH_RESTRICTED}/api/static`)
  return temp
}

export default class extends React.Component<Props, State> {
    
    constructor(props: any) {
        super(props)
        const markdownModule = require(`raw-loader!../../docs/${props.source}`)
        this.state = { content: contentSubstitutions(markdownModule.default)}
    }

    render() {
      return (
        <div>
          <ReactMarkdown children={this.state.content} />
        </div>
      )
    }
  }

