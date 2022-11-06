import { DomMPM } from '../config/model'
import { binLibMpm } from '../config/serverconfig'
import { fsReadCodegenFile, fsWriteFile } from '../utils/fsutils'
import * as ops from './operations'

export async function mpmOperationWithStringResult(mpm: string, operationBuilder: (modelFile: string, outputFile: string) => string): Promise<string> {
    return await ops.operationWithStringResult(DomMPM, mpm, operationBuilder)
}

async function genericOperation(mpm: string, operation: string): Promise<string> {
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation ${operation} ${f} > ${g} `)
}


export async function eventSequences(mpm: string): Promise<string> {
    return await genericOperation(mpm, "eventsequences")
}

export async function matrices(mpm: string): Promise<string> {
    return await genericOperation(mpm, "matrices")
}
export async function vectorSequences(mpm: string): Promise<string> {
    return await genericOperation(mpm, "vectorsequences")
}

export async function inputLabels(mpm: string): Promise<string> {
    return await genericOperation(mpm, "inputlabelsmpm")
}

export async function eigenvalue(mpm: string, matrix: string): Promise<string> {
    const maArg = (matrix.length == 0) ? "" : `--matrices ${matrix}`
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation eigenvalue ${maArg} ${f} > ${g} `)
}

export async function eigenvectors(mpm: string, matrix: string): Promise<string> {
    const maArg = (matrix.length == 0) ? "" : `--matrices ${matrix}`
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation eigenvectors ${maArg} ${f} > ${g} `)
}

export async function precedencegraph(mpm: string, matrix: string): Promise<string> {
    const maArg = (matrix.length == 0) ? "" : `--matrices ${matrix}`
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation precedencegraph ${maArg} ${f} > ${g} `)
}


export async function precedencegraphGraphviz(mpm: string, matrix: string): Promise<string> {
    const maArg = (matrix.length == 0) ? "" : `--matrices ${matrix}`
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation precedencegraphgraphviz ${maArg} ${f} > ${g} `)
}

export async function makePrecedenceGraphGraphviz(mpmFile: string, matrix: string, dotFile: string): Promise<void> {
    const mpm = await fsReadCodegenFile(mpmFile)
    const graph = await precedencegraphGraphviz(mpm, matrix)
    await fsWriteFile(dotFile, graph)
}


export async function starclosure(mpm: string, matrix: string): Promise<string> {
    const maArg = (matrix.length == 0) ? "" : `--matrices ${matrix}`
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation starclosure ${maArg} ${f} > ${g} `)
}

export async function vectorTrace(mpm: string, numOfIter: string, initialState: string, inputTraces: string): Promise<string> {
    const optIs = initialState != "" ? `-is ${initialState}` : ''
    const optIt = inputTraces != "" ? `-it ${inputTraces}` : ''
    const optNi = numOfIter != "" ? `-ni ${numOfIter}` : ''
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation vectortrace ${optIs} ${optIt} ${optNi} ${f} > ${g} `)
}

export async function vectorTraceTransform(mpm: string, numOfIter: string, initialState: string, inputTraces: string): Promise<string> {
    const optIs = initialState != "" ? `-is ${initialState}` : ''
    const optIt = inputTraces != "" ? `-it ${inputTraces}` : ''
    const optNi = numOfIter != "" ? `-ni ${numOfIter}` : ''
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation vectortracetransform ${optIs} ${optIt} ${optNi} ${f} > ${g} `)
}

export async function vectorTraceXml(mpm: string, numOfIter: string, vectorTraces: string): Promise<string> {
    const optVt = vectorTraces != "" ? `-sq ${vectorTraces}` : ''
    const optNi = numOfIter != "" ? `-ni ${numOfIter}` : ''
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation vectortracexml ${optVt} ${optNi} ${f} > ${g} `)
}

export async function vectorTraceOfEventAndVectorSequencesXml(mpm: string, eventAndVectorSequences: string): Promise<string> {
    const optVt = eventAndVectorSequences != "" ? `-sq ${eventAndVectorSequences}` : ''
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation vectortracexml ${optVt} ${f} > ${g} `)
}


export async function convolution(mpm: string, sequences: string): Promise<string> {
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation convolution -sq ${sequences} ${f} > ${g} `)
}

export async function multiply(mpm: string, matrices: string, vectorSequence: string): Promise<string> {
    return await mpmOperationWithStringResult(mpm, (f, g) => {
        var seqOpt = ""
        if (vectorSequence.length > 0) {
            seqOpt = `-sq ${vectorSequence}`
        }
        return `"${binLibMpm}" --operation multiply -ma ${matrices} ${seqOpt} ${f} > ${g} `
    })
}

export async function maximum(mpm: string, sequences: string): Promise<string> {
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation maxsequences -sq ${sequences} ${f} > ${g} `)
}

export async function delay(mpm: string, sequence: string, par: string): Promise<string> {
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation delaysequence -sq ${sequence} -pa ${par} ${f} > ${g} `)
}

export async function scale(mpm: string, sequence: string, par: string): Promise<string> {
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation scalesequence -sq ${sequence} -pa ${par} ${f} > ${g} `)
}

export async function convolutionTransform(mpm: string, sequences: string): Promise<string> {
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation convolutiontransform -sq ${sequences} ${f} > ${g} `)
}

export async function maximumTransform(mpm: string, sequences: string): Promise<string> {
    return await mpmOperationWithStringResult(mpm, (f, g) => `"${binLibMpm}" --operation maxsequencestransform -sq ${sequences} ${f} > ${g} `)
}

export async function multiplyTransform(mpm: string, matrices: string, vectorSequence: string): Promise<string> {
    return await mpmOperationWithStringResult(mpm, (f, g) => {
        var seqOpt = ""
        if (vectorSequence.length > 0) {
            seqOpt = `-sq ${vectorSequence}`
        }
        return `"${binLibMpm}" --operation multiplytransform -ma ${matrices} ${seqOpt} ${f} > ${g} `
    })
}
