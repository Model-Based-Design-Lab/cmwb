import * as mongoose from 'mongoose'
import crypto from 'crypto'

import { getAccessGroupModelConnection, getPasswordUserModelConnection } from './passwdb'
import { GeneralGroup, NoneGroup } from '../config/config'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

export interface IPasswordUser extends mongoose.Document {
	id: string
	name: string
	email: string
	group: string
	accessibleGroups: string[]
	activeGroup: string
	isAdmin: boolean
	verified: boolean
	verificationToken: string
	verificationTokenCreatedAt: Date
	passwordHash: string
	createdAt: Date
	lastPasswordReset: Date
	setPassword(password: string): Promise<void>
	verifyPassword(password: string): Promise<boolean>
	}

var PasswordUserSchema: mongoose.Schema<IPasswordUser> = new Schema({
	id: {
		type: String,
		required: false
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	verified: Boolean,
	verificationToken: String,
	verificationTokenCreatedAt: {
		type: Date,
		required: false
	},
	passwordHash: String,
	isAdmin: {
		type: Boolean,
		required: true,
		default: false
	},
	group: {
		type: String,
		required: true,
		default: NoneGroup
	},
	accessibleGroups: {
		type: [String],
		required: true,
		default: [GeneralGroup]
	},
	activeGroup: {
		type: String,
		required: true,
		default: GeneralGroup
	},
	createdAt: {
		type: Date,
		required: false
	},
	lastPasswordReset: {
		type: Date,
		required: false
	},
})

async function digestMessage(message: string) {
	const msgUint8 = new TextEncoder().encode(message)
	const hash = crypto.createHash('sha512')
	hash.update(msgUint8)
	return hash.digest('hex')
}


PasswordUserSchema.methods.setPassword = async function(password: string) { 
	this.passwordHash = await digestMessage(password)
}

PasswordUserSchema.methods.verifyPassword = async function(password: string): Promise<boolean> { 
	const pwdHash = await digestMessage(password)
	return this.passwordHash == pwdHash
}

PasswordUserSchema.pre('save', function (next) {
	let doc = <IPasswordUser>this
	let now = new Date()
	if (!doc.createdAt) {
		doc.createdAt = now
	}
	if (!doc.lastPasswordReset) {
		doc.lastPasswordReset = now
	}
	doc.id = doc._id
	next()
})


export type TPasswordUserModel = mongoose.Model<mongoose.Document, {}>

export async function getPasswordUserModel(host: string): Promise<TPasswordUserModel> {
	const conn = await getPasswordUserModelConnection(host)
	return conn.model('PasswordUserModel', PasswordUserSchema)
}

PasswordUserSchema.methods.publish = function(cb: ()=>void) {
	throw "Not Implemented"
}

export interface IAccessGroup extends mongoose.Document {
	id: string
	name: string
	accessCode: string
}

var AccessGroupSchema = new Schema({
	id: {
		type: String,
		required: false
	},
	name: {
		type: String,
		required: true
	},
	accessCode: {
		type: String,
		required: true
	},
})

AccessGroupSchema.pre('save', function (next) {
	let doc = this
	doc.id = doc._id.toString()
	next()
})

export type TAccessGroupModel = mongoose.Model<mongoose.Document, {}>

export async function getAccessGroupModel(host: string): Promise<any> {
	const conn = await getAccessGroupModelConnection(host)
	return conn.model('AccessGroupModel', AccessGroupSchema)
}


