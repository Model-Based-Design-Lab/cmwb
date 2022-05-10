import { ApiAnalysisMPMConvertPrecedenceGraph, ApiAnalysisMPMConvolutionAnalysis, ApiAnalysisMPMConvolutionTransform, ApiAnalysisMPMDelaySequence, ApiAnalysisMPMEigenVectors, ApiAnalysisMPMPrecedenceGraph, ApiAnalysisMPMGetEventSequences, ApiAnalysisMPMGetInputLabels, ApiAnalysisMPMGetMatrices, ApiAnalysisMPMGetVectorSequences, ApiAnalysisMPMLargestEigenValue, ApiAnalysisMPMMaximumAnalysis, ApiAnalysisMPMMaximumTransform, ApiAnalysisMPMMultiplyAnalysis, ApiAnalysisMPMMultiplyTransform, ApiAnalysisMPMOutputVectorTraceOfStateSpace, ApiAnalysisMPMOutputVectorTraceOfStateSpaceTransform, ApiAnalysisMPMScaleSequence, ApiAnalysisMPMStarClosure, ApiAnalysisMPMOutputVectorTraveOfEventAndVectorSequences } from "../api/api"
import { Controller } from "./controller"


export class MPMAnalysisController extends Controller {

    static async getEventSequences(modelId: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMGetEventSequences, {modelId}, respObj => respObj.analysisOutput)
    }

    static async getMatrices(modelId: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMGetMatrices, {modelId}, respObj => respObj.analysisOutput)
    }
    static async getVectorSequences(modelId: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMGetVectorSequences, {modelId}, respObj => respObj.analysisOutput)
    }

    static async getInputLabels(modelId: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMGetInputLabels, {modelId}, respObj => respObj.analysisOutput)
    }

    static async largestEigenValue(modelId: string, matrix: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMLargestEigenValue, {modelId, matrix}, respObj => respObj.analysisOutput)
    }

    static async eigenVectors(modelId: string, matrix: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMEigenVectors, {modelId, matrix}, respObj => respObj.analysisOutput)
    }

    static async precedencegraph(modelId: string, matrix: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMPrecedenceGraph, {modelId, matrix}, respObj => respObj.analysisOutput)
    }

    static async viewPrecedencegraph(modelId: string, name: string, matrix: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData(ApiAnalysisMPMConvertPrecedenceGraph, {modelId, name, matrix},  respObj => respObj.artifact)
    }


    static async starClosure(modelId: string, matrix: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMStarClosure, {modelId, matrix}, respObj => respObj.analysisOutput)
    }

    static async convolution(modelId: string, eventSequences: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMConvolutionAnalysis, {modelId, eventSequences}, respObj => respObj.analysisOutput)
    }

    static async convolutionTransform(modelId: string, userId: string, userName: string, eventSequences: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMConvolutionTransform, {modelId, userId, userName, eventSequences}, respObj => respObj.modelName)
    }

    static async maximum(modelId: string, eventSequences: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMMaximumAnalysis, {modelId, eventSequences}, respObj => respObj.analysisOutput)
    }

    static async maximumTransform(modelId: string, userId: string, userName: string, eventSequences: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMMaximumTransform, {modelId, userId, userName, eventSequences}, respObj => respObj.modelName)
    }

    static async multiply(modelId: string, matrixList: string, vectorSequence: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMMultiplyAnalysis, {modelId, matrixList, vectorSequence}, respObj => respObj.analysisOutput)
    }

    static async multiplyTransform(modelId: string, userId: string, userName: string, matrixList: string, vectorSequence: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMMultiplyTransform, {modelId, userId, userName, matrixList, vectorSequence}, respObj => respObj.modelName)
    }

    static async delaySequence(modelId: string, sequence: string, delay: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMDelaySequence, {modelId, sequence, delay}, respObj => respObj.analysisOutput)
    }

    static async scaleSequence(modelId: string, sequence: string, scaleFactor: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMScaleSequence, {modelId, sequence, scaleFactor: (scaleFactor.localeCompare('-inf')==0?'mininf' : scaleFactor)}, respObj => respObj.analysisOutput)
    }

    static async outputVectorTraceOfStateSpace(modelId: string, numberOfIterations: string, initialState: string, inputSequences: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMOutputVectorTraceOfStateSpace, {modelId, numberOfIterations, initialState, inputSequences}, respObj => respObj.analysisOutput)
    }

    static async outputVectorTraceOfStateSpaceTransform(modelId: string, userId: string, userName: string, numberOfIterations: string, initialState: string, inputSequences: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMOutputVectorTraceOfStateSpaceTransform, {modelId, userId, userName, numberOfIterations, initialState, inputSequences}, respObj => respObj.modelName)
    }

    static async visualizeVectorSequence(modelId: string, modelName: string, userId: string, userName: string, eventAndVectorSequences: string): Promise<string> {
        return MPMAnalysisController.requestWithResponseAndData<string>(ApiAnalysisMPMOutputVectorTraveOfEventAndVectorSequences, {modelId, modelName, userId, userName, eventAndVectorSequences}, respObj => respObj.artifact)
    }

    


}

