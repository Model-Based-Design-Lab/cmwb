import { DomFSA } from "../config/model"
import ModuleIndex from "../pages/restricted/modules/ModuleIndex"
import { isNonNegativeInteger, isNumeric, isPositiveInteger, isValidModelName } from "../utils/utils"


export class Operation {
	constructor() {
		this.cancelled = false
	}

	private operation: ()=>Promise<any>
	private postProcessing: (result: any)=>Promise<void>
	private cancelled: boolean
	private error: boolean
	private reject: (err: any) => void

	public cancel() {
		this.cancelled = true
		if (this.reject) {
			this.reject("The operation was cancelled.")
		}
	}

	public timeout() {
		this.cancelled = true
		if (this.reject) {
			this.reject("The operation has timed out.")
		}
	}

	public setOperation(operation: ()=>Promise<any>) {
		this.operation = operation
	}

	public setPostProcessing(postProcessing: (result: any)=>Promise<void>) {
		this.postProcessing  = postProcessing
	}

	// complicated cancelling logic...
	public execute(): Promise<void> {
		var result: string
		this.error = false
		return new Promise<any>((resolve, reject) => {
			this.reject = reject
			this.operation()
			.then(result => {
				if (! this.cancelled) {
					resolve(result)
				}
			})
			.catch(error => {
				this.error = true
				result = "An error occurred during the operation.\n" + error
				resolve(result)
			})
		})
		.then( res => {
			result = res
			if (this.error) {
				throw new Error(res)
			} else {
				if (! this.cancelled) {
					if (this.postProcessing) {
						return this.postProcessing(result)
					}
				}	
			}
		})
	}
	
}

function setArgumentProperty(o: any, key: string, value: any) {
	Object.defineProperty(o, key, {value: value, writable: false})
}

export async function buildArguments(requiredArguments: any[], component: ModuleIndex): Promise<any>{
	var argResult = {}
	if (! requiredArguments) return argResult

	// deal with advanced arguments
	// did the use enable the advanced mode?
	var advancedModeSelected = false
	var advancedMode = false

	// show advance mode question only if there are any advanced options
	var showAdvanced: boolean = requiredArguments.some(a=>a.advanced)

	for (var i = 0; i < requiredArguments.length; i++) {
		const a = requiredArguments[i]

		advancedModeSelected = advancedModeSelected || advancedMode

		if (a.advanced) {
			if (! advancedModeSelected) {
				if (a.defaultValue === undefined) {
					throw new Error(`Default value required on advanced argument ${a.name}`);
				}
				setArgumentProperty(argResult, a.name, a.defaultValue)
				continue
			}
		}

		// stop asking if the user has selected advanced mode
		showAdvanced = showAdvanced && (! advancedMode)

		var resValue
		switch (a.type) {
			case "text":
				[advancedMode, resValue] = await component.getText(a.question, a.placeholder, showAdvanced, a.validate)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "boolean":
				setArgumentProperty(argResult, a.name, await component.getBoolean(a.question, a.defaultValue, showAdvanced))
				break
	
			case "number":
				if (a.validate===undefined) {
					a.validate = (s: string) => true
				}
				[advancedMode, resValue] = await component.getNumber(a.question, a.placeholder, showAdvanced, a.validate)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "mpNumber":
				[advancedMode, resValue] = await component.getMPNumber(a.question, a.placeholder, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "mpVector":
				[advancedMode, resValue] = await component.getMPVector(a.question, a.placeholder, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "inputSequences":
				[advancedMode, resValue] = await component.getInputSequences(a.question, a.placeholder, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "initialStateSDF":
				[advancedMode, resValue] = await component.getInitialStateSDF(a.question, a.placeholder, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break
				
			case "userName":
				setArgumentProperty(argResult, a.name, await component.getUserName())
				break

			case "userId":
				setArgumentProperty(argResult, a.name, await component.getUserId())
				break

			case "selectedModelId":
				setArgumentProperty(argResult, a.name, await component.getSelectedModelId())
				break

			case "selectedModelName":
				setArgumentProperty(argResult, a.name, await component.getSelectedModelName())
				break

			case "chooseModelIdFsa":
				[advancedMode, resValue] = await component.getChooseModelId(a.question, DomFSA, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break
			
			case "word":
				[advancedMode, resValue] = await component.getText(a.question, a.placeholder, showAdvanced, a.validate)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "chooseState":
				[advancedMode, resValue] = await component.getChooseState(a.question, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "chooseRecurrentState":
				[advancedMode, resValue] = await component.getChooseRecurrentState(a.question, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "chooseStateSet":
				[advancedMode, resValue] = await component.getChooseStateSet(a.question, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "chooseStateSetOptional":
				[advancedMode, resValue] = await component.getChooseStateSet(a.question, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue?resValue:"")
			break

			case "chooseStoppingConditions":
				[advancedMode, resValue] = await component.getChooseStoppingConditions(a.question, a.initialValues, showAdvanced, a.validate,  a.hiddenOptions, a.isTransientAnalysis)
				setArgumentProperty(argResult, a.name, resValue)
				break		

			case "listOfEventSequenceNames":
				[advancedMode, resValue] = await component.getListOfEventSequenceNames(a.question, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "listOfMatricesAndVectorSequences":
				[advancedMode, resValue] = await component.getListOfMatricesAndVectorSequences(a.question, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "listOfEventAndVectorSequences":
				[advancedMode, resValue] = await component.getListOfEventAndVectorSequences(a.question, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break
	
			case "eventSequenceName":
				[advancedMode, resValue] = await component.getEventSequenceName(a.question, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break

			case "selectMatrixIfMoreThanOne":
				[advancedMode, resValue] = await component.getMatrixName(a.question, showAdvanced)
				setArgumentProperty(argResult, a.name, resValue)
				break
					

			default:
				throw new Error(`Unknown argument type: ${a.type}`)
				break
		}
	}
	return argResult
}


export const ValidateAllowEmpty = (v: (n: string)=>boolean) => ((n: string)=> n==""?true:v(n))
export const ValidateModelName = (n: string)=>isValidModelName(n)
export const ValidateNonNegativeInteger = (n: string)=>isNonNegativeInteger(n)
export const ValidatePositiveInteger = (n: string)=>isPositiveInteger(n)
export const ValidateNumber = (n: string)=>isNumeric(n)
