import { binLibFsa, binLibDtmc, binLibSdf } from "../config/config"
import { DomFSA, DomRegEx, DomDTMC, DomSDF, domExtensions, DomLTL, DomMPM } from "../config/model"
import { cpExecute } from "../utils/cputils"
import { doWithTempFileGetContents, doWithTempFileWithContents, fsReadCodegenFile } from "../utils/fsutils"


function _domainBin(dom: string) {
    switch (dom) {
        case DomFSA:
            return binLibFsa
        case DomRegEx:
            return binLibFsa
        case DomLTL:
            return binLibFsa
        case DomDTMC:
            return binLibDtmc
        case DomSDF:
            return binLibSdf
        case DomMPM:
            return binLibSdf
        default:
            break
    }
}

export async function operationWithGenericResult<TResult>(domain: string, model: string, operationBuilder: (modelFile: string, outputFile: string) => string, resultExtractor: (output: string)=>TResult): Promise<TResult> {

    const output = await doWithTempFileWithContents(model, domExtensions.get(domain), async (f: string)=>{
        return await doWithTempFileGetContents('txt', async (g: string) => {
            const operation = operationBuilder(f, g)
            await cpExecute(operation)        
        })
    })
    return resultExtractor(output)
}

export async function operationWithStringResult(domain: string, model: string, operationBuilder: (modelFile: string, outputFile: string) => string): Promise<string> {
    return await operationWithGenericResult<string>(domain, model, operationBuilder, getStringResult)
}

export async function operationWithBooleanResult(domain: string, model: string, operationBuilder: (modelFile: string, outputFile: string) => string): Promise<boolean> {
    return await operationWithGenericResult<boolean>(domain, model, operationBuilder, getBooleanResult)
}

export async function operationWithBooleanAndExplanation (domain: string, model: string, operationBuilder: (modelFile: string, outputFile: string) => string): Promise<[boolean, string]> {
    return await operationWithGenericResult<[boolean, string]>(domain, model, operationBuilder, output => [getBooleanResult(output), getExplanationResult(output)])
}

export async function transformingOperation (
    modelText: string, 
    operation: string, 
    args: Map<string,string>, 
    srcExt:string, 
    dstExt:string, 
    domain: string
    ): Promise<string> 
{

    return doWithTempFileWithContents(modelText, srcExt, async (f: string) => {
        return await doWithTempFileGetContents(dstExt, async (g: string)=>{
            var argsStr = ""
            args.forEach((argValue, arg) => {
                argsStr += `-${arg} ${argValue} `
            })
            await cpExecute(`"${_domainBin(domain)}" --operation ${operation} ${argsStr} ${f} > ${g} `)        
        })
    })
}

export async function combiningOperationWithGenericResult<TResult> (domain: string, model1: string, model2: string, operationBuilder: (modelFile1: string, modelFile2: string, outputFile: string) => string, resultExtractor: (output: string) => TResult): Promise<TResult> {

    const output = await doWithTempFileWithContents(model1, domExtensions.get(domain), async (f1: string) =>{
        return await doWithTempFileWithContents(model2, domExtensions.get(domain), async (f2: string) => {
            return doWithTempFileGetContents(domExtensions.get(domain), async (g: string) =>{
                const operation = operationBuilder(f1, f2, g)
                await cpExecute(operation)            
            })
        })
    })
    return resultExtractor(output)
}

export async function combiningOperation (domain: string, model1: string, model2: string, operationBuilder: (modelFile1: string, modelFile2: string, outputFile: string) => string): Promise<string> {
    return combiningOperationWithGenericResult<string>(domain, model1, model2, operationBuilder, output=>output)
}

export function getBooleanResult(output: string): boolean {
    var resTrue = output.includes('True')
    var resFalse = output.includes('False')

    if (resTrue && resFalse || !resTrue && !resFalse) {
        throw new Error("No unambiguous boolean result found in output.")
    }
    if (resTrue) return true
    if (resFalse) return false
}

function getStringResult(output: string): string {
    return output
}

export function getExplanationResult(_output: string): string {
    return "Explanation to be implemented"
}


