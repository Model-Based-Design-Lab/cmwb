import fs from 'fs'
import { codeGenOutputDir } from '../config/config'
import path from 'path'
import tmp from 'tmp'

export function withTrailingSlash(path: string) {
    if (path.length == 0) return '/'
    if (path.slice(-1) != '/') return path+'/'
    return path
}

// remove trailing / if any
export function removeTrailingSlash(path: string) {
    if (path.length == 0) return ''
    if (path.slice(-1) == '/') return path.substr(0, path.length-1)
    return path
}

export async function fsWriteFile(filename: string, content: string, encoding: string = 'utf8'): Promise<void> {
    const data = new Uint8Array(Buffer.from(content))
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, encoding, err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

export async function fsReadFile(filename: string, encoding: string = 'utf8'): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filename, encoding, (error, data) => {
            if (error) reject(error)
            else resolve(data)
        })
    })
}

export async function fsReadBinaryFile(filename: string, encoding: string = 'utf8'): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(filename, (error, data) => {
            if (error) reject(error)
            else resolve(data)
        })
    })
}

export async function fsReadJSONFile(filename: string, encoding: string = 'utf8'): Promise<any> {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(filename, encoding, (error, data) => {
            if (error) reject(error)
            else resolve(JSON.parse(data))
        })
    })
}

export async function fsReadDir(dir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) reject(err)
            else resolve(files)
        })
    })
}

export async function fsRename(oldName: string, newName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.rename(oldName, newName, (error) => {
            if (error) reject(error)
            else resolve()
        })
    })
}


export async function fsDeleteFile(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.unlink(filename, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}


async function fsIsDirectory(path:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) reject()
            else resolve(stats.isDirectory())
        })
    })
}

async function fsDeleteDir(path:string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.rmdir(path, err => {
            if (err) reject()
            else resolve()
        })
    })
}



async function deleteFolderRecursive(dir: string) {
    if (await fsDirExists(dir)) {
        const files = await fsReadDir(dir)
        for (var i=0; i< files.length; i++) {
            const f = files[i]
                const curPath = path.join(dir, f)
            if (await fsIsDirectory(curPath)) {
                await deleteFolderRecursive(curPath)
            } else {
                await fsDeleteFile(curPath)
            }
        }
        await fsDeleteDir(dir)
    }
}


async function fsDirExists(path: string): Promise<boolean> {
    return new Promise((resolve, _reject) => {
        fs.access(path, fs.constants.R_OK, error => {
            if (error) {
                resolve(false)
            } else {
                resolve(true)
            }

        })
    })
}

async function fsMkDir(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, error => {
            if (error) {
                reject()
            } else {
                resolve()
            }
        })
    })
}


// ensure that the directory path exists and is empty
export async function ensureEmptyDir(path: string): Promise<void> {
    // check that path is inside the codegen dir, otherwise abort! abort!
    if (! (path.indexOf(codeGenOutputDir) == 0)) throw new Error('ensureEmptyDir only works inside codegenoutput dir')
    path = removeTrailingSlash(path)
    if (await fsDirExists(path)) {
        await deleteFolderRecursive(path)
    }
    await fsMkDir(path)
}

// ensure that the directory path exists
export async function ensureDirExists(path: string): Promise<void> {
    // check that path is inside the codegen dir, otherwise abort! abort!
    if (! (path.indexOf(codeGenOutputDir) == 0)) throw new Error('ensureDir only works inside codegenoutput dir')
    // remove trailing / if any
    if (path.slice(-1) == '/') path = path.substr(0, path.length-1)
    return new Promise(
		(resolve, reject) => {
			fs.access(path, fs.constants.R_OK, error => {
                if (! error) resolve()
                // the directory does not exist, create it
                fs.mkdir(path, err => {
                    if (err) reject(err)
                    else resolve()
                })
            })
        }
    )
}

export async function checkFileExists(path: string): Promise<boolean> {
    return new Promise( (resolve, _reject) => {
        // Check if the file is readable.
        fs.access(path, fs.constants.R_OK, (err) => {
            if (err) resolve(false)
            else resolve(true)
        })
    })
}

export function getAllFilesSync(dir: string): string[] {
    dir = withTrailingSlash(dir)
    var results:string[] = []
    const list = fs.readdirSync(dir)
    for (var i = 0; i < list.length; i++) {
        const file = list[i]
            const fullFile = path.join(dir, file)
        const stat = fs.statSync(fullFile)
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(getAllFilesSync(`${dir}${file}`))
        } else { 
            /* Is a file */
            results.push(`${dir}${file}`)
        }
    }
    return results
}

export async function getAllFiles(dir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        try {
            resolve(getAllFilesSync(dir)) 
        } catch (error) {
            reject(error)
        }
    })
}

export async function newTempFileName(ext: string): Promise<string> {
    return new Promise((resolve, reject) => {
        var options = {
            // seems we must make temp files under the system's temp dir
            // dir: tempDir,
	    	postfix: `.${ext}`
        }
        tmp.tmpName(options, (err, tmpName) => {
            if (err) reject(err)
            else resolve(tmpName)
        })
    })
}


export async function saveAsTempFile(contents: string, ext: string): Promise<string> {
    return new Promise((resolve, reject) => {
        newTempFileName(ext)
        .then( tmpName => {
            fsWriteFile(tmpName, contents, 'utf8')
            .then(() => resolve(tmpName))
        })
        .catch(err => reject(err))
    })
}
