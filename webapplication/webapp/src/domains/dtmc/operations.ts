import { IStoppingConditions, SimulationOptions } from "../../components/Controls/StoppingCondition"
import { VIEWGRAPH_PATH } from "../../config/config"
import { DomDTMC } from "../../config/model"
import { DTMCAnalysisController } from "../../controller/dtmcanalysiscontroller"
import { ModelsController } from "../../controller/modelscontroller"
import { extractPartitioning, extractStateList } from "../../operations/utils"
import { FileExtensionSVG, MimeTypeSVG } from "../../utils/filetypes"
import { historyPush } from "../../utils/routing"
import { isNonNegativeInteger, isNumeric } from "../../utils/utils"
import { buildArguments, Operation, ValidateAllowEmpty, ValidateModelName, ValidateNonNegativeInteger, ValidateNumber, ValidatePositiveInteger } from "../operations"

export enum OpDTMC {
	CreateDTMC,
	TransientDistribution,
	TransientRewards,
	TransientMatrix,
	CommunicatingClasses,
	ClassifyTransientRecurrent,
	DeterminePeriodicity,
	DetermineMCType,
	HittingProbability,
	RewardUntilHit,
	HittingProbabilitySet,
	RewardUntilHitSet,
	LimitingMatrix,
	LimitingDistribution,
	LongRunReward,
	ViewTransitionDiagram,
	ViewTransientGraph,
	SimTrace,
	SimLongRunExpectedAverageReward,
	SimCesaroLimitDistribution,
	SimTransientExpectedReward,
	SimTransientDistribution,
	SimHittingProbabilityState,
	SimHittingRewardState,
	SimHittingProbabilityStateSet,
	SimHittingRewardStateSet,
	ConvertSVG,
}

export const OpDTMCDescriptions= new Map<OpDTMC,string>([
    [OpDTMC.CreateDTMC, "Create a new DTMC model"],
    [OpDTMC.TransientDistribution, "Transient Distribution"],
    [OpDTMC.TransientRewards, "Transient Reward"],
    [OpDTMC.TransientMatrix, "Transient Matrix"],
    [OpDTMC.CommunicatingClasses, "Communicating Classes"],
    [OpDTMC.ClassifyTransientRecurrent, "Classify Transient Recurrent"],
    [OpDTMC.DeterminePeriodicity, "Determine Periodicity"],
    [OpDTMC.DetermineMCType, "Determine MC Type"],
    [OpDTMC.HittingProbability, "Hitting Probability"],
    [OpDTMC.RewardUntilHit, "Reward until Hit"],
    [OpDTMC.HittingProbabilitySet, "Hitting Probability Set"],
    [OpDTMC.RewardUntilHitSet, "Reward until Hit Set"],
    [OpDTMC.LimitingMatrix, "Limiting Matrix"],
    [OpDTMC.LimitingDistribution, "Limiting Distribution"],
    [OpDTMC.LongRunReward, "Long-run Reward"],
    [OpDTMC.ViewTransitionDiagram, "View Transition Diagram"],
    [OpDTMC.ViewTransientGraph, "View Transient Graph"],
    [OpDTMC.SimTrace, "Simulate Trace"],
    [OpDTMC.SimLongRunExpectedAverageReward, "Long-run Average Reward"],
    [OpDTMC.SimCesaroLimitDistribution, "Cesàro Limit Distribution"],
    [OpDTMC.SimTransientExpectedReward, "Transient Reward"],
    [OpDTMC.SimTransientDistribution, "Transient Distribution"],
    [OpDTMC.SimHittingProbabilityState, "Hitting Probability"],
    [OpDTMC.SimHittingRewardState, "Reward until Hit"],
    [OpDTMC.SimHittingProbabilityStateSet, "Hitting Probability Set"],
    [OpDTMC.SimHittingRewardStateSet, "Reward until Hit Set"],
    [OpDTMC.ConvertSVG, "Convert to SVG"]
])


export const GeneralOperations = [
	OpDTMC.CreateDTMC,
]

export const OperationsOnMarkovChains = [
    OpDTMC.TransientDistribution,
    OpDTMC.TransientRewards,
    OpDTMC.TransientMatrix,
    OpDTMC.CommunicatingClasses,
    OpDTMC.ClassifyTransientRecurrent,
    OpDTMC.DeterminePeriodicity,
    OpDTMC.DetermineMCType,
    OpDTMC.HittingProbability,
    OpDTMC.RewardUntilHit,
    OpDTMC.HittingProbabilitySet,
    OpDTMC.RewardUntilHitSet,
    OpDTMC.LimitingMatrix,
    OpDTMC.LimitingDistribution,
    OpDTMC.LongRunReward,
    OpDTMC.ViewTransitionDiagram,
    OpDTMC.ViewTransientGraph,
]

