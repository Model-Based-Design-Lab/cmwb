import {Express} from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import LocalStrategy from 'passport-local'
import { BASE_PATH_RESTRICTED } from '../config/config'
import { PasswordUserDb } from '../database/passwdb'
import { IExternalPasswordUser } from '../database/passwdbinterface'
import authRoutes, { LoginURL } from './auth-routes'
import { sendVerificationEmail } from '../email/sendmail'
import { logger } from '../config/winston'
import { GeneralGroup } from '../config/config'


// setup the authentication to the express server using the provided database to access user information
export function setupPassport(server: Express, passwordDb: PasswordUserDb, localMode: boolean) {
    
    const localLoginStrategy = new LocalStrategy.Strategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            // ask database to validate password
            passwordDb.validatePassword(email, password)
            .then(result => {
                // if validation passed
                if (result) {
                    // get the full user from the database
                    passwordDb.getUserByEmail(email)
                    .then( user => {
                        // return the user to the password middleware
                        return done(null, user)
                    })
                } else {
                    // indicate a failure to authenticate
                    req.flash("message", "Login failed, unknown email or invalid password.")
                    return done(null, false)
                }
            })
        }
    )

    const localLocalStrategy = new LocalStrategy.Strategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            // get user from database, auto-register if needed
            passwordDb.validateLocalUser(email, req.body.name)
            .then(result => {
                // if validation passed
                if (result) {
                    // get the full user from the database
                    passwordDb.getUserByEmail(email)
                    .then( user => {
                        // return the user to the password middleware
                        return done(null, user)
                    })
                } else {
                    // indicate a failure to authenticate
                    req.flash("message", "Login failed, unknown email or invalid password.")
                    return done(null, false)
                }
            })
        }
    )

    const localGuestLoginStrategy = new LocalStrategy.Strategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function(_email, _password, done) {
            // ask database to validate password
            return done(null, {
                id: "",
                name: "guest",
                email: "",
                isGuest: true,
                group: GeneralGroup,
                accessibleGroups: [GeneralGroup],
                createdAt: new Date()
            })
        }
    )

    const localSignupStrategy = new LocalStrategy.Strategy(
        {
            usernameField: 'email',
            passwordField: 'accesscode',
            passReqToCallback: true
        },
        function(req, email, accessCode, done) {
            // ask database if the email is still available
            passwordDb.isEmailKnown(email)
            .then(result => {
                if (result) {
                    // indicate a failure to sign up
                    req.flash("message", "This email address is already in use.")
                    return done(null, false)
                }
                passwordDb.groupForAccessCode(accessCode)
                .then(group => { 
                    if (group == null) {
                        req.flash("message", "Wrong access code.")
                        return done(null, false)
                    }
                    const name = req.body.name
                    passwordDb.signUpNewUser(name, email, group)
                    .then(({userId, verificationToken}) => {
                        sendVerificationEmail(email, name, userId, verificationToken)
                        return done(null, {name: name, email: email, isGuest: true})    
                    })
                })
                .catch(_reason => done(null, false))
            })
        }
    )

    // configuring Passport with the defined strategy
    if (localMode) {
        logger.info("Starting Passport for local user.")
        passport.use('local-login', localLocalStrategy)
    } else {
        passport.use('local-login', localLoginStrategy)
        passport.use('local-signup', localSignupStrategy)
        passport.use('local-guest', localGuestLoginStrategy)
    }

    // (de)serialization just pass the database user to the session
    passport.serializeUser((user: IExternalPasswordUser, done) => done(null, user))
    passport.deserializeUser((user: IExternalPasswordUser, done) => done(null, user))

    // adding Passport middleware
    server.use(passport.initialize())
    server.use(passport.session())
    
    // adding the flash middleware to pass error messages from the login
    server.use(flash())
    
    // set the login/logout authentication routes
    server.use(authRoutes)

    // restrict access to some routes
    const restrictAccess = (req: { isAuthenticated: () => any }, res: { redirect: (arg0: string) => any }, next: () => void) => {
        if (!req.isAuthenticated()) return res.redirect(LoginURL)
        next()
    }

    // set restriction to all routes under BASE_PATH_RESTRICTED
    if (! localMode) {
        server.use(BASE_PATH_RESTRICTED, restrictAccess)
    }

}