import { QuizGroup, webAppRoot } from "../config/config";
import { DomainExtensions, domains } from "../config/model";
import { ModelsDb } from "../database/modelsdb";
import { fsReadFile, fsReadJSONFile } from "../utils/fsutils";


export type TModel = {
    name: string
    file: string
    domain: string
}

export type TExercise = {
    name: string
    description: string
    models: TModel[]
    answers: any[]
    userId: string
}

// {
//     "description": "question.md",
//     "models": [
    // {
    //     "name": "Exercise 1", 
    //     "file": "exercise1.dtmc"
    // }
//     ],
//     "answers": [
//         [
//             "multipleChoice", 
//             "What is the Markov Chain Type?", 
//             ["A", "B", "C"], 
//             "B"
//         ]
//     ]
// }

export async function createExercise(name: string, userId: string, modelsDb: ModelsDb): Promise<any> {
    var ex = await loadExercise(name)
    ex.userId = userId
    ex.name = name
    await createModels(ex, modelsDb)
    return ex
}


export async function loadExercise(name: string): Promise<TExercise> {
    var ex = await fsReadJSONFile(`${webAppRoot}/exercises/${name}/exercise.json`)
    return ex
}

async function createModels(ex: TExercise, modelsDb: ModelsDb): Promise<void> {
    for (var i=0 ; i< ex.models.length; i++){ 
        const m = ex.models[i]
        const modelContent = await fsReadFile(`${webAppRoot}/exercises/${ex.name}/${m.file}`)
        const domain = domains.find(d => m.file.endsWith(DomainExtensions.get(d)))
        const modelId = await modelsDb.newModel(m.name, domain, "Quiz", QuizGroup, ex.userId)
        await modelsDb.updateModelContent(modelId, modelContent, ex.userId)
    }
}

export function initializeExercise(ex: TExercise, modelsDb: ModelsDb) {
    // assumes that the exercise is loaded in the session and that the user is currently logged in

    // create the models for the user
    createModels(ex, modelsDb)
}