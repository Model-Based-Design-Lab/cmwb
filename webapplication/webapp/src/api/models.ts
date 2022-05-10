import * as bodyParser from 'body-parser'
import * as express from 'express'
import { ApiModelsDeleteModel, ApiModelsGetList, ApiModelsGetModel, ApiModelsGetPublicList, ApiModelsGetUser, ApiModelsNewModel, ApiModelsPublishModel, ApiModelsRenameModel, ApiModelsSaveModel, ApiModelsUnpublishModel, decodeQuery, errorResponse, okResponse, ApiModelsScratchModel, ApiModelsUnscratchModel, ApiModelsGetUserDomain, ApiModelsGetPublicDomainList, ApiModelsGetUserModule, ApiModelsGetPreview, ApiModelsGetPreviewImg, ApiModelsDeleteScratchModuleModels, setProcessingRoute, setProcessingWithoutResultRoute, ApiModelsGetDotGraph, ApiModelsGetArtifact, ApiModelsGetBinaryArtifact, ApiModelsGetPublicModuleList, ApiModelsHandoverModel, ApiModelsSetGroupOfModel } from '../api/api'
import { sessionUserId } from '../authentication/utils'
import { dotGraph, getArtifactContent, getBinaryArtifactContent } from '../codegen/codegen'
import { getPreviewImage, makePreviewPromise } from '../codegen/preview'

import { ModelsDb } from '../database/modelsdb'
import { IExternalCompModModel } from '../database/modelsdbinterface'
import { PasswordUserDb } from '../database/passwdb'


function setQueryRouteReturningModelList(router: express.Router, api: string, operation: (req: any)=>Promise<any>, errorMsg: string) {
    return setProcessingRoute(router,api, operation, 
        models => {
            const orderedModels = models.sort((t1:IExternalCompModModel, t2: IExternalCompModModel) => t1.name.localeCompare(t2.name))
            return {list: orderedModels}
        }, errorMsg)
}

function setModelProcessingWithoutResultRoute(router: express.Router, api: string, operation: (modelId: string, sessionUserId: string)=>Promise<void>, errorMsg: string){
    return setProcessingWithoutResultRoute(router, api, req=>{
        const modelId = decodeQuery(req.query).modelId as string
        const userId = sessionUserId(req)
        return operation(modelId, userId)
    }, errorMsg)
}

