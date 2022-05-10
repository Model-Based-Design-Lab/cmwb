import { ApiAnalysisLTLConvertToNBA } from "../api/api"
import { Controller } from "./controller"

export class LTLAnalysisController extends Controller {

    static async convertToNBA(modelId: string, userId: string, userName: string): Promise<string> {
        return LTLAnalysisController.requestWithResponseAndData(ApiAnalysisLTLConvertToNBA, {modelId: modelId, userId: userId, userName: userName}, respObj => respObj.modelName)
    }

    
}

