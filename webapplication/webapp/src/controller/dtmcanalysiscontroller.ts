import { ApiAnalysisDTMCClassifyTransientRecurrent, ApiAnalysisDTMCCommunicatingClasses, ApiAnalysisDTMCConvertSVG, ApiAnalysisDTMCDetermineMCType, ApiAnalysisDTMCDeterminePeriodicity, ApiAnalysisDTMCGetRecurrentStates, ApiAnalysisDTMCGetStates, ApiAnalysisDTMCHittingProbability, ApiAnalysisDTMCHittingProbabilitySet, ApiAnalysisDTMCLimitingDistribution, ApiAnalysisDTMCLimitingMatrix, ApiAnalysisDTMCLongRunReward, ApiAnalysisDTMCRewardUntilHit, ApiAnalysisDTMCRewardUntilHitSet, ApiAnalysisDTMCSimCesaroLimitDistribution, ApiAnalysisDTMCSimHittingProbabilityState, ApiAnalysisDTMCSimHittingProbabilityStateSet, ApiAnalysisDTMCSimHittingRewardState, ApiAnalysisDTMCSimHittingRewardStateSet, ApiAnalysisDTMCSimLongRunExpectedAverageReward, ApiAnalysisDTMCSimTrace, ApiAnalysisDTMCSimTransientDistribution, ApiAnalysisDTMCSimTransientExpectedReward, ApiAnalysisDTMCTransientDistribution, ApiAnalysisDTMCTransientGraph, ApiAnalysisDTMCTransientMatrix, ApiAnalysisDTMCTransientRewards } from "../api/api"
import { Controller } from "./controller"


export type TSimConditions = {
    confidence?: number
    absoluteErrorBound?: number
    relativeErrorBound?: number
    numberOfSteps: number
    numberOfRealizations?: number
    timeout?: number
}

export class DTMCAnalysisController extends Controller {

    static async getStates(modelId: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCGetStates, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async getRecurrentStates(modelId: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCGetRecurrentStates, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    
    static async transientDistribution(modelId: string, numberOfSteps: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCTransientDistribution, {modelId: modelId, numberOfSteps: numberOfSteps}, respObj => respObj.analysisOutput)
    }

    static async transientRewards(modelId: string, numberOfSteps: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCTransientRewards, {modelId: modelId, numberOfSteps: numberOfSteps}, respObj => respObj.analysisOutput)
    }

    static async transientMatrix(modelId: string, numberOfSteps: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCTransientMatrix, {modelId: modelId, numberOfSteps: numberOfSteps}, respObj => respObj.analysisOutput)
    }

    static async communicatingClasses(modelId: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCCommunicatingClasses, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async classifyTransientRecurrent(modelId: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCClassifyTransientRecurrent, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async determinePeriodicity(modelId: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCDeterminePeriodicity, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async determineMCType(modelId: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCDetermineMCType, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async hittingProbability(modelId: string, state: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCHittingProbability, {modelId: modelId, state: state}, respObj => respObj.analysisOutput)
    }

    static async rewardUntilHit(modelId: string, state: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCRewardUntilHit, {modelId: modelId, state: state}, respObj => respObj.analysisOutput)
    }

    static async hittingProbabilitySet(modelId: string, states: string): Promise<string> {
        if (states=="") return "No states selected"
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCHittingProbabilitySet, {modelId: modelId, states: states}, respObj => respObj.analysisOutput)
    }

    static async rewardUntilHitSet(modelId: string, states: string): Promise<string> {
        if (states=="") return "No states selected"
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCRewardUntilHitSet, {modelId: modelId, states: states}, respObj => respObj.analysisOutput)
    }

    static async limitingMatrix(modelId: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCLimitingMatrix, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async limitingDistribution(modelId: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCLimitingDistribution, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async longRunReward(modelId: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCLongRunReward, {modelId: modelId}, respObj => respObj.analysisOutput)
    }

    static async viewTransientGraph(modelId: string, modelName: string, numberOfSteps: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData(ApiAnalysisDTMCTransientGraph, {modelId, modelName, numberOfSteps},  respObj => respObj.artifact)
    }

    static async simTrace(modelId: string, numberOfSteps: string, seed: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCSimTrace, {modelId: modelId, numberOfSteps, seed}, respObj => respObj.analysisOutput)
    }

    static async simLongRunExpectedAverageReward(modelId: string, conditions: TSimConditions, recurrentState: string, seed: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCSimLongRunExpectedAverageReward, {modelId, conditions, recurrentState, seed}, respObj => respObj.analysisOutput)
    }

    static async simCesaroLimitDistribution(modelId: string, conditions: TSimConditions, recurrentState: string, seed: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCSimCesaroLimitDistribution, {modelId, conditions, recurrentState, seed}, respObj => respObj.analysisOutput)
    }

    static async simTransientExpectedReward(modelId: string, numberOfSteps:string, conditions: TSimConditions, seed: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCSimTransientExpectedReward, {modelId, numberOfSteps, conditions, seed}, respObj => respObj.analysisOutput)
    }

    static async simTransientDistribution(modelId: string, numberOfSteps:string, conditions: TSimConditions, seed: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCSimTransientDistribution, {modelId, numberOfSteps, conditions, seed}, respObj => respObj.analysisOutput)
    }

    static async simHittingProbabilityState(modelId: string, state:string, conditions: TSimConditions, analyzeStates: string, seed: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCSimHittingProbabilityState, {modelId, state, conditions, analyzeStates, seed}, respObj => respObj.analysisOutput)
    }

    static async simHittingRewardState(modelId: string, state:string, conditions: TSimConditions, analyzeStates: string, seed: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCSimHittingRewardState, {modelId, state, conditions, analyzeStates, seed}, respObj => respObj.analysisOutput)
    }

    static async simHittingProbabilityStateSet(modelId: string, states:string, conditions: TSimConditions, analyzeStates: string, seed: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCSimHittingProbabilityStateSet, {modelId, states, conditions, analyzeStates, seed}, respObj => respObj.analysisOutput)
    }

    static async simHittingRewardStateSet(modelId: string, states:string, conditions: TSimConditions, analyzeStates: string, seed: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData<string>(ApiAnalysisDTMCSimHittingRewardStateSet, {modelId, states, conditions, analyzeStates, seed}, respObj => respObj.analysisOutput)
    }

    static async convertToSVG(modelId: string, modelName: string): Promise<string> {
        return DTMCAnalysisController.requestWithResponseAndData(ApiAnalysisDTMCConvertSVG, {modelId, modelName},  respObj => respObj.artifact)
    }

}

