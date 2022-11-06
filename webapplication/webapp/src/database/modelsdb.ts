import mongoose from 'mongoose'
import { modelTypes, IExternalCompModModel, typeScratch, typePublic, typeUser } from './modelsdbinterface'
import { getCompModModel, ICompModModel, TCompModModel } from './modelsschema'
import { Logger } from 'winston'
import { ValidModelNameRegEx } from '../config/config'
import { DomainModules, domains, DomDTMC, DomFSA, DomLTL, DomMPM, DomSDF, ModelTemplates } from '../config/model'
import { dbHandler, dbHandlerWithResult, getMongooseConnection, TErrorCallback, TVoidResultCallback } from './mongoose'
import { CheckReadAccess, ReadAccessBarrier, WriteAccessBarrier } from './access'
import { dbName } from '../config/serverconfig'

var CompModModel: TCompModModel


export abstract class ModelsDb {

	protected logger: Logger

	constructor(logger: Logger) {
		this.logger = logger
	}

	public abstract connect(): Promise<boolean>
	// get all models accessible to the user
	public abstract getAll(userId: string): Promise<IExternalCompModModel[]>
	// get all models accessible to the user from a particular group
	public abstract getAllGroup(userId: string, group: string): Promise<IExternalCompModModel[]>
	// get a particular model, for a particular user, checking access right
	public abstract getModel(modelId: string, userId: string): Promise<IExternalCompModModel>
	// delete a model for a particular user, checking access right
	public abstract deleteModel(modelId: string, userId: string): Promise<void>
	// delete all scratch models from a given module
	public abstract deleteScratchModuleModels(userId: string, module: string): Promise<void>
	// delete all models of a particular user
	public abstract deleteUserModels(userId: string): Promise<void>
	// make a model public for a user, into a particular group, checking all access rights
	public abstract publishModel(modelId: string, userId: string, group: string): Promise<void>
	// unpublish a model
	public abstract unpublishModel(modelId: string, userId: string): Promise<void>
	// scratch a model
	public abstract scratchModel(modelId: string, userId: string): Promise<void>
	// unscratch a model
	public abstract unscratchModel(modelId: string, userId: string): Promise<void>
	// add a new model
	public abstract addModel(modelName: string, content: string, domain: string, type: string, owner: string, ownerName: string, group: string, userId: string): Promise<string>
	// rename a model
	public abstract renameModel(modelId: string, modelName: string, userId: string): Promise<void>
	// set group of a model
	public abstract setGroupOfModel(modelId: string, group: string, userId: string): Promise<void>
	// hand over a model to another user
	public abstract handoverModel(modelId: string, newOwnerId: string, newOwnerName: string, userId: string): Promise<void>
	// create a new model
	public async newModel(modelName: string, domain: string, ownerName: string, userId: string, group: string): Promise<string> {
		if (!this.validateModelName(modelName)) throw new Error("Invalid model name.")
		const modelId = await this.addModel(modelName, ModelTemplates.get(domain), domain, typeScratch, userId, ownerName, group, userId)
		return modelId
	}

	public async getPublicModels(userId: string): Promise<IExternalCompModModel[]>
	{
		return (await this.getAll(userId)).filter(m => m.type == typePublic)
	}
	public async getPublicDomainModels(domain: string, userId: string): Promise<IExternalCompModModel[]>
	{
		return (await this.getAll(userId)).filter(m => (m.type == typePublic && m.domain == domain))
	}

	public async getPublicModuleModels(module: string, userId: string): Promise<IExternalCompModModel[]>
	{
		return (await this.getAll(userId)).filter(m => (m.type == typePublic && DomainModules.get(m.domain) == module))
	}

	public async getModelsForUser(userId: string): Promise<IExternalCompModModel[]> 
	{
		return (await this.getAll(userId)).filter(m => (m.owner == userId || m.type==typePublic))
	}

	public async getDomainModelsForUser(domain: string, userId: string): Promise<IExternalCompModModel[]> {
		return (await this.getAll(userId)).filter(m => ((m.owner == userId || m.type==typePublic) && m.domain == domain))
	}
	
