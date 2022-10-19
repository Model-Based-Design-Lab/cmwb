import { logger } from '../config/winston'
import { BinaryEncoding, codegenBin, codeGenOutputDir, graphvizBin, latex2SvgBin, previewDir, sdf3analyzeBin, sdf3analyzeFsmSadfBin, sdf3convertSdfSadfBin, cmtraceBin, webAppRoot } from "../config/config"
import { ensureDirExists, ensureEmptyDir, fsDeleteFile, fsReadBinaryCodegenFile, fsReadDir, fsReadCodegenFile, fsRename, fsWriteFile, getAllFiles } from "../utils/fsutils"
import { cpExecute } from "../utils/cputils"
import { DomDTMC, domExtensions, DomFSA, DomLTL, DomMPM, DomRegEx, DomSDF } from "../config/model"
import * as libDtmc from '../operations/dtmc'
import * as libMpm from '../operations/mpm'
import { ganttTraceXml } from "../operations/sdf"
import { vectorTraceOfEventAndVectorSequencesXml, vectorTraceXml } from "../operations/mpm"
import { asNameWithoutSpaces, onDomain } from "../utils/utils"
import path from "path"


// define type for tasks in code generation
type CodeGenTask = {
	logText: string
	func: () => Promise<any>
	errorMsg: string
}

export abstract class CodeGenBase {

    protected modelId: string
    protected name: string
    protected nameWithoutSpaces: string
    protected extension: string

    constructor(modelId: string, name: string, extension: string) {
        this.modelId = modelId
        this.name = name
        this.nameWithoutSpaces = asNameWithoutSpaces(name)
        this.extension = extension
    }

    public abstract runCodeGen(content: string): Promise<void>

    public abstract runMakePreview(content: string, previewFileName: string): Promise<void>

    public abstract runMakeGraphviz(content: string): Promise<string>

    public runMakeSVG(_content: string): Promise<string> {
        return new Promise(resolve => resolve(""))
    }

    public runMakeSVGArtifact(_content: string): Promise<string> {
        return new Promise(resolve => resolve(""))
    }

    public static modelOutDir(modelId: string) {
        return `${codeGenOutputDir}/${modelId}`
    }

    public static artifactFile(artifact: String) {
        return `${codeGenOutputDir}/${artifact}`
    }

    public async getArtifactFileRelative (file: string) {
        return path.relative(`${codeGenOutputDir}/`, file)
    }

