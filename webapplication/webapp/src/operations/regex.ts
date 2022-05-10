import { domExtensions, DomFSA, DomRegEx } from "../config/model"
import { transformingOperation } from "./operations"


export async function asFsa (regex: string): Promise<string> {
    return await transformingOperation(regex, 'convertRegEx', new Map(), domExtensions.get(DomRegEx), domExtensions.get(DomFSA), DomRegEx)
}

export async function asNba (regex: string): Promise<string> {
    return await transformingOperation(regex, 'convertOmegaRegEx', new Map(), domExtensions.get(DomRegEx), domExtensions.get(DomFSA), DomRegEx)
}
