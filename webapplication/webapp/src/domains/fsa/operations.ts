import { VIEWGRAPH_PATH } from "../../config/config"
import { DomFSA, DomLTL, DomRegEx } from "../../config/model"
import { FSAAnalysisController } from "../../controller/fsaanalysiscontroller"
import { LTLAnalysisController } from "../../controller/ltlanalysiscontroller"
import { ModelsController } from "../../controller/modelscontroller"
import { RegExAnalysisController } from "../../controller/regexanalysiscontroller"
import { extractBuchiStateList, extractSetOfStates, extractStateList } from "../../operations/utils"
import { FileExtensionSVG, MimeTypeSVG } from "../../utils/filetypes"
import { historyPush } from "../../utils/routing"
import { isValidFSASymbol } from "../../utils/utils"
import { buildArguments, Operation, ValidateModelName } from "../operations"

export enum OpFSA {
	// general operations
    CreateFSA,
    CreateRegEx,
    CreateLTL,
	
	// OperationsOnAutomata
    DetermineAlphabet,
    RelabelStates,
    CheckDeterminism,
    ReachableStates,
    ViewGraph,
	
	// OperationsOnAutomataOnFiniteWords
    ConvertToDFA,
    EliminateEpsilon,
    MakeComplete,
    CheckEmptiness,
    SynchronousProduct,
    Complement,
    CheckWordAcceptance,
    CheckLanguageInclusion,
    Minimize,
    ConvertToRegEx,
    ConvertSVG,

	// OperationsOnBuechiAutomata
    CheckEmptinessNBA,
    SynchronousProductNBA,
    EliminateEpsilonNBA,
    MinimizeNBA,

	// OperationsOnRegularExpressions
    RegExConvertToFSA,
    RegExConvertOmegaRegExToNBA,

	// OperationsOnLinearTemporalLogic
	LTLConvertToNBA
}


export const OpFSADescriptions= new Map<OpFSA,string>([

	// general operations
    [OpFSA.CreateFSA, "Create a new FSA model"],
    [OpFSA.CreateRegEx, "Create a new RegEx model"],
    [OpFSA.CreateLTL, "Create a new LTL model"],

	// OperationsOnAutomata
    [OpFSA.DetermineAlphabet, "Determine Alphabet"],
    [OpFSA.RelabelStates, "Relabel States"],
    [OpFSA.CheckDeterminism, "Check Determinism"],
    [OpFSA.ReachableStates, "Reachable States"],
    [OpFSA.ViewGraph, "View Graph"],

	// OperationsOnAutomataOnFiniteWords
    [OpFSA.ConvertToDFA, "Convert to DFA"],
    [OpFSA.EliminateEpsilon, "Eliminate ε"],
    [OpFSA.MakeComplete, "Make Complete"],
    [OpFSA.CheckEmptiness, "Check for emptiness"],
    [OpFSA.SynchronousProduct, "Synchronous Product"],
    [OpFSA.Complement, "Complement"],
    [OpFSA.CheckWordAcceptance, "Check Word Acceptance"],
    [OpFSA.CheckLanguageInclusion, "Check Language Inclusion"],
    [OpFSA.Minimize, "Minimize"],

    [OpFSA.ConvertToRegEx, "Convert to Regular Expression"],
    [OpFSA.ConvertSVG, "Convert to SVG image"],


	// OperationsOnBuechiAutomata
    [OpFSA.CheckEmptinessNBA, "Check for emptiness NBA"],
    [OpFSA.SynchronousProductNBA, "Synchronous Product NBA"],
    [OpFSA.EliminateEpsilonNBA, "Eliminate ε"],
    [OpFSA.MinimizeNBA, "Minimize NBA"],

	// OperationsOnRegularExpressions
    [OpFSA.RegExConvertToFSA, "Convert to FSA"],
    [OpFSA.RegExConvertOmegaRegExToNBA, "Convert ω-RE to NBA"],

	// OperationsOnLinearTemporalLogic
	[OpFSA.LTLConvertToNBA, "Convert to NBA"]
])

