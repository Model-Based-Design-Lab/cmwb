import { ApiUsersAllFullGroups, ApiUsersAllGroups, ApiUsersChangePassword, ApiUsersCreateAccessGroup, ApiUsersDeleteAccount, ApiUsersGetActiveGroup, ApiUsersGetUser, ApiUsersGetUserGroups, ApiUsersGetUsers, ApiUsersRegisterAccessCode, ApiUsersSendResetPasswordLink, ApiUsersSetActiveGroup, ApiUsersSetPassword, ApiUsersUpdateUser, ApiUsersVerifyEmail } from "../api/api"
import { GeneralGroup } from "../config/config"
import { IExternalAccessGroup, IExternalPasswordUser } from "../database/passwdbinterface"
import { Controller } from "./controller"

export class UserController extends Controller {

    // user is not yet verified, token is used for validation
    static async verifyEmail(userId: string, token: string): Promise<string> {
        return UserController.requestWithResponseAndDataUnrestricted<string>(ApiUsersVerifyEmail, {userId: userId, token: token}, respObj=>respObj.name)
    }

    // user is not yet verified, token is used for validation
    static async setPassword(userId: string, token: string, password: string) {
        return UserController.requestWithResponseUnrestricted(ApiUsersSetPassword, {userId: userId, token: token, password: password})
    }

    // change existing verified user password
    static async changePassword(userId: string, oldPassword: string, newPassword: string) {
        return UserController.requestWithResponseUnrestricted(ApiUsersChangePassword, {userId: userId, oldPassword: oldPassword, newPassword: newPassword})
    }

    // send email with reset link
    static async sendResetPasswordLink(email: string) {
        return UserController.requestWithResponseUnrestricted(ApiUsersSendResetPasswordLink, {email: email})
    }

    // delete user and models
    static async deleteAccount(email: string, password: string) {
        return UserController.requestWithResponseUnrestricted(ApiUsersDeleteAccount, {email: email, password: password})
    }

    // get list of users
    static async getUsers() {
        return UserController.requestWithResponseAndData(ApiUsersGetUsers, {}, respObj => respObj.users)
    }

    static async getUser(userId: string) {
        return UserController.requestWithResponseAndData(ApiUsersGetUser, {userId}, respObj => respObj.user)
    }

    // get list of user's groups
    static async getUserGroups(): Promise<string[]> {
        return UserController.requestWithResponseAndData(ApiUsersGetUserGroups, {},respObj => respObj.groups)
    }

    // get user's active group
    static async getActiveGroup(): Promise<string> {
        return UserController.requestWithResponseAndData(ApiUsersGetActiveGroup, {},respObj => respObj.activeGroup)
    }

    // set user's active group
    static async setActiveGroup(group: string): Promise<void> {
        return UserController.requestWithResponse(ApiUsersSetActiveGroup, {activeGroup: group}) 
    }

    // update user data
    static async updateUser(user: IExternalPasswordUser): Promise<void> {
        return UserController.requestWithResponse(ApiUsersUpdateUser, {
            userId: user.id,
            name: user.name,
            group: user.group,
            accessibleGroups: user.accessibleGroups,
            isAdmin: user.isAdmin
        }) 
    }

    // register access code
    static async registerAccessCode(accessCode: string): Promise<string[]> {
        return UserController.requestWithResponseAndData(ApiUsersRegisterAccessCode, { accessCode }, respObj => respObj.groups) 
    }

    // get all group names
    static async getAllGroups(): Promise<string[]> {
        return UserController.requestWithResponseAndData(ApiUsersAllGroups, {},respObj => respObj.groups)
    }
    
    // get all full IExternalAccessGroups
    static async getAllFullGroups(): Promise<IExternalAccessGroup[]> {
        return UserController.requestWithResponseAndData(ApiUsersAllFullGroups, {},respObj => respObj.groups)
    }
    
    // create new access group
    static async createAccessGroup(name: string, accessCode: string): Promise<void> {
        return UserController.requestWithResponse(ApiUsersCreateAccessGroup, {name, accessCode})
    }

}