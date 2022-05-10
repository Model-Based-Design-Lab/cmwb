import { domExtensions, DomFSA, DomLTL } from '../config/model'
import { transformingOperation } from './operations'

export async function asFsa (formula: string): Promise<string> {
    return await transformingOperation(formula, 'convertLTL', new Map(), domExtensions.get(DomLTL), domExtensions.get(DomFSA), DomLTL)
}