export const SimulationOperationsOnMarkovChains = [
    OpDTMC.SimTrace,
    OpDTMC.SimLongRunExpectedAverageReward,
    OpDTMC.SimCesaroLimitDistribution,
    OpDTMC.SimTransientExpectedReward,
    OpDTMC.SimTransientDistribution,
    OpDTMC.SimHittingProbabilityState,
    OpDTMC.SimHittingRewardState,
    OpDTMC.SimHittingProbabilityStateSet,
    OpDTMC.SimHittingRewardStateSet,
]

export const ConversionOperationsOnMarkovChains = [
	OpDTMC.ConvertSVG,
]


const ValidateStoppingConditions = (sc: IStoppingConditions) => {
	if (! isNumeric(sc.confidenceLevel)) return false
	// if ([sc.absoluteErrorBound, sc.relativeErrorBound].every(v => v=="")) return false
	if (! (sc.numberOfRealizations=="" || isNonNegativeInteger(sc.numberOfRealizations))) return false
	if (! ValidateAllowEmpty(ValidateNumber)(sc.absoluteErrorBound)) return false
	if (! ValidateAllowEmpty(ValidateNumber)(sc.relativeErrorBound)) return false
	if (! ValidateAllowEmpty(ValidateNonNegativeInteger)(sc.maxPathLength)) return false
	if (! ValidateAllowEmpty(ValidateNonNegativeInteger)(sc.numberOfRealizations)) return false
	if (! ValidateAllowEmpty(ValidateNumber)(sc.timeOut)) return false
	return true
}

