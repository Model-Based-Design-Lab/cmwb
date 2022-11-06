import * as mongoose from 'mongoose'
import { modelTypes, typePublic } from './modelsdbinterface'
import { domains } from '../config/model'
import { getCMWBModelConnection } from './modelsdb'
import { GeneralGroup } from '../config/config'

const Schema = mongoose.Schema
export interface ICompModModel extends mongoose.Document {
	id: string
	name: string
	content: string
	domain: string
	type: string
	owner: string
	ownerName: string
	group: string
	createdAt: Date
	modifiedAt: Date
	annotations: mongoose.Types.Map<string>
	isAccessibleTo(userId: string): boolean
	isOwnedBy(userId: string): boolean
}

var CompModSchema: mongoose.Schema<ICompModModel> = new Schema({
	id: {
		type: String,
		required: false
	},
	name: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	domain: {
		type: String,
		enum: domains,
		required: true
	},
	type: {
		type: String,
		enum: modelTypes,
		required: true
	},
	owner: {
		type: String,
		required: true
	},
	ownerName: {
		type: String,
		required: true
	},
	group: {
		type: String,
		required: true,
		default: GeneralGroup
	},
	createdAt: {
		type: Date,
		required: false
	},
	modifiedAt: {
		type: Date,
		required: false
	},
	annotations: {
		type: mongoose.Schema.Types.Map,
		of: String,
		required: false
	}
})

CompModSchema.pre('save', function (next) {
	let doc = <ICompModModel>this
	let now = new Date()
	if (!doc.createdAt) {
		doc.createdAt = now
	}
	doc.modifiedAt = now
	doc.id = doc._id
	next()
})


CompModSchema.methods.isAccessibleTo = function(userId: string): boolean { 
	return (this.type == typePublic) || (this.owner == userId)
}

CompModSchema.methods.isOwnedBy = function(userId: string): boolean { 
	return this.owner == userId
}

export type TCompModModel = mongoose.Model<mongoose.Document, {}>

export async function getCompModModel(host: string): Promise<TCompModModel> {
	const conn = await getCMWBModelConnection(host)
	return conn.model('CompModModel', CompModSchema)
}

