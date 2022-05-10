import { ApiAnalysisRegExConvertOmegaRegExToNBA, ApiAnalysisRegExConvertToDFA } from "../api/api"
import { Controller } from "./controller"

export class RegExAnalysisController extends Controller {

    static async convertToFSA(modelId: string, userId: string, userName: string): Promise<string> {
        return RegExAnalysisController.requestWithResponseAndData(ApiAnalysisRegExConvertToDFA, {modelId: modelId, userId: userId, userName: userName}, respObj => respObj.modelName)
    }

    static async convertOmegaRegExToNBA(modelId: string, userId: string, userName: string): Promise<string> {
        return RegExAnalysisController.requestWithResponseAndData(ApiAnalysisRegExConvertOmegaRegExToNBA, {modelId: modelId, userId: userId, userName: userName}, respObj => respObj.modelName)
    }
    
}