	public async getModuleModelsForUser(module: string, userId: string): Promise<IExternalCompModModel[]> {
		return (await this.getAll(userId)).filter(m => ((m.owner == userId || m.type==typePublic) && DomainModules.get(m.domain) == module))
	}

	

	public abstract updateModelContent(modelId: string, modelContent: string, userId: string): Promise<void>

	protected validateModelName(name: string) {
		return ValidModelNameRegEx.test(name)
	}

}


var cmwbModelConnection: mongoose.Connection = null

export async function getCMWBModelConnection(host: string) {
	if (cmwbModelConnection === null) {
		cmwbModelConnection = await getMongooseConnection(host)
		return cmwbModelConnection
	} else {
		return cmwbModelConnection
	}
}

export class ModelsMongooseDb extends ModelsDb {

	constructor(logger: Logger, host: string) {
		super(logger)
		this.host = host
	}

	private host: string

	async connect() {
		return new Promise<boolean>(async (resolve, _reject) => {
			try {
				const conn = await getCMWBModelConnection(this.host)
				//Bind connection to error event (to get notification of connection errors)
				conn.on('error', this.logger.error.bind(console, 'MongoDB connection error:'))
				cmwbModelConnection = conn.useDb(dbName)
				CompModModel = await getCompModModel(this.host)
				resolve(true)					
			} catch (error) {
				resolve(false)
			}
		})
	}

	public async getAll(userId: string): Promise<IExternalCompModModel[]> {
		return new Promise((resolve, reject) => {
			CompModModel.find().exec(dbHandlerWithResult('Error in getAll', result => 
			resolve(result.filter((m: ICompModModel) => CheckReadAccess(m, userId))), 
			reject))
		})
	}

	public async getAllGroup(userId: string, group: string): Promise<IExternalCompModModel[]> {
		return new Promise((resolve, reject) => {
			CompModModel.find().exec(dbHandlerWithResult('Error in getAll', result => 
			resolve(result.filter((m: ICompModModel) => CheckReadAccess(m, userId) && m.group == group)), 
			reject))
		})
	}

	/**
	 * Get models, applying a filter
	 * @param filter The filter to apply 
	 * @param done Callback delivers an array of models on success
	 * @param error Error callback
	 */
	private getAllFilter(filter: object, done: (result: ICompModModel[]) => void, error: TErrorCallback) {
		CompModModel.find(filter)
			.exec(dbHandlerWithResult('Error in getAllFilter', done, error))
	}

	/**
	 * Get models of a certain type
	 * @param type The type of model user, public 
	 * @param done Callback delivers an array of models on success
	 * @param error Error callback
	 */
	private getAllType(type: string, done: (result: ICompModModel[]) => void, error: TErrorCallback) {
		if (!this.checkType(type)) return error(`'${type}' is not a valid model type.`)
		CompModModel.find()
			.where('type').equals(type)
			.exec(dbHandlerWithResult('Error in getAllType', done, error))
	}

	public async getModel(modelId: string, userId: string): Promise<IExternalCompModModel> {
		const model: ICompModModel = await this.getMongooseModel(modelId)
		ReadAccessBarrier(model, userId)
		return {
			id: model.id,
			name: model.name,
			content: model.content,
			domain: model.domain,
			type: model.type,
			owner: model.owner,
			ownerName: model.ownerName,
			group: model.group,
			createdAt: model.createdAt,
			modifiedAt: model.modifiedAt,
			annotations: model.annotations
		}
	}

	private async getMongooseModel(modelId: string): Promise<ICompModModel> {
		return new Promise<ICompModModel>((resolve, reject) => {
			CompModModel.findById(modelId, dbHandlerWithResult("Could not find model", result => resolve(result), reject))
		})
	}

	private getModelOwner(id: string, done: (owner: string) => void, error: TErrorCallback) {
		this.getMongooseModel(id)
		.then(model => {
			done(model.owner)
		})
		.catch(reason => error(reason))
	}

