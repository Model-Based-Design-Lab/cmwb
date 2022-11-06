import cp from 'child_process'
import { DefaultChildProcessTimeoutSeconds } from '../config/serverconfig'

export async function cpExecute(command: string, timeoutSeconds: number=DefaultChildProcessTimeoutSeconds): Promise<string> {
    return new Promise((resolve, reject) => {
        cp.exec(command, {timeout: 1000*timeoutSeconds}, (error, stdout, stderr) => {
            if (error) {
                if (error.signal == 'SIGTERM') {
                    // Timeout occurred
                    reject(`The process was terminated because of a timeout.`)
                } else {
                    reject(`${error} wih stderr: ${stderr}.`)
                }
            } else {
                resolve(stdout)

            }
        })        
    })
}
