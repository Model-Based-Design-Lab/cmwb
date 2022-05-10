// models API

import express from "express"

// restricted

// models API

// get all models for user; no query data
export const ApiModelsGetList = '/api/models/getList'
// delete a model; query: modelId
export const ApiModelsDeleteModel = '/api/models/delete'
// delete all scratch models of module; query: module
export const ApiModelsDeleteScratchModuleModels = '/api/models/deleteScratchModuleModels'
// get a model; query: modelId
export const ApiModelsGetModel = '/api/models/getModel'
// publish a model; query: modelId
export const ApiModelsPublishModel = '/api/models/publishModel'
// unpublish a model; query: modelId
export const ApiModelsUnpublishModel = '/api/models/unpublishModel'
// scratch a model; query: modelId
export const ApiModelsScratchModel = '/api/models/scratchModel'
// unscratch a model; query: modelId
export const ApiModelsUnscratchModel = '/api/models/unscratchModel'
// create a new model; query: modelName, domain, ownerName, group
export const ApiModelsNewModel = '/api/models/newModel'
// rename model; query: modelId,  modelName 
export const ApiModelsRenameModel = '/api/models/renameModel'
export const ApiModelsSetGroupOfModel = '/api/models/setGroupOfModel'
// hand over model to another user; query: modelId, userEmail
export const ApiModelsHandoverModel = '/api/models/handoverModel'
// save model; POST request; query: modelId, modelContent 
export const ApiModelsSaveModel = '/api/models/saveModel'
// run code generation; query: modelId, type
export const ApiModelsCodegen = '/api/models/codegen'
// get a product artifact; query: artifactPath
export const ApiModelsGetArtifact = '/api/models/getArtifact'
// get a binary artifact; query: artifactPath
export const ApiModelsGetBinaryArtifact = '/api/models/getBinaryArtifact'

// preview API

// get the preview; query: modelId
export const ApiModelsGetPreview = '/api/models/getPreview'
// get the preview image; query: previewPath
export const ApiModelsGetPreviewImg = '/api/models/getPreviewImg'

// codegen
// get graphviz graph; query: modelId
export const ApiModelsGetDotGraph = '/api/models/getDotGraph'


// guest allowed calls
export const ApiModelsGetPublicList = '/api/models/getPublicModels'
export const ApiModelsGetPublicDomainList = '/api/models/getPublicDomainModels'
export const ApiModelsGetPublicModuleList = '/api/models/getPublicModuleModels'
export const ApiModelsGetUser = '/api/models/getUserModels'
export const ApiModelsGetUserDomain = '/api/models/getUserDomainModels'
export const ApiModelsGetUserModule = '/api/models/getUserModuleModels'

// analysis API
export const ApiAnalysisFSADetermineAlphabet = '/api/models/analysis/fsa/alphabet'
export const ApiAnalysisFSAReachableStates = '/api/models/analysis/fsa/reachablestates'
export const ApiAnalysisFSACheckEmptiness = '/api/models/analysis/fsa/checkEmptiness'
export const ApiAnalysisFSACheckEmptinessNBA = '/api/models/analysis/fsa/checkEmptinessNBA'
export const ApiAnalysisFSACheckDeterminism = '/api/models/analysis/fsa/checkDeterminism'
export const ApiAnalysisFSACheckWordAcceptance = '/api/models/analysis/fsa/checkWordAcceptance'
export const ApiAnalysisFSACheckLanguageInclusion = '/api/models/analysis/fsa/checkLanguageInclusion'
export const ApiAnalysisFSARelabelStates = '/api/models/analysis/fsa/relabelStates'
export const ApiAnalysisFSAConvertToDFA = '/api/models/analysis/fsa/convertToDFA'
export const ApiAnalysisFSAEliminateEpsilon = '/api/models/analysis/fsa/eliminateEpsilon'
export const ApiAnalysisFSAEliminateEpsilonNBA = '/api/models/analysis/fsa/eliminateEpsilonNBA'
export const ApiAnalysisFSAMakeComplete = '/api/models/analysis/fsa/makeComplete'
export const ApiAnalysisFSAComplement = '/api/models/analysis/fsa/complement'
export const ApiAnalysisFSAMinimize = '/api/models/analysis/fsa/minimize'
export const ApiAnalysisFSAMinimizeNBA = '/api/models/analysis/fsa/minimizeNBA'
export const ApiAnalysisFSAConvertToRegEx = '/api/models/analysis/fsa/convertToRegEx'
export const ApiAnalysisFSASynchronousProduct = '/api/models/analysis/fsa/synchronousProduct'
export const ApiAnalysisFSASynchronousProductNBA = '/api/models/analysis/fsa/synchronousProductNBA'

// FSA conversion
export const ApiAnalysisFSAConvertSVG = '/api/models/analysis/fsa/convertsvg'


// RegEx
export const ApiAnalysisRegExConvertToDFA = '/api/models/analysis/regex/convertToDFA'
export const ApiAnalysisRegExConvertOmegaRegExToNBA = '/api/models/analysis/regex/convertOmegaRegExToNBA'

