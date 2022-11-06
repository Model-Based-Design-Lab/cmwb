import { DomDTMC, domExtensions } from '../config/model'
import { binLibDtmc } from '../config/serverconfig'
import { fsReadCodegenFile, fsWriteFile } from '../utils/fsutils'
import { operationWithStringResult, transformingOperation } from './operations'

export async function transformingOperationDtmc(
    dtmc: string, 
    operation: string, 
    args: Map<string,string>, 
    srcExt:string = domExtensions.get(DomDTMC), 
    dstExt:string = domExtensions.get(DomDTMC)
    ): Promise<string> 
{
    return await transformingOperation(dtmc, operation, args, srcExt, dstExt, DomDTMC)
}


export async function executionGraph (dtmc: string, numberOfSteps: number): Promise<string> {
    const args = new Map<string,string>()
    args.set("ns", numberOfSteps.toString())
    return await transformingOperationDtmc(dtmc, 'executiongraph', args, domExtensions.get(DomDTMC), 'svg')
}

export async function makeExecutionGraph(dtmcFile: string, numberOfSteps: number, graphFile: string): Promise<void> {
    const dtmc = await fsReadCodegenFile(dtmcFile)
    const graph = await executionGraph(dtmc, numberOfSteps)
    await fsWriteFile(graphFile, graph)
}

export async function dtmcOperationWithStringResult(dtmc: string, operationBuilder: (modelFile: string, outputFile: string) => string): Promise<string> {
    return await operationWithStringResult(DomDTMC, dtmc, operationBuilder)
}

export async function getStates(dtmc: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation liststates ${f} > ${g} `)
}

export async function getRecurrentStates(dtmc: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation listrecurrentstates ${f} > ${g} `)
}


export async function transient(dtmc: string, numberOfSteps: number): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation transient ${f} -ns ${numberOfSteps} > ${g} `)
}

export async function transientRewards(dtmc: string, numberOfSteps: number): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation transientRewards ${f} -ns ${numberOfSteps} > ${g} `)
}

export async function transientMatrix(dtmc: string, numberOfSteps: number): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation transientMatrix ${f} -ns ${numberOfSteps} > ${g} `)
}

export async function communicatingclasses(dtmc: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation communicatingstates ${f} > ${g} `)
}

export async function classifytransientrecurrent(dtmc: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation classifytransientrecurrent ${f} > ${g} `)
}

export async function periodicity(dtmc: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation periodicity ${f} > ${g} `)
}

export async function mctype(dtmc: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation mctype ${f} > ${g} `)
}

export async function hittingprobability(dtmc: string, state: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation hittingprobability ${f} -s ${state} > ${g} `)
}

export async function rewardtillhit(dtmc: string, state: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation rewardtillhit ${f} -s ${state} > ${g} `)
}

export async function hittingprobabilityset(dtmc: string, states: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation hittingprobabilityset ${f} -ss ${states} > ${g} `)
}

export async function rewardtillhitset(dtmc: string, states: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation rewardtillhitset ${f} -ss ${states} > ${g} `)
}

export async function limitingMatrix(dtmc: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation limitingMatrix ${f} > ${g} `)
}

export async function limitingDistribution(dtmc: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation limitingDistribution ${f} > ${g} `)
}

export async function longRunReward(dtmc: string): Promise<string> {
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation longRunReward ${f} > ${g} `)
}

export async function simTrace(dtmc: string, numberOfSteps: number, seed: number|undefined = undefined): Promise<string> {
    const seedOption = seed ? `--seed ${seed}` : ""
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation markovtrace ${f} ${seedOption} -ns ${numberOfSteps} > ${g} `)
}

export async function simLongRunExpectedAverageReward(dtmc: string, conditions: string[], recurrentState: string|undefined = undefined, seed: number|undefined = undefined): Promise<string> {
    const recurrentStateOption = (recurrentState && recurrentState!="") ? `--state ${recurrentState}` : ""
    const seedOption = seed ? `--seed ${seed}` : ""
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation longrunexpectedaveragereward ${f} ${seedOption} ${recurrentStateOption} -c [${conditions}] > ${g} `)
}

export async function simCesaroLimitDistribution(dtmc: string, conditions: string[], recurrentState: string|undefined = undefined, seed: number|undefined = undefined): Promise<string> {
    const recurrentStateOption = (recurrentState && recurrentState!="") ? `--state ${recurrentState}` : ""
    const seedOption = seed ? `--seed ${seed}` : ""
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation cezarolimitdistribution ${f} ${seedOption} ${recurrentStateOption} -c [${conditions}] > ${g} `)
}

export async function simTransientExpectedReward(dtmc: string, numberOfSteps: string, conditions: string[], seed: number|undefined = undefined): Promise<string> {
    const seedOption = seed ? `--seed ${seed}` : ""
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation estimationexpectedreward ${f} ${seedOption} -ns ${numberOfSteps} -c [${conditions}] > ${g} `)
}

export async function simTransientDistribution(dtmc: string, numberOfSteps: string, conditions: string[], seed: number|undefined = undefined): Promise<string> {
    const seedOption = seed ? `--seed ${seed}` : ""
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation estimationdistribution ${f} ${seedOption} -ns ${numberOfSteps} -c [${conditions}] > ${g} `)
}

export async function simHittingProbabilityState(dtmc: string, state: string, conditions: string[], analyzeStates: string[]|undefined, seed: number|undefined = undefined): Promise<string> {
    const seedOption = seed ? `--seed ${seed}` : ""
    const analyzeStatesOption = analyzeStates ? `-sa ${analyzeStates}` : ""
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation estimationhittingstate ${f} ${seedOption} ${analyzeStatesOption} -s ${state} -c [${conditions}] > ${g} `)
}

export async function simHittingRewardState(dtmc: string, state: string, conditions: string[], analyzeStates: string[]|undefined, seed: number|undefined = undefined): Promise<string> {
    const seedOption = seed ? `--seed ${seed}` : ""
    const analyzeStatesOption = analyzeStates ? `-sa ${analyzeStates}` : ""
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation estimationhittingreward ${f} ${seedOption} ${analyzeStatesOption} -s ${state} -c [${conditions}] > ${g} `)
}

export async function simHittingProbabilityStateSet(dtmc: string, states: string, conditions: string[], analyzeStates: string[]|undefined, seed: number|undefined = undefined): Promise<string> {
    const seedOption = seed ? `--seed ${seed}` : ""
    const analyzeStatesOption = analyzeStates ? `-sa ${analyzeStates}` : ""
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation estimationhittingstateset ${f} ${seedOption} ${analyzeStatesOption} -ss ${states} -c [${conditions}] > ${g} `)
}

export async function simHittingRewardStateSet(dtmc: string, states: string, conditions: string[], analyzeStates: string[]|undefined, seed: number|undefined = undefined): Promise<string> {
    const seedOption = seed ? `--seed ${seed}` : ""
    const analyzeStatesOption = analyzeStates ? `-sa ${analyzeStates}` : ""
    return await dtmcOperationWithStringResult(dtmc, (f, g) => `"${binLibDtmc}" --operation estimationhittingrewardset ${f} ${seedOption} ${analyzeStatesOption} -ss ${states} -c [${conditions}] > ${g} `)
}
