import * as bodyParser from 'body-parser'
import * as express from 'express'
import { sessionUserId } from '../../authentication/utils'
import { DomFSA } from '../../config/model'

import { ModelsDb } from '../../database/modelsdb'
import { IExternalCompModModel, typeScratch } from '../../database/modelsdbinterface'
import {decodeQuery, errorResponse, okResponse } from '../api'
import { setDTMCAnalysisAPI } from './dtmc'
import { setFSAAnalysisAPI } from './fsa'
import { setLTLAnalysisAPI } from './ltl'
import { setMPMAnalysisAPI } from './mpm'
import { setRegExAnalysisAPI } from './regex'
import { setSDFAnalysisAPI } from './sdf'


export function setTransformToDomainRoute(router: express.Router, modelsDb: ModelsDb, api: string, transform:  (model: string) => Promise<string>, newNameTransform: (oldName: string)=>string, targetDomain: string, errorMessage: string) {
    router.get(api, (req, res) => {
        const {modelId, userId, userName} = decodeQuery(req.query) as {modelId: string, userId: string, userName: string }
        var newName: string
        var group: string
        modelsDb.getModel(modelId, sessionUserId(req))
        .then( (model: IExternalCompModModel) => {
            newName = newNameTransform(model.name)
            group = model.group
            return transform(model.content)
        })
        .then( newModelText => {
            storeAsScratchModel(modelsDb, newName, newModelText, userId, userName, targetDomain, group, sessionUserId(req))
        })
        .then(() => res.send(okResponse({modelName: newName})))
        .catch( reason => 
            res.send(errorResponse(`${errorMessage}: ${reason}`))
        )
    })
}

export function setTransformToDomainRouteWithInput(router: express.Router, modelsDb: ModelsDb, api: string, transform:  (model: string, query: any) => Promise<string>, newNameTransform: (oldName: string)=>string, targetDomain: string, errorMessage: string) {
    router.get(api, (req, res) => {
        const {modelId, userId, userName} = decodeQuery(req.query) as {modelId: string, userId: string, userName: string }
        var newName: string
        var group: string
        modelsDb.getModel(modelId, sessionUserId(req))
        .then( model => {
            newName = newNameTransform(model.name)
            group = model.group
            return transform(model.content, req.query)
        })
        .then( newModelText => {
            storeAsScratchModel(modelsDb, newName, newModelText, userId, userName, targetDomain, group, sessionUserId(req))
        })
        .then(() => res.send(okResponse({modelName: newName})))
        .catch( reason => 
            res.send(errorResponse(`${errorMessage}: ${reason}`))
        )
    })
}

export function setCombiningTransformRoute(router: express.Router, modelsDb: ModelsDb, api: string, transform:  (model1: string, model2: string) => Promise<string>, newNameTransform: (oldName1: string, oldName2: string)=>string, errorMessage: string) {
    router.get(api, (req, res) => {
        const {modelId, secondModelId, userId, userName} = decodeQuery(req.query) as {modelId: string, secondModelId: string, userId: string, userName: string }
        var newName: string
        var model1: IExternalCompModModel
        var model2: IExternalCompModModel
        var group: string
        modelsDb.getModel(modelId, sessionUserId(req))
        .then( model => {
            model1 = model
            group = model1.group
            return modelsDb.getModel(secondModelId, sessionUserId(req))
        })
        .then( model => {
            model2 = model
            newName = newNameTransform(model1.name, model2.name)
            return transform(model1.content, model2.content)
        })
        .then( newModelText => {
            storeAsScratchModel(modelsDb, newName, newModelText, userId, userName, DomFSA, group, sessionUserId(req))
        })
        .then(() => res.send(okResponse({modelName: newName})))
        .catch( reason => 
            res.send(errorResponse(`${errorMessage}: ${reason}`))
        )
    })
}

export function setCombiningBooleanTextAnalysisRoute(router: express.Router, modelsDb: ModelsDb, api: string, analysis:  (model1: string, model2: string) => Promise<[boolean,string]>, errorMessage: string) {
    router.get(api, (req, res) => {
        const {modelId, secondModelId} = decodeQuery(req.query) as {modelId: string, secondModelId: string}
        var model1: IExternalCompModModel
        var model2: IExternalCompModModel
        modelsDb.getModel(modelId, sessionUserId(req))
        .then( model => {
            model1 = model
            return modelsDb.getModel(secondModelId, sessionUserId(req))
        })
        .then( model => {
            model2 = model
            return analysis(model1.content, model2.content)
        })
        .then(([analysisResult, analysisOutput]) => res.send(okResponse({analysisResult: analysisResult, analysisOutput: analysisOutput})))
        .catch( reason => 
            res.send(errorResponse(`${errorMessage}: ${reason}`))
        )
    })
}


