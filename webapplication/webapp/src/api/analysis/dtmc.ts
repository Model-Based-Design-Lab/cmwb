
import express from "express"
import { convertSVGArtifact, transientExecutionGraph } from "../../codegen/codegen"
import { DomDTMC } from "../../config/model"
import { ModelsDb } from "../../database/modelsdb"
import { classifytransientrecurrent, communicatingclasses, getRecurrentStates, getStates, hittingprobability, hittingprobabilityset, limitingDistribution, limitingMatrix, longRunReward, mctype, periodicity, rewardtillhit, rewardtillhitset, simCesaroLimitDistribution, simHittingProbabilityState, simHittingProbabilityStateSet, simHittingRewardState, simHittingRewardStateSet, simLongRunExpectedAverageReward, simTrace, simTransientDistribution, simTransientExpectedReward, transient, transientMatrix, transientRewards } from "../../operations/dtmc"
import { ApiAnalysisDTMCClassifyTransientRecurrent, ApiAnalysisDTMCCommunicatingClasses, ApiAnalysisDTMCConvertSVG, ApiAnalysisDTMCDetermineMCType, ApiAnalysisDTMCDeterminePeriodicity, ApiAnalysisDTMCGetRecurrentStates, ApiAnalysisDTMCGetStates, ApiAnalysisDTMCHittingProbability, ApiAnalysisDTMCHittingProbabilitySet, ApiAnalysisDTMCLimitingDistribution, ApiAnalysisDTMCLimitingMatrix, ApiAnalysisDTMCLongRunReward, ApiAnalysisDTMCRewardUntilHit, ApiAnalysisDTMCRewardUntilHitSet, ApiAnalysisDTMCSimCesaroLimitDistribution, ApiAnalysisDTMCSimHittingProbabilityState, ApiAnalysisDTMCSimHittingProbabilityStateSet, ApiAnalysisDTMCSimHittingRewardState, ApiAnalysisDTMCSimHittingRewardStateSet, ApiAnalysisDTMCSimLongRunExpectedAverageReward, ApiAnalysisDTMCSimTrace, ApiAnalysisDTMCSimTransientDistribution, ApiAnalysisDTMCSimTransientExpectedReward, ApiAnalysisDTMCTransientDistribution, ApiAnalysisDTMCTransientGraph, ApiAnalysisDTMCTransientMatrix, ApiAnalysisDTMCTransientRewards } from "../api"
import { setArtifactGenerationRouteWithInput, setTextAnalysisRoute, setTextAnalysisRouteWithInput } from "./analysis"

export function setDTMCAnalysisAPI(router: express.Router, modelsDb: ModelsDb) {

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisDTMCGetStates,m=>getStates(m), "Failed to get states")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisDTMCGetRecurrentStates,m=>getRecurrentStates(m), "Failed to get recurrent states")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCTransientDistribution, (m,q)=>transient(m, q.numberOfSteps), "Failed to analyze transient distributions")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCTransientRewards, (m,q)=>transientRewards(m, q.numberOfSteps), "Failed to analyze transient reward")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCTransientMatrix, (m,q)=>transientMatrix(m, q.numberOfSteps), "Failed to analyze transient matrix")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisDTMCCommunicatingClasses, m=>communicatingclasses(m), "Failed to analyze communicating classes")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisDTMCClassifyTransientRecurrent, m=>classifytransientrecurrent(m), "Failed to classify transient recurrent classes")
    
    setTextAnalysisRoute(router, modelsDb, ApiAnalysisDTMCDeterminePeriodicity, m=>periodicity(m), "Failed to determine periodicity")
    
    setTextAnalysisRoute(router, modelsDb, ApiAnalysisDTMCDetermineMCType, m=>mctype(m), "Failed to determine mctype")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCHittingProbability, (m,q)=>hittingprobability(m, q.state), "Failed to determine hitting probability")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCRewardUntilHit, (m,q)=>rewardtillhit(m, q.state), "Failed to determine reward until hit")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCHittingProbabilitySet, (m,q)=>hittingprobabilityset(m, q.states), "Failed to determine hitting probability for set")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCRewardUntilHitSet, (m,q)=>rewardtillhitset(m, q.states), "Failed to determine reward until set hit")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisDTMCLimitingMatrix, m=>limitingMatrix(m), "Failed to determine limiting matrix")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisDTMCLimitingDistribution, m=>limitingDistribution(m), "Failed to determine limiting distribution")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisDTMCLongRunReward, m=>longRunReward(m), "Failed to determine long-run reward")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCSimTrace, (m,q)=>simTrace(m, q.numberOfSteps, q.seed), "Failed to analyze simulation trace")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCSimLongRunExpectedAverageReward, (m,q)=>simLongRunExpectedAverageReward(m, q.conditions, q.recurrentState, q.seed), "Failed to analyze estimated long run expected reward")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCSimCesaroLimitDistribution, (m,q)=>simCesaroLimitDistribution(m, q.conditions, q.recurrentState, q.seed), "Failed to analyze estimated Cesàro limit")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCSimTransientExpectedReward, (m,q)=>simTransientExpectedReward(m, q.numberOfSteps, q.conditions, q.seed), "Failed to analyze transient expected reward")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCSimTransientDistribution, (m,q)=>simTransientDistribution(m, q.numberOfSteps, q.conditions, q.seed), "Failed to analyze transient expected distribution")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCSimHittingProbabilityState, (m,q)=>simHittingProbabilityState(m, q.state, q.conditions, q.analyzeStates, q.seed), "Failed to analyze expected state hit probability")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCSimHittingRewardState, (m,q)=>simHittingRewardState(m, q.state, q.conditions, q.analyzeStates, q.seed), "Failed to analyze expected reward until state hit")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCSimHittingProbabilityStateSet, (m,q)=>simHittingProbabilityStateSet(m, q.states, q.conditions, q.analyzeStates, q.seed), "Failed to analyze expected state set  hit probability")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisDTMCSimHittingRewardStateSet, (m,q)=>simHittingRewardStateSet(m, q.states, q.conditions, q.analyzeStates, q.seed), "Failed to analyze expected reward until state set hit")

    setArtifactGenerationRouteWithInput(router, modelsDb, ApiAnalysisDTMCTransientGraph, (m,q)=>transientExecutionGraph(q.modelId, q.modelName, m, parseInt(q.numberOfSteps)), "Failed to make transient graph.")

    setArtifactGenerationRouteWithInput(router, modelsDb, ApiAnalysisDTMCConvertSVG, (m,q)=>convertSVGArtifact(DomDTMC, q.modelId, q.modelName, m), "Failed to convert to SVG.")

    return router

}