export function getModelsAPI(modelsDb: ModelsDb, passwordDb: PasswordUserDb): express.Router {
    const router = express.Router()
    router.use(bodyParser.json())

    setQueryRouteReturningModelList(router, ApiModelsGetList, req=>modelsDb.getModelsForUser(sessionUserId(req)), "Failed to get models from database")

    setProcessingRoute(router, ApiModelsGetModel, req=>{
            const modelId = decodeQuery(req.query).modelId as string
            return modelsDb.getModel(modelId, sessionUserId(req))
        }, model => {return {model: model}}, "Failed to get model from database")

    setModelProcessingWithoutResultRoute(router, ApiModelsDeleteModel, (modelId, sessionUserId)=>modelsDb.deleteModel(modelId, sessionUserId), "Failed to delete model from database")

    setProcessingWithoutResultRoute(router, ApiModelsDeleteScratchModuleModels, req=>{
            const module = decodeQuery(req.query).module as string
            return modelsDb.deleteScratchModuleModels(sessionUserId(req), module)        
        }, "Failed to delete scratch models from database")

    setProcessingWithoutResultRoute(router, ApiModelsPublishModel, req=> {
            const {modelId, group} = decodeQuery(req.query) as {modelId: string, group: string}
            return modelsDb.publishModel(modelId, sessionUserId(req), group)
        }, "Failed to publish model from database")    

    setModelProcessingWithoutResultRoute(router, ApiModelsUnpublishModel, (modelId, sessionUserId)=>modelsDb.unpublishModel(modelId, sessionUserId), "Failed to unpublish model from database")

    setModelProcessingWithoutResultRoute(router, ApiModelsScratchModel, (modelId, sessionUserId)=>modelsDb.scratchModel(modelId, sessionUserId), "Failed to scratch model from database")

    setModelProcessingWithoutResultRoute(router, ApiModelsUnscratchModel, (modelId, sessionUserId)=>modelsDb.unscratchModel(modelId, sessionUserId), "Failed to unscratch model from database")

    setProcessingRoute(router, ApiModelsNewModel, req=>{
            const {modelName, domain, ownerName, group} = decodeQuery(req.query) as {modelName: string, domain: string, ownerName: string, group: string}
            return modelsDb.newModel(modelName, domain, ownerName, sessionUserId(req), group)
        }, modelId => {return {modelId}}
        , "Failed to create new model")

    setProcessingWithoutResultRoute(router, ApiModelsRenameModel, req=>{
            const {modelId, modelName} = decodeQuery(req.query) as {modelId: string, modelName: string}
            return modelsDb.renameModel(modelId, modelName, sessionUserId(req))
        }, "Failed to rename model in database")
        
    setProcessingWithoutResultRoute(router, ApiModelsSetGroupOfModel, req=>{
            const {modelId, group} = decodeQuery(req.query) as {modelId: string, group: string}
            return modelsDb.setGroupOfModel(modelId, group, sessionUserId(req))
        }, "Failed to rename model in database")

    setProcessingRoute(router, ApiModelsHandoverModel, req => {
        const {modelId, userEmail} = decodeQuery(req.query) as {modelId: string, userEmail: string}
        return new Promise((resolve, reject) => {
            passwordDb.getUserByEmail(userEmail)
            .then(user => {
                modelsDb.handoverModel(modelId, user.id, user.name, sessionUserId(req))
                .then(() => {
                    resolve({message: `Model handed over to ${user.name}.`})
                })
            })
            .catch(reason => reject(`User with email ${userEmail} not found.`))
        })
    }, res => {return res}, "Failed to handover model from database")


    setProcessingWithoutResultRoute(router, ApiModelsSaveModel, req=>{
            const {modelId, modelContent} = req.body as {modelId: string, modelContent: string}
            return modelsDb.updateModelContent(modelId, modelContent, sessionUserId(req))        
        }, "Failed to save model to database", true)

    setQueryRouteReturningModelList(router, ApiModelsGetPublicList, req=>modelsDb.getPublicModels(sessionUserId(req)), "Failed to get public model list")

    setQueryRouteReturningModelList(router, ApiModelsGetPublicDomainList, req=>{
            const {domain} = decodeQuery(req.query) as {domain: string}
            return modelsDb.getPublicDomainModels(domain, sessionUserId(req))
        }, "Failed to get public domain list")

    // get all models accessible to user (including public)
    router.get(ApiModelsGetUser, (req, res) => {
        const {userId} = decodeQuery(req.query) as {userId: string}
        checkUser(userId, req, res)
        respondSortedListOfModels(modelsDb.getModelsForUser(userId), res)        
    })

    // get all models accessible to user for a particular domain (including public)
    router.get(ApiModelsGetUserDomain, (req, res) => {
        const {userId, domain} = decodeQuery(req.query) as {userId: string, domain: string}
        checkUser(userId, req, res)
        respondSortedListOfModels(modelsDb.getDomainModelsForUser(domain, userId), res)        
    })

    // get all models accessible to user for a particular module (including public)
    router.get(ApiModelsGetUserModule, (req, res) => {
        const {userId, module} = decodeQuery(req.query) as {userId: string, module: string}
        checkUser(userId, req, res)
        respondSortedListOfModels(modelsDb.getModuleModelsForUser(module, userId), res)
    })

    // get preview
    router.get(ApiModelsGetPreview, (req, res) => {
        const {modelId} = decodeQuery(req.query) as {modelId: string}
        modelsDb.getModel(modelId, sessionUserId(req))
        .then( model => {
            if (model === null) {
                throw new Error(`Model ${modelId} not found in database.`)
            }
            return makePreviewPromise(modelId, model.name, model.content, model.domain)
        })
        .then( (previewPath: string) => {
            res.send(okResponse({previewPath: previewPath}))
        })
        .catch( reason => {
            res.send(errorResponse(`Failed to make preview: ${reason}`))
        })
    })

    // get preview image data
    router.get(ApiModelsGetPreviewImg, (req, res) => {
        const {previewPath} = decodeQuery(req.query) as {previewPath: string}
        getPreviewImage(previewPath)
        .then( (previewImg: string) => {
            res.send(okResponse({previewImg: previewImg}))
        })
        .catch( reason => 
            res.send(errorResponse(`Failed to get preview image: ${reason}`))
        )
    })

    // get dot graph of a model
    router.get(ApiModelsGetDotGraph, (req, res) => {
        const {modelId} = decodeQuery(req.query) as {modelId: string}
        modelsDb.getModel(modelId, sessionUserId(req))
        .then( model => {
            if (model === null) {
                throw new Error(`Model ${modelId} not found in database.`)
            }
            return dotGraph(model.domain, modelId, model.name, model.content)
        })
        .then( (dotGraph: string) => {
            res.send(okResponse({dotGraph}))
        })
        .catch( reason => {
            res.send(errorResponse(`Failed to make do graph: ${reason}`))
        })
    })
    
    setProcessingRoute(router, ApiModelsGetArtifact, req => {
        const {artifactPath} = decodeQuery(req.query) as {artifactPath: string}
        return getArtifactContent(artifactPath)
    }, content => { return {artifactText: content}}, "Failed to get artifact")

    setProcessingRoute(router, ApiModelsGetBinaryArtifact, req => {
        const {artifactPath} = decodeQuery(req.query) as {artifactPath: string}
        return getBinaryArtifactContent(artifactPath)
    }, content => { return {artifactEncoded: content}}, "Failed to get binary artifact")


    // Guest routes
    
    router.get(ApiModelsGetPublicList, (_req, res) => {
        respondSortedListOfModels(modelsDb.getPublicModels(null), res)        
    })

    router.get(ApiModelsGetPublicDomainList, (req, res) => {
        const {domain} = decodeQuery(req.query) as {domain: string}
        respondSortedListOfModels(modelsDb.getPublicDomainModels(domain, null), res)        
    })

    router.get(ApiModelsGetPublicModuleList, (req, res) => {
        const {domain} = decodeQuery(req.query) as {domain: string}
        respondSortedListOfModels(modelsDb.getPublicModuleModels(domain, null), res)
    })
    
    return router
}

function respondSortedListOfModels(getModels: Promise<IExternalCompModModel[]>, res: any) {
    getModels
    .then( models => {
        const orderedModels = models.sort((t1, t2) => t1.name.localeCompare(t2.name))
        res.send(okResponse({list: orderedModels}))
    })
    .catch( reason => 
        res.send(errorResponse(`Failed to get models from database: ${reason}`))
    )
}

function checkUser(userId: string, req: any, res: any) {
    if (userId != sessionUserId(req)) return res.send(errorResponse(`Illegal user.`))
}