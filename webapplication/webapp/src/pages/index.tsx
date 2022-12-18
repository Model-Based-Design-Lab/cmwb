import * as React from 'react'
import Container from 'react-bootstrap/Container'
import { configPath } from '../config/config'

const build = require(`../${configPath}/build.json`)

export default function Index() {
    return (
        <Container fluid>
            <h1>Computational Modeling Workbench</h1>
            <p>Welcome to the Computational Modeling Workbench! Please log in.</p>
            <p>Build date: {build.date}</p>
            <p>Build commit: {build.commit}</p>
        </Container>
    )
}
