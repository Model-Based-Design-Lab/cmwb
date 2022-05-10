import * as bodyParser from 'body-parser'
import * as express from 'express'
import { ApiQuizEndExercise, ApiQuizInitializeExercise, decodeQuery, setProcessingRoute, setProcessingWithoutResultRoute } from '../api/api'
import { sessionUserId } from '../authentication/utils'
import { ModelsDb } from '../database/modelsdb'
import { createExercise } from '../quiz/quiz'

export function getQuizAPI(modelsDb: ModelsDb): express.Router {
    const router = express.Router()
    router.use(bodyParser.json())


    setProcessingRoute(router, ApiQuizInitializeExercise, async req=>{
        const {exerciseName} = decodeQuery(req.query) as {exerciseName: string}
        const ex = await createExercise(exerciseName, sessionUserId(req), modelsDb)
        req.session.quiz.exercise = ex
        return ex
    }, exercise => {return {exercise}}, "Failed to initialize exercise")

    setProcessingWithoutResultRoute(router, ApiQuizEndExercise, async req=>{
        req.session.quiz.active = false
    }, "Failed to initialize exercise")

    return router
}