const OperationArguments = new Map<OpDTMC,any>([
	[OpDTMC.CreateDTMC, [
		{type: 'text', name: 'modelName', question: 'Please enter a name for the new model.', placeholder: "ModelName", validate: ValidateModelName}, 
		{type: 'userName', name: 'userName'}
	]],
	[OpDTMC.TransientDistribution, [
		{type: 'number', name:'numberOfSteps', question: 'Please provide the number of steps.', placeholder: "N", validate: ValidateNonNegativeInteger}, 
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.TransientRewards, [
		{type: 'number', name: 'numberOfSteps', question: 'Please provide the number of steps.', placeholder: "N", validate: ValidateNonNegativeInteger}, 
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.TransientMatrix, [
		{type: 'number', name:'numberOfSteps', question: 'Please provide the number of steps.', placeholder: "N", validate: ValidateNonNegativeInteger}, 
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.CommunicatingClasses, [
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.ClassifyTransientRecurrent, [
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.DeterminePeriodicity, [
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.DetermineMCType, [
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.HittingProbability, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseState', name: 'state', question: 'Select state for hitting probability.'}
	]],
	[OpDTMC.RewardUntilHit, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseState', name: 'state', question: 'Select state to determine expected reward until it is hit.'}
	]],
	[OpDTMC.HittingProbabilitySet, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseStateSet', name: 'states', question: 'Select set of states for hitting probability.'}
	]],
	[OpDTMC.RewardUntilHitSet, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseStateSet', name: 'states', question: 'Select set of states to determine expected reward until it is hit.'}
	]],
	[OpDTMC.LimitingMatrix, [
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.LimitingDistribution, [
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.LongRunReward, [
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.ViewTransitionDiagram, [
		{type: 'selectedModelId', name: 'modelId'}
	]],
	[OpDTMC.SimTrace, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'number', name:'numberOfSteps', question: 'Please provide the number of steps.',placeholder: "N", validate: ValidateNonNegativeInteger}, 
		{type: 'number', name:'seed', question: 'Please provide simulation seed (integer number) or empty for a random seed.',placeholder: "seed number", validate: ValidateAllowEmpty(ValidateNonNegativeInteger), advanced: true, defaultValue: ""}, 
	]],
	[OpDTMC.SimLongRunExpectedAverageReward, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseRecurrentState', name: 'recurrentState', question: 'Optionally select recurrent state.'},
		{type: 'chooseStoppingConditions', name: 'conditions', question: 'Select values for the following criteria. ', initialValues: ["0.95", "", "", "10000", "", ""], isTransientAnalysis: false, validate: ValidateStoppingConditions},
		{type: 'number', name:'seed', question: 'Please provide simulation seed (integer number) or empty for a random seed.',placeholder: "seed number", validate: ValidateAllowEmpty(ValidateNonNegativeInteger), advanced: true, defaultValue: ""}, 
	]],
	[OpDTMC.SimCesaroLimitDistribution, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseRecurrentState', name: 'recurrentState', question: 'Optionally select recurrent state.'},
		{type: 'chooseStoppingConditions', name: 'conditions', question: 'Select values for the following criteria. ', initialValues: ["0.95", "", "", "1000", "", ""], isTransientAnalysis: false, validate: ValidateStoppingConditions},
		{type: 'number', name:'seed', question: 'Please provide simulation seed (integer number) or empty for a random seed.',placeholder: "seed number", validate: ValidateAllowEmpty(ValidateNonNegativeInteger), advanced: true, defaultValue: ""}, 
	]],
	[OpDTMC.SimTransientExpectedReward, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'number', name:'numberOfSteps', question: 'Please provide the number of steps.',placeholder: "N", validate: ValidatePositiveInteger}, 
		{type: 'chooseStoppingConditions', name: 'conditions', question: 'Select values for the following criteria. ', initialValues: ["0.95", "", "", "", "1000", ""], hiddenOptions: [SimulationOptions.MaxPathLength], isTransientAnalysis: true, validate: ValidateStoppingConditions},
		{type: 'number', name:'seed', question: 'Please provide simulation seed (integer number) or empty for a random seed.',placeholder: "seed number", validate: ValidateAllowEmpty(ValidateNonNegativeInteger), advanced: true, defaultValue: ""}, 
	]],
	[OpDTMC.SimTransientDistribution, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'number', name:'numberOfSteps', question: 'Please provide the number of steps.',placeholder: "N"}, 
		{type: 'chooseStoppingConditions', name: 'conditions', question: 'Select values for the following criteria. ', initialValues: ["0.95", "", "", "", "1000", ""], hiddenOptions: [SimulationOptions.MaxPathLength], isTransientAnalysis: true, validate: ValidateStoppingConditions},
		{type: 'number', name:'seed', question: 'Please provide simulation seed (integer number) or empty for a random seed.',placeholder: "seed number", validate: ValidateAllowEmpty(ValidateNonNegativeInteger), advanced: true, defaultValue: ""}, 
	]],
	[OpDTMC.SimHittingProbabilityState, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseState', name: 'state', question: 'Select state for hitting probability.'},
		{type: 'chooseStoppingConditions', name: 'conditions', question: 'Select values for the following criteria. ', initialValues: ["0.95", "", "", "50", "1000", ""], isTransientAnalysis: true, validate: ValidateStoppingConditions},
		{type: 'chooseStateSetOptional', name: 'analyzeStates', question: 'Optionally limit the states to analyze.'},
		{type: 'number', name:'seed', question: 'Please provide simulation seed (integer number) or empty for a random seed.', placeholder: "seed number", validate: ValidateAllowEmpty(ValidateNonNegativeInteger), advanced: true, defaultValue: ""}, 
	]],
	[OpDTMC.SimHittingRewardState, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseState', name: 'state', question: 'Select state for expected reward until hit.'},
		{type: 'chooseStoppingConditions', name: 'conditions', question: 'Select values for the following criteria. ', initialValues: ["0.95", "", "", "50", "1000", ""], isTransientAnalysis: true, validate: ValidateStoppingConditions},
		{type: 'chooseStateSetOptional', name: 'analyzeStates', question: 'Optionally limit the states to analyze.'},
		{type: 'number', name:'seed', question: 'Please provide simulation seed (integer number) or empty for a random seed.', placeholder: "seed number", validate: ValidateAllowEmpty(ValidateNonNegativeInteger), advanced: true, defaultValue: ""}, 
	]],
	[OpDTMC.SimHittingProbabilityStateSet, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseStateSet', name: 'states', question: 'Select set of states for hitting probability.'},
		{type: 'chooseStoppingConditions', name: 'conditions', question: 'Select values for the following criteria. ', initialValues: ["0.95", "", "", "50", "1000", ""], isTransientAnalysis: true, validate: ValidateStoppingConditions},
		{type: 'chooseStateSetOptional', name: 'analyzeStates', question: 'Optionally limit the states to analyze.'},
		{type: 'number', name:'seed', question: 'Please provide simulation seed (integer number) or empty for a random seed.', placeholder: "seed number", validate: ValidateAllowEmpty(ValidateNonNegativeInteger), advanced: true, defaultValue: ""}, 
	]],
	[OpDTMC.SimHittingRewardStateSet, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'chooseStateSet', name: 'states', question: 'Select set of states for expected reward until set is hit.'},
		{type: 'chooseStoppingConditions', name: 'conditions', question: 'Select values for the following criteria. ', initialValues: ["0.95", "", "", "50", "1000", ""], isTransientAnalysis: true, validate: ValidateStoppingConditions},
		{type: 'chooseStateSetOptional', name: 'analyzeStates', question: 'Optionally limit the states to analyze.'},
		{type: 'number', name:'seed', question: 'Please provide simulation seed (integer number) or empty for a random seed.', placeholder: "seed number", validate: ValidateAllowEmpty(ValidateNonNegativeInteger), advanced: true, defaultValue: ""}, 
	]],
	[OpDTMC.ViewTransientGraph, [
		{type: 'selectedModelId', name: 'modelId'},
		{type: 'selectedModelName', name:'modelName'},
		{type: 'number', name:'numberOfSteps', question: 'Please provide the number of steps.',placeholder: "N", validate: ValidateNonNegativeInteger}, 
	]],
	[OpDTMC.ConvertSVG, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectedModelName', name:'modelName'},
	]],
])


