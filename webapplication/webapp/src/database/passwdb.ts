import mongoose from 'mongoose'
import { IExternalPasswordUser, IExternalAccessGroup } from './passwdbinterface'
import { getAccessGroupModel, getPasswordUserModel, IAccessGroup, IPasswordUser, TAccessGroupModel, TPasswordUserModel } from './passwschema'
import { Logger } from 'winston'
import { GeneralGroup, ResetPasswordTimeoutSeconds, SignupTokenExpirySeconds } from '../config/config'
import crypto from 'crypto'
import { dbHandler, dbHandlerWithResult, getMongooseConnection, ObjectIdToString } from './mongoose'
import { sendResetPasswordEmail } from '../email/sendmail'
import { secondsSince } from '../utils/utils'
import { AdminAccessAsyncBarrier, LocalModeBarrier } from './access'
import { MongoError } from 'mongodb'
import { passwordDbName } from '../config/serverconfig'

// connect to mongo db
// database: cmwb_users
// collection passwordusermodels


const ValidUserNameRegEx = /^[^\*\'\"\\\/\']+$/


var PasswordUserModel: TPasswordUserModel
var AccessGroupModel: TAccessGroupModel


export abstract class PasswordUserDb {

	protected logger: Logger

	constructor(logger: Logger) {
		this.logger = logger
	}

	public abstract connect(): Promise<boolean>

	public abstract getAll(): Promise<IExternalPasswordUser[]>
	public abstract signUpNewUser(name: string, email: string, group: string): Promise<{userId: string, verificationToken: string}>
	public abstract verifyEmail(userId: string, verificationToken: string): Promise<string>
	public abstract setPassword(userId: string, verificationToken: string, password: string): Promise<void>
	public abstract changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>

	public abstract addUser(name: string, email: string, group: string, verificationToken: string): Promise<string>
	public abstract deleteUser(userId: string): Promise<void>
	public abstract getUserByEmail(email: string): Promise<IExternalPasswordUser>
	public abstract isEmailKnown(email: string): Promise<boolean>
	public abstract isAdmin(userId: string): Promise<boolean>

	public abstract validatePassword(email: string, password: string): Promise<boolean>
	public abstract validateLocalUser(email: string, name: string): Promise<boolean>

	public abstract sendResetPasswordLink(email: string): Promise<void>
	public abstract getUsers(sessionUserId: string): Promise<IExternalPasswordUser[]>
	public abstract getUser(sessionUserId: string, userId: string): Promise<IExternalPasswordUser>
	public abstract getUserGroups(sessionUserId: string): Promise<string[]>
	public abstract getUserActiveGroup(sessionUserId: string): Promise<string>
	public abstract setUserActiveGroup(sessionUserId: string, activeGroup: string): Promise<void>
	public abstract updateUser(sessionUserId: string, userId: string, name: string, group: string, accessibleGroups: string[], isAdmin: boolean): Promise<void>

	// groups and access codes
	public abstract groupForAccessCode(code: string): Promise<string>
	public abstract registerAccessCode(sessionUserId: string, code: string): Promise<string[]>
	public abstract createAccessGroup(sessionUserId: string, name: string, accessCode: string): Promise<void>
	public abstract allGroups(): Promise<string[]>
	public abstract allGroupsForUser(sessionUserId: string): Promise<string[]>
	public abstract allFullGroupsForUser(sessionUserId: string): Promise<IExternalAccessGroup[]>

	protected validateUserName(name: string) {
		return ValidUserNameRegEx.test(name)
	}

}

var passwordUserModelConnection: mongoose.Connection = null

export async function getPasswordUserModelConnection(host: string) {
	if (passwordUserModelConnection === null) {
		passwordUserModelConnection = await getMongooseConnection(host)
		return passwordUserModelConnection
	} else {
		return passwordUserModelConnection
	}
}

var accessGroupModelConnection: mongoose.Connection = null

export async function getAccessGroupModelConnection(host: string) {
	if (accessGroupModelConnection === null) {
		accessGroupModelConnection = await getMongooseConnection(host)
		return accessGroupModelConnection
	} else {
		return accessGroupModelConnection
	}
}

export class PasswordUserMongooseDb extends PasswordUserDb {

	constructor(logger: Logger, host: string) {
		super(logger)
		this.host = host
	}

	private host: string

	public async connect() {
		return new Promise<boolean>(async (resolve, _reject) => {
			try {
				const conn = await getPasswordUserModelConnection(this.host)
				//Bind connection to error event (to get notification of connection errors)
				conn.on('error', this.logger.error.bind(console, 'MongoDB connection error:'))
				passwordUserModelConnection = conn.useDb(passwordDbName)
				PasswordUserModel = await getPasswordUserModel(this.host)
				accessGroupModelConnection = conn.useDb(passwordDbName)
				AccessGroupModel = await getAccessGroupModel(this.host)
				resolve(true)					
			} catch (error) {
				resolve(false)
			}
		})
	}

	public async signUpNewUser(name: string, email: string, group: string): Promise<{userId: string, verificationToken: string}> 
	{
		const verificationToken = randomHexString(20)
		const id = await this.addUser(name, email, group, verificationToken)
		return {userId: id, verificationToken: verificationToken}
	}

	private verificationExpired(user: IPasswordUser): boolean {
		return secondsSince(user.verificationTokenCreatedAt) > SignupTokenExpirySeconds
	}

	// return true if a password reset has been requested too recently
	private resetPasswordTimeout(user: IPasswordUser): boolean {
		return secondsSince(user.lastPasswordReset) < ResetPasswordTimeoutSeconds
	}

	public async verifyEmail(userId: string, verificationToken: string): Promise<string>
	{
		const user = await this.getMongooseUserById(userId)
		if (user.verificationToken == verificationToken) {
			// check if token is not too old
			if (this.verificationExpired(user)) {
				throw new Error("Verification token has expired")
			}
			user.verified = true
			await user.save()
			return user.name
		} else {
			throw new Error("Wrong verification token.")
		}
	}

	public async isAdmin(userId: string): Promise<boolean>
	{
		const user = await this.getMongooseUserById(userId)
		return user.isAdmin
	}


	public async setPassword(userId: string, verificationToken: string, password: string): Promise<void>
	{
		const user = await this.getMongooseUserById(userId)
		if (user.verificationToken == verificationToken) {
			// check if token is not too old
			const ageMilliseconds = user.createdAt.valueOf() - (new Date()).valueOf()
			if (ageMilliseconds > SignupTokenExpirySeconds*1000) {
				throw new Error("Verification token has expired")
			}
			await user.setPassword(password)
			await user.save()
			return
		} else {
			throw new Error("Wrong verification token.")
		}
	}

	public async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>
	{
		const user = await this.getMongooseUserById(userId)
		if (! await user.verifyPassword(oldPassword)) throw new Error("Invalid password.")
		await user.setPassword(newPassword)
		await user.save()
		return
	}

	public async addUser(name: string, email: string, group: string, verificationToken: string): Promise<string> {
		return new Promise((resolve, reject) => {
			if (!this.validateUserName(name)) reject(`'${name}' is not a valid user name.`)
			var newUser = new PasswordUserModel(
				{
					name: name,
					verificationToken: verificationToken,
					verificationTokenCreatedAt: new Date(),
					verified: false,
					email: email.toLowerCase(),
					group: group
				}
			) as IPasswordUser
			newUser.save(dbHandlerWithResult('Error in addUser', 
				savedUser => {
					resolve(ObjectIdToString(savedUser.id))
				},
				()=> reject()))
		})
	}

	public async deleteUser(userId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			PasswordUserModel.deleteOne({id: userId}, dbHandler('Failed to delete user.', ()=> resolve(), err => reject(err)))
		})
	}


	public async getAll(): Promise<IExternalPasswordUser[]> {
		return new Promise((resolve, reject) => {
			PasswordUserModel.find().exec(dbHandlerWithResult('Error in getAll', result => resolve(result), reject))
		})
	}

	public async getUserByEmail(email: string): Promise<IExternalPasswordUser> {
		const user = await this.getMongooseUserByEmail(email)
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			group: user.group,
			accessibleGroups: user.accessibleGroups,
			isGuest: false,
			isAdmin: user.isAdmin,
			createdAt: user.createdAt
		}
	}

	public async isEmailKnown(email: string): Promise<boolean> {
		return new Promise<boolean>((resolve, _reject) => {
			this.getMongooseUserByEmail(email)
			.then(user => {
				// if email is not verified and token is expired, delete
				if (! user.verified) {
					if (this.verificationExpired(user)) {
						// verification has expired, delete user
						this.deleteUser(user.id)
					} else {
						// verification is not expired, email is still reserved
						resolve(true)
					}
				}
				resolve(true)
			})
			.catch(_err => {
				resolve(false)
			})
		})
	}


	public async validatePassword(email: string, password: string) {
		try {
			const user = await this.getMongooseUserByEmail(email)
			return await user.verifyPassword(password)
		} catch (error) {
			return false
		}
	}

	public async validateLocalUser(email: string, name: string) {
		LocalModeBarrier()
		if(! await this.existsMongooseUserByEmail(email)) {
			await this.addUser(name, email, GeneralGroup, "no-verification-needed")
		}
		return true
	}

	public async sendResetPasswordLink(email: string) {
		// send an email with a password reset link if 
		// a user with this email is known and a password reset has not been recently sent
		var user: IPasswordUser
		try {
			user = await this.getMongooseUserByEmail(email)
		} catch (error) {
			throw new Error("A user with that email address does not exists.")
		}

		if (this.resetPasswordTimeout(user)) throw new Error("Cannot request password reset too soon after previous reset")
		
		user.verificationToken = randomHexString(20)
		sendResetPasswordEmail(user.email, user.name, user.id, user.verificationToken)

		user.lastPasswordReset = new Date()
		user.verificationTokenCreatedAt = new Date()
		user.save()
	}


	private async getMongooseUserByEmail(email: string): Promise<IPasswordUser> {
		return new Promise<IPasswordUser>((resolve, reject) => {
			PasswordUserModel.findOne(
				{email: email.toLowerCase()}, 
				dbHandlerWithResult("Could not find user by email.", 
					result => {
						if (result == null) reject("no such user")
						resolve(result)
					}, 
					reject))
		})
	}

	private async existsMongooseUserByEmail(email: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			PasswordUserModel.findOne(
				{email: email.toLowerCase()}, 
				(err: MongoError, result: any) => {
					if (err) {
						resolve(false)
					}
					if (result==null) resolve(false)
					resolve(true)
				}
			)
		})
	}

	private async getMongooseUserById(userId: string): Promise<IPasswordUser> {
		return new Promise<IPasswordUser>((resolve, reject) => {
			PasswordUserModel.findOne({id: userId}, dbHandlerWithResult("Could not find user", result => resolve(result), reject))
		})
	}

	public async getUsers(sessionUserId: string): Promise<IExternalPasswordUser[]> {
		await AdminAccessAsyncBarrier(this, sessionUserId)
		return new Promise((resolve, reject) => {
			PasswordUserModel.find().exec(dbHandlerWithResult('Error in getUsers', result => 
			resolve(result), 
			reject))
		})
	}

	public async getUser(sessionUserId: string, userId: string): Promise<IExternalPasswordUser> {
		await AdminAccessAsyncBarrier(this, sessionUserId)
		return new Promise((resolve, reject) => {
			PasswordUserModel.findOne({id: userId}, dbHandlerWithResult('Error in getUser', result => 
			resolve(result), 
			reject))
		})
	}

	public async getUserGroups(sessionUserId: string): Promise<string[]> {
		const user: IPasswordUser = await this.getMongooseUserById(sessionUserId)
		if (user.isAdmin) {
			return await this.allGroups()
		}
		const groups = new Set<string>()
		groups.add(GeneralGroup)
		groups.add(user.group)
		if (! (user.accessibleGroups === undefined)) {
			user.accessibleGroups.forEach(g => groups.add(g))
		}
		return Array.from(groups.values())
	}

	public async getUserActiveGroup(sessionUserId: string): Promise<string> {
		const user: IPasswordUser = await this.getMongooseUserById(sessionUserId)
		return user.activeGroup
	}

	public async setUserActiveGroup(sessionUserId: string, activeGroup: string): Promise<void> {
		const user: IPasswordUser = await this.getMongooseUserById(sessionUserId)
		user.activeGroup = activeGroup
		await user.save()
		return
	}

	public async updateUser(sessionUserId: string, userId: string, name: string, group: string, accessibleGroups: string[], isAdmin: boolean): Promise<void> {
		const sessionUser: IPasswordUser = await this.getMongooseUserById(sessionUserId)
		const user: IPasswordUser = await this.getMongooseUserById(userId)
		if (sessionUser.isAdmin) {
			user.name = name
			user.group = group
			user.accessibleGroups = accessibleGroups
			user.isAdmin = isAdmin
			await user.save()
			return	
		} else {
			// non admin user can only update some elements
			if (userId == sessionUserId) {
				user.name = name
				await user.save()
				return		
			} else {
				throw new Error("Insufficient access rights to update user.");				
			}
		}
	}

	private async forAllAccessGroupsDo(action:(ag: IExternalAccessGroup)=> void) {
		return new Promise<void>((resolve, reject) => {
			AccessGroupModel.find().exec(dbHandlerWithResult('Error in groupForAccessCode', (result: IExternalAccessGroup[]) => {
				result.forEach(ag => {
					action(ag)
				})
				resolve()
			},
		reject))
		})
	}

	private async getAllAccessGroups(): Promise<IExternalAccessGroup[]> {
		var result = new Array<IExternalAccessGroup>()
		await this.forAllAccessGroupsDo(ag=>result.push(ag))
		return result
	}


	public async groupForAccessCode(code: string): Promise<string> {
		var group: string = null
		await this.forAllAccessGroupsDo(ag => {
			if (ag.accessCode == code) {
				group = ag.name
			}
		})
		return group
	}

	public async registerAccessCode(sessionUserId: string, code: string): Promise<string[]> {
		const sessionUser: IPasswordUser = await this.getMongooseUserById(sessionUserId)
		var found = false
		await this.forAllAccessGroupsDo(ag => {
			if (ag.accessCode == code) {
				found = true
				if (! sessionUser.accessibleGroups.includes(ag.name)) {
					sessionUser.accessibleGroups.push(ag.name)
				}
			}
		})
		if (! found) {
			throw new Error("Access code is not valid.");
			
		}
		const updatedUser = await sessionUser.save()
		return updatedUser.accessibleGroups
	}


	public async allGroups(): Promise<string[]> {
		const accessGroups = await this.getAllAccessGroups()
		return accessGroups.map(ag => ag.name)
	}

	public async allGroupsForUser(sessionUserId: string): Promise<string[]> {
		await AdminAccessAsyncBarrier(this, sessionUserId)
		return this.allGroups()
	}

	public async allFullGroupsForUser(sessionUserId: string): Promise<IExternalAccessGroup[]> {
		await AdminAccessAsyncBarrier(this, sessionUserId)
		return this.getAllAccessGroups()
	}

	private async addAccessGroup(name: string, accessCode: string): Promise<string> {
		return new Promise((resolve, reject) => {
			var newGroup = new AccessGroupModel(
				{
					name,
					accessCode
				}
			) as IAccessGroup
			newGroup.save(dbHandlerWithResult('Error in addGroup', 
				savedGroup => {
					resolve(ObjectIdToString(savedGroup.id))
				},
				()=> reject()))
		})
	}


	public async createAccessGroup(sessionUserId: string, name: string, accessCode: string): Promise<void> {
		await AdminAccessAsyncBarrier(this, sessionUserId)
		await this.addAccessGroup(name, accessCode)
	}


}