// LTL
export const ApiAnalysisLTLConvertToNBA = '/api/models/analysis/ltl/convertToNBA'

// DTMC

export const ApiAnalysisDTMCGetStates = '/api/models/analysis/dtmc/getStates'
export const ApiAnalysisDTMCGetRecurrentStates = '/api/models/analysis/dtmc/getRecurrentStates'
export const ApiAnalysisDTMCTransientDistribution = '/api/models/analysis/dtmc/transientDistribution'
export const ApiAnalysisDTMCTransientRewards = '/api/models/analysis/dtmc/transientRewards'
export const ApiAnalysisDTMCTransientMatrix = '/api/models/analysis/dtmc/transientMatrix'
export const ApiAnalysisDTMCCommunicatingClasses = '/api/models/analysis/dtmc/communicatingClasses'
export const ApiAnalysisDTMCClassifyTransientRecurrent = '/api/models/analysis/dtmc/classifyTransientRecurrent'
export const ApiAnalysisDTMCDeterminePeriodicity = '/api/models/analysis/dtmc/determinePeriodicity'
export const ApiAnalysisDTMCDetermineMCType = '/api/models/analysis/dtmc/determineMCType'
export const ApiAnalysisDTMCHittingProbability = '/api/models/analysis/dtmc/hittingProbability'
export const ApiAnalysisDTMCRewardUntilHit = '/api/models/analysis/dtmc/rewardUntilHit'
export const ApiAnalysisDTMCHittingProbabilitySet = '/api/models/analysis/dtmc/hittingProbabilitySet'
export const ApiAnalysisDTMCRewardUntilHitSet = '/api/models/analysis/dtmc/rewardUntilHitSet'
export const ApiAnalysisDTMCLimitingMatrix = '/api/models/analysis/dtmc/limitingMatrix'
export const ApiAnalysisDTMCLimitingDistribution = '/api/models/analysis/dtmc/limitingDistribution'
export const ApiAnalysisDTMCLongRunReward = '/api/models/analysis/dtmc/longRunReward'
export const ApiAnalysisDTMCSimTrace = '/api/models/analysis/dtmc/simTrace'
export const ApiAnalysisDTMCSimLongRunExpectedAverageReward = '/api/models/analysis/dtmc/simLongRunExpectedAverageReward'
export const ApiAnalysisDTMCSimCesaroLimitDistribution = '/api/models/analysis/dtmc/simCesaroLimitDistribution'
export const ApiAnalysisDTMCSimTransientExpectedReward = '/api/models/analysis/dtmc/simTransientExpectedReward'
export const ApiAnalysisDTMCSimTransientDistribution = '/api/models/analysis/dtmc/simTransientDistribution'
export const ApiAnalysisDTMCSimHittingProbabilityState = '/api/models/analysis/dtmc/simHittingProbabilityState'
export const ApiAnalysisDTMCSimHittingRewardState = '/api/models/analysis/dtmc/simHittingRewardState'
export const ApiAnalysisDTMCSimHittingProbabilityStateSet = '/api/models/analysis/dtmc/simHittingProbabilityStateSet'
export const ApiAnalysisDTMCSimHittingRewardStateSet = '/api/models/analysis/dtmc/simHittingRewardStateSet'
export const ApiAnalysisDTMCTransientGraph = '/api/models/analysis/dtmc/transientgraph'

// DTMC conversion
export const ApiAnalysisDTMCConvertSVG = '/api/models/analysis/dtmc/convertsvg'

// SDF analysis
export const ApiAnalysisSDFGetInputLabels = '/api/models/analysis/sdf/inputlabels'
export const ApiAnalysisSDFGetStateLabels = '/api/models/analysis/sdf/statelabels'
export const ApiAnalysisSDFRepetitionVector = '/api/models/analysis/sdf/repetitionvector'
export const ApiAnalysisSDFCheckDeadlock = '/api/models/analysis/sdf/checkdeadlock'
export const ApiAnalysisSDFThroughput = '/api/models/analysis/sdf/throughput'
export const ApiAnalysisSDFLatency = '/api/models/analysis/sdf/latency'
export const ApiAnalysisSDFConvertToSingleRate = '/api/models/analysis/sdf/converttosinglerate'
export const ApiAnalysisSDFStateSpaceMatrices = '/api/models/analysis/sdf/statespacematrices'
export const ApiAnalysisSDFMakeStateMatrixModel = '/api/models/analysis/sdf/makestatematrixmodel'
export const ApiAnalysisSDFMakeStateSpaceMatricesModel = '/api/models/analysis/sdf/makestatespacematricesmodel'
export const ApiAnalysisSDFGanttChart = '/api/models/analysis/sdf/ganttchart'

// SDF conversion
export const ApiAnalysisSDFConvertSVG = '/api/models/analysis/sdf/convertsvg'
export const ApiAnalysisSDFConvertSDF3 = '/api/models/analysis/sdf/convertsdf3'


