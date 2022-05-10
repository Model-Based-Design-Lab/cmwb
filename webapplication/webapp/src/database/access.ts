import { ICompModModel } from "./modelsschema";
import { PasswordUserDb } from "./passwdb";

export function CheckWriteAccess(model: ICompModModel, sessionUserId: string) {
    return model.isOwnedBy(sessionUserId)
}

export function CheckReadAccess(model: ICompModModel, sessionUserId: string) {
    return model.isAccessibleTo(sessionUserId)
}

export async function CheckAdminAccess(passwordUserDb: PasswordUserDb, sessionUserId: string): Promise<boolean> {
    return await passwordUserDb.isAdmin(sessionUserId)
}

export function WriteAccessBarrier(model: ICompModModel, sessionUserId: string) {
    if (! CheckWriteAccess(model, sessionUserId)) throw new Error("Model is not write-accessible")
}

export function ReadAccessBarrier(model: ICompModModel, sessionUserId: string) {
    if (! CheckReadAccess(model, sessionUserId)) throw new Error("Model is not read-accessible")
}

export async function AdminAccessAsyncBarrier(passwordUserDb: PasswordUserDb, sessionUserId: string): Promise<void> {
    const accessible = await CheckAdminAccess(passwordUserDb, sessionUserId)
    if (! accessible) throw new Error("User is not an administrator")
}

export function LocalModeBarrier() {
    if (! global.localMode) throw new Error("Server is not in local mode.")
}