function setGenericAnalysisRoute<TResult>(router: express.Router, modelsDb: ModelsDb, api: string, analysisOperation:  (model: string, query:any) => Promise<TResult>, makeResponse: (result: TResult)=>any, errorMessage: string) {
    router.get(api, (req, res) => {
        const query = decodeQuery(req.query)
        const modelId =  query.modelId
        modelsDb.getModel(modelId, sessionUserId(req))
        .then( model => analysisOperation(model.content, query))
        .then( result => {
            res.send(okResponse(makeResponse(result)))
        })
        .catch( reason => 
            res.send(errorResponse(`${errorMessage}\n${reason}`))
        )
    })
}

// analysis route with only textual output
export function setTextAnalysisRoute(router: express.Router, modelsDb: ModelsDb, api: string, analysisOperation:  (model: string) => Promise<string>, errorMessage: string) {
    setGenericAnalysisRoute<string>(router, modelsDb, api, (m, _q)=>analysisOperation(m), analysisOutput=>{return {analysisOutput: analysisOutput}}, errorMessage)
}

// boolean analysis route 
export function setBooleanAnalysisRoute(router: express.Router, modelsDb: ModelsDb, api: string, analysisOperation:  (model: string) => Promise<boolean>, errorMessage: string) {
    setGenericAnalysisRoute<boolean>(router, modelsDb, api, analysisOperation, analysisResult => {return {analysisResult: analysisResult}}, errorMessage)
}

// boolean analysis route with additional input and textual output
export function setBooleanAnalysisRouteWithInput(router: express.Router, modelsDb: ModelsDb, api: string, analysisOperation:  (model: string, query: any) => Promise<boolean>, errorMessage: string) {
    setGenericAnalysisRoute<boolean>(router, modelsDb, api, analysisOperation, analysisResult => {return {analysisResult: analysisResult}}, errorMessage)
}

// analysis route with boolean and textual output
export function setBooleanTextAnalysisRoute(router: express.Router, modelsDb: ModelsDb, api: string, analysisOperation:  (model: string) => Promise<[boolean,string]>, errorMessage: string) {
    setGenericAnalysisRoute<[boolean, string]>(router, modelsDb, api, (m, _q)=>analysisOperation(m), ([analysisResult, analysisOutput]) => {return {analysisResult,  analysisOutput}}, errorMessage)
}

// analysis route with boolean and two textual outputs
export function setBooleanTwoTextAnalysisRoute(router: express.Router, modelsDb: ModelsDb, api: string, analysisOperation:  (model: string) => Promise<[boolean,string,string]>, errorMessage: string) {
    setGenericAnalysisRoute<[boolean, string,string]>(router, modelsDb, api, (m, _q)=>analysisOperation(m), ([analysisResult, analysisOutput1, analysisOutput2]) => {return {analysisResult, analysisOutput1, analysisOutput2}}, errorMessage)
}

export function setTextAnalysisRouteWithInput(router: express.Router, modelsDb: ModelsDb, api: string, analysisOperation:  (model: string, query: any) => Promise<string>, errorMessage: string) {
    setGenericAnalysisRoute<string>(router, modelsDb, api, analysisOperation, analysisOutput => {return {analysisOutput: analysisOutput}}, errorMessage)
}

export function setArtifactGenerationRouteWithInput(router: express.Router, modelsDb: ModelsDb, api: string, generationOperation:  (model: string, query: any) => Promise<string>, errorMessage: string) {
    setGenericAnalysisRoute<string>(router, modelsDb, api, generationOperation, artifact => {return {artifact}}, errorMessage)
}


// analysis route with additional input and boolean and textual output
export function setBooleanTextAnalysisRouteWithInput(router: express.Router, modelsDb: ModelsDb, api: string, analysisOperation:  (model: string, query: any) => Promise<[boolean,string]>, errorMessage: string) {
    setGenericAnalysisRoute<[boolean, string]>(router, modelsDb, api, analysisOperation, ([analysisResult, analysisOutput]) => {return {analysisResult: analysisResult, analysisOutput: analysisOutput}}, errorMessage)
}

export function setBooleanTwoTextAnalysisRouteWithInput(router: express.Router, modelsDb: ModelsDb, api: string, analysisOperation:  (model: string, query: any) => Promise<[boolean,string,string]>, errorMessage: string) {
    setGenericAnalysisRoute<[boolean, string, string]>(router, modelsDb, api, analysisOperation, ([analysisResult, analysisOutput1, analysisOutput2]) => {return {analysisResult, analysisOutput1, analysisOutput2}}, errorMessage)
}

async function storeAsScratchModel(modelsDb: ModelsDb, name: string, content: string, owner: string, userName: string, domain: string, group: string, sessionUser: string) {
	await modelsDb.addModel(name, content, domain, typeScratch, owner, userName, group, sessionUser
	)
}

export function getAnalysisAPI(modelsDb: ModelsDb): express.Router {
    const router = express.Router()
    router.use(bodyParser.json())

    setFSAAnalysisAPI(router, modelsDb)
    setRegExAnalysisAPI(router, modelsDb)
    setLTLAnalysisAPI(router, modelsDb)
    setDTMCAnalysisAPI(router, modelsDb)
    setSDFAnalysisAPI(router, modelsDb)
    setMPMAnalysisAPI(router, modelsDb)

    return router

}