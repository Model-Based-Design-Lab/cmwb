import express from "express"
import passport from "passport"
import { BASE_PATH, BASE_PATH_RESTRICTED } from "../config/config"

export const LoginURL = `${BASE_PATH}/login`
export const LogoutURL = `${BASE_PATH_RESTRICTED}/logout`
export const SignupURL = `${BASE_PATH}/signup`
export const GuestURL = `${BASE_PATH}/guestlogin`

// get the express router
const router = express.Router()

// set up the login authentication route
// POST values are expected to be called 'email' and 'password'
router.post(LoginURL, 
    // pass post request on the login route through the authenticate middleware
    passport.authenticate('local-login', {
        successRedirect: BASE_PATH_RESTRICTED,
        failureRedirect: LoginURL,
        failureFlash: true 
    }))

// define the logout route
router.get(LogoutURL, (req: any, res, next) => {
    req.logout(function(err: any) {
        if (err) { return next(err) }
        res.redirect(LoginURL)
    })
})

// set up the signup route
router.post(SignupURL, 
    passport.authenticate('local-signup', {
        successRedirect: `${BASE_PATH}/authentication/signup`,
        failureRedirect: LoginURL,
        failureFlash: true 
    }))

// set up the guest login route
router.post(GuestURL, 
    passport.authenticate('local-guest', {
        successRedirect: BASE_PATH_RESTRICTED,
        failureRedirect: LoginURL
    }))



export default router