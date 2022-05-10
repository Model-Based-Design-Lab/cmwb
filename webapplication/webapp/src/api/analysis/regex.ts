import { ModelsDb } from "../../database/modelsdb"
import { ApiAnalysisRegExConvertOmegaRegExToNBA, ApiAnalysisRegExConvertToDFA } from '../api'
import express from "express"
import { asFsa, asNba } from "../../operations/regex"
import { setTransformToDomainRoute } from "./analysis"
import { DomFSA, DomRegEx } from "../../config/model"

export function setTransformRoute(router: express.Router, modelsDb: ModelsDb, api: string, transform:  (model: string) => Promise<string>, newNameTransform: (oldName: string)=>string, errorMessage: string) {
    setTransformToDomainRoute(router, modelsDb, api, transform, newNameTransform, DomRegEx, errorMessage)
}


export function setRegExAnalysisAPI(router: express.Router, modelsDb: ModelsDb) {

    setTransformToDomainRoute(router, modelsDb, ApiAnalysisRegExConvertToDFA, m=>asFsa(m), name => name+'_nfa', DomFSA, "Failed to convert to NFA")

    setTransformToDomainRoute(router, modelsDb, ApiAnalysisRegExConvertOmegaRegExToNBA, m=>asNba(m), name => name+'_nba', DomFSA, "Failed to convert to NBA")

    return router

}