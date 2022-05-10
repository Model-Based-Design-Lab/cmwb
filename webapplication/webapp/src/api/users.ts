import * as bodyParser from 'body-parser'
import * as express from 'express'
import { ApiUsersAllFullGroups, ApiUsersAllGroups, ApiUsersChangePassword, ApiUsersCreateAccessGroup, ApiUsersDeleteAccount, ApiUsersGetActiveGroup, ApiUsersGetUser, ApiUsersGetUserGroups, ApiUsersGetUsers, ApiUsersRegisterAccessCode, ApiUsersSendResetPasswordLink, ApiUsersSetActiveGroup, ApiUsersSetPassword, ApiUsersUpdateUser, ApiUsersVerifyEmail, decodeQuery, errorResponse, okResponse, setProcessingRoute } from '../api/api'
import { sessionUserEmail, sessionUserId } from '../authentication/utils'
import { PasswordUserDb } from '../database/passwdb'
import { ModelsDb } from '../database/modelsdb'
import { IExternalAccessGroup, IExternalPasswordUser } from '../database/passwdbinterface'
import { CheckAdminAccess } from '../database/access'
import { BASE_PATH } from '../config/config'

function setQueryRouteReturningUserList(router: express.Router, api: string, operation: (req: any)=>Promise<any>, errorMsg: string) {
    return setProcessingRoute(router, api, operation, 
        users => {
            const orderedUsers = users.sort((t1:IExternalPasswordUser, t2: IExternalPasswordUser) => t1.name.localeCompare(t2.name))
            return {users: orderedUsers}
        }, errorMsg)
}


export function getRedirect(): express.Router {
    const router = express.Router()
    router.get('', (req, res) => {
        res.redirect(BASE_PATH);
      })
    return router
}

export function getUnrestrictedUsersAPI(modelsDb: ModelsDb, userDb: PasswordUserDb): express.Router {
    const router = express.Router()
    router.use(bodyParser.json())

    router.get(ApiUsersVerifyEmail, (req, res) => {
        const {userId, token} = decodeQuery(req.query) as {userId: string, token: string}
        userDb.verifyEmail(userId, token)
        .then( name => {
            res.send(okResponse({name: name}))
        })
        .catch( reason => 
            res.send(errorResponse(`Verification failed: ${reason}`))
        )
    })

    router.get(ApiUsersSetPassword, (req, res) => {
        const {userId, token, password} = decodeQuery(req.query) as {userId: string, token: string, password: string}
        userDb.setPassword(userId, token, password)
        .then( () => {
            req.logout()
            res.send(okResponse({}))
        })
        .catch( reason => 
            res.send(errorResponse(`Set password failed: ${reason}`))
        )
    })

    router.get(ApiUsersChangePassword, (req, res) => {
        const {userId, oldPassword, newPassword} = decodeQuery(req.query) as {userId: string, oldPassword: string, newPassword: string}
        userDb.changePassword(userId, oldPassword, newPassword)
        .then( () => {
            res.send(okResponse({}))
        })
        .catch( reason => 
            res.send(errorResponse(`Change password failed: ${reason}`))
        )
    })

    router.get(ApiUsersSendResetPasswordLink, (req, res) => {
        const {email} = decodeQuery(req.query) as {email: string}
        userDb.sendResetPasswordLink(email)
        .then( () => {
            res.send(okResponse({}))
        })
        .catch( reason => 
            res.send(errorResponse(`Could not send reset password link: ${reason}`))
        )
    })

    router.get(ApiUsersDeleteAccount, async (req, res) => {
        const {email, password} = decodeQuery(req.query) as {email: string, password: string}
        const isAdmin = await CheckAdminAccess(userDb, sessionUserId(req))
        if (! isAdmin) {
            if (sessionUserEmail(req) != email){
                res.send(errorResponse('Email is not from current session user.'))
                return
            }
            if (! await userDb.validatePassword(email, password)) {
                res.send(errorResponse('Invalid password.'))
                return
            }
        }
        try {
            const user = await userDb.getUserByEmail(email)
            await modelsDb.deleteUserModels(user.id)
            await userDb.deleteUser(user.id)
            if (! isAdmin) {
                req.logout()
            }
            res.send(okResponse({}))                
        } catch (reason) {
            res.send(errorResponse(`Could not delete account: ${reason}`))
        }
    })

    return router
}

export function getRestrictedUsersAPI(userDb: PasswordUserDb): express.Router {
    const router = express.Router()
    router.use(bodyParser.json())

    setQueryRouteReturningUserList(router, ApiUsersGetUsers, req=>userDb.getUsers(sessionUserId(req)), "Failed to get user list")

    setProcessingRoute(router, ApiUsersGetUser, req => {
        const {userId} = decodeQuery(req.query) as {userId: string}
        return userDb.getUser(sessionUserId(req), userId)
        }, (result: IExternalPasswordUser)=>{ return {user: result}}, "Failed to get user")

    setProcessingRoute(router, ApiUsersGetUserGroups, req => {
        return userDb.getUserGroups(sessionUserId(req))
        }, (result: string[])=>{ return {groups: result}}, "Failed to get user groups.")
        
    setProcessingRoute(router, ApiUsersGetActiveGroup, req => {
            return userDb.getUserActiveGroup(sessionUserId(req))
            }, (result: string)=>{ return {activeGroup: result}}, "Failed to get active group.")
        
    setProcessingRoute(router, ApiUsersSetActiveGroup, req => {
        const {activeGroup} = decodeQuery(req.query) as {activeGroup: string}
        return userDb.setUserActiveGroup(sessionUserId(req), activeGroup)
        }, ()=>{ return {}}, "Failed to set active group.")

    setProcessingRoute(router, ApiUsersUpdateUser, req => {
        const {userId, name, group, accessibleGroups, isAdmin} = decodeQuery(req.query) as { userId: string, name: string, group: string, accessibleGroups: string, isAdmin: boolean }
        return userDb.updateUser(sessionUserId(req), userId, name, group, accessibleGroups.split(","), isAdmin)
        }, ()=>{ return {}}, "Failed to update user.")
            
    setProcessingRoute(router, ApiUsersAllGroups, req => {
        return userDb.allGroupsForUser(sessionUserId(req))
        }, (result: string[])=>{ return {groups: result}}, "Failed to get all groups.")

    setProcessingRoute(router, ApiUsersAllFullGroups, req => {
        return userDb.allFullGroupsForUser(sessionUserId(req))
        }, (result: IExternalAccessGroup[])=>{ return {groups: result}}, "Failed to get all groups.")
    

    setProcessingRoute(router, ApiUsersRegisterAccessCode, req => {
        const {accessCode} = decodeQuery(req.query) as { accessCode: string }
        return userDb.registerAccessCode(sessionUserId(req), accessCode)
        }, (groups: string[])=>{ return {groups}}, "Failed to register access code.")
    
    setProcessingRoute(router, ApiUsersCreateAccessGroup, req => {
        const {name, accessCode} = decodeQuery(req.query) as { name: string, accessCode: string }
        return userDb.createAccessGroup(sessionUserId(req), name, accessCode)
        }, ()=>{ return {}}, "Failed to create access group.")
    

    return router
}