    protected async doRunCodeGen(log: string, tasks: CodeGenTask[]): Promise<void> {
        var error = false
        var reason = ''
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i]
            if (!error) {
                log += task.logText
                try {
                    await task.func()                    
                } catch (err) {
                    logger.error(reason)
                    logger.error(task.errorMsg)
                    error = true
                    reason = err
                }
            }
        }
        await this.writeLogFile(log)
        if (error) throw new Error(`Failed to complete tasks: ${reason}.`)
    }

    protected modelOutDir() {
        return `${codeGenOutputDir}/${this.modelId}`
    }

    protected previewOutDir() {
        return `${previewDir}`
    }

    protected async clearCodeGenOutput() {
        await ensureEmptyDir(this.modelOutDir())
    }

    protected async createModelDir(): Promise<void> {
        await ensureDirExists(this.modelOutDir())
    }

    protected async createModelFile(content: string): Promise<string> {
        var outDir = this.modelOutDir()
        await ensureDirExists(outDir)
        await fsWriteFile(`${outDir}/${this.nameWithoutSpaces}.${this.extension}`, content)
        return "Done."
    }

    protected async doXtextCodeGen(): Promise<string> {
        return await cpExecute(`"${codegenBin}" "${this.modelOutDir()}/${this.nameWithoutSpaces}.${this.extension}" "${this.modelOutDir()}/"`)
    }

    /**
     * Rename files with the provided extensions to have the
     * base name to the model name 
     * @param extensions the extensions to rename
     */
    protected async renameXtextOutput(extensions: string[]): Promise<string> {
        for (let i = 0; i < extensions.length; i++) {
            const ext = extensions[i]
            await this.renameArtifact(`.${ext}`, `${this.nameWithoutSpaces}.${ext}`)
        }
        return "Done."
    }

    protected async graphvizMakeSvg(): Promise<void> {
        await cpExecute(`${graphvizBin} -Tsvg "${this.modelOutDir()}/${this.nameWithoutSpaces}.dot" -o "${this.modelOutDir()}/${this.nameWithoutSpaces}.svg"`)
    }

    protected async latexMakeSvg(): Promise<void> {
        await cpExecute(`"${latex2SvgBin}" "${this.modelOutDir()}/${this.nameWithoutSpaces}.LaTeX" > "${this.modelOutDir()}/${this.nameWithoutSpaces}.svg"`)
    }


    protected async removeTemporaryFiles(extensions: string[]): Promise<string> {
        for (let i = 0; i < extensions.length; i++) {
            const ext = extensions[i]
            await this.removeArtifact(`${this.nameWithoutSpaces}.${ext}`)
        }
        return "Done."
    }

    protected async writeLogFile(log: string): Promise<string> {
        await fsWriteFile(`${this.modelOutDir()}/${this.nameWithoutSpaces}.log.txt`, log)
        return "Done."
    }

    private async removeArtifact(filename: string): Promise<void> {
        await fsDeleteFile(`${this.modelOutDir()}/${filename}`)
    }

    private async renameArtifact(oldExt: string, newFileName: string): Promise<void> {
        const files = await fsReadDir(this.modelOutDir())
        for (var i = 0; i < files.length; i++) {
            if (files[i].endsWith(oldExt)) {
                await fsRename(`${this.modelOutDir()}/${files[i]}`, `${this.modelOutDir()}/${newFileName}`)
                i = files.length + 1
            }
        }
        if (i == files.length) {
            throw new Error(`Could not find file with extension ${oldExt}.`)
        }
    }


    // TASKS to compose

    protected CleanDirTask = {
        logText: `\n\nClearing output directory.\n`,
        func: async () => await this.clearCodeGenOutput(),
        errorMsg: "Failed to clean the code generation directory"
    }

    protected CreateModelDirTask = () => {
        return {
            logText: `\n\nCreating model directory.\n`,
            func: async () => await this.createModelDir(),
            errorMsg: "Failed to create model dir."
        }
    }

    protected WriteModelFileTask = (content: string) => {
        return {
            logText: `\n\nCreating model file.\n`,
            func: async () => await this.createModelFile(content),
            errorMsg: "Failed to write model file"
        }
    }

    protected XtextCodeGenerationTask = {
        logText: `\n\nRunning Xtext code generation.\n`,
        func: async () => await this.doXtextCodeGen(),
        errorMsg: `Failed to generate code with Xtext`
    }


    protected RenamingOutputTask = (extensions: string[]) => {
        return {
            logText: `\n\nRenaming Xtext code generation output.\n`,
            func: async () => await this.renameXtextOutput(extensions),
            errorMsg: `Failed to rename code generation output for ${this.name}`
        }
    }

    protected ConvertGraphToSVGTask(f: () => Promise<void>) {
        return {
            logText: `\n\nConverting graph to SVG.\n`,
            func: async () => { return await f() },
            errorMsg: `Failed to run graphviz for ${this.name}`
        }
    }

    protected getFileContentsTask(ext: string, callBack: (content: string) => void) {
        return {
            logText: `\n\nRetrieving file content.\n`,
            func: async () => {
                const content = await fsReadCodegenFile(`${this.modelOutDir()}/${this.nameWithoutSpaces}.${ext}`)
                callBack(content)
                return
            },
            errorMsg: `Failed to get file content.`
        }
    }

    protected getArtifactTask(ext: string, callBack: (content: string) => void) {
        return {
            logText: `\n\nRetrieving artifact file.\n`,
            func: async () => {
                callBack(await this.getArtifactFileRelative(`${this.modelOutDir()}/${this.nameWithoutSpaces}.${ext}`))
            },
            errorMsg: `Failed to get artifact file.`
        }
    }

    protected RemoveTemporaryFiles(extensions: string[]) {
        return {
            logText: `\n\nRemoving temporary files.\n`,
            func: async () => await this.removeTemporaryFiles(extensions),
            errorMsg: `Failed to remove temporary files for ${this.name}`
        }
    }

    protected CopyPreviewTask(previewFileName: string) {
        return {
            logText: `\n\Copying graph to previews.\n`,
            func: async () => await fsRename(`${this.modelOutDir()}/${this.nameWithoutSpaces}.svg`, `${this.previewOutDir()}/${previewFileName}`),
            errorMsg: `Failed to copy preview file for ${this.name}`
        }
    }

	protected ConvertLaTeXToSVGTask(f: ()=>Promise<void>) {
		return {
			logText: `\n\nConverting LaTeX to SVG.\n`,
			func: async () => {return await f()},
			errorMsg: "Failed to generate SVG"
		}
	}

}

export class CodeGenDTMC extends CodeGenBase {

    constructor(modelId: string, name: string) {
		super(modelId, name, domExtensions.get(DomDTMC))
	}

	public async graphvizMakeDtmc() {
        await cpExecute(`${graphvizBin} -Tsvg "${this.modelOutDir()}/${this.nameWithoutSpaces}.dot" -Kcirco -o "${this.modelOutDir()}/${this.nameWithoutSpaces}.svg"`)
	}

	protected async doMakeExecutionGraph(dtmcFile: string, numberOfSteps: number, graphFile: string): Promise<string> {
		await libDtmc.makeExecutionGraph(dtmcFile, numberOfSteps, graphFile)
		return "Done."
	}