export const GeneralOperations = [
	OpFSA.CreateFSA,
	OpFSA.CreateRegEx,
	OpFSA.CreateLTL
]

export const OperationsOnAutomata = [
	OpFSA.DetermineAlphabet,
	OpFSA.RelabelStates,
	OpFSA.CheckDeterminism,
	OpFSA.ReachableStates,
	OpFSA.ViewGraph
]

export const OperationsOnAutomataOnFiniteWords = [
	OpFSA.ConvertToDFA,
	OpFSA.EliminateEpsilon,
	OpFSA.MakeComplete,
	OpFSA.CheckEmptiness,
	OpFSA.SynchronousProduct,
	OpFSA.Complement,
	OpFSA.CheckWordAcceptance,
	OpFSA.CheckLanguageInclusion,
	OpFSA.Minimize,
	OpFSA.ConvertToRegEx,
]

export const OperationsOnBuechiAutomata = [
	OpFSA.CheckEmptinessNBA,
	OpFSA.SynchronousProductNBA,
	OpFSA.EliminateEpsilonNBA,
	OpFSA.MinimizeNBA
]

export const ConversionOperationsOnAutomata = [
	OpFSA.ConvertSVG,
]

export const OperationsOnRegularExpressions = [
	OpFSA.RegExConvertToFSA ,
	OpFSA.RegExConvertOmegaRegExToNBA
]

export const OperationsOnLTLFormulas = [
	OpFSA.LTLConvertToNBA
]

const ValidateInputWord = (w: string) => {
	return w.split(",").map(l=>l.trim()).every(l => isValidFSASymbol(l))
}

const OperationArguments = new Map<OpFSA,any>([
	[OpFSA.CreateFSA, [
		{type: 'text', name:'modelName', question: 'Please enter a name for the new model.', placeholder: "ModelName", validate: ValidateModelName},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.CreateRegEx, [
		{type: 'text', name:'modelName', question: 'Please enter a name for the new model.', placeholder: "ModelName", validate: ValidateModelName}, 
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.CreateLTL, [
		{type: 'text', name:'modelName', question: 'Please enter a name for the new model.', placeholder: "ModelName", validate: ValidateModelName},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.DetermineAlphabet, [
		{type: 'selectedModelId', name:'modelId'}
	]],
	[OpFSA.RelabelStates, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.ReachableStates, [
		{type: 'selectedModelId', name:'modelId'},
	]],
	[OpFSA.ViewGraph, [
		{type: 'selectedModelId', name:'modelId'},
	]],
	[OpFSA.ConvertToDFA, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.EliminateEpsilon, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.MakeComplete, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.CheckEmptiness, [
		{type: 'selectedModelId', name:'modelId'},
	]],
	[OpFSA.SynchronousProduct, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'chooseModelIdFsa', name:'secondModelId', question: "Select model to take the product with."},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.Complement, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.CheckWordAcceptance, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'word', name:'inputWord', question: "Provide input word as a comma-separated list of symbols.", placeholder: "a,b,c", validate: ValidateInputWord},
	]],
	[OpFSA.CheckDeterminism, [
		{type: 'selectedModelId', name:'modelId'},
	]],
	[OpFSA.CheckLanguageInclusion, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'chooseModelIdFsa', name:'secondModelId', question: "Select model to compare the language to."},
	]],
	[OpFSA.Minimize, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.ConvertToRegEx, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.ConvertSVG, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectedModelName', name:'modelName'},
	]],
	[OpFSA.CheckEmptinessNBA, [
		{type: 'selectedModelId', name:'modelId'},
	]],
	[OpFSA.SynchronousProductNBA, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'chooseModelIdFsa', name:'secondModelId', question: "Select model to take the product with."},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.EliminateEpsilonNBA, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.MinimizeNBA, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.RegExConvertToFSA, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.RegExConvertOmegaRegExToNBA, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpFSA.LTLConvertToNBA, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
])


