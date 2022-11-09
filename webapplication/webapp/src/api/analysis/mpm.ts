import { ModelsDb } from "../../database/modelsdb"
import { setArtifactGenerationRouteWithInput, setTextAnalysisRoute,  setTextAnalysisRouteWithInput,  setTransformToDomainRoute, setTransformToDomainRouteWithInput } from "./analysis"
import { ApiAnalysisMPMConvertPrecedenceGraph, ApiAnalysisMPMConvolutionAnalysis, ApiAnalysisMPMConvolutionTransform, ApiAnalysisMPMDelaySequence, ApiAnalysisMPMEigenVectors, ApiAnalysisMPMPrecedenceGraph, ApiAnalysisMPMGetEventSequences, ApiAnalysisMPMGetInputLabels, ApiAnalysisMPMGetMatrices, ApiAnalysisMPMGetVectorSequences, ApiAnalysisMPMLargestEigenValue, ApiAnalysisMPMMaximumAnalysis, ApiAnalysisMPMMaximumTransform, ApiAnalysisMPMMultiplyAnalysis, ApiAnalysisMPMMultiplyTransform, ApiAnalysisMPMOutputVectorTraceOfStateSpace, ApiAnalysisMPMOutputVectorTraceOfStateSpaceTransform, ApiAnalysisMPMScaleSequence, ApiAnalysisMPMStarClosure, ApiAnalysisMPMOutputVectorTraveOfEventAndVectorSequences } from '../api'

import express from "express"
import { DomMPM } from "../../config/model"
import { convolution, convolutionTransform, delay, eigenvalue, eigenvectors, precedencegraph, eventSequences, inputLabels, matrices, maximum, maximumTransform, multiply, multiplyTransform, scale, starclosure, vectorSequences, vectorTrace, vectorTraceTransform } from "../../operations/mpm"
import { convertPrecedenceGraph, vectorChart } from "../../codegen/codegen"

function setTransformRouteWithInput(router: express.Router, modelsDb: ModelsDb, api: string, transform:  (model: string, query: any) => Promise<string>, newNameTransform: (oldName: string)=>string, errorMessage: string) {
    return setTransformToDomainRouteWithInput(router, modelsDb, api, transform, newNameTransform, DomMPM, errorMessage)
}


export function setMPMAnalysisAPI(router: express.Router, modelsDb: ModelsDb) {

    // Analysis API calls with textual result

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisMPMGetEventSequences, m=>eventSequences(m), "Failed to determine event sequences.")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisMPMGetMatrices, m=>matrices(m), "Failed to determine matrices.")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisMPMGetVectorSequences, m=>vectorSequences(m), "Failed to determine vector sequences.")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisMPMGetInputLabels, m=>inputLabels(m), "Failed to determine input labels.")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMLargestEigenValue, (m,q)=>eigenvalue(m, q.matrix), "Failed to determine largest eigenvalue.")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMEigenVectors, (m,q)=>eigenvectors(m, q.matrix), "Failed to determine eigenvectors.")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMPrecedenceGraph, (m,q)=>precedencegraph(m, q.matrix), "Failed to determine precedence graph.")

    setArtifactGenerationRouteWithInput(router, modelsDb, ApiAnalysisMPMConvertPrecedenceGraph, (m,q)=>convertPrecedenceGraph(q.modelId, q.name, m, q.matrix), "Failed to make precedence graph.")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMStarClosure, (m,q)=>starclosure(m, q.matrix), "Failed to determine star closure.")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMConvolutionAnalysis, (m,q)=>convolution(m, q.eventSequences), "Failed to compute convolution.")

    setTransformRouteWithInput(router, modelsDb, ApiAnalysisMPMConvolutionTransform, (m,q)=>convolutionTransform(m, q.eventSequences), name => name+'_conv', "Failed to compute convolution")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMMaximumAnalysis, (m,q)=>maximum(m, q.eventSequences), "Failed to compute maximum.")

    setTransformRouteWithInput(router, modelsDb, ApiAnalysisMPMMaximumTransform, (m,q)=>maximumTransform(m, q.eventSequences), name => name+'_max', "Failed to compute maximum")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMMultiplyAnalysis, (m,q)=>multiply(m, q.matrixList, q.vectorSequence), "Failed to compute product.")

    setTransformRouteWithInput(router, modelsDb, ApiAnalysisMPMMultiplyTransform, (m,q)=>multiplyTransform(m, q.matrixList, q.vectorSequence), name => name+'_prod', "Failed to compute product")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMDelaySequence, (m,q)=>delay(m, q.sequence, q.delay), "Failed to delay sequence.")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMScaleSequence, (m,q)=>scale(m, q.sequence, q.scaleFactor), "Failed to scale sequence.")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisMPMOutputVectorTraceOfStateSpace, (m,q)=>vectorTrace(m, q.numberOfIterations, q.initialState, q.inputSequences), "Failed to compute output sequence")

    setTransformRouteWithInput(router, modelsDb, ApiAnalysisMPMOutputVectorTraceOfStateSpaceTransform, (m,q)=>vectorTraceTransform(m, q.numberOfIterations, q.initialState, q.inputSequences), name => name+'_output', "Failed to compute output sequence model")

    setArtifactGenerationRouteWithInput(router, modelsDb, ApiAnalysisMPMOutputVectorTraveOfEventAndVectorSequences, (m,q)=>vectorChart(q.modelId, q.modelName, m, q.eventAndVectorSequences), "Failed to make Vector chart.")

}