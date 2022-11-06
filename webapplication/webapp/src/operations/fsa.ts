import { domExtensions, DomFSA } from '../config/model'
import { binLibFsa } from '../config/serverconfig'
import { combiningOperation, combiningOperationWithGenericResult, getBooleanResult, operationWithBooleanAndExplanation, operationWithBooleanResult, operationWithGenericResult, operationWithStringResult, transformingOperation } from './operations'

async function transformingOperationFsa(
    fsa: string, 
    operation: string, 
    srcExt:string = domExtensions.get(DomFSA),
    dstExt:string = domExtensions.get(DomFSA)
    ): Promise<string> 
{
    return await transformingOperation(fsa, operation, new Map(), srcExt, dstExt, DomFSA)
}

async function combiningOperationFsa (fsa1: string, fsa2: string, operation: string): Promise<string> {
    return await combiningOperation(DomFSA, fsa1, fsa2, (f1, f2, g) => `"${binLibFsa}" --operation ${operation} ${f1} --secondaryautomaton ${f2} > ${g} `)
}

export async function combiningAnalysis (fsa1: string, fsa2: string, operationBuilder: (fsaFile1: string, fsaFile2: string, outputFile: string) => string): Promise<[boolean, string]> {
    return await combiningOperationWithGenericResult(DomFSA, fsa1, fsa2, operationBuilder, output=>[getBooleanResult(output), getOutputWord(output)])
}

async function combiningAnalysisFsa (fsa1: string, fsa2: string, operation: string): Promise<[boolean, string]> {
    return await combiningAnalysis(fsa1, fsa2, (f1, f2, g) => `"${binLibFsa}" --operation ${operation} ${f1} --secondaryautomaton ${f2} > ${g} `)
}

async function operationWithBooleanResultFsa (fsa: string, operationBuilder: (fsa: string, outputFile: string) => string): Promise<boolean> {
    return await operationWithBooleanResult(DomFSA, fsa, operationBuilder)
}

async function analysisStringOperationFsa (fsa: string, operation: string): Promise<string> {
    return await operationWithStringResult(DomFSA, fsa, (f,g) => `"${binLibFsa}" --operation ${operation} ${f} > ${g} `)
}

async function analysisOperationWithExplanationFsa (fsa: string, operation: string): Promise<[boolean, string]> {
    return await operationWithBooleanAndExplanation(DomFSA, fsa, (f, g) => `"${binLibFsa}" --operation ${operation} ${f} > ${g} `)
}

export async function asDfa (fsa: string): Promise<string> {
    return await transformingOperationFsa(fsa, 'asDFA')
}

export async function eliminateEpsilon (fsa: string): Promise<string> {
    return await transformingOperationFsa(fsa, 'eliminateEpsilon')
}

export async function asRegEx (fsa: string): Promise<string> {
    return await transformingOperationFsa(fsa, 'asRegEx')
}

export async function accepts(fsa: string, word: string): Promise<[boolean,string]> {
    return await operationWithGenericResult(DomFSA, fsa, (f, g) => `"${binLibFsa}" --operation accepts ${f} --word ${word} > ${g} `, output => [getBooleanResult(output), getOutputTrace(output)])
}

export async function isDeterministic (fsa: string): Promise<[boolean, string]> {
    return await analysisOperationWithExplanationFsa(fsa, 'isDeterministic')
}

export async function alphabet (fsa: string): Promise<string> {
    return await analysisStringOperationFsa(fsa, 'alphabet')
}

export async function reachableStates (fsa: string): Promise<string> {
    return await analysisStringOperationFsa(fsa, 'reachableStates')
}

export async function complete (fsa: string): Promise<string> {
    return await transformingOperationFsa(fsa, 'complete')
}
    
export async function complement (fsa: string): Promise<string> {
    return await transformingOperationFsa(fsa, 'complement')
}

export async function product(fsa1: string, fsa2: string): Promise<string> {
    return await combiningOperationFsa(fsa1, fsa2, 'product')
}

export async function strictProduct(fsa1: string, fsa2: string): Promise<string> {
    return await combiningOperationFsa(fsa1, fsa2, 'strictProduct')
}

export async function productBuchi(fsa1: string, fsa2: string): Promise<string> {
    return await combiningOperationFsa(fsa1, fsa2, 'productBuchi')
}

export async function strictProductBuchi(fsa1: string, fsa2: string): Promise<string> {
    return await combiningOperationFsa(fsa1, fsa2, 'strictProductBuchi')
}

export async function languageEmpty (fsa: string): Promise<[boolean,string, string]> {
    return await operationWithGenericResult(DomFSA, fsa, (f, g) => `"${binLibFsa}" --operation languageEmpty ${f} > ${g} `, output => [getBooleanResult(output), getOutputWord(output), getOutputTrace2(output)])
}

export async function languageEmptyBuchi (fsa: string): Promise<[boolean,string,string]> {
    return await operationWithGenericResult(DomFSA, fsa, (f, g) => `"${binLibFsa}" --operation languageEmptyBuchi ${f} > ${g} `, output => [getBooleanResult(output), getOutputWords(output), getOutputTraces(output)])
}
    
export async function languageIncluded (fsa1: string, fsa2: string): Promise<[boolean,string]> {
	return await combiningAnalysisFsa(fsa1, fsa2, 'languageIncluded')
}

export async function minimize(fsa: string): Promise<string> {
    return await transformingOperationFsa(fsa, 'minimize')
}

export async function minimizeBuchi(fsa: string): Promise<string> {
    return await transformingOperationFsa(fsa, 'minimizeBuchi')
}

export async function relabel (fsa: string): Promise<string> {
    return await transformingOperationFsa(fsa, 'relabel')
}

function wordToLetters(word: string): string
{
	if (word.length == 0) return "()"
	let arrayOfWords = word.split(',')
	let reLetters= /'(.*?)'/i
	const letters = arrayOfWords.map(letter => reLetters.exec(letter)[1])
	return `(${letters.join(', ')})`
}

function getOutputWord(output: string): string {
	var match = /\[(.*?)\]/i.exec(output)
	if (!match) return "No word"
	const word = match[1]
	return wordToLetters(word)
}

function getOutputTrace(output: string): string {
    // assumes that the output trace is the first part between square brackets !
    var match = /.*?\[(.*?)\]/s.exec(output)
	if (!match) return "No trace"
	const trace = match[1]
	return `[${trace}]`
}

function getOutputTrace2(output: string): string {
    // assumes that the output trace is the second part between square brackets !
    var match = /.*?\[.*?\].*?\[(.*?)\]/s.exec(output)
	if (!match) return "No trace"
	const trace = match[1]
	return `[${trace}]`
}


export function getOutputWords(output: string): string {
    var match = /.*?\[(.*?)\].*?\[(.*?)\]/s.exec(output)
	if (!match) return "No word"
    const word1 = wordToLetters(match[1])
    const word2 = wordToLetters(match[2])
    return `${word1} ${word2}**`
}

export function getOutputTraces(output: string): string {
    var match = /.*?\[.*?\].*?\[.*?\].*?\[(.*?)\].*?\[(.*?)\]/s.exec(output)
	if (!match) return "No word"
    return `[${match[1]}]; [${match[2]}]**`
}
