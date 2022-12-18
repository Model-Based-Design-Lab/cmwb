import * as React from 'react'
import Container from 'react-bootstrap/Container'
import { DomainSelection } from '../../components/Jumbotron/DomainSelection'
import QuizMessage from '../../components/Welcome/Quiz'
import WelcomeMessage from '../../components/Welcome/Welcome'
import { configPath, MODELS_PAGE_URL } from '../../config/config'
import { ModuleColors, ModuleDTMC, ModuleFSA, ModuleNames, ModuleSDF } from '../../config/model'
import { historyPush } from '../../utils/routing'

const build = require(`../../${configPath}/build.json`)

export default function Index(props: any) {

    return (
        <Container fluid>
            <h1>Computational Modeling Workbench</h1>
            <WelcomeMessage user={props.user}/>
            <QuizMessage quiz={props.quiz}/>
            <p>Select one of the following.</p>
            <DomainSelection module={ModuleNames.get(ModuleFSA)} color={ModuleColors.get(ModuleFSA)} onClick={()=>historyPush(MODELS_PAGE_URL.get(ModuleFSA))}></DomainSelection>
            <DomainSelection module={ModuleNames.get(ModuleDTMC)} color={ModuleColors.get(ModuleDTMC)} onClick={()=>historyPush(MODELS_PAGE_URL.get(ModuleDTMC))}></DomainSelection>
            <DomainSelection module={ModuleNames.get(ModuleSDF)} color={ModuleColors.get(ModuleSDF)} onClick={()=>historyPush(MODELS_PAGE_URL.get(ModuleSDF))}></DomainSelection>
            <p>Build date: {build.date}</p>
            <p>Build commit: {build.commit}</p>
        </Container>
    )
}