    public static makeExecutionGraphFileName = (fn: string) => `${fn}_execution.svg`

	protected MakeExecutionGraph(numberOfSteps: number) {
		return {
			logText: `\n\Making DTMC execution graph.\n`,
			func: async () => await this.doMakeExecutionGraph(`${this.modelOutDir()}/${this.nameWithoutSpaces}.${this.extension}`, numberOfSteps, `${this.modelOutDir()}/${CodeGenDTMC.makeExecutionGraphFileName(this.nameWithoutSpaces)}`),
			errorMsg: `Failed to make execution graph for ${this.name}`
		}
	}

	public async runMakeExecutionGraph(content: string, numberOfSteps: number): Promise<string> {
		await this.doRunCodeGen(
            `Generating transient execution graph for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.MakeExecutionGraph(numberOfSteps),
                this.RemoveTemporaryFiles([domExtensions.get(DomDTMC)])
            ]
        )
        return this.getArtifactFileRelative(`${this.modelOutDir()}/${CodeGenDTMC.makeExecutionGraphFileName(this.nameWithoutSpaces)}`)
	}


	public async runCodeGen(content: string) {
		await this.doRunCodeGen(
			`Generating dtmc code for model ${this.name}.\n`,
			[
				this.CleanDirTask,
				this.WriteModelFileTask(content),
				this.XtextCodeGenerationTask,
				this.RenamingOutputTask(['mat', 'LaTeX', 'dot', 'dtmc']),
				this.ConvertGraphToSVGTask(async ()=> await this.graphvizMakeDtmc()),
				this.MakeExecutionGraph(10),
				this.RemoveTemporaryFiles([domExtensions.get(DomDTMC), 'dot'])
			]
		)
	}

	public async runMakePreview (content: string, previewFileName: string): Promise<void> {
        await this.doRunCodeGen(
            `Generating dtmc preview model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['mat', 'LaTeX', 'dot']),
                this.ConvertGraphToSVGTask(async () => await this.graphvizMakeDtmc()),
                this.CopyPreviewTask(previewFileName),
                this.RemoveTemporaryFiles([domExtensions.get(DomDTMC),'dot', 'mat', 'LaTeX'])
            ]
        )
	}

	public async runMakeGraphviz (content: string): Promise<string> {
        var result = ""
        await this.doRunCodeGen(
            `Generating dtmc graphviz for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['mat', 'LaTeX', 'dot']),
                this.getFileContentsTask('dot', (fileContent: string) => {
                    result = fileContent
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomDTMC),'dot', 'mat', 'LaTeX'])
            ]
        )
        return result
	}

	public async runMakeSVG (content: string): Promise<string> {
        var result = ""
		await this.doRunCodeGen(
            `Generating SVG file for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot', 'LaTeX', 'mat', 'dot']),
                this.ConvertGraphToSVGTask(async () => await this.graphvizMakeSvg()),
                this.getFileContentsTask('svg', (fileContent: string) => {
                    result = fileContent
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomDTMC),'dot', 'svg', 'LaTeX', 'mat'])
            ]
        )
        return result
    }

    public async runMakeSVGArtifact(content: string): Promise<string> {
        var result = ""
		await this.doRunCodeGen(
            `Generating SVG artifact for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot', 'LaTeX', 'mat', 'dot']),
                this.ConvertGraphToSVGTask(async () => await this.graphvizMakeSvg()),
                this.getArtifactTask('svg', (artifact: string) => {
                    result = artifact
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomDTMC),'dot', 'LaTeX', 'mat'])
            ]
        )
        return result
    }



}

export class CodeGenFSA extends CodeGenBase {
    
    constructor(modelId: string, name: string) {
		super(modelId, name, domExtensions.get(DomFSA))
	}

	public async runCodeGen(content: string) {
		await this.doRunCodeGen(
			`Generating fsa code for model ${this.name}.\n`,
			[
				this.CleanDirTask,
				this.WriteModelFileTask(content),
				this.XtextCodeGenerationTask,
				this.RenamingOutputTask(['dot']),
				this.ConvertGraphToSVGTask(async () => await this.graphvizMakeFsa()),
				this.RemoveTemporaryFiles([domExtensions.get(DomFSA), 'dot'])
			]
		)
	}

	public async runMakePreview (content: string, previewFileName: string): Promise<void> {
        await this.doRunCodeGen(
            `Generating fsa preview model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot']),
                this.ConvertGraphToSVGTask(async () => await this.graphvizMakeFsa()),
                this.CopyPreviewTask(previewFileName),
                this.RemoveTemporaryFiles([domExtensions.get(DomFSA), 'dot'])
            ]
        )
	}

	public async runMakeGraphviz (content: string): Promise<string> {
        var result = ""
        await this.doRunCodeGen(
            `Generating fsa graphviz for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot']),
                this.getFileContentsTask('dot', (fileContent: string) => {
                    result = fileContent
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomFSA), 'dot'])
            ]
        )
        return result
	}

	public async runMakeSVG (content: string): Promise<string> {
        var result = ""
		await this.doRunCodeGen(
            `Generating SVG file for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot']),
                this.ConvertGraphToSVGTask(async () => await this.graphvizMakeSvg()),
                this.getFileContentsTask('svg', (fileContent: string) => {
                    result = fileContent
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomFSA),'dot', 'svg'])
            ]
        )
        return result
    }
    
    public async runMakeSVGArtifact(content: string): Promise<string> {
        var result = ""
		await this.doRunCodeGen(
            `Generating SVG artifact for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot']),
                this.ConvertGraphToSVGTask(async () => await this.graphvizMakeSvg()),
                this.getArtifactTask('svg', (artifact: string) => {
                    result = artifact
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomFSA),'dot'])
            ]
        )
        return result
    }


	private async graphvizMakeFsa() {
		await cpExecute(`${graphvizBin} -Tsvg "${this.modelOutDir()}/${this.nameWithoutSpaces}.dot" -Kneato -o "${this.modelOutDir()}/${this.nameWithoutSpaces}.svg"`)
	}
	
}

export class CodeGenRegEx extends CodeGenBase {

    constructor(modelId: string, name: string) {
		super(modelId, name, domExtensions.get(DomRegEx))
	}

	public async runCodeGen(content: string) {
		await this.doRunCodeGen(
			`Generating regex code for model ${this.name}.\n`,
			[
				this.CleanDirTask,
				this.WriteModelFileTask(content),
				this.XtextCodeGenerationTask,
				this.RenamingOutputTask(['LaTeX']),
				this.ConvertLaTeXToSVGTask(async () => await this.latexMakeSvg()),
				this.RemoveTemporaryFiles([])
			]
		)
	}

	public async runMakePreview (content: string, previewFileName: string): Promise<void> {
        await this.doRunCodeGen(
            `Generating regex preview for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['LaTeX']),
                this.ConvertLaTeXToSVGTask(async () => await this.latexMakeSvg()),
                this.CopyPreviewTask(previewFileName),
                this.RemoveTemporaryFiles([domExtensions.get(DomRegEx), 'LaTeX'])
            ]
        )
	}
    
	public async runMakeGraphviz (_content: string): Promise<string> {
		return ''
	}
    
}

