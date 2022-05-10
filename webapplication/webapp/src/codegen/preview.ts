import { previewDir } from "../config/config"
import { checkFileExists, fsReadFile } from "../utils/fsutils"
import { hashString, onDomain } from "../utils/utils"
import { CodeGenBase, CodeGenDTMC, CodeGenFSA, CodeGenLTL, CodeGenMPM, CodeGenRegEx, CodeGenSDF } from "./codegen"

class Preview {

    gen: CodeGenBase

    constructor(gen: CodeGenBase) {
        this.gen = gen
    }

    public async getPreviewFor(content: string): Promise<string> {
        // compute a hash value for the model to quickly identify cache
        const hash = hashString(content)
        // check if we have a cached version
        if (await this.previewExists(hash)) {
            return this.previewFileNameForHash(hash)
        }
        // create a new preview
        await this.gen.runMakePreview(content, this.previewFileNameForHash(hash))
        return this.previewFileNameForHash(hash)
    }

    private previewFileNameForHash(hash: number): string {
        return hash.toString()+'.svg'
    }

    private artifactForHash(hash: number): string {
        return `${previewDir}/${this.previewFileNameForHash(hash)}`
    }

    private async previewExists(hash: number): Promise<boolean> {
        return checkFileExists(this.artifactForHash(hash))
    }

}

export function makePreviewPromise (id: string, name: string, content: string, domain: string) {
	return onDomain(domain,
		() => {return new Preview(new CodeGenSDF(id, name)).getPreviewFor(content)},
		() => {return new Preview(new CodeGenMPM(id, name)).getPreviewFor(content)},
		() => {return new Preview(new CodeGenDTMC(id, name)).getPreviewFor(content)},
		() => {return new Preview(new CodeGenFSA(id, name)).getPreviewFor(content)},
		() => {return new Preview(new CodeGenRegEx(id, name)).getPreviewFor(content)},
		() => {return new Preview(new CodeGenLTL(id, name)).getPreviewFor(content)}
	)
}

export async function getPreviewImage(previewPath: string) {
    return await fsReadFile(`${previewDir}/${previewPath}`)
}
