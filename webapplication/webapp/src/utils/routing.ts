// kind of polyfill to avoid using 'withRouter'


function makeQueryString(query: any): string {
    return Object.entries(query).map(([k, v]: [string, string]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')

}

export function historyPush(pathname: string, query?: any){
    if (query) {
        window.location.href = `${pathname}?${makeQueryString(query)}`
    } else {
        window.location.href = pathname
    }
}

export function openInNewWindow(pathname: string, query?: any){
    if (query) {
        window.open(`${pathname}?${makeQueryString(query)}`)
    } else {
        window.open(pathname)
    }
}