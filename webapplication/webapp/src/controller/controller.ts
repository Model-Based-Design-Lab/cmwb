// The client-side object that executes all operations requested by the UI
import fetch from 'isomorphic-fetch'

import { ResultErrorMessage, ResultOK } from "../api/api"
import { BASE_PATH, BASE_PATH_RESTRICTED } from '../config/config'



export class Controller {

    protected static async fetch(api: string, query?: any, usePost: boolean = false): Promise<Response> {
        return this.fetchWithUrl(`${BASE_PATH_RESTRICTED}`, api, query, usePost)
    }

    protected static async fetchUnrestricted(api: string, query?: any): Promise<Response> {
        // return this.fetchWithUrl(`${BASE_URL}${BASE_PATH}`, api, query)
        return this.fetchWithUrl(`${BASE_PATH}`, api, query)
    }

    private static async fetchWithUrl(urlPrefix: string, api: string, query?: any, usePost: boolean = false): Promise<Response> {
        if (usePost) {
            return fetch(`${urlPrefix}${api}`, {
                method: "POST",
                body: JSON.stringify(query?query:{}),
                headers: {
                    "Content-Type": "application/json"
                 },            
            })
        } else {
            var queryString = ""
            if (query) {
                queryString = `?${Object.keys(query).map(k => `${k}=${encodeURIComponent(query[k])}`).join("&")}`
            }
            return fetch(`${urlPrefix}${api}${queryString}`)
        }
    }

    protected static async fetchResponseObject(api: string, query?: any, usePost: boolean = false): Promise<any> {
        const res = await this.fetch(api, query, usePost)
        return await res.json()
    }

    protected static async fetchResponseObjectUnrestricted(api: string, query?: any): Promise<any> {
        const res = await this.fetchUnrestricted(api, query)
        return await res.json()
    }

    protected static async requestWithResponse(api: string, query: any, usePost: boolean = false): Promise<void>{
        const respObj = await this.fetchResponseObject(api, query, usePost)
        if (ResultOK(respObj)) {
            return
        } else {
            throw new Error(ResultErrorMessage(respObj))
        }
    }

    protected static async requestWithResponseUnrestricted(api: string, query: any): Promise<void>{
        const respObj = await this.fetchResponseObjectUnrestricted(api, query)
        if (ResultOK(respObj)) {
            return
        } else {
            throw new Error(ResultErrorMessage(respObj))
        }
    }

    protected static async requestWithResponseAndData<TResponseData>(api: string, query: any, extractData: (arg0: any) => TResponseData): Promise<TResponseData>{
        const respObj = await this.fetchResponseObject(api, query)
        if (ResultOK(respObj)) {
            return extractData(respObj)
        } else {
            throw new Error(ResultErrorMessage(respObj))
        }
    }

    protected static async requestWithResponseAndDataUnrestricted<TResponseData>(api: string, query: any, extractData: (arg0: any) => TResponseData): Promise<TResponseData>{
        const respObj = await this.fetchResponseObjectUnrestricted(api, query)
        if (ResultOK(respObj)) {
            return extractData(respObj)
        } else {
            throw new Error(ResultErrorMessage(respObj))
        }
    }

}


