import { ApiModelsCodegen, ApiModelsDeleteModel, ApiModelsDeleteScratchModuleModels, ApiModelsGetArtifact, ApiModelsGetDotGraph, ApiModelsGetList, ApiModelsGetModel, ApiModelsGetPreview, ApiModelsGetPreviewImg, ApiModelsGetPublicDomainList, ApiModelsGetPublicList, ApiModelsGetPublicModuleList, ApiModelsGetUser, ApiModelsGetUserDomain, ApiModelsGetUserModule, ApiModelsHandoverModel, ApiModelsNewModel, ApiModelsPublishModel, ApiModelsRenameModel, ApiModelsSaveModel, ApiModelsScratchModel, ApiModelsSetGroupOfModel, ApiModelsUnpublishModel, ApiModelsUnscratchModel } from "../api/api"
import { Controller } from "./controller"


export class ModelsController extends Controller {

    static async deleteModel(modelId: string){
        return ModelsController.requestWithResponse(ApiModelsDeleteModel, {modelId})
    }

    static async deleteScratchModuleModels(module: string){
        return ModelsController.requestWithResponse(ApiModelsDeleteScratchModuleModels, {module})
    }

    static async getAllModels(): Promise<any[]> {
        return ModelsController.requestWithResponseAndData<any[]>(ApiModelsGetList, {}, respObj => respObj.list)
    }

    static async getPublicModels(): Promise<any[]> {
        return ModelsController.requestWithResponseAndData<any[]>(ApiModelsGetPublicList, {}, respObj=>respObj.list)
    }

    static async getDomainPublicModels(domain: string): Promise<any[]> {
        return ModelsController.requestWithResponseAndData<any[]>(ApiModelsGetPublicDomainList, {domain: domain}, respObj=>respObj.list)
    }

    static async getModulePublicModels(domain: string): Promise<any[]> {
        return ModelsController.requestWithResponseAndData<any[]>(ApiModelsGetPublicModuleList, {domain: domain}, respObj=>respObj.list)
    }


    static async getModelsForUser(userId: string): Promise<any[]> {
        return ModelsController.requestWithResponseAndData<any[]>(ApiModelsGetUser, {userId: userId}, respObj=>respObj.list)
    }

    static async getDomainModelsForUser(userId: string, domain: string): Promise<any[]> {
        return ModelsController.requestWithResponseAndData<any[]>(ApiModelsGetUserDomain, {userId: userId, domain: domain}, respObj=>respObj.list)
    }

    static async getModuleModelsForUser(userId: string, module: string): Promise<any[]> {
        return ModelsController.requestWithResponseAndData<any[]>(ApiModelsGetUserModule, {userId: userId, module: module}, respObj=>respObj.list)
    }
  
    static async getModel(modelId: string): Promise<any> {
        return ModelsController.requestWithResponseAndData<any[]>(ApiModelsGetModel, {modelId}, respObj=>respObj.model)
    }

    static async publishModel(modelId: string){
        return ModelsController.requestWithResponse(ApiModelsPublishModel, {modelId})
    }

    static async unpublishModel(modelId: string){
        return ModelsController.requestWithResponse(ApiModelsUnpublishModel, {modelId})
    }

    static async scratchModel(modelId: string){
        return ModelsController.requestWithResponse(ApiModelsScratchModel, {modelId})
    }

    static async unscratchModel(modelId: string){
        return ModelsController.requestWithResponse(ApiModelsUnscratchModel, {modelId})
    }

    static async newModel(modelName: string, domain: string, ownerName: string): Promise<string>{
        return ModelsController.requestWithResponseAndData<string>(ApiModelsNewModel, {modelName, domain, ownerName}, respObj=>respObj.modelId)
    }

    static async renameModel(modelId: string, modelName: string){
        return ModelsController.requestWithResponse(ApiModelsRenameModel, {modelId,  modelName})
    }

    static async setGroupOfModel(modelId: string, group: string){
        return ModelsController.requestWithResponse(ApiModelsSetGroupOfModel, {modelId,  group})
    }
    

    static async handoverModel(modelId: string, userEmail: string){
        return ModelsController.requestWithResponseAndData<string>(ApiModelsHandoverModel, {modelId, userEmail}, res => res.message)
    }

    static async saveModel(modelId: string, modelContent: string){
        return ModelsController.requestWithResponse(ApiModelsSaveModel, {modelId, modelContent}, true)
    }

    static async getArtifact(artifactPath: string): Promise<string> {
        return ModelsController.requestWithResponseAndData<string>(ApiModelsGetArtifact, {artifactPath}, respObj=>respObj.artifactText)
    }

    static async doCodegen(modelId: string, codegenType: string): Promise<any[]> {
        return ModelsController.requestWithResponseAndData<any[]>(ApiModelsCodegen, {modelId, type: codegenType}, respObj=>respObj.artifacts)
    }

    static async getPreview(modelId: string): Promise<string> {
        return ModelsController.requestWithResponseAndData<string>(ApiModelsGetPreview, {modelId}, respObj=>respObj.previewPath)
    }

    static async getPreviewImg(previewPath: string): Promise<string> {
        return ModelsController.requestWithResponseAndData<string>(ApiModelsGetPreviewImg, {previewPath}, respObj=>respObj.previewImg)
    }
    
    static async getDotGraph(modelId: string): Promise<string> {
        return ModelsController.requestWithResponseAndData<string>(ApiModelsGetDotGraph, {modelId}, respObj=>respObj.dotGraph)
    }

    

}