// stub class to allow some testing offline without mongo database connection
var testUsers: any[] = [
	{
		id: '1',
		name: 'Marc',
		email: 'm.c.w.geilen@tue.nl',
		isGuest: false,
		isAdmin: true,
		verified: true,
		verificationToken: "",
		createdAt: new Date('1-1-2020'),
	},
	{
		id: '2',
		name: 'Freek',
		email: 'f.v.d.berg@tue.nl',
		verified: true,
		verificationToken: "",
		isGuest: false,
		isAdmin: false,
		createdAt: new Date('1-1-2020'),
	},
]

var testUsersNextId = 2

export class PasswordUserDbStub extends PasswordUserDb {

	private newId() {
		testUsersNextId += 1
		return testUsersNextId.toString()
	}

	async connect() {
		return true
	}

	public async getAll() {
		return testUsers
	}

	public async signUpNewUser(name: string, email: string, group: string): Promise<{userId: string, verificationToken: string}> 
	{
		const verificationToken = randomHexString(20)
		const id = await this.addUser(name, email, group, verificationToken)
		return {userId: id, verificationToken: verificationToken}
	}

	public async verifyEmail(userId: string, verificationToken: string): Promise<string>
	{
		const user = testUsers.find(u => u.id == userId)
		if (user.verificationToken == verificationToken) {
			user.verified = true
			return user.name
		} else {
			throw new Error("Wrong verification token.")
		}
	}

