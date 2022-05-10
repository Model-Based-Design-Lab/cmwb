import mongoose from 'mongoose'
import { mongoDbHost } from '../config/config'
import { MongoError, ObjectId } from "mongodb"

var mongooseConnection: mongoose.Connection = null

export function getMongooseConnection(host: string): Promise<mongoose.Connection> {
    return new Promise((resolve, reject) => {
		if (mongooseConnection == null) {
			mongoose.connect(host, { useNewUrlParser: true, useUnifiedTopology: true })
				.then(() => {
					//Get the default connection
					mongooseConnection = mongoose.connection
					resolve(mongooseConnection)
				})
				.catch((err) => {reject(err)})
        } else {
            resolve(mongooseConnection)
        }
    })
}

export function stringToObjectId(hexStringId: string) {
	return mongoose.Types.ObjectId(hexStringId)
}

export function ObjectIdToString(id: ObjectId) {
	return id.toString()
}

export type TErrorCallback = (_reason: string) => void
export type TVoidResultCallback = () => void

export function dbHandler(logErrorMessage: string, done: TVoidResultCallback, error: (_reason: any) => void, toDo?: () => void) {
	return (err: MongoError) => {
		if (err) {
			this.logger.error(logErrorMessage + `: ${err}`)
			return error(err)
		}
		if (toDo) toDo()
		return done()
	}
}

export function dbHandlerWithResult(logErrorMessage: string, done: (result: any) => void, error: (_reason: any) => void, toDo?: (result: any) => void) {
	return (err: MongoError, result: any) => {
		if (err) {
			this.logger.error(logErrorMessage + `: ${err}`)
			return error(err)
		}
		if (toDo) toDo(result)
		return done(result)
	}
}


