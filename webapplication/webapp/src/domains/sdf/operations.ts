import { DomMPM, DomSDF } from "../../config/model"
import { ModelsController } from "../../controller/modelscontroller"
import { MPMAnalysisController } from "../../controller/mpmanalysiscontroller"
import { SDFAnalysisController } from "../../controller/sdfanalysiscontroller"
import { extractInconsistentCycle } from "../../operations/utils"
import { FileExtensionSDF3, FileExtensionSVG, MimeTypeSDF3, MimeTypeSVG } from "../../utils/filetypes"
import { isInteger } from "../../utils/utils"
import { buildArguments, Operation, ValidateModelName, ValidateNonNegativeInteger, ValidateNumber, ValidatePositiveInteger } from "../operations"

export enum OpSDF {
    CreateSDF,
    CreateMPM,

	// operations on dataflow models
    RepetitionVector,
    CheckDeadlock,
    Throughput,
    Latency,
    ConvertToSingleRate,
    StateMatrix,
    StateSpaceMatrices,
    GanttChart,

	// conversion operations on dataflow models
    ConvertStateMatrixModel,
    ConvertStateSpaceMatricesModel,
    ConvertSDF3,
    ConvertSVG,

	// operations on max-plus matrices
    MPMLargestEigenValue,
    MPMEigenVectors,
    MPMPrecedenceGraph,
	MPMConvertPrecedenceGraph,
    MPMConvolutionAnalysis,
    MPMConvolutionTransform,
    MPMDelaySequence,
    MPMScaleSequence,
    MPMMaximumAnalysis,
    MPMMaximumTransform,
    MPMComputeStarClosure,
    MPMMultiply,
    MPMMultiplyTransform,
    MPMComputeOutputVectorTraceOfStateSpace,
    MPMComputeOutputVectorTraceOfStateSpaceTransform,
    MPMVisualizeVectorTrace,
}

export const OpSDFDescriptions= new Map<OpSDF,string>([

    [OpSDF.CreateSDF, "Create a new dataflow model"],
    [OpSDF.CreateMPM, "Create a new max-plus model"],

// operations on dataflow models
    [OpSDF.RepetitionVector, "Repetition Vector"],
    [OpSDF.CheckDeadlock, "Check Deadlock"],
    [OpSDF.Throughput, "Throughput"],
    [OpSDF.Latency, "Latency"],
    [OpSDF.StateMatrix, "State Matrix"],
    [OpSDF.StateSpaceMatrices, "State-Space Matrices"],
    [OpSDF.GanttChart, "Gantt Chart"],

// conversion operations on dataflow models
    [OpSDF.ConvertStateMatrixModel, "Convert to State Matrix"],
    [OpSDF.ConvertToSingleRate, "Convert to Single-Rate"],
    [OpSDF.ConvertStateSpaceMatricesModel, "Make State-space Matrices Model"],
    [OpSDF.ConvertSDF3, "Convert to SDF3 xml format"],
    [OpSDF.ConvertSVG, "Convert to SVG image"],


// operations on max-plus matrices
    [OpSDF.MPMLargestEigenValue, "Largest Eigenvalue"],
    [OpSDF.MPMEigenVectors, "Eigenvectors"],
    [OpSDF.MPMPrecedenceGraph, "Precedence Graph"],
    [OpSDF.MPMConvertPrecedenceGraph, "Convert to Precedence Graph image"],
    [OpSDF.MPMConvolutionAnalysis, "Convolution Analysis"],
    [OpSDF.MPMConvolutionTransform, "Convolution Transform"],
    [OpSDF.MPMDelaySequence, "Delay Sequence"],
    [OpSDF.MPMScaleSequence, "Scale Sequence"],
    [OpSDF.MPMMaximumAnalysis, "Maximum Analysis"],
    [OpSDF.MPMMaximumTransform, "Maximum Transform"],
    [OpSDF.MPMComputeStarClosure, "Compute *-closure"],
    [OpSDF.MPMMultiply, "Multiply"],
    [OpSDF.MPMMultiplyTransform, "Multiply Transform"],
    [OpSDF.MPMComputeOutputVectorTraceOfStateSpace, "Compute Output Vector Trace of State-Space"],
    [OpSDF.MPMComputeOutputVectorTraceOfStateSpaceTransform, "Compute Output Vector Trace of State-Space Transform"],
    [OpSDF.MPMVisualizeVectorTrace, "Visualize Vector Trace"],
])

