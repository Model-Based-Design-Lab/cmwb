import { ModelsDb } from "../../database/modelsdb"
import { setTransformToDomainRoute } from "./analysis"
import { ApiAnalysisLTLConvertToNBA } from '../api'
import express from "express"
import { asFsa } from "../../operations/ltl"
import { DomFSA } from "../../config/model"

export function setLTLAnalysisAPI(router: express.Router, modelsDb: ModelsDb) {

    setTransformToDomainRoute(router, modelsDb, ApiAnalysisLTLConvertToNBA, m=>asFsa(m), name => name+'_nba', DomFSA, "Failed to convert to NBA")

    return router

}