
function extractQuotedStates(seq: string): string[]
{
    // match the individual states between single quotes
    var stateRegex = /'(.*?)'/g
    var matchArray: any[]
    var states = []
    while ((matchArray = stateRegex.exec(seq)) !== null) {
        states.push(matchArray[1])
    }
    return states
}

export function extractStateList(outputText: string) {
    // match the sequence between square brackets
    const seq: string = (outputText.match(/\[(.*?)\]/))[1]
    return extractQuotedStates(seq)
}

export function extractBuchiStateList(outputText: string) {
    // match the sequences between square brackets
    const match = (outputText.match(/\[(.*?)\].*?\[(.*?)\]/))
    const seq1: string = match[1]
    const seq2: string = match[2]
    const sSeq1 = extractQuotedStates(seq1)
    const sSeq2 = extractQuotedStates(seq2)
    // repeat the cycle 4 times
    return sSeq1.concat(sSeq2).concat(sSeq2).concat(sSeq2).concat(sSeq2)
}

function trimAndRemoveQuotes(s: string) {
    const trimmed = s.trim()
    if (trimmed.length<2) return trimmed
    if (trimmed[0]=="'" && trimmed[trimmed.length-1] == "'") return trimmed.substr(1, trimmed.length-2)
    return trimmed
}

function findClosingParenthesis(states: string, startingIndex: number): number {
    var p = startingIndex
    while (states[p] != ')') {
        if (states[p] == '(') {
            p = findClosingParenthesis(states, p+1)
        }
        if (states[p] == '{') {
            p = findClosingCurlyBracket(states, p+1)
        }
        p += 1
    }
    return p
}

function findClosingCurlyBracket(states: string, startingIndex: number): number {
    var p = startingIndex
    while (states[p] != '}') {
        if (states[p] == '(') {
            p = findClosingParenthesis(states, p+1)
        }
        if (states[p] == '{') {
            p = findClosingCurlyBracket(states, p+1)
        }
        p += 1
    }
    return p
}

function removeStateFromFront(states: string) {
    if (states[0] == '(') {
        const p = findClosingParenthesis(states, 1)
        return [states.substr(0, p+1), states.substr(p+2)]
    }
    if (states[0] == '{') {
        const p = findClosingCurlyBracket(states, 1)
        return [states.substr(0, p+1), states.substr(p+2)]
    }
    const p = states.indexOf(",")
    if (p==-1) return [states.trim(), "" ]
    return [states.substr(0, p), states.substr(p+1)]
}

function splitStates(states: string): string[]
{
    // note that for automata states can include curly braces, parentheses and commas
    states = states.trim()
    // check for brackets
    var result = []
    var state: string
    var oldLength = states.length
    while(states.length > 0) {
        [state, states] = removeStateFromFront(states)
        states = states.trim()
        if (states.length == oldLength) throw new Error("Something went wrong.")
        oldLength = states.length
        result.push(state)
    }
    return result
}

export function extractSetOfStates(text: string) {
    // match the sequence between curly brackets
    const seq: string = (text.match(/\{(.*)\}/))[1]
    const parts = splitStates(seq)
    return parts.map(p => trimAndRemoveQuotes(p))
}

export function extractPartitioning(outputText: string) {

    // match the sets of states
    var setRegex = /\{.*?\}/g
    var matchArray: any[]
    var sets = []
    while ((matchArray = setRegex.exec(outputText)) !== null) {
        sets.push(extractSetOfStates(matchArray[0]))
    }
    return sets
}

export function extractInconsistentCycle(outputText: string) {

    // match the sets of actors
    var actorsRegex = /following actors:\s(.*?)$/g
    var matchArray: any[]
    var actors = []
    while ((matchArray = actorsRegex.exec(outputText)) !== null) {
        actors.push(splitStates(matchArray[1]))
    }
    return actors
}