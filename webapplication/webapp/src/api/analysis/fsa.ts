import { ModelsDb } from "../../database/modelsdb"
import { setArtifactGenerationRouteWithInput, setBooleanTextAnalysisRoute, setBooleanTextAnalysisRouteWithInput, setBooleanTwoTextAnalysisRoute, setCombiningBooleanTextAnalysisRoute, setCombiningTransformRoute, setTextAnalysisRoute,  setTransformToDomainRoute } from "./analysis"
import { ApiAnalysisFSACheckDeterminism, ApiAnalysisFSACheckEmptiness, ApiAnalysisFSACheckEmptinessNBA, ApiAnalysisFSACheckLanguageInclusion, ApiAnalysisFSACheckWordAcceptance, ApiAnalysisFSAComplement, ApiAnalysisFSAConvertSVG, ApiAnalysisFSAConvertToDFA, ApiAnalysisFSAConvertToRegEx, ApiAnalysisFSADetermineAlphabet, ApiAnalysisFSAEliminateEpsilon, ApiAnalysisFSAEliminateEpsilonNBA, ApiAnalysisFSAMakeComplete, ApiAnalysisFSAMinimize, ApiAnalysisFSAMinimizeNBA, ApiAnalysisFSAReachableStates, ApiAnalysisFSARelabelStates, ApiAnalysisFSASynchronousProduct, ApiAnalysisFSASynchronousProductNBA } from '../api'
import { accepts, alphabet, asDfa, asRegEx, complement, complete, eliminateEpsilon, isDeterministic, languageEmpty, languageEmptyBuchi, languageIncluded, minimize, minimizeBuchi,  reachableStates, relabel, strictProduct, strictProductBuchi } from "../../operations/fsa"
import express from "express"
import { DomFSA, DomRegEx } from "../../config/model"
import { convertSVGArtifact } from "../../codegen/codegen"

function setTransformRoute(router: express.Router, modelsDb: ModelsDb, api: string, transform:  (model: string) => Promise<string>, newNameTransform: (oldName: string)=>string, errorMessage: string) {
    setTransformToDomainRoute(router, modelsDb, api, transform, newNameTransform, DomFSA, errorMessage)
}


export function setFSAAnalysisAPI(router: express.Router, modelsDb: ModelsDb) {

    // Analysis API calls with textual result

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisFSADetermineAlphabet, m=>alphabet(m), "Failed to determine alphabet")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisFSAReachableStates, m=>reachableStates(m), "Failed to determine reachable states")

    // Analysis API calls with boolean + textual result
  
    setBooleanTwoTextAnalysisRoute(router, modelsDb, ApiAnalysisFSACheckEmptiness, m=>languageEmpty(m), "Failed to check emptiness")

    setBooleanTwoTextAnalysisRoute(router, modelsDb, ApiAnalysisFSACheckEmptinessNBA, m=>languageEmptyBuchi(m), "Failed to check emptiness")

    setBooleanTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisFSACheckWordAcceptance, (m,q)=>accepts(m,q.inputWord), "Failed to check word acceptance")

    setBooleanTextAnalysisRoute(router, modelsDb, ApiAnalysisFSACheckDeterminism, m=>isDeterministic(m), "Failed to check determinism")

    setCombiningBooleanTextAnalysisRoute(router, modelsDb, ApiAnalysisFSACheckLanguageInclusion, (m1,m2)=>languageIncluded(m1,m2), "Failed to check language inclusion")

    // Transformation API calls
    
    setTransformRoute(router, modelsDb, ApiAnalysisFSARelabelStates, m=>relabel(m), name => name+'_relabel', "Failed to relabel states")

    setTransformRoute(router, modelsDb, ApiAnalysisFSAConvertToDFA, m=>asDfa(m), name => name+'_dfa', "Failed to convert to DFA")

    setTransformRoute(router, modelsDb, ApiAnalysisFSAEliminateEpsilon, m=>eliminateEpsilon(m), name => name+'_no_eps', "Failed to eliminate epsilon transitions")   

    setTransformRoute(router, modelsDb, ApiAnalysisFSAEliminateEpsilonNBA, m=>eliminateEpsilon(m), name => name+'_no_eps', "Failed to eliminate epsilon transitions")   

    setTransformRoute(router, modelsDb, ApiAnalysisFSAMakeComplete, m=>complete(m), name => name+'_complete', "Failed to complete automaton")

    setTransformRoute(router, modelsDb, ApiAnalysisFSAComplement, m=>complement(m), name => name+'_complement', "Failed to complement automaton")   

    setTransformRoute(router, modelsDb, ApiAnalysisFSAMinimize, m=>minimize(m), name => name+'_minimize', "Failed to minimize automaton")

    setTransformRoute(router, modelsDb, ApiAnalysisFSAMinimizeNBA, m=>minimizeBuchi(m), name => name+'_minimize', "Failed to minimize automaton")

    setTransformToDomainRoute(router, modelsDb, ApiAnalysisFSAConvertToRegEx, m=>asRegEx(m), name => name+'_regex', DomRegEx, "Failed to convert to regular expression")

    // Combining transformation API calls

    setCombiningTransformRoute(router, modelsDb, ApiAnalysisFSASynchronousProduct, (m1: string, m2: string)=>strictProduct(m1,m2), (name1, name2) => `${name1}_${name2}_sproduct`, "Failed to compute synchronous product")   

    setCombiningTransformRoute(router, modelsDb, ApiAnalysisFSASynchronousProductNBA, (m1: string, m2: string)=>strictProductBuchi(m1,m2), (name1, name2) => `${name1}_${name2}_sproduct`, "Failed to compute synchronous product")   

    setArtifactGenerationRouteWithInput(router, modelsDb, ApiAnalysisFSAConvertSVG, (m,q)=>convertSVGArtifact(DomFSA, q.modelId, q.modelName, m), "Failed to convert to SVG.")

    return router

}