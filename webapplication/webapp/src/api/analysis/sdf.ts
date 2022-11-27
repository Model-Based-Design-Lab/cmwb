import { ModelsDb } from "../../database/modelsdb"
import { setArtifactGenerationRouteWithInput, setTextAnalysisRoute,  setTextAnalysisRouteWithInput, setTransformToDomainRoute } from "./analysis"
import { ApiAnalysisSDFCheckDeadlock, ApiAnalysisSDFConvertSDF3, ApiAnalysisSDFConvertSVG, ApiAnalysisSDFConvertToSingleRate, ApiAnalysisSDFGanttChart, ApiAnalysisSDFGetInputLabels, ApiAnalysisSDFGetStateLabels, ApiAnalysisSDFLatency, ApiAnalysisSDFMakeStateMatrixModel, ApiAnalysisSDFMakeStateSpaceMatricesModel, ApiAnalysisSDFRepetitionVector, ApiAnalysisSDFStateMatrix, ApiAnalysisSDFStateSpaceMatrices, ApiAnalysisSDFThroughput } from '../api'
import { convertToSingleRate, convertToStateMatrix, convertToStateSpaceMatrices, deadlock, inputLabels, stateLabels, latency, repetitionVector, stateSpaceMatrices, throughput, stateMatrix } from "../../operations/sdf"
import express from "express"
import { DomMPM, DomSDF } from "../../config/model"
import { convertSDF3Artifact, convertSVGArtifact, ganttChart } from "../../codegen/codegen"

function setTransformRoute(router: express.Router, modelsDb: ModelsDb, api: string, transform:  (model: string) => Promise<string>, newNameTransform: (oldName: string)=>string, errorMessage: string) {
    setTransformToDomainRoute(router, modelsDb, api, transform, newNameTransform, DomSDF, errorMessage)
}


export function setSDFAnalysisAPI(router: express.Router, modelsDb: ModelsDb) {

    // Analysis API calls with textual result

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisSDFGetInputLabels, m=>inputLabels(m), "Failed to determine input labels.")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisSDFGetStateLabels, m=>stateLabels(m), "Failed to determine state labels.")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisSDFRepetitionVector, m=>repetitionVector(m), "Failed to determine repetition vector")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisSDFCheckDeadlock, m=>deadlock(m), "Failed to check deadlock")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisSDFThroughput, m=>throughput(m), "Failed to check throughput")

    setTextAnalysisRouteWithInput(router, modelsDb, ApiAnalysisSDFLatency, (m,q) => latency(m, q.period), "Failed to check latency")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisSDFStateMatrix, m=>stateMatrix(m), "Failed to determine state matrix.")

    setTextAnalysisRoute(router, modelsDb, ApiAnalysisSDFStateSpaceMatrices, m=>stateSpaceMatrices(m), "Failed to determine state-space matrices.")

    setArtifactGenerationRouteWithInput(router, modelsDb, ApiAnalysisSDFGanttChart, (m,q)=>ganttChart(q.modelId, q.modelName, m, q.numberOfIterations, q.initialState, q.inputTraces, q.zeroBased=="true"), "Failed to make Gantt chart.")

    setArtifactGenerationRouteWithInput(router, modelsDb, ApiAnalysisSDFConvertSVG, (m,q)=>convertSVGArtifact(DomSDF, q.modelId, q.modelName, m), "Failed to convert to SVG.")

    setArtifactGenerationRouteWithInput(router, modelsDb, ApiAnalysisSDFConvertSDF3, (m,q)=>convertSDF3Artifact(q.modelId, q.modelName, m), "Failed to convert to SDF3.")

    // Transformation API calls

    setTransformRoute(router, modelsDb, ApiAnalysisSDFConvertToSingleRate, m=>convertToSingleRate(m), name => name+'_sr', "Failed to convert to single rate")

    setTransformToDomainRoute(router, modelsDb, ApiAnalysisSDFMakeStateMatrixModel, m=>convertToStateMatrix(m), name => name+'_state_matrix', DomMPM, "Failed to convert to state matrix.")

    setTransformToDomainRoute(router, modelsDb, ApiAnalysisSDFMakeStateSpaceMatricesModel, m=>convertToStateSpaceMatrices(m), name => name+'_state_space_matrices', DomMPM, "Failed to convert to state space matrices.")


}