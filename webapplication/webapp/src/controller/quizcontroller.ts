import { ApiQuizEndExercise, ApiQuizInitializeExercise } from "../api/api"
import { Controller } from "./controller"

export class QuizController extends Controller {

    static async initializeExercise(exerciseName: string): Promise<void> {
        return QuizController.requestWithResponseAndData<any>(ApiQuizInitializeExercise, {exerciseName}, respObj => respObj.exercise)
    }

    static async endExercise(): Promise<void> {
        return QuizController.requestWithResponse(ApiQuizEndExercise, {})
    }

}