export class CodeGenLTL extends CodeGenBase {

    constructor(modelId: string, name: string) {
		super(modelId, name, domExtensions.get(DomLTL))
	}

	public async runCodeGen(content: string) {
		await this.doRunCodeGen(
			`Generating ltl code for model ${this.name}.\n`,
			[
				this.CleanDirTask,
				this.WriteModelFileTask(content),
				this.XtextCodeGenerationTask,
				this.RenamingOutputTask(['LaTeX']),
				this.ConvertLaTeXToSVGTask(async () => await this.latexMakeSvg()),
				this.RemoveTemporaryFiles([])
			]
		)
	}

	public async runMakePreview (content: string, previewFileName: string): Promise<void> {
        await this.doRunCodeGen(
            `Generating ltl preview for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['LaTeX']),
                this.ConvertLaTeXToSVGTask(async () => await this.latexMakeSvg()),
                this.CopyPreviewTask(previewFileName),
                this.RemoveTemporaryFiles([domExtensions.get(DomLTL), 'LaTeX'])
            ]
        )
	}
 
	public async runMakeGraphviz (_content: string): Promise<string> {
		return ''
	}


}

export class CodeGenSDF extends CodeGenBase {

    constructor(modelId: string, name: string) {
		super(modelId, name, domExtensions.get(DomSDF))
	}

	public async runCodeGen(content: string) {
		await this.doRunCodeGen(
			`Generating SDF code for model ${this.name}.\n`,
			[
				this.CleanDirTask,
				this.WriteModelFileTask(content),
				this.XtextCodeGenerationTask,
				this.RenamingOutputTask(['dot', 'sdfx']),
				this.ConvertGraphToSVGTask(async () => await this.graphvizMakeSvg()),
				this.ComputeThroughputTask,
				this.ConvertSDFToSADFTask,
				this.GenerateSADFTraceTask,
				this.ConvertTraceToSVGTask,
				this.RemoveTemporaryFiles([domExtensions.get(DomSDF), 'dot', 'sdfx', 'fsmsadfx', 'tracex'])
			]
		)
	}

	public async runMakePreview (content: string, previewFileName: string): Promise<void> {
        await this.doRunCodeGen(
            `Generating sdf preview model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot', 'sdfx']),
                this.ConvertGraphToSVGTask(async () => await this.graphvizMakeSvg()),
                this.CopyPreviewTask(previewFileName),
                this.RemoveTemporaryFiles([domExtensions.get(DomSDF), 'dot', 'sdfx'])
            ]
        )
	}

	public async runMakeGraphviz (content: string): Promise<string> {
        var result = ""
		await this.doRunCodeGen(
            `Generating sdf graphviz for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot', 'sdfx']),
                this.getFileContentsTask('dot', (fileContent: string) => {
                    result = fileContent
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomSDF),'dot', 'sdfx'])
            ]
        )
        return result
    }

	public async runMakeSDF3 (content: string): Promise<string> {
        var result = ""
		await this.doRunCodeGen(
            `Generating SDF3 sdfx file for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot', 'sdfx']),
                this.getFileContentsTask('sdfx', (fileContent: string) => {
                    result = fileContent
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomSDF),'dot', 'sdfx'])
            ]
        )
        return result
    }

	public async runMakeSDF3Artifact (content: string): Promise<string> {
        var result = ""
		await this.doRunCodeGen(
            `Generating SDF3 sdfx file for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot', 'sdfx']),
                this.getArtifactTask('sdfx', (artifact: string) => {
                    result = artifact
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomSDF), 'dot'])
            ]
        )
        return result
    }
    
	public async runMakeSVG (content: string): Promise<string> {
        var result = ""
		await this.doRunCodeGen(
            `Generating SVG file for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot', 'sdfx']),
                this.ConvertGraphToSVGTask(async () => await this.graphvizMakeSvg()),
                this.getFileContentsTask('svg', (fileContent: string) => {
                    result = fileContent
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomSDF),'dot', 'svg', 'sdfx'])
            ]
        )
        return result
    }

    public async runMakeSVGArtifact(content: string): Promise<string> {
        var result = ""
		await this.doRunCodeGen(
            `Generating SVG artifact for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['dot', 'sdfx']),
                this.ConvertGraphToSVGTask(async () => await this.graphvizMakeSvg()),
                this.getArtifactTask('svg', (artifact: string) => {
                    result = artifact
                }),
                this.RemoveTemporaryFiles([domExtensions.get(DomSDF),'dot', 'sdfx'])
            ]
        )
        return result
    }


    public static makeGanttChartFileName = (fn: string) => `${fn}_gantt.svg`

	public async runMakeGanttChart(content: string, numOfIter: string, initialState: string, inputTraces: string, zeroBased: boolean): Promise<string> {
        const actualNumOfIter = parseInt(numOfIter)
		await this.doRunCodeGen(
            `Generating Gantt chart for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.GenerateGanttTraceTask(content, actualNumOfIter, initialState, inputTraces, zeroBased),
                this.ConvertGanttTraceToSVGTask,
                this.RemoveTemporaryFiles([domExtensions.get(DomSDF)])
            ]
        )
        return this.getArtifactFileRelative(`${this.modelOutDir()}/${CodeGenSDF.makeGanttChartFileName(this.nameWithoutSpaces)}`)
	}

	private GenerateGanttTraceTask(sdf: string, numOfIter: number, initialState:string, inputTraces: string, zeroBased: boolean) {
		return {
			logText: `\n\nGenerating Gantt chart.\n`,
			func: async () => await this.generateGanttTrace(sdf, numOfIter, initialState, inputTraces, zeroBased),
			errorMsg: `Failed to generate Gantt trace for ${this.name}`
		}
	}

	private ConvertGanttTraceToSVGTask = {
		logText: `\n\nConverting Gantt trace to SVG.\n`,
		func: async () => await this.convertGanttTraceToSVG(),
		errorMsg: `Failed to convert trace to SVG for ${this.name}`
	}

	private async generateGanttTrace(sdf: string, numOfIter: number, initialState: string, inputTraces: string, zeroBased: boolean) {
        const xmlContent = await ganttTraceXml(sdf, numOfIter, initialState, inputTraces, zeroBased)
        await fsWriteFile(`${this.modelOutDir()}/${this.nameWithoutSpaces}.tracex`, xmlContent)
	}
	
	private async convertGanttTraceToSVG(): Promise<void> {
		await cpExecute(`${cmtraceBin} -t Gantt "${this.modelOutDir()}/${this.nameWithoutSpaces}.tracex" "${this.modelOutDir()}/${CodeGenSDF.makeGanttChartFileName(this.nameWithoutSpaces)}"`)
	}

	public async getThroughput(): Promise<string> {
		try {
			const content = await fsReadCodegenFile(`${this.modelOutDir()}/${this.nameWithoutSpaces}.throughput.txt`)
			// look for a line of the form: thr(testgraph) = 0.153846
			const throughputRegexp = new RegExp('^thr\\(.*\\)\\s*=\\s*(\\S*)\\s*$', 'gm')
			const result = throughputRegexp.exec(content.toString())
			if (result === null) return "Undefined"
			return result[1]
		} catch (error) {
			return "<No throughput analysis result available>"
		}
	}

	private ComputeThroughputTask = {
		logText: `\n\nComputing throughput.\n`,
		func: async () => await this.analyzeThroughput(),
		errorMsg: `Failed to analyze throughput for ${this.name}`	
	}

	private ConvertSDFToSADFTask = 
	{
		logText: `\n\nConverting SDF to SADF.\n`,
		func: async () => await this.convertSDFtoSADF(),
		errorMsg: `Failed to convert SDF to SADF for ${this.name}`
	}

	private GenerateSADFTraceTask = {
		logText: `\n\nGenerating trace.\n`,
		func: async () => await this.generateTrace(),
		errorMsg: `Failed to generate trace for ${this.name}`
	}

	private ConvertTraceToSVGTask = {
		logText: `\n\nConverting trace to SVG.\n`,
		func: async () => await this.convertTraceToSVG(),
		errorMsg: `Failed to convert trace to SVG for ${this.name}`
	}

	private async analyzeThroughput(): Promise<void> {
		await cpExecute(`${sdf3analyzeBin} --algo throughput --graph "${this.modelOutDir()}/${this.nameWithoutSpaces}.sdfx" > "${this.modelOutDir()}/${this.nameWithoutSpaces}.throughput.txt"`)
	}

	private async convertSDFtoSADF(): Promise<void> {
		await cpExecute(`${sdf3convertSdfSadfBin} --type fsmsadf --graph "${this.modelOutDir()}/${this.nameWithoutSpaces}.sdfx" --output "${this.modelOutDir()}/${this.nameWithoutSpaces}.fsmsadfx"`)
	}
	
	private async generateTrace(): Promise<void> {
		await cpExecute(`${sdf3analyzeFsmSadfBin} --algo trace --seq s,s,s,s,s --traceFormat XML --graph "${this.modelOutDir()}/${this.nameWithoutSpaces}.fsmsadfx" --traceFile "${this.modelOutDir()}/${this.nameWithoutSpaces}.tracex"`)
	}
	
	private async convertTraceToSVG(): Promise<void> {
		await cpExecute(`${cmtraceBin} -t Gantt "${this.modelOutDir()}/${this.nameWithoutSpaces}.tracex" "${this.modelOutDir()}/${this.nameWithoutSpaces}_trace.svg"`)
	}

}

