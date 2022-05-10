import { ValidModelNameRegEx } from '../config/config'
import { DomSDF, DomMPM, DomDTMC, DomFSA, DomRegEx, DomLTL } from '../config/model'

export function saveToFile(content: string, documentName: string, contentType = '') {
    const a = document.createElement('a')
    const file = new Blob([content], { type: contentType })

    a.href = URL.createObjectURL(file)
    a.download = documentName
    a.click()

    URL.revokeObjectURL(a.href)
}

export function secondsSince(d: Date): number {
    const ageMilliseconds = (new Date()).valueOf() - d.valueOf()
    return ageMilliseconds / 1000
}

export function dateAndTimeString(dateLike: any) {
    return  `${new Date(dateLike).toLocaleDateString()}, ${new Date(dateLike).toLocaleTimeString()}`
}

export function asNameWithoutSpaces(name: string) : string {
    if (name===null) {
		throw new Error("Name is not defined");
	}
	return name.replace(/[\s\&\#\%\;]/g, '')
}

export function removeWhiteSpace(s: string) {
    return s.replace(/[\s]/g, '')
}

export const hashString = (s: string) => s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0)

export function onDomain(domain: string, 
	sdf: ()=>any,
	mpm: ()=>any,
	dtmc: ()=>any,
	fsa: ()=>any,
	regex: ()=>any,
	ltl: ()=>any,
	)
{
	switch (domain) {
		case DomSDF: {
			return sdf()
		}
		case DomMPM: {
			return mpm()
		}
		case DomDTMC: {
			return dtmc()
		}
		case DomFSA: {
			return fsa()
		}
		case DomRegEx: {
			return regex()
		}
		case DomLTL: {
			return ltl()
		}
		default: {
			throw new Error(`Unknown domain: ${domain}.`)
			break
		}
	}
}


export function stripSvg(xmlText: string, width?:string, height?:string): string {
	const start = xmlText.indexOf('<svg')
	const end = xmlText.lastIndexOf('</svg>')+6
	var svgText =  xmlText.substr(start, end-start)
	if (width) {
		svgText = svgText.replace(/width\s*=\s*".*?"/, `width="${width}"`)
	}
	if (height) {
		svgText = svgText.replace(/height\s*=\s*".*?"/, `height="${height}"`)
	}
	return svgText
}


export function isInteger(val: string) {
    return /^-?\d+$/.test(val)
}

export function isNonNegativeInteger(val: string) {
    return /^\d+$/.test(val)
}

export function isPositiveInteger(val: string) {
    if (! isNonNegativeInteger(val)) return false
	return parseInt(val) > 0
}


export function isMPNumeric(val: string) {
	if (val.trim()=="") return false
	if (val == '-inf') return true
	if (isNaN(Number(val))) return false
    return true
}

export function isNumeric(val: string) {
	if (val.trim()=="") return false
	if (isNaN(Number(val))) return false
    return true
}

export function isMPVector(val: string) {
	val = val.trim()
	if (val.slice(0,1)!='[' || val.slice(-1)!=']') return false
	const numbers = val.slice(1, -1).split(",").map(n => n.trim())
	// empty brackets are OK
	if (numbers.length == 1 && numbers[0] == "") return true
	return numbers.reduce(
		(valid: boolean, n)=> {
			return valid && isMPNumeric(n)
		}, 
		true)
}

export function isMPInputSequence(val: string) {
	// (for now), same requirements as a vector
	return isMPVector(val)
}

export const IdentifierRegex = /^[A-Z][0-9A-Z_$]*$/i;

export const XtextIDRegex = /^\^?[a-zA-Z\$\_][a-zA-Z\$\_0-9]*$/

export function isIdentifier(val: string) {
	return XtextIDRegex.test(val)
}

export function isValidFSASymbol(s: string): boolean {
	return isIdentifier(s)
}

export const allEmpty = (values: string[]) => {
	return values.reduce((empty, s) => (empty && s==""), true)
	}

export function isValidModelName(n: string) {
	return ValidModelNameRegEx.test(n)
}