export async function makeOperation(op: OpFSA, component: any): Promise<Operation> {
	const args = await buildArguments(OperationArguments.get(op), component)
	var operation = new Operation()
	switch (op) {
		case OpFSA.CreateFSA:
			operation.setOperation(()=>ModelsController.newModel(args.modelName, DomFSA, args.userName))
			operation.setPostProcessing(async () => component.refreshModels() )
			break

		case OpFSA.CreateRegEx:
			operation.setOperation(()=>ModelsController.newModel(args.modelName, DomRegEx, args.userName))
			operation.setPostProcessing(async _result => component.refreshModels() )
			break

		case OpFSA.CreateLTL:
			operation.setOperation(()=>ModelsController.newModel(args.modelName, DomLTL, args.userName))
			operation.setPostProcessing(async _result => component.refreshModels() )
			break

		case OpFSA.DetermineAlphabet:
			operation.setOperation(()=>FSAAnalysisController.determineAlphabet(args.modelId))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The alphabet of automaton ${component.getModelName(args.modelId)} is:\n${tResult}`))
			break

		case OpFSA.ReachableStates:
			operation.setOperation(() => FSAAnalysisController.reachableStates(args.modelId))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The reachable states of automaton ${component.getModelName(args.modelId)} are:`)
				component.processAnalysisResult(tResult)
				component.setAnimationSetOfStates(extractSetOfStates(tResult))
			})
			break

		case OpFSA.CheckEmptiness:
			operation.setOperation(() => FSAAnalysisController.checkEmptiness(args.modelId))
			operation.setPostProcessing(async ([bResult, tResult1, tResult2]) => {
				if (bResult) {
					component.processAnalysisResult(`The automaton ${component.getModelName(args.modelId)} has an empty language.`)
				} else {
					component.processAnalysisResult(`The automaton ${component.getModelName(args.modelId)} does not have an empty language. It accepts the word: ${tResult1}`)
					component.setAnimationStateSequence(extractStateList(tResult2))
				}	
			})
			break

		case OpFSA.CheckEmptinessNBA:
			operation.setOperation(() => FSAAnalysisController.checkEmptinessNBA(args.modelId))
			operation.setPostProcessing(async ([bResult, tResult1, tResult2]) => {
				if (bResult) {
					component.processAnalysisResult(`The automaton ${component.getModelName(args.modelId)} has an empty language.`)
				} else {
					component.processAnalysisResult(`The automaton ${component.getModelName(args.modelId)} does not have an empty language. It accepts the word: ${tResult1}`)
					component.setAnimationStateSequence(extractBuchiStateList(tResult2))
				}	
			})
			break

		case OpFSA.RelabelStates:
			operation.setOperation(() => FSAAnalysisController.relabelStates(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the relabeled automaton is ${newName}.`)
				component.refreshModels()
			})
			break
			
		case OpFSA.ConvertToDFA:
			operation.setOperation(() => FSAAnalysisController.convertToDFA(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the automaton converted to DFA is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpFSA.EliminateEpsilon:
			operation.setOperation(() => FSAAnalysisController.eliminateEpsilon(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the automaton without epsilon transitions is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpFSA.EliminateEpsilonNBA:
			operation.setOperation(() => FSAAnalysisController.eliminateEpsilonNBA(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the automaton without epsilon transitions is ${newName}.`)
				component.refreshModels()
			})
			break				

		case OpFSA.MakeComplete:
			operation.setOperation(() => FSAAnalysisController.makeComplete(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the completed automaton is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpFSA.Complement:
			operation.setOperation(() => FSAAnalysisController.complement(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the complement automaton is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpFSA.SynchronousProduct:
			operation.setOperation(() => FSAAnalysisController.synchronousProduct(args.modelId, args.secondModelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the product automaton is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpFSA.SynchronousProductNBA:
			operation.setOperation(() => FSAAnalysisController.synchronousProductNBA(args.modelId, args.secondModelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the product automaton is ${newName}.`)
				component.refreshModels()
			})
			break
	
		case OpFSA.CheckWordAcceptance:
			operation.setOperation(() => FSAAnalysisController.checkWordAcceptance(args.modelId, args.inputWord))
			operation.setPostProcessing(async ([bResult, tResult]) => {
				if (bResult) {
					component.processAnalysisResult(`The automaton ${component.getModelName(args.modelId)} accepts the word ${args.inputWord}.`)
					component.setAnimationStateSequence(extractStateList(tResult))
				} else {
					component.processAnalysisResult(`The automaton ${component.getModelName(args.modelId)} does not accept the word ${args.inputWord}.`)
				}	
			})
			break
	
		case OpFSA.CheckDeterminism:
			operation.setOperation(() => FSAAnalysisController.checkDeterminism(args.modelId))
			operation.setPostProcessing(async ([bResult, tResult]) => {
				if (bResult) {
					component.processAnalysisResult(`The automaton ${component.getModelName(args.modelId)} is deterministic.`)
				} else {
					component.processAnalysisResult(`The automaton ${component.getModelName(args.modelId)} is not deterministic.`)
				}	
			})
			break

		case OpFSA.CheckLanguageInclusion:
			operation.setOperation(() => FSAAnalysisController.checkLanguageInclusion(args.modelId, args.secondModelId))
			operation.setPostProcessing(async ([bResult, tResult]) => {
				if (bResult) {
					component.processAnalysisResult(`The language of automaton ${component.getModelName(args.modelId)} is included in the language of automaton ${component.getModelName(args.secondModelId)}.`)
				} else {
					component.processAnalysisResult(`The language of automaton ${component.getModelName(args.modelId)} is not included in the language of automaton ${component.getModelName(args.secondModelId)}.`)
					component.processAnalysisResult(`It accepts the word ${tResult}, which is not in the language of ${component.getModelName(args.secondModelId)}.`)
				}
			})
			break

		case OpFSA.Minimize:
			operation.setOperation(() => FSAAnalysisController.minimize(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The minimized automaton is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpFSA.MinimizeNBA:
			operation.setOperation(() => FSAAnalysisController.minimizeNBA(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The minimized automaton is ${newName}.`)
				component.refreshModels()
			})
			break
				
		case OpFSA.ConvertToRegEx:
			operation.setOperation(() => FSAAnalysisController.convertToRegEx(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The new regular expression is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpFSA.ConvertSVG:
			operation.setOperation(() => FSAAnalysisController.convertToSVG(args.modelId, args.modelName))
			operation.setPostProcessing(async artifact => component.processDownloadArtifact(`SVG image of ${args.modelName}`,artifact, MimeTypeSVG, `${args.modelName}.${FileExtensionSVG}`))
			break
				
		case OpFSA.ViewGraph:
			operation.setOperation(async () => historyPush(VIEWGRAPH_PATH,{ modelId: args.modelId}))
			break

		case OpFSA.RegExConvertToFSA:
			operation.setOperation(() => RegExAnalysisController.convertToFSA(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The new automaton is ${newName}.`)
				component.refreshModels()
			})
			break
				
		case OpFSA.RegExConvertOmegaRegExToNBA:
			operation.setOperation(() => RegExAnalysisController.convertOmegaRegExToNBA(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The new automaton is ${newName}.`)
				component.refreshModels()
			})
			break
				
		case OpFSA.LTLConvertToNBA:
			operation.setOperation(() => LTLAnalysisController.convertToNBA(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The new automaton is ${newName}.`)
				component.refreshModels()
			})
			break
	
		default:
			break
	}
	return operation
}