	public async setPassword(userId: string, verificationToken: string, password: string): Promise<void>
	{		
		const user = testUsers.find(u => u.id == userId)
		if (user.verificationToken == verificationToken) {
			// stub ignores passwords
			// user.setPassword(password)
			return
		} else {
			throw new Error("Wrong verification token.")
		}
	}

	public async addUser(name: string, email: string, group: string, verificationToken: string): Promise<string> {
		const id = this.newId()
		testUsers.push({
			id: id,
			name: name,
			email: email,
			group: group,
			verified: false,
			verificationToken: verificationToken,
			verificationTokenCreatedAt: new Date(),
			isGuest: false,
			isAdmin: false,
			createdAt: new Date()
		})
		return id
	}

	public async deleteUser(userId: string): Promise<void> {
		testUsers = testUsers.filter(u => u.id != userId)
	}

	public async getUserByEmail(email: string): Promise<IExternalPasswordUser> {
		const model = testUsers.find(u => u.email == email)
		if (model) return model
		throw new Error(`A user with email '${email}' does not exist.`)		
	}

	public async isEmailKnown(email: string): Promise<boolean> {
		const user = testUsers.find(u => u.email == email)
		if (user) return true
		return false
	}

	public async isAdmin(userId: string): Promise<boolean>
	{
		const user = testUsers.find(u => u.id == userId)
		return user.isAdmin
	}