export async function makeOperation(op: OpDTMC, component: any): Promise<Operation> {
	const args = await buildArguments(OperationArguments.get(op), component)
	var operation = new Operation()
	switch (op) {

		case OpDTMC.CreateDTMC:
			operation.setOperation(()=>ModelsController.newModel(args.modelName, DomDTMC, args.userName))
			operation.setPostProcessing(async _result => component.refreshModels() )
			break

		case OpDTMC.TransientDistribution:
			operation.setOperation(async ()=> DTMCAnalysisController.transientDistribution(args.modelId, args.numberOfSteps))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The transient distributions of ${component.getModelName(args.modelId)} for ${args.numberOfSteps} steps is as follows.\n${tResult}`))
			break

		case OpDTMC.TransientRewards:
			operation.setOperation(async () => DTMCAnalysisController.transientRewards(args.modelId, args.numberOfSteps))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The transient reward of ${component.getModelName(args.modelId)} for ${args.numberOfSteps} steps is as follows.\n${tResult}`))
			break

		case OpDTMC.TransientMatrix:
			operation.setOperation(async () => DTMCAnalysisController.transientMatrix(args.modelId, args.numberOfSteps))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The transient matrix of ${component.getModelName(args.modelId)} for ${args.numberOfSteps} steps is as follows.\n${tResult}`))
			break

		case OpDTMC.CommunicatingClasses:
			operation.setOperation(async () => DTMCAnalysisController.communicatingClasses(args.modelId))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The communicating classes of ${component.getModelName(args.modelId)} are as follows.\n${tResult}`)
				component.setAnimationPartitioning(extractPartitioning(tResult))
			})
			break

		case OpDTMC.ClassifyTransientRecurrent:
			operation.setOperation(async () => DTMCAnalysisController.classifyTransientRecurrent(args.modelId))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The classification of ${component.getModelName(args.modelId)} into transient and recurrent states is as follows.\n${tResult}`)
				component.setAnimationPartitioning(extractPartitioning(tResult))
			})
			break

		case OpDTMC.DeterminePeriodicity:
			operation.setOperation(async () => DTMCAnalysisController.determinePeriodicity(args.modelId))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The periodicity of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`)
				component.setAnimationPartitioning(extractPartitioning(tResult))
			})
			break

		case OpDTMC.DetermineMCType:
			operation.setOperation(async () => DTMCAnalysisController.determineMCType(args.modelId))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The type of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpDTMC.HittingProbability:
			operation.setOperation(async () => DTMCAnalysisController.hittingProbability(args.modelId, args.state))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The hitting probability of state ${args.state} of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`)
				component.setAnimationSetOfStates([args.state])
			})
			break
	
		case OpDTMC.RewardUntilHit:
			operation.setOperation(async () => DTMCAnalysisController.rewardUntilHit(args.modelId, args.state))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The expected reward until state ${args.state} of ${component.getModelName(args.modelId)} is hit is as follows.\n${tResult}`)
				component.setAnimationSetOfStates([args.state])
			})
			break

		case OpDTMC.HittingProbabilitySet:
			operation.setOperation(async () => DTMCAnalysisController.hittingProbabilitySet(args.modelId, args.states))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The hitting probability of the set ${args.states} of states of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`)
				component.setAnimationSetOfStates(args.states)
			})
			break

		case OpDTMC.RewardUntilHitSet:
			operation.setOperation(async () => DTMCAnalysisController.rewardUntilHitSet(args.modelId, args.states))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The expected reward until the set ${args.states} of states of ${component.getModelName(args.modelId)} is hit is as follows.\n${tResult}`)
				component.setAnimationSetOfStates(args.states)
			})
			break

		case OpDTMC.LimitingMatrix:
			operation.setOperation(async () => DTMCAnalysisController.limitingMatrix(args.modelId))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The limiting matrix of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpDTMC.LimitingDistribution:
			operation.setOperation(async () => DTMCAnalysisController.limitingDistribution(args.modelId))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The limiting distribution of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpDTMC.LongRunReward:
			operation.setOperation(async () => DTMCAnalysisController.longRunReward(args.modelId))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The expected long-run reward of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break
			
		case OpDTMC.ViewTransitionDiagram:
			operation.setOperation(async () => historyPush(VIEWGRAPH_PATH,{ modelId: args.modelId}))
			break

		case OpDTMC.ViewTransientGraph:
			operation.setOperation(() => DTMCAnalysisController.viewTransientGraph(args.modelId, args.modelName, args.numberOfSteps))
			operation.setPostProcessing(async artifact => component.processAnalysisResultImage(`Transient distributions of ${args.modelName}`, artifact))
			break

		case OpDTMC.SimTrace:
			operation.setOperation(async ()=> DTMCAnalysisController.simTrace(args.modelId, args.numberOfSteps, args.seed))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`A simulation trace of ${component.getModelName(args.modelId)} for ${args.numberOfSteps} steps is as follows.\n${tResult}`)
				component.setAnimationStateSequence(extractStateList(tResult))
			})
			break

		case OpDTMC.SimLongRunExpectedAverageReward:
			operation.setOperation(async ()=> DTMCAnalysisController.simLongRunExpectedAverageReward(args.modelId, args.conditions, args.recurrentState, args.seed))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The estimated long-run expected average reward for ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break
				
		case OpDTMC.SimCesaroLimitDistribution:
			operation.setOperation(async ()=> DTMCAnalysisController.simCesaroLimitDistribution(args.modelId, args.conditions, args.recurrentState, args.seed))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The estimated Cesàro limit distribution of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break
				
		case OpDTMC.SimTransientExpectedReward:
			operation.setOperation(async ()=> DTMCAnalysisController.simTransientExpectedReward(args.modelId, args.numberOfSteps, args.conditions, args.seed))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The estimated transient expected reward after ${args.numberOfSteps} steps of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpDTMC.SimTransientDistribution:
			operation.setOperation(async ()=> DTMCAnalysisController.simTransientDistribution(args.modelId, args.numberOfSteps, args.conditions, args.seed))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The estimated expected distribution after ${args.numberOfSteps} steps of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpDTMC.SimHittingProbabilityState:
			operation.setOperation(async ()=> DTMCAnalysisController.simHittingProbabilityState(args.modelId, args.state, args.conditions, args.analyzeStates, args.seed))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The estimated probability of hitting state ${args.state} of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`)
				component.setAnimationSetOfStates([args.state])
			})
			break

		case OpDTMC.SimHittingRewardState:
			operation.setOperation(async ()=> DTMCAnalysisController.simHittingRewardState(args.modelId, args.state, args.conditions, args.analyzeStates, args.seed))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The estimated reward until hitting state ${args.state} of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`)
				component.setAnimationSetOfStates([args.state])
			})
			break

		case OpDTMC.SimHittingProbabilityStateSet:
			operation.setOperation(async ()=> DTMCAnalysisController.simHittingProbabilityStateSet(args.modelId, args.states, args.conditions, args.analyzeStates, args.seed))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The estimated probability to hit the set ${args.state} of states of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`)
				component.setAnimationSetOfStates(args.states)
			})
			break

		case OpDTMC.SimHittingRewardStateSet:
			operation.setOperation(async ()=> DTMCAnalysisController.simHittingRewardStateSet(args.modelId, args.states, args.conditions, args.analyzeStates, args.seed))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The estimated reward until hitting the set ${args.states} of states of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`)
				component.setAnimationSetOfStates(args.states)
			})
			break
		// Conversion operations

		case OpDTMC.ConvertSVG:
			operation.setOperation(() => DTMCAnalysisController.convertToSVG(args.modelId, args.modelName))
			operation.setPostProcessing(async artifact => component.processDownloadArtifact(`SVG image of ${args.modelName}`,artifact, MimeTypeSVG, `${args.modelName}.${FileExtensionSVG}`))
			break
				
		default:
			break
	}
	return operation
}
