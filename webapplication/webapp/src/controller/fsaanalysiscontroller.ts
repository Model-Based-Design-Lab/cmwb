import { ApiAnalysisFSACheckDeterminism, ApiAnalysisFSACheckEmptiness, ApiAnalysisFSACheckEmptinessNBA, ApiAnalysisFSACheckLanguageInclusion, ApiAnalysisFSACheckWordAcceptance, ApiAnalysisFSAComplement, ApiAnalysisFSAConvertSVG, ApiAnalysisFSAConvertToDFA, ApiAnalysisFSAConvertToRegEx, ApiAnalysisFSADetermineAlphabet, ApiAnalysisFSAEliminateEpsilon, ApiAnalysisFSAEliminateEpsilonNBA, ApiAnalysisFSAMakeComplete, ApiAnalysisFSAMinimize, ApiAnalysisFSAMinimizeNBA, ApiAnalysisFSAReachableStates, ApiAnalysisFSARelabelStates, ApiAnalysisFSASynchronousProduct, ApiAnalysisFSASynchronousProductNBA } from "../api/api"
import { Controller } from "./controller"


export class FSAAnalysisController extends Controller {

    static async determineAlphabet(modelId: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData<string>(ApiAnalysisFSADetermineAlphabet, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async reachableStates(modelId: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData<string>(ApiAnalysisFSAReachableStates, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async checkEmptiness(modelId: string): Promise<[boolean,string,string]> {
        return FSAAnalysisController.requestWithResponseAndData<[boolean,string,string]>(ApiAnalysisFSACheckEmptiness, {modelId: modelId}, respObj => [respObj.analysisResult, respObj.analysisOutput1, respObj.analysisOutput2])
    }

    static async checkEmptinessNBA(modelId: string): Promise<[boolean,string,string]> {
        return FSAAnalysisController.requestWithResponseAndData<[boolean,string,string]>(ApiAnalysisFSACheckEmptinessNBA, {modelId: modelId}, respObj => [respObj.analysisResult, respObj.analysisOutput1,respObj.analysisOutput2])
    }

    static async checkDeterminism(modelId: string): Promise<[boolean,string]> {
        return FSAAnalysisController.requestWithResponseAndData<[boolean,string]>(ApiAnalysisFSACheckDeterminism, {modelId: modelId}, respObj => [respObj.analysisResult, respObj.analysisOutput])
    }

    static async checkWordAcceptance(modelId: string, inputWord: string): Promise<[boolean,string]> {
        return FSAAnalysisController.requestWithResponseAndData<[boolean,string]>(ApiAnalysisFSACheckWordAcceptance, {modelId, inputWord}, respObj => [respObj.analysisResult, respObj.analysisOutput])
    }

    static async checkLanguageInclusion(modelId: string, secondModelId: string): Promise<[boolean,string]> {
        return FSAAnalysisController.requestWithResponseAndData<[boolean,string]>(ApiAnalysisFSACheckLanguageInclusion, {modelId: modelId, secondModelId: secondModelId}, respObj => [respObj.analysisResult, respObj.analysisOutput])
    }

    static async relabelStates(modelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSARelabelStates, {modelId: modelId, userId: userId, userName: userName},  respObj => respObj.modelName)
    }

    static async convertToDFA(modelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSAConvertToDFA, {modelId: modelId, userId: userId, userName: userName},  respObj => respObj.modelName)
    }

    static async eliminateEpsilon(modelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSAEliminateEpsilon, {modelId: modelId, userId: userId, userName: userName},  respObj => respObj.modelName)
    }

    static async eliminateEpsilonNBA(modelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSAEliminateEpsilonNBA, {modelId: modelId, userId: userId, userName: userName},  respObj => respObj.modelName)
    }

    static async makeComplete(modelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSAMakeComplete, {modelId: modelId, userId: userId, userName: userName},  respObj => respObj.modelName)
    }

    static async complement(modelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSAComplement, {modelId: modelId, userId: userId, userName: userName},  respObj => respObj.modelName)
    }

    static async minimize(modelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSAMinimize, {modelId: modelId, userId: userId, userName: userName}, respObj => respObj.modelName)
    }

    static async minimizeNBA(modelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSAMinimizeNBA, {modelId: modelId, userId: userId, userName: userName}, respObj => respObj.modelName)
    }

    static async convertToRegEx(modelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSAConvertToRegEx, {modelId: modelId, userId: userId, userName: userName}, respObj => respObj.modelName)
    }

    static async convertToSVG(modelId: string, modelName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSAConvertSVG, {modelId, modelName},  respObj => respObj.artifact)
    }
    

    static async synchronousProduct(modelId: string, secondModelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSASynchronousProduct, {modelId: modelId, secondModelId: secondModelId, userId: userId, userName: userName}, respObj => respObj.modelName)
    }

    static async synchronousProductNBA(modelId: string, secondModelId: string, userId: string, userName: string): Promise<string> {
        return FSAAnalysisController.requestWithResponseAndData(ApiAnalysisFSASynchronousProductNBA, {modelId: modelId, secondModelId: secondModelId, userId: userId, userName: userName}, respObj => respObj.modelName)
    }

}