export const GeneralOperations = [
	OpSDF.CreateSDF,
	OpSDF.CreateMPM
]

export const OperationsOnDataFlowModels = [
	OpSDF.RepetitionVector,
	OpSDF.CheckDeadlock,
	OpSDF.Throughput,
	OpSDF.Latency,
	OpSDF.StateMatrix,
	OpSDF.StateSpaceMatrices,
	OpSDF.GanttChart,
]

export const ConversionOperationsOnDataFlowModels = [
	OpSDF.ConvertToSingleRate,
	OpSDF.ConvertStateMatrixModel,
	OpSDF.ConvertStateSpaceMatricesModel,
	OpSDF.ConvertSDF3,
	OpSDF.ConvertSVG,
]


export const OperationsOnMaxPlusMatrices = [
    OpSDF.MPMLargestEigenValue,
    OpSDF.MPMEigenVectors,
    OpSDF.MPMPrecedenceGraph,
    OpSDF.MPMConvertPrecedenceGraph,
    OpSDF.MPMConvolutionAnalysis,
    OpSDF.MPMConvolutionTransform,
    OpSDF.MPMDelaySequence,
    OpSDF.MPMScaleSequence,
    OpSDF.MPMMaximumAnalysis,
    OpSDF.MPMMaximumTransform,
    OpSDF.MPMComputeStarClosure,
    OpSDF.MPMMultiply,
    OpSDF.MPMMultiplyTransform,
    OpSDF.MPMComputeOutputVectorTraceOfStateSpace,
    OpSDF.MPMComputeOutputVectorTraceOfStateSpaceTransform,
    OpSDF.MPMVisualizeVectorTrace,
]