export class CodeGenMPM extends CodeGenBase {

    constructor(modelId: string, name: string) {
		super(modelId, name, domExtensions.get(DomMPM))
	}

	public async runCodeGen (content: string) {
		return this.doRunCodeGen(
			`Generating max-plus matrix code for model ${this.name}.\n`,
			[
				this.CleanDirTask,
				this.WriteModelFileTask(content),
				this.XtextCodeGenerationTask,
				this.RenamingOutputTask(['LaTeX']),
				this.ConvertLaTeXToSVGTask(async () => await this.latexMakeSvg()),
				this.RemoveTemporaryFiles([])
			]
		)
	}
	
	public async runMakePreview (content: string, previewFileName: string): Promise<void> {
		await this.doRunCodeGen(
            `Generating max-plus matrix preview for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.XtextCodeGenerationTask,
                this.RenamingOutputTask(['LaTeX']),
                this.ConvertLaTeXToSVGTask(async () => await this.latexMakeSvg()),
                this.CopyPreviewTask(previewFileName),
                this.RemoveTemporaryFiles([domExtensions.get(DomMPM), 'LaTeX'])
            ]
        )
	}

	public async runMakeGraphviz (_content: string): Promise<string> {
		return ''
	}

	public async runMakeVectorTraceGraph(content: string, numOfIter: string, vectorTraces: string): Promise<string> {
		await this.doRunCodeGen(
            `Generating vector trace for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.GenerateVectorTraceTask(content, numOfIter, vectorTraces),
                this.ConvertVectorTraceToSVGTask,
                this.RemoveTemporaryFiles([domExtensions.get(DomMPM)])
            ]
        )
        return `${this.modelOutDir()}/${this.nameWithoutSpaces}_trace.svg`
	}

    public static makeVectorChartFileName = (fn: string) => `${fn}_trace.svg`

    public async runMakeVectorChart(content: string, eventAndVectorSequences: string): Promise<string> {
        await this.doRunCodeGen(
            `Generating Vector chart for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.GenerateGanttTraceOfEventAndVectorSequencesTask(content, eventAndVectorSequences),
                this.ConvertVectorTraceToSVGTask,
                this.RemoveTemporaryFiles([domExtensions.get(DomMPM)])
            ]
        )
        return this.getArtifactFileRelative(`${this.modelOutDir()}/${CodeGenMPM.makeVectorChartFileName(this.nameWithoutSpaces)}`)
	}


	protected async doMakePrecedenceGraph(mpmFile: string, matrix: string, dotFile: string): Promise<string> {
		await libMpm.makePrecedenceGraphGraphviz(mpmFile, matrix, dotFile)
		return "Done."
	}

    public static makePrecedenceGraphGraphvizFileName = (fn: string) => `${fn}.dot`
    public static makePrecedenceGraphImageFileName = (fn: string) => `${fn}.svg`

	protected MakePrecedenceGraph(matrix: string) {
		return {
			logText: `\n\Making MPM precedence graph.\n`,
			func: async () => await this.doMakePrecedenceGraph(`${this.modelOutDir()}/${this.nameWithoutSpaces}.${this.extension}`, matrix, `${this.modelOutDir()}/${CodeGenMPM.makePrecedenceGraphGraphvizFileName(this.nameWithoutSpaces)}`),
			errorMsg: `Failed to make precedence graph for ${this.name}`
		}
	}

	public async runMakePrecedenceGraph(content: string, matrix: string): Promise<string> {
		await this.doRunCodeGen(
            `Generating precedence graph for model ${this.name}.\n`,
            [
                this.CreateModelDirTask(),
                this.CleanDirTask,
                this.WriteModelFileTask(content),
                this.MakePrecedenceGraph(matrix),
                this.ConvertGraphToSVGTask(async ()=> await this.graphvizMakeSvg()),
                this.RemoveTemporaryFiles([domExtensions.get(DomMPM)])
            ]
        )
        return this.getArtifactFileRelative(`${this.modelOutDir()}/${CodeGenMPM.makePrecedenceGraphImageFileName(this.nameWithoutSpaces)}`)
	}

	private GenerateVectorTraceTask(mpm: string, numOfIter: string, vectorTraces: string) {
		return {
			logText: `\n\nGenerating vector trace.\n`,
			func: async () => await this.generateVectorTrace(mpm, numOfIter, vectorTraces),
			errorMsg: `Failed to generate vector trace for ${this.name}`
		}
	}

	private GenerateGanttTraceOfEventAndVectorSequencesTask(mpm: string, eventAndVectorSequences: string) {
		return {
			logText: `\n\nGenerating vector trace.\n`,
			func: async () => await this.generateVectorTraceOfEventAndVectorSequences(mpm, eventAndVectorSequences),
			errorMsg: `Failed to generate vector trace for ${this.name}`
		}
	}


	private ConvertVectorTraceToSVGTask = {
		logText: `\n\nConverting trace to SVG.\n`,
		func: () => this.convertVectorTraceToSVG(),
		errorMsg: `Failed to convert trace to SVG for ${this.name}`
	}

	private async generateVectorTrace(mpm: string, numOfIter: string, vectorTraces: string): Promise<void> {
		const xmlContent = await vectorTraceXml(mpm, numOfIter, vectorTraces)
        await fsWriteFile(`${this.modelOutDir()}/${this.nameWithoutSpaces}.tracex`, xmlContent)
	}

	private async generateVectorTraceOfEventAndVectorSequences(mpm: string, eventAndVectorSequences: string): Promise<void> {
        const xmlContent = await vectorTraceOfEventAndVectorSequencesXml(mpm, eventAndVectorSequences)
        await fsWriteFile(`${this.modelOutDir()}/${this.nameWithoutSpaces}.tracex`, xmlContent)
	}


	private async convertVectorTraceToSVG() {
		await cpExecute(`${cmtraceBin} -t vector "${this.modelOutDir()}/${this.nameWithoutSpaces}.tracex" "${this.modelOutDir()}/${this.nameWithoutSpaces}_trace.svg"`)
	}

}

function domCodeGen (modelId: string, name: string, domain: string): CodeGenBase {
    return onDomain(domain,
		() => new CodeGenSDF(modelId, name),
		() => new CodeGenMPM(modelId, name),
		() => new CodeGenDTMC(modelId, name),
		() => new CodeGenFSA(modelId, name),
		() => new CodeGenRegEx(modelId, name),
		() => new CodeGenLTL(modelId, name)
    )
}

export async function runCodeGen (modelId: string, name: string, content: string, domain: string) {
    await domCodeGen(modelId, name, domain).runCodeGen(content)
}

export async function artifacts (modelId: string) {
    const files = await getAllFiles(CodeGenBase.modelOutDir(modelId))
    return files.map((file:string) => [path.basename(file), file, path.extname(file)])
}

export function pathOfArtifact(model: string, art: String) {
	return `${codeGenOutputDir}/${model}/${art}`
}

export async function getArtifactContent (art: String): Promise<string> {
	return await fsReadCodegenFile(CodeGenBase.artifactFile(art))
}

export async function getBinaryArtifactContent (art: String): Promise<string> {
    return (await fsReadBinaryCodegenFile(CodeGenBase.artifactFile(art))).toString(BinaryEncoding)
}


export async function report(domain: string, id: string, name: string) {
    const nameWithoutSpaces = asNameWithoutSpaces(name)
	const reportPromise =  onDomain(domain,
		() => reportSdf(id, nameWithoutSpaces),
		() => reportMpm(id, nameWithoutSpaces),
		() => reportDtmc(id, nameWithoutSpaces),
		() => reportFsa(id, nameWithoutSpaces),
		() => reportRegex(id, nameWithoutSpaces),
		() => reportLTL(id, nameWithoutSpaces)
    )
    return await reportPromise
}

export async function dotGraph(domain: string, modelId: string, name: string, content: string): Promise<string> {
	const graphvizContent= await domCodeGen(modelId, name, domain).runMakeGraphviz(content)
	return graphvizContent.replace(/\n/g, '\\n')
}

export async function vectorTraceGraph(modelId: string, name: string, content: string, numOfIter: string, vectorTraces: string, callBack: (result: any)=>void, errCallBack: (err: any)=>void) {
	const codeGen =new CodeGenMPM(modelId, name)
    try {
        const file = await codeGen.runMakeVectorTraceGraph(content, numOfIter, vectorTraces)
        callBack({
            artifact: 'vector trace',
            model: name,
            file: file
        })            
    } catch (error) {
        errCallBack(error)
    }
}

export async function ganttChart(id: string, name: string, content: string, numOfIter: string, initialState: string, inputTraces: string, zeroBased: boolean): Promise<string> {
	const codeGen =new CodeGenSDF(id, name)
    const file = await codeGen.runMakeGanttChart(content, numOfIter, initialState, inputTraces, zeroBased)
    return file
}

export async function vectorChart(id: string, name: string, content: string, eventAndVectorSequences: string): Promise<string> {
    const codeGen =new CodeGenMPM(id, name)
    const file = await codeGen.runMakeVectorChart(content, eventAndVectorSequences)        
    return file

}

export async function convertSVG(domain: string, id: string, name: string, content: string): Promise<string> {
	const codeGen = domCodeGen(id, name, domain)
    return await codeGen.runMakeSVG(content)
}

export async function convertSVGArtifact(domain: string, id: string, name: string, content: string): Promise<string> {
	const codeGen = domCodeGen(id, name, domain)
    return await codeGen.runMakeSVGArtifact(content)
}

export async function convertSDF3(id: string, name: string, content: string): Promise<string> {
	const codeGen =new CodeGenSDF(id, name)
    return await codeGen.runMakeSDF3(content)
}

export async function convertSDF3Artifact(id: string, name: string, content: string): Promise<string> {
	const codeGen =new CodeGenSDF(id, name)
    return await codeGen.runMakeSDF3Artifact(content)
}


export async function transientExecutionGraph(id: string, name: string, content: string, numberOfSteps: number): Promise<string> {
    const codeGen =new CodeGenDTMC(id, name)
    const file = await codeGen.runMakeExecutionGraph(content, numberOfSteps)
    return file
}

export async function convertPrecedencegraph(id: string, name: string, content: string, matrix: string): Promise<string> {
    const codeGen =new CodeGenMPM(id, name)
    const file = await codeGen.runMakePrecedenceGraph(content, matrix)
    return file
}


export async function reportSdf(id: string, name: string) {
	const codeGenSDF = new CodeGenSDF(id, name)
	const throughputVal = await codeGenSDF.getThroughput()
	return {
		name: name, 
		throughputStatement: `The throughput of the graph '${name}' is: ${throughputVal}.`, 
		graphImagePath: `${CodeGenBase.modelOutDir(id)}/${name}.svg`, 
		traceImagePath: `${CodeGenBase.modelOutDir(id)}/${name}_trace.svg`
	}
}

// TODO: to be implemented
export async function reportMpm(id: string, name: string) {
	return {
		id: id,
		name: name
	}
}

export async function reportDtmc(id: string, name: string) {
	return {
		id: id,
		name: name, 
		graphImagePath: `${CodeGenBase.modelOutDir(id)}/${name}.svg`,
		executionGraphImagePath: `${CodeGenBase.modelOutDir(id)}/${CodeGenDTMC.makeExecutionGraphFileName(name)}`,
		equation: getArtifactContent(`${CodeGenBase.modelOutDir(id)}/${name}.LaTeX`)
	}
}

export async function reportFsa(id: string, name: string) {
	return {
		id: id,
		name: name, 
		graphImagePath: `${CodeGenBase.modelOutDir(id)}/${name}.svg`
	}
}

export async function reportRegex(id: string, name: string) {
	return {
		id: id,
		name: name
	}
}

export async function reportLTL(id: string, name: string) {
	return {
		id: id,
		name: name
	}
}