// MPM analysis
export const ApiAnalysisMPMGetEventSequences = '/api/models/analysis/mpm/eventsequences'
export const ApiAnalysisMPMGetMatrices = '/api/models/analysis/mpm/matrices'
export const ApiAnalysisMPMGetVectorSequences = '/api/models/analysis/mpm/vectorsequences'
export const ApiAnalysisMPMGetInputLabels = '/api/models/analysis/mpm/inputlabels'
export const ApiAnalysisMPMLargestEigenValue = '/api/models/analysis/mpm/largesteigenvalue'
export const ApiAnalysisMPMEigenVectors = '/api/models/analysis/mpm/eigenvectors'
export const ApiAnalysisMPMPrecedenceGraph = '/api/models/analysis/mpm/precedencegraph'
export const ApiAnalysisMPMConvertPrecedenceGraph = '/api/models/analysis/mpm/convertprecedencegraph'
export const ApiAnalysisMPMStarClosure = '/api/models/analysis/mpm/starclosure'
export const ApiAnalysisMPMConvolutionAnalysis = '/api/models/analysis/mpm/convolution'
export const ApiAnalysisMPMConvolutionTransform = '/api/models/analysis/mpm/convolutiontransform'
export const ApiAnalysisMPMMaximumAnalysis = '/api/models/analysis/mpm/maximum'
export const ApiAnalysisMPMMaximumTransform = '/api/models/analysis/mpm/maximumtransform'
export const ApiAnalysisMPMMultiplyAnalysis = '/api/models/analysis/mpm/multiply'
export const ApiAnalysisMPMMultiplyTransform = '/api/models/analysis/mpm/multiplytransform'
export const ApiAnalysisMPMDelaySequence = '/api/models/analysis/mpm/delaysequence'
export const ApiAnalysisMPMScaleSequence = '/api/models/analysis/mpm/scalesequence'
export const ApiAnalysisMPMOutputVectorTraceOfStateSpace = '/api/models/analysis/mpm/outputvectortraceofstatespace'
export const ApiAnalysisMPMOutputVectorTraveOfEventAndVectorSequences = '/api/models/analysis/mpm/outputvectortraceofeventandvectorsequences'


export const ApiAnalysisMPMOutputVectorTraceOfStateSpaceTransform = '/api/models/analysis/mpm/outputvectortraceofstatespacetransform'


// users API
export const ApiUsersVerifyEmail = '/api/users/verifyEmail'
export const ApiUsersSetPassword = '/api/users/setPassword'
export const ApiUsersChangePassword = '/api/users/changePassword'
export const ApiUsersSendResetPasswordLink = '/api/users/sendResetPasswordLink'
export const ApiUsersDeleteAccount = '/api/users/deleteAccount'
export const ApiUsersGetUsers = '/api/users/getUsers'
export const ApiUsersGetUser = '/api/users/getUser'
export const ApiUsersGetUserGroups = '/api/users/getUserGroups'
export const ApiUsersGetActiveGroup = '/api/users/getActiveGroup'
export const ApiUsersSetActiveGroup = '/api/users/setActiveGroup'
export const ApiUsersUpdateUser = '/api/users/updateUser'
export const ApiUsersRegisterAccessCode = '/api/users/registerAccessCode'
export const ApiUsersCreateAccessGroup = '/api/users/createAccessGroup'

// groups
export const ApiUsersAllGroups = '/api/users/allGroups'
export const ApiUsersAllFullGroups = '/api/users/allFullGroups'

// quiz API
export const ApiQuizInitializeExercise = '/api/quiz/initializeExercise'
export const ApiQuizEndExercise = '/api/quiz/endExercise'

// static files API
export const ApiStaticFilesGet = '/api/static'


export function ResultOK(res: { result: string }): boolean 
{
    return res.result == "ok"
}

export function ResultErrorMessage(res: { message: string }): string 
{
    return res.message
}


export function errorResponse(errMsg: string) {
    return {
        result: "error",
        message: errMsg
    }
}

export function okResponse(results: Object) {
    const response = Object.assign({result: "ok"}, results)
    return response
}

export function decodeQuery(encodedQuery: any): any {
    return Object.keys(encodedQuery).reduce(function(result: any, key: string) {
      result[key] = decodeURIComponent(encodedQuery[key])
      return result
    }, {})
}

export function setProcessingRoute(router: express.Router, api: string, operation: (req: any)=>Promise<any>, processResult: (result: any)=>any, errorMsg: string, usePost: boolean = false) {
    const handler = (req: any, res: any) => {
        operation(req)
        .then( result => res.send(okResponse(processResult(result))))
        .catch( reason => 
            res.send(errorResponse(`${errorMsg}: ${reason}`))
        )
    }
    if (usePost) {
        router.post(api, handler)
    } else {
        router.get(api, handler)
    }
}



export function setProcessingWithoutResultRoute(router: express.Router, api: string, operation: (req: any)=>Promise<void>, errorMsg: string, usePost: boolean = false ) {
    return setProcessingRoute(router, api, operation, ()=>{return {}}, errorMsg, usePost)
}
