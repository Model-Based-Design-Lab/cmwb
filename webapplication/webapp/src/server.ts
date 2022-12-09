import express from 'express'
import { BASE_PATH, BASE_PATH_RESTRICTED, DEBUG_PORT, PORT } from "./config/config"
import http from 'http'
import next from 'next'
import session from 'express-session'
import uid from 'uid-safe'
import bodyParser from 'body-parser'

import { logger, stream } from './config/winston'
import morgan from 'morgan'
import { setupPassport } from './authentication/auth'
import { PasswordUserDb, PasswordUserDbStub, PasswordUserMongooseDb } from './database/passwdb'
import { getRedirect, getRestrictedUsersAPI, getUnrestrictedUsersAPI } from './api/users'
import { setupSMTP } from './email/sendmail'
import { ModelsDb, ModelsDbStub, ModelsMongooseDb } from './database/modelsdb'
import { getModelsAPI } from './api/models'
import { getAnalysisAPI } from './api/analysis/analysis'
import { getPublicStaticFilesAPI, getRestrictedStaticFilesAPI } from './api/staticfiles'
import { containerMongoDbHost, mongoDbHost } from './config/serverconfig'

// check if we want to run in development or production mode
var dev: boolean = true
if (process.argv.includes("production")) {
    dev = false
}

// Note: for debug version, run with debug as argument
// also: need to adapt both src/config/config.ts and config.js files

var port = PORT
var debugMode = false
var localMode = false

if (process.argv.includes("debug")) {
	console.log('\x1b[31m', 'Running in Debug mode.', '\x1b[0m')
    port = DEBUG_PORT
    debugMode = true
}

if (process.argv.includes("local")) {
	console.log('\x1b[31m', 'Running in Local mode.', '\x1b[0m')
    localMode = true
}

global.localMode = localMode

// create the Next.js app
const app = next({
    dev,
    dir: "./src"
})

// getRequestHandler returns a request handler which we can use to parse all HTTP requests
const handle: any = app.getRequestHandler()

// prepare the app and then...
app.prepare().then(async () => {

    // create express server
    const server = express()

    // add session management to Express
    const sessionConfig = {
        // Create cryptographically secure UID (synchronously)
        secret: uid.sync(18),
        cookie: {
            path: BASE_PATH,
            httpOnly: true,
            secure: false,
            maxAge: 86400 * 1000 // 24 hours in milliseconds
        },
        resave: false,
        saveUninitialized: true
    }
    server.use(session(sessionConfig))

    // required to make sure the login post request data get parsed; must come before passport middleware
    server.use( bodyParser.urlencoded({ extended: true }) ) 

    // set the logging middleware
    server.use(morgan('combined', { stream: stream }))

    // make a log
    logger.info("Computational Modeling Workbench Application Server Starting")

    const dbHost = localMode?containerMongoDbHost:mongoDbHost

    // connect to the models database
    logger.info(`Connecting to database host: ${dbHost}`)
    var modelsDb: ModelsDb = new ModelsMongooseDb(logger, dbHost)
    if (! await modelsDb.connect()) {
        logger.error("Failed to connect to database. Using stub.")
        modelsDb = new ModelsDbStub(logger)
    }
    logger.info("Connected to CMWB database")

    // connect to the user and password database
    var passwordDb: PasswordUserDb = new PasswordUserMongooseDb(logger, dbHost)
    if (! await passwordDb.connect()) {
        logger.error("Failed to connect to user database. Using stub.")
        passwordDb = new PasswordUserDbStub(logger)
    }
    logger.info("Connected to user database")

    // set up the authentication stuff
    setupPassport(server, passwordDb, localMode)
    logger.info("Passport set up")

    // set the API access
    server.use(BASE_PATH_RESTRICTED, getModelsAPI(modelsDb, passwordDb))
    server.use(BASE_PATH_RESTRICTED, getAnalysisAPI(modelsDb))
    server.use(BASE_PATH, getUnrestrictedUsersAPI(modelsDb, passwordDb))
    server.use(BASE_PATH_RESTRICTED, getRestrictedUsersAPI(passwordDb))
    server.use(BASE_PATH_RESTRICTED, getRestrictedStaticFilesAPI())
    server.use(BASE_PATH, getPublicStaticFilesAPI())
    // base redirect
    server.use('', getRedirect())

    // server.use(BASE_PATH_RESTRICTED, getQuizAPI(modelsDb))    

    // handling everything else with Next.js
    server.get("*", handle)

    if (! localMode) {
        // setup and verify SMTP
        setupSMTP(logger)
    }

    // create server and start
    http.createServer(server).listen(port, () => {
        logger.info(`listening on port ${port}`)
    })
})