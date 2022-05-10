

// modules
export const ModuleSDF = 'sdf'
export const ModuleDTMC = 'dtmc'
export const ModuleFSA = 'fsa'

export const Modules = [
	ModuleSDF,
	ModuleDTMC,
	ModuleFSA
]

export const ModuleDescriptions = new Map([
	[ModuleSDF,  'dataflow and max-plus algebra'],
	[ModuleDTMC,  'discrete-time Markov chains'],
	[ModuleFSA,  'regular languages and finite state automata'],
])

// domains
export const DomSDF = 'dataflow'
export const DomMPM = 'mpmatrix'
export const DomDTMC = 'markovchains'
export const DomFSA = 'finitestateautomata'
export const DomRegEx = 'regularexpressions'
export const DomLTL = 'lineartemporallogic'

export const DomainNames = new Map([
	[DomSDF,  'dataflow'],
	[DomFSA,  'finite state automata'],
	[DomDTMC,  'discrete-time Markov chains'],
	[DomLTL,  'linear temporal logic'],
	[DomRegEx,  'regular expressions'],
	[DomMPM,  'max-plus'],
])

export const ModuleNames = new Map([
	[ModuleFSA,  'automata and languages'],
	[ModuleDTMC,  'discrete-time Markov chains'],
	[ModuleSDF,  'max-plus and dataflow'],
])

export const ModuleColors = new Map([
	[ModuleFSA,  '#4f4cfa'],
	[ModuleDTMC,  '#fa4c4c'],
	[ModuleSDF,  '#fadd4c'],
])
export const ModuleColorsDark = new Map([
	[ModuleFSA,  '#4f4cfa'],
	[ModuleDTMC,  '#fa4c4c'],
	[ModuleSDF,  '#fadd4c'],
])

export const ModelTypeNames = new Map([
	[DomSDF,  'dataflow'],
	[DomFSA,  'finite state automaton'],
	[DomDTMC,  'Markov chain'],
	[DomLTL,  'LTL formula'],
	[DomRegEx,  'regular expression'],
	[DomMPM,  'max-plus'],
])

export const DomainExtensions = new Map([
	[DomSDF,  'sdf'],
	[DomMPM,  'mpm'],
	[DomDTMC,  'dtmc'],
	[DomFSA,  'fsa'],
	[DomRegEx,  'regex'],
	[DomLTL,  'ltl']])

export const DomainModules = new Map([
	[DomSDF,  ModuleSDF],
	[DomMPM,  ModuleSDF],
	[DomDTMC, ModuleDTMC],
	[DomFSA,  ModuleFSA],
	[DomRegEx, ModuleFSA],
	[DomLTL,  ModuleFSA]])
	

export const domains = [
	DomSDF,
	DomMPM,
	DomDTMC, 
	DomFSA,
	DomRegEx,
	DomLTL
]

export const domExtensions = new Map([
	[DomSDF,  'sdf'],
	[DomMPM,  'mpm'],
	[DomDTMC,  'dtmc'],
	[DomFSA,  'fsa'],
	[DomRegEx,  'regex'],
	[DomLTL,  'ltl']])

export const sdfTemplate = `
dataflow graph Model {
        A ---> B
        B - initial tokens: 1 --> A
}`


export const mpmTemplate = `
max-plus model MPModel:
matrices
A =
[
	[ 0     -inf ]
	[ -inf  0    ]
]`

export const dtmcTemplate = `
markov chain Model {
        A[p: 0.9] -- 1/2  -> B
        B[r: 3/2] -- 1/10 -> A
}`

export const fsaTemplate = `
finite state automaton Model {
        A initial -- a --> B
        B final   -- a;b --> A
}`

export const regexTemplate = `
regular expression Test = @alpha + @beta
where 
alpha = '0' + '1'
beta = a.b*
`
export const ltlTemplate = `
ltl formula phi = a U b
`

export const ModelTemplates = new Map([
	[DomSDF, sdfTemplate],
	[DomMPM, mpmTemplate],
	[DomDTMC, dtmcTemplate],
	[DomFSA, fsaTemplate],
	[DomRegEx, regexTemplate],
	[DomLTL, ltlTemplate],
])