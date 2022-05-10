// check from the react props if there is a user that is logged in
export function isLoggedIn(props: any)
{
    if (props.user) return true
    return false
}

// get the user name from the react props
export function userDisplayName(props: any)
{
    if (! isLoggedIn(props)) return '<unknown>'
    return props.user.name
}

// check if the user is a guest
export function isGuest(props: any)
{
    if (! props.user) return true
    if (! props.user.isGuest) return false
    return true
}

// check if the user is admin
export function isAdmin(props: any)
{
    if (! props.user) return true
    if (! props.user.isAdmin) return false
    return true
}

export function sessionUserId(req: any) {
    return req.session.passport?.user?.id
}

export function sessionUserEmail(req: any) {
    return req.session.passport?.user?.email
}