const OperationArguments = new Map<OpSDF,any>([
	[OpSDF.CreateSDF, [
		{type: 'text', name: 'modelName', question: 'Please enter a name for the new model.', placeholder: "ModelName", validate: ValidateModelName},
		{type: 'userName', name: 'userName'}
	]],
	[OpSDF.RepetitionVector, [
		{type: 'selectedModelId', name:'modelId'}
	]],
	[OpSDF.CheckDeadlock, [
		{type: 'selectedModelId', name:'modelId'}
	]],
	[OpSDF.Throughput, [
		{type: 'selectedModelId', name:'modelId'}
	]],
	[OpSDF.Latency, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'number', name:'period', question: "Provide the period (μ).", validate: ValidateNumber}
	]],
	[OpSDF.ConvertToSingleRate, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpSDF.StateMatrix, [
		{type: 'selectedModelId', name:'modelId'},
	]],
	[OpSDF.StateSpaceMatrices, [
		{type: 'selectedModelId', name:'modelId'},
	]],
	[OpSDF.ConvertStateMatrixModel, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpSDF.ConvertStateSpaceMatricesModel, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'}
	]],
	[OpSDF.GanttChart, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectedModelName', name:'modelName'},
		{type: 'number', name:'numberOfIterations', question: 'Provide the number of iterations to visualize.', validate: ValidatePositiveInteger},
		{type: 'boolean', name:'zeroBased', question: 'Start actor firings at time zero (Otherwise negative starting times, or -inf are allowed)?', advanced: true, defaultValue: true},
		{type: 'initialStateSDF', name:'initialState', question: "Please provide the initial state  time stamps, a number or '-inf'. Leave empty for zero-state.", advanced: true, defaultValue: ""},
		{type: 'inputSequences', name:'inputSequences', question: 'Please Provide the input traces (format: [-inf, 0], [1, 2], i=[-inf,0], i=i1). Leave empty to assume all input available at time -inf.', advanced: true, defaultValue: ""},
	]],
	[OpSDF.ConvertSDF3, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectedModelName', name:'modelName'},
	]],
	[OpSDF.ConvertSVG, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectedModelName', name:'modelName'},
	]],
	[OpSDF.CreateMPM, [
		{type: 'text', name: 'modelName', question: 'Please enter a name for the new model.', placeholder: "ModelName", validate: ValidateModelName},
		{type: 'userName', name: 'userName'}
	]],
	[OpSDF.MPMLargestEigenValue, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectMatrixIfMoreThanOne', name:'matrix'},
	]],
	[OpSDF.MPMEigenVectors, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectMatrixIfMoreThanOne', name:'matrix'},
	]],
	[OpSDF.MPMPrecedenceGraph, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectMatrixIfMoreThanOne', name:'matrix'},
	]],
	[OpSDF.MPMConvertPrecedenceGraph, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectedModelName', name:'modelName'},
		{type: 'selectMatrixIfMoreThanOne', name:'matrix'},
	]],
	[OpSDF.MPMConvolutionAnalysis, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'listOfEventSequenceNames', name: 'eventSequences', question: 'Provide the sequences to operate on.'}
	]],
	[OpSDF.MPMConvolutionTransform, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'},
		{type: 'listOfEventSequenceNames', name: 'eventSequences', question: 'Provide the sequences to operate on.'}
	]],
	[OpSDF.MPMDelaySequence, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'eventSequenceName', name: 'eventSequence', question: 'Select the sequence to delay.'},
		{type: 'number', name: 'delay', question: 'Provide the number of events to delay as a non-negative integer number.'},
	]],
	[OpSDF.MPMScaleSequence, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'eventSequenceName', name: 'eventSequence', question: 'Select the sequence to scale.'},
		{type: 'mpNumber', name: 'scaleFactor', question: 'Provide the factor to scale the sequence by (to add to the time stamps).'},
	]],
	[OpSDF.MPMMaximumAnalysis, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'listOfEventSequenceNames', name: 'eventSequences', question: 'Provide the sequences to operate on.'}
	]],
	[OpSDF.MPMMaximumTransform, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'},
		{type: 'listOfEventSequenceNames', name: 'eventSequences', question: 'Provide the sequences to operate on.'}
	]],
	[OpSDF.MPMComputeStarClosure, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectMatrixIfMoreThanOne', name:'matrix'},
	]],
	[OpSDF.MPMMultiply, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'listOfMatricesAndVectorSequences', name: 'multiplicationList', question: 'Provide a sequence matrices, possibly ending with a vector sequence to be multiplied.'}
	]],
	[OpSDF.MPMMultiplyTransform, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'},
		{type: 'listOfMatricesAndVectorSequences', name: 'multiplicationList', question: 'Provide a sequence matrices, possibly ending with a vector sequence to be multiplied.'}
	]],
	[OpSDF.MPMComputeOutputVectorTraceOfStateSpace, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'number', name: 'numberOfIterations', question: 'Optionally provide the required number of iterations. Otherwise leave empty to determine as many iterations as possible.'},
		{type: 'mpVector', name: 'initialState', question: 'Provide the initial state (format: [-inf, 0]). Leave empty to use the zero vector.', advanced: true, defaultValue: ""},
		{type: 'inputSequences', name: 'inputSequences', question: 'Provide the input sequences in the form: [-inf, 0, ...], or the name of an event sequence defined in the model.', advanced: true, defaultValue: ""},
	]],
	[OpSDF.MPMComputeOutputVectorTraceOfStateSpaceTransform, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'},
		{type: 'number', name: 'numberOfIterations', question: 'Optionally provide the required number of iterations. Otherwise leave empty to determine as many iterations as possible.'},
		{type: 'mpVector', name: 'initialState', question: 'Provide the initial state (format: [-inf, 0]). Leave empty to use the zero vector.', advanced: true, defaultValue: ""},
		{type: 'inputSequences', name: 'inputSequences', question: 'Provide the input sequences in the form: [-inf, 0, ...], or the name of an event sequence defined in the model.', advanced: true, defaultValue: ""},
	]],
	[OpSDF.MPMVisualizeVectorTrace, [
		{type: 'selectedModelId', name:'modelId'},
		{type: 'selectedModelName', name:'modelName'},
		{type: 'userId', name:'userId'},
		{type: 'userName', name:'userName'},
		{type: 'listOfEventAndVectorSequences', name: 'eventAndVectorSequences', question: 'Select event sequences and vector sequences for the trace.'}
	]],
])



