import { domExtensions, DomMPM, DomSDF } from '../config/model'
import { binLibSdf } from '../config/serverconfig'
import * as ops from './operations'

export async function sdfOperationWithStringResult(sdf: string, operationBuilder: (modelFile: string, outputFile: string) => string): Promise<string> {
    return await ops.operationWithStringResult(DomSDF, sdf, operationBuilder)
}

export async function throughput(sdf: string): Promise<string> {
    return await sdfOperationWithStringResult(sdf, (f, g) => `"${binLibSdf}" --operation throughput ${f} > ${g} `)
}

export async function inputLabels(sdf: string): Promise<string> {
    return await sdfOperationWithStringResult(sdf, (f, g) => `"${binLibSdf}" --operation inputlabelssdf ${f} > ${g} `)
}

export async function stateLabels(sdf: string): Promise<string> {
    return await sdfOperationWithStringResult(sdf, (f, g) => `"${binLibSdf}" --operation statelabelssdf ${f} > ${g} `)
}

export async function repetitionVector(sdf: string): Promise<string> {
    return await sdfOperationWithStringResult(sdf, (f, g) => `"${binLibSdf}" --operation repetitionvector ${f} > ${g} `)
}

export async function deadlock(sdf: string): Promise<string> {
    return await sdfOperationWithStringResult(sdf, (f, g) => `"${binLibSdf}" --operation deadlock ${f} > ${g} `)
}

export async function latency(sdf: string, period: number): Promise<string> {
    return await sdfOperationWithStringResult(sdf, (f, g) => `"${binLibSdf}" --operation generalizedlatency ${f} -p ${period} > ${g} `)
}

export async function stateMatrix(sdf: string): Promise<string> {
    return await sdfOperationWithStringResult(sdf, (f, g) => `"${binLibSdf}" --operation statematrix ${f} > ${g} `)
}

export async function stateSpaceMatrices(sdf: string): Promise<string> {
    return await sdfOperationWithStringResult(sdf, (f, g) => `"${binLibSdf}" --operation statespacematrices ${f} > ${g} `)
}

export async function convertToStateMatrix(sdf: string): Promise<string> {
    return await ops.transformingOperation(sdf, 'statematrixmodel', new Map(), domExtensions.get(DomSDF), domExtensions.get(DomMPM), DomSDF)
}

export async function convertToStateSpaceMatrices(sdf: string): Promise<string> {
    return await ops.transformingOperation(sdf, 'statespacematricesmodel', new Map(), domExtensions.get(DomSDF), domExtensions.get(DomMPM), DomSDF)
}

export async function convertToSingleRate(sdf: string): Promise<string> {
    return await ops.transformingOperation(sdf, 'converttosinglerate', new Map(), domExtensions.get(DomSDF), domExtensions.get(DomSDF), DomSDF)
}

export async function ganttTraceXml(sdf: string, numOfIter: number, initialState: string, inputTraces: string, zeroBased: boolean): Promise<string> {
    var optIt = inputTraces != "" ? `-it ${inputTraces}` : ''
    var optIs = initialState != "" ? `-is ${initialState}` : ''
    var operation = zeroBased ? "ganttchart-zero-based" : "ganttchart"
    return await sdfOperationWithStringResult(sdf, (f, g) => `"${binLibSdf}" --operation ${operation} ${optIt} ${optIs} -ni ${numOfIter} ${f} > ${g} `)
}