	public async getUsers(sessionUserId: string): Promise<IExternalPasswordUser[]> {
		await AdminAccessAsyncBarrier(this, sessionUserId)
		return testUsers
	}

	public async getUser(sessionUserId: string, userId: string): Promise<IExternalPasswordUser> {
		await AdminAccessAsyncBarrier(this, sessionUserId)
		return testUsers[0]
	}

	public async getUserGroups(sessionUserId: string): Promise<string[]> {
		return testUsers[0].accessibleGroups
	}

	public async getUserActiveGroup(sessionUserId: string): Promise<string> {
		return testUsers[0].group
	}

	public async setUserActiveGroup(sessionUserId: string, activeGroup: string): Promise<void> {
		testUsers[0].activeGroup = activeGroup
	}

	public async updateUser(sessionUserId: string, userId: string, name: string, group: string, accessibleGroups: string[], isAdmin: boolean): Promise<void> {
		// not implemented
	}


	public async validatePassword(email: string, password: string) {
		return true
	}

	public async validateLocalUser(email: string, name: string) {
		return true
	}

	public async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
	}


	public async sendResetPasswordLink(email: string) {
	}

	public async groupForAccessCode(code: string): Promise<string> {
		return null
	}

	public async allGroups(): Promise<string[]> {
		return []
	}

	public async allGroupsForUser(userId: string): Promise<string[]> {
		return []
	}

	public async allFullGroupsForUser(userId: string): Promise<IExternalAccessGroup[]> {
		return []
	}

	public async registerAccessCode(sessionUserId: string, code: string): Promise<string[]> {
		return []
	}

	public async createAccessGroup(sessionUserId: string, name: string, accessCode: string): Promise<void> {
	}
}


function randomHexString(len: number): string {
	return Array.from(crypto.randomBytes(len)).map(b => b.toString(16).padStart(2, '0')).join('')
}