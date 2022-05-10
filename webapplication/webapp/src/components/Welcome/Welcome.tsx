import React from "react"
import { isAdmin, isGuest, userDisplayName } from "../../authentication/utils"

export default function WelcomeMessage(props: any) {
    var welcome: JSX.Element
    if (isGuest(props)) {
        welcome = <p>Welcome  {userDisplayName(props)}. You are logged in as a guest.</p>
    } else {
        if (isAdmin(props)) {
            welcome = <p>Welcome {userDisplayName(props)}. You are logged in.</p>
        } else {
            welcome = <p>Welcome {userDisplayName(props)}. You are logged in.</p>
        }
    }

    return welcome
}

