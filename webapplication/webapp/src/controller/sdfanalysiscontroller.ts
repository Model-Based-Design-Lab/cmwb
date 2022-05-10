import { ApiAnalysisSDFCheckDeadlock, ApiAnalysisSDFConvertSDF3, ApiAnalysisSDFConvertSVG, ApiAnalysisSDFConvertToSingleRate, ApiAnalysisSDFGanttChart, ApiAnalysisSDFGetInputLabels, ApiAnalysisSDFGetStateLabels, ApiAnalysisSDFLatency, ApiAnalysisSDFMakeStateMatrixModel, ApiAnalysisSDFMakeStateSpaceMatricesModel, ApiAnalysisSDFRepetitionVector, ApiAnalysisSDFStateSpaceMatrices, ApiAnalysisSDFThroughput } from "../api/api"
import { Controller } from "./controller"


export class SDFAnalysisController extends Controller {

    static async getInputLabels(modelId: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData<string>(ApiAnalysisSDFGetInputLabels, {modelId}, respObj => respObj.analysisOutput)
    }

    static async getStateLabels(modelId: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData<string>(ApiAnalysisSDFGetStateLabels, {modelId}, respObj => respObj.analysisOutput)
    }
    
    static async repetitionVector(modelId: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData<string>(ApiAnalysisSDFRepetitionVector, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async checkDeadlock(modelId: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData<string>(ApiAnalysisSDFCheckDeadlock, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async throughput(modelId: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData<string>(ApiAnalysisSDFThroughput, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async latency(modelId: string, period: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData<string>(ApiAnalysisSDFLatency, {modelId, period}, respObj => respObj.analysisOutput)
    }

    static async convertToSingleRate(modelId: string, userId: string, userName: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData(ApiAnalysisSDFConvertToSingleRate, {modelId: modelId, userId: userId, userName: userName},  respObj => respObj.modelName)
    }

    static async stateSpaceMatrices(modelId: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData<string>(ApiAnalysisSDFStateSpaceMatrices, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async makeStateMatrixModel(modelId: string, userId: string, userName: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData(ApiAnalysisSDFMakeStateMatrixModel, {modelId: modelId, userId: userId, userName: userName},  respObj => respObj.modelName)
    }

    static async makeStateSpaceMatricesModel(modelId: string, userId: string, userName: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData(ApiAnalysisSDFMakeStateSpaceMatricesModel, {modelId: modelId, userId: userId, userName: userName},  respObj => respObj.modelName)
    }

    static async ganttChart(modelId: string, modelName: string, numberOfIterations: string, initialState: string, inputTraces: string, zeroBased: boolean): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData(ApiAnalysisSDFGanttChart, {modelId, modelName, numberOfIterations, initialState, inputTraces, zeroBased},  respObj => respObj.artifact)
    }

    static async convertToSVG(modelId: string, modelName: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData(ApiAnalysisSDFConvertSVG, {modelId, modelName},  respObj => respObj.artifact)
    }
    
    static async convertToSDF3(modelId: string, modelName: string): Promise<string> {
        return SDFAnalysisController.requestWithResponseAndData(ApiAnalysisSDFConvertSDF3, {modelId, modelName},  respObj => respObj.artifact)
    }
    
    

}