	async renameModel(modelId: string, modelName: string, userId: string) {
		this.getMongooseModel(modelId)
		.then(model => {
			if (model === undefined) {
				throw new Error(`Model with id ${modelId} is not found.`);				
			}
			WriteAccessBarrier(model, userId)
			model.name = modelName
			model.save()	
		})
	}

	async setGroupOfModel(modelId: string, group: string, userId: string) {
		this.getMongooseModel(modelId)
		.then(model => {
			if (model === undefined) {
				throw new Error(`Model with id ${modelId} is not found.`);				
			}
			WriteAccessBarrier(model, userId)
			model.group = group
			model.save()	
		})
	}


	async handoverModel(modelId: string, newOwnerId: string, newOwnerName: string, userId: string) {
		this.getMongooseModel(modelId)
		.then(model => {
			if (model === undefined) {
				throw new Error(`Model with id ${modelId} is not found.`);				
			}
			WriteAccessBarrier(model, userId)
			model.owner = newOwnerId
			model.ownerName = newOwnerName
			model.save()
		})
	}

	async deleteModel(modelId: string, userId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.getMongooseModel(modelId)
			.then(model => {
				if (model === undefined) {
					throw new Error(`Model with id ${modelId} is not found.`);				
				}
				WriteAccessBarrier(model, userId)
				CompModModel.findByIdAndDelete(modelId, dbHandler('Error findOneAndDelete in deleteModel', () => resolve(), reject))
			})
		})
	}

	async deleteUserModels(userId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			CompModModel.deleteMany({owner: userId}, null, dbHandler('Error deleteMany in deleteModel', () => resolve(), reject))
		})
	}

	async deleteScratchModuleModels(userId: string, module: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const doms = domains.filter(d => DomainModules.get(d) == module)
			CompModModel.deleteMany({owner: userId, domain: {$in: doms}, type: typeScratch}, null, dbHandler('Error deleteMany in deleteModel', () => resolve(), reject))
		})
	}

	async addModel(modelName: string, content: string, domain: string, type: string, owner: string, ownerName: string, group: string, userId: string): Promise<string> {	
		if (owner != userId) throw new Error("Not allowed.")
		return new Promise((resolve, reject) => {
			if (!this.validateModelName(modelName)) {
				reject(`'${modelName}' is not a valid model name.`)
			} else {
				const m = CompModModel.create(
					{
						name: modelName,
						content,
						domain,
						type,
						owner,
						ownerName,
						group
					},
					dbHandlerWithResult('Error in insertOne in addModel', m => resolve(m.id), ()=> reject())
				)
			}
		})
	}

	private updateModel(id: string, modelName: string, content: string, domain: string, type: string, owner: string, ownerName: string, done: TVoidResultCallback, error: TErrorCallback) {
		if (!this.validateModelName(modelName)) return error(`'${modelName}' is not a valid model name.`)
		this.getMongooseModel(id)
			.then(
				(model) => {
					model.name = modelName
					model.content = content
					model.type = type
					model.domain = domain
					model.owner = owner
					model.ownerName = ownerName
					model.save()
					done()
				})
			.catch(reason => error(reason))
	}

	public async setModelType(modelId: string, type: string, userId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.getMongooseModel(modelId)
			.then ( model => {
				if (model === undefined) {
					throw new Error(`Model with id ${modelId} is not found.`);				
				}	
				WriteAccessBarrier(model, userId)
				this.updateModelType(modelId, type, resolve, reject)
			})
		})
	}


	public async publishModel(modelId: string, userId: string): Promise<void> {
		return this.setModelType(modelId, typePublic, userId)
	}

	public async unpublishModel(modelId: string, userId: string): Promise<void> {
		return this.setModelType(modelId, typeUser, userId)
	}

	public async scratchModel(modelId: string, userId: string): Promise<void> {
		return this.setModelType(modelId, typeScratch, userId)
	}

	public async unscratchModel(modelId: string, userId: string): Promise<void> {
		return this.setModelType(modelId, typeUser, userId)
	}

	private updateModelType(id: string, type: string, done: TVoidResultCallback, error: TErrorCallback) {
		this.getMongooseModel(id)
			.then(model => {
				model.type = type
				model.save()
				done()
			})
			.catch(reason => {
				this.logger.error('Failed to update model type')
				error(reason)
			})
	}

	public async updateModelContent(modelId: string, modelContent: string, userId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.getMongooseModel(modelId)
			.then(model => {
				if (model === undefined) {
					throw new Error(`Model with id ${modelId} is not found.`);				
				}	
				WriteAccessBarrier(model, userId)
				model.content = modelContent
				model.save()
				resolve()
			})
			.catch(reason => {
				reject(reason)
			})
		})
	}

	private checkType(type: string) {
		if (!modelTypes.includes(type)) {
			this.logger.error(`Type ${type} unknown.`)
			return false
		}
		return true
	}

}

