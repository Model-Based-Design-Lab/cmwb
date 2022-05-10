import * as React from 'react'
import Container from 'react-bootstrap/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBookReader, faEnvelope, faCube, faUserAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { isLoggedIn } from '../../authentication/utils'
import { BASE_PATH, BASE_PATH_RESTRICTED, MODELS_PAGE_URL } from '../../config/config'
import { ModuleColors, ModuleDTMC, ModuleFSA, ModuleSDF } from '../../config/model'

export default function Navigation(props: any) {
    let userLogInOut: any
    if (isLoggedIn(props)) {
        userLogInOut = <a href={`${BASE_PATH_RESTRICTED}/profile`}>
            <FontAwesomeIcon className="w3-xxlarge" icon={faUserAlt}></FontAwesomeIcon>
            <p>PROFILE</p>
        </a>
    } else {
        userLogInOut = <a href={`${BASE_PATH}/login`}>
            <FontAwesomeIcon className="w3-xxlarge" icon={faUserAlt}></FontAwesomeIcon>
            <p>LOGIN</p>
        </a>
    }
    const inQuiz = props.quiz && props.quiz.active
    return (
        <Container fluid>
            <div className='cmwbNavigation' style={{width: '75px', textAlign: 'center'}}>
            <a href={`${BASE_PATH_RESTRICTED}/`}>
                <FontAwesomeIcon className="w3-xxlarge" icon={faHome}></FontAwesomeIcon>
                <p>HOME</p>
            </a>
            {userLogInOut}
            {inQuiz && <div><a href={`${BASE_PATH_RESTRICTED}/quiz/question`}>Quiz Question</a></div>}
            {inQuiz && <div><a href={`${BASE_PATH_RESTRICTED}/quiz/submit`}>Submit Answer</a></div>}
            <a href={`${MODELS_PAGE_URL.get(ModuleFSA)}`}>
                <FontAwesomeIcon className="w3-xxlarge" icon={faCube} color={ModuleColors.get(ModuleFSA)}></FontAwesomeIcon>
                <p>FSA</p>
            </a>
            <a href={`${MODELS_PAGE_URL.get(ModuleDTMC)}`}>
                <FontAwesomeIcon className="w3-xxlarge" icon={faCube} color={ModuleColors.get(ModuleDTMC)}></FontAwesomeIcon>
                <p>DTMC</p>
            </a>
            <a href={`${MODELS_PAGE_URL.get(ModuleSDF)}`}>
                <FontAwesomeIcon className="w3-xxlarge" icon={faCube} color={ModuleColors.get(ModuleSDF)}></FontAwesomeIcon>
                <p>SDF</p>
            </a>
            <a href={`${BASE_PATH}/documentation`}>
                <FontAwesomeIcon className="w3-xxlarge" icon={faBookReader}></FontAwesomeIcon>
                <p>Documentation</p>
            </a>
            <a href={`${BASE_PATH}/about`}>
                <FontAwesomeIcon className="w3-xxlarge" icon={faInfoCircle}></FontAwesomeIcon>
                <p>ABOUT</p>
            </a>
            <a href={`${BASE_PATH}/contact`}>
                <FontAwesomeIcon className="w3-xxlarge center" icon={faEnvelope}></FontAwesomeIcon>
                <p>CONTACT</p>
            </a>
            </div>
        </Container>
    )
}

