import * as express from 'express'
import { ApiStaticFilesGet } from '../api/api'
import { publicStaticFilesDir, restrictedStaticFilesDir } from '../config/serverconfig'

export function getRestrictedStaticFilesAPI(): express.Router {
    const router = express.Router()
    // router.use(bodyParser.json())

    router.use(ApiStaticFilesGet, express.static(restrictedStaticFilesDir))

    return router
}

export function getPublicStaticFilesAPI(): express.Router {
    const router = express.Router()
    // router.use(bodyParser.json())

    router.use(ApiStaticFilesGet, express.static(publicStaticFilesDir))

    return router
}