// stub class to allow some testing offline without mongo database connection
var testModels: IExternalCompModModel[] = [
	{
		id: '1',
		name: 'Model A',
		content: 'component A {}',
		domain: DomFSA,
		type: typePublic,
		owner: '1',
		ownerName: 'Marc',
		group: 'general',
		createdAt: new Date('1-1-2020'),
		modifiedAt: new Date('1-1-2020'),
		annotations: new Map<string, string>()
	},
	{
		id: '2',
		name: 'Model B',
		content: 'dataflow graph Model {\n			A [execution time: 1] ---> B\n			B [execution time: 1] - initial tokens: 1 --> A\n	}',
		domain: DomSDF,
		type: typeUser,
		owner: '1',
		ownerName: 'Marc',
		group: 'general',
		createdAt: new Date('1-1-2020'),
		modifiedAt: new Date('1-1-2020'),
		annotations: new Map<string, string>()
	},
	{
		id: '3',
		name: 'Model C',
		content: '\n		markov chain Model {\n				A -- 1/2  -> B\n				B -- 1/10 -> A\n		}',
		domain: DomDTMC,
		type: typePublic,
		owner: '1',
		ownerName: 'Marc',
		group: 'general',
		createdAt: new Date('1-1-2020'),
		modifiedAt: new Date('1-1-2020'),
		annotations: new Map<string, string>()
	},
	{
		id: '4',
		name: 'Model D',
		content: 'component D {}',
		domain: DomLTL,
		type: typeUser,
		owner: '1',
		ownerName: 'Marc',
		group: 'general',
		createdAt: new Date('1-1-2020'),
		modifiedAt: new Date('1-1-2020'),
		annotations: new Map<string, string>()
	},
	{
		id: '5',
		name: 'MPM',
		content: 'max-plus model MPModel:\n		matrices\n		A (x0 x1) = [[0 1 ] [ 1 0]]\n  vector sequences\n				v (i1 i2)= [\n			[0 0]\n			[2 3]\n			[5 4]\n		]\n		\n		event sequences\n		h = [0 2 4 8 12 ]\n		x = [-inf 10 -inf -inf -inf -inf ]',
		domain: DomMPM,
		type: typeUser,
		owner: '1',
		ownerName: 'Marc',
		group: 'general',
		createdAt: new Date('1-1-2020'),
		modifiedAt: new Date('1-1-2020'),
		annotations: new Map<string, string>()
	},
	{
		id: '6',
		name: 'Eggs',
		content: 'dataflow graph Eggs {    inputs i    outputs o        i        -- consumption rate: 4 -----------------------> Clean    Clean[1] -- production rate: 4; consumption rate: 10 --> Box    Box      -- initial tokens: 1 ------------------------> Box    Box[1]   -- production rate: 10 ----------------------> o}',
		domain: DomSDF,
		type: typeUser,
		owner: '1',
		ownerName: 'Marc',
		group: 'general',
		createdAt: new Date('1-1-2020'),
		modifiedAt: new Date('1-1-2020'),
		annotations: new Map<string, string>()
	}
]

var testModelsNextId = 7

export class ModelsDbStub extends ModelsDb {

