import { BASE_URL, CONTAINER_BASE_URL } from "../config/config"
import { DomainExtensions } from "../config/model"

// the language for this editor
export const languageIDs = DomainExtensions

export function createUrl(localMode: boolean, path: string) {
    const url = localMode?CONTAINER_BASE_URL:BASE_URL
    const baseProtocolMatch = (url.match(/(.*?):\/\/(.*)/))
    const baseProtocol = baseProtocolMatch[1]
    const baseUrl = baseProtocolMatch[2]
    if (baseProtocol == "http") {
        return `ws://${baseUrl}${path}`
    } else {
        return `wss://${baseUrl}${path}`
    }
}