export async function makeOperation(op: OpSDF, component: any): Promise<Operation> {
	const args = await buildArguments(OperationArguments.get(op), component)
	var operation = new Operation()
	switch (op) {

		case OpSDF.CreateSDF:
			operation.setOperation(()=>ModelsController.newModel(args.modelName, DomSDF, args.userName))
			operation.setPostProcessing(async _result => component.refreshModels() )
			break

		case OpSDF.RepetitionVector:
			operation.setOperation(()=>SDFAnalysisController.repetitionVector(args.modelId))
			operation.setPostProcessing(async tResult => {
				component.processAnalysisResult(`The repetition vector of the graph ${component.getModelName(args.modelId)} is:\n${tResult}`)
				component.setAnimationSetOfActors(extractInconsistentCycle(tResult))
			})
			break

		case OpSDF.CheckDeadlock:
			operation.setOperation(()=>SDFAnalysisController.checkDeadlock(args.modelId))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The deadlock analysis of the graph ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpSDF.Throughput:
			operation.setOperation(()=>SDFAnalysisController.throughput(args.modelId))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The throughput analysis of the graph ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpSDF.Latency:
			operation.setOperation(()=>SDFAnalysisController.latency(args.modelId, args.period))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The latency analysis of the graph ${component.getModelName(args.modelId)} for period ${args.period} is as follows.\n${tResult}`))
			break

		case OpSDF.ConvertToSingleRate:
			operation.setOperation(() => SDFAnalysisController.convertToSingleRate(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The new single rate graph is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpSDF.StateMatrix:
			operation.setOperation(()=>SDFAnalysisController.stateMatrix(args.modelId))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The max-plus state matrix of the graph ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpSDF.StateSpaceMatrices:
			operation.setOperation(()=>SDFAnalysisController.stateSpaceMatrices(args.modelId))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The state-space max-plus matrices of the graph ${component.getModelName(args.modelId)} are as follows.\n${tResult}`))
			break

			case OpSDF.ConvertStateMatrixModel:
			operation.setOperation(() => SDFAnalysisController.makeStateMatrixModel(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The new max-plus model is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpSDF.ConvertStateSpaceMatricesModel:
			operation.setOperation(() => SDFAnalysisController.makeStateSpaceMatricesModel(args.modelId, args.userId, args.userName))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The new max-plus model is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpSDF.GanttChart:
			operation.setOperation(() => SDFAnalysisController.ganttChart(args.modelId, args.modelName, args.numberOfIterations, args.initialState, args.inputSequences, args.zeroBased))
			operation.setPostProcessing(async artifact => component.processAnalysisResultImage(`Gantt chart of ${args.modelName}`, artifact))
			break

		// Conversion operations

		case OpSDF.ConvertSVG:
			operation.setOperation(() => SDFAnalysisController.convertToSVG(args.modelId, args.modelName))
			operation.setPostProcessing(async artifact => component.processDownloadArtifact(`SVG image of ${args.modelName}`,artifact, MimeTypeSVG, `${args.modelName}.${FileExtensionSVG}`))
			break

		case OpSDF.ConvertSDF3:
			operation.setOperation(() => SDFAnalysisController.convertToSDF3(args.modelId, args.modelName))
			operation.setPostProcessing(async artifact => component.processDownloadArtifact(`SDF3 model of ${args.modelName}`,artifact, MimeTypeSDF3, `${args.modelName}.${FileExtensionSDF3}`))
			break

		// MPM operations

		case OpSDF.CreateMPM:
			operation.setOperation(()=>ModelsController.newModel(args.modelName, DomMPM, args.userName))
			operation.setPostProcessing(async _result => component.refreshModels() )
			break

		case OpSDF.MPMLargestEigenValue:
			operation.setOperation(()=>MPMAnalysisController.largestEigenValue(args.modelId, args.matrix))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The largest eigenvalue analysis of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpSDF.MPMEigenVectors:
			operation.setOperation(()=>MPMAnalysisController.eigenVectors(args.modelId, args.matrix))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The eigenvector analysis of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpSDF.MPMPrecedenceGraph:
			operation.setOperation(()=>MPMAnalysisController.precedencegraph(args.modelId, args.matrix))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The precedencegraph analysis of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpSDF.MPMConvertPrecedenceGraph:
			operation.setOperation(() => MPMAnalysisController.viewPrecedencegraph(args.modelId, args.modelName, args.matrix))
			operation.setPostProcessing(async artifact => component.processAnalysisResultImage(`Precedence Graph of ${args.matrix}`, artifact))
			break


		case OpSDF.MPMConvolutionAnalysis:
			operation.setOperation(()=>MPMAnalysisController.convolution(args.modelId, args.eventSequences))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(tResult))
			break

		case OpSDF.MPMConvolutionTransform:
			operation.setOperation(()=>MPMAnalysisController.convolutionTransform(args.modelId, args.userId, args.userName, args.eventSequences))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the max-plus model with the convolution sequence is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpSDF.MPMDelaySequence:
			operation.setOperation(()=>MPMAnalysisController.delaySequence(args.modelId, args.eventSequence, args.delay))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(tResult))
			break

		case OpSDF.MPMScaleSequence:
			operation.setOperation(()=>MPMAnalysisController.scaleSequence(args.modelId, args.eventSequence, args.scaleFactor))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(tResult))
			break

		case OpSDF.MPMMaximumAnalysis:
			operation.setOperation(()=>MPMAnalysisController.maximum(args.modelId, args.eventSequences))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(tResult))
			break

		case OpSDF.MPMMaximumTransform:
			operation.setOperation(()=>MPMAnalysisController.maximumTransform(args.modelId, args.userId, args.userName, args.eventSequences))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the max-plus model with the maximum sequence is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpSDF.MPMComputeStarClosure:
			operation.setOperation(()=>MPMAnalysisController.starClosure(args.modelId, args.matrix))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(`The *-closure analysis of ${component.getModelName(args.modelId)} is as follows.\n${tResult}`))
			break

		case OpSDF.MPMMultiply:
			operation.setOperation(()=>MPMAnalysisController.multiply(args.modelId, args.multiplicationList.matrices, args.multiplicationList.vectorSequences))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(tResult))
			break

		case OpSDF.MPMMultiplyTransform:
			operation.setOperation(()=>MPMAnalysisController.multiplyTransform(args.modelId, args.userId, args.userName, args.multiplicationList.matrices, args.multiplicationList.vectorSequences))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the max-plus model with the multiplication result is ${newName}.`)
				component.refreshModels()
			})
			break

		case OpSDF.MPMComputeOutputVectorTraceOfStateSpace:
			operation.setOperation(()=>MPMAnalysisController.outputVectorTraceOfStateSpace(args.modelId, args.numberOfIterations, args.initialState, args.inputSequences))
			operation.setPostProcessing(async tResult => component.processAnalysisResult(tResult))
			break

		case OpSDF.MPMComputeOutputVectorTraceOfStateSpaceTransform:
			operation.setOperation(()=>MPMAnalysisController.outputVectorTraceOfStateSpaceTransform(args.modelId, args.userId, args.userName, args.numberOfIterations, args.initialState, args.inputSequences))
			operation.setPostProcessing(async newName => {
				component.processAnalysisResult(`The name of the max-plus model with the output trace is ${newName}.`)
				component.refreshModels()
			})
			break


		case OpSDF.MPMVisualizeVectorTrace:
			operation.setOperation(()=>MPMAnalysisController.visualizeVectorSequence(args.modelId, args.modelName, args.userId, args.userName, args.eventAndVectorSequences))
			operation.setPostProcessing(async artifact => component.processAnalysisResultImage(`Vector trace chart of ${args.modelName}`, artifact))
			break


		default:
			// no-op
			operation.setOperation(async ()=>{})
			operation.setPostProcessing(async () => {})
			console.error(`Unknown SDF operation was requested: ${op}`)
			break
	}
	return operation
}