	private newId() {
		testModelsNextId += 1
		return testModelsNextId.toString()
	}

	async connect() {
		return true
	}

	public async getAll(userId: string) {
		return testModels
	}

	public async getAllGroup(userId: string) {
		return testModels
	}

	public async deleteModel(modelId: string, userId: string): Promise<void> {
		const model = testModels.find(m => m.id == modelId)
		if (model) {
			if (model.owner != userId) throw new Error("Model is not accessible.")
			testModels = testModels.filter(model => model.id != modelId)
			return
		}
		throw new Error(`A model with ID '${modelId}' does not exist.`)
	}

	async deleteUserModels(userId: string): Promise<void> {
		testModels = testModels.filter(m => m.owner != userId)
	}

	async deleteScratchModuleModels(userId: string, module: string): Promise<void> {
		const doms = domains.filter(d => DomainModules.get(d) == module)
		testModels = testModels.filter(m => m.owner != userId || m.type != typeScratch || ! doms.includes(m.domain))
	}

	public async getModel(modelId: string, userId: string): Promise<IExternalCompModModel> {
		const model = testModels.find(m => m.id == modelId)
		if (model) {
			if (model.owner != userId && model.type==typeUser) throw new Error("Model is not accessible.")
			return model
		}
		throw new Error(`A model with ID '${modelId}' does not exist.`)
	}

	private async setModelType(modelId: string, type: string, userId: string): Promise<void> {
		const model = testModels.find(m => m.id == modelId)
		if (model) {
			if (model.owner != userId) throw new Error("Model is not accessible.")
			model.type = type
			return
		}
		throw new Error(`A model with ID '${modelId}' does not exist.`)
	}

	public async publishModel(modelId: string, userId: string): Promise<void> {
		return this.setModelType(modelId, typePublic, userId)
	}

	public async unpublishModel(modelId: string, userId: string): Promise<void> {
		return this.setModelType(modelId, typeUser, userId)
	}

	public async scratchModel(modelId: string, userId: string): Promise<void> {
		return this.setModelType(modelId, typeScratch, userId)
	}

	public async unscratchModel(modelId: string, userId: string): Promise<void> {
		return this.setModelType(modelId, typeUser, userId)
	}

	async addModel(modelName: string, content: string, domain: string, type: string, owner: string, ownerName: string, group: string, userId: string): Promise<string> {	
		if (owner != userId) throw new Error("Not allowed.")
		const newId = this.newId()
		testModels.push(
			{
				id: newId,
				name: modelName,
				content,
				domain,
				type,
				owner,
				ownerName,
				group,
				createdAt: new Date(),
				modifiedAt: new Date(),
				annotations: new Map<string, string>()
			}
		)
		return newId
	}	

	async renameModel(modelId: string, modelName: string, userId: string) {
		const model = testModels.find(m => m.id == modelId)
		if (model) {
			if (model.owner != userId) throw new Error("Model is not accessible.")
			model.name = modelName
			return
		}
		throw new Error(`A model with ID '${modelId}' does not exist.`)
	}

	
	async setGroupOfModel(modelId: string, group: string, userId: string) {
		const model = testModels.find(m => m.id == modelId)
		if (model) {
			if (model.owner != userId) throw new Error("Model is not accessible.")
			model.group = group
			return
		}
		throw new Error(`A model with ID '${modelId}' does not exist.`)
	}
	

	async handoverModel(modelId: string, newOwnerId: string, newOwnerName: string, userId: string) {
		const model = testModels.find(m => m.id == modelId)
		if (model) {
			if (model.owner != userId) throw new Error("Model is not accessible.");
			model.owner = newOwnerId
			return
		}
		throw new Error(`A model with ID '${modelId}' does not exist.`)
	}

	async updateModelContent(modelId: string, modelContent: string, userId: string): Promise<void> {
		const model = testModels.find(m => m.id == modelId)
		if (model) {
			if (model.owner != userId) throw new Error("Model is not accessible.")
			model.content = modelContent
			return
		}
		throw new Error(`A model with ID '${modelId}' does not exist.`)
	}


}