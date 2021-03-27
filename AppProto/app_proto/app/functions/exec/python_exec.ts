import {successResponse, failResponse} from "../responses";
import {isWindows} from "../constants";

export const spawn = require("child_process").spawn; 


export default async function handlePythonExec(executor: string, args: Array<string>) {
    
    return new Promise<{success:boolean, response:string}>((resolve, reject) => {
            try {

                const pythonProcess =  spawn(executor, args, {shell:isWindows});

                pythonProcess && pythonProcess.stdout && pythonProcess.stdout.on('data', (data: any) => {

                    const resp = data.toString().trim();

                    if (resp.startsWith("ERROR")) {
                        reject(failResponse("Error in Python process, check errors.log."));
                    }

                    if (resp.startsWith("SUCCESS")) {
                        resolve(successResponse(resp))
                    }
                })

                pythonProcess && pythonProcess.on('error', (err: any) => {

                    reject(failResponse("Error in Python process, check errors.log."))
                })

                pythonProcess && pythonProcess.on("exit", (code: any, signal: any) => {

                    const errorText = pythonProcess.stderr.toString().trim();
                    if (code || signal) {
                        reject(failResponse("Error in Python process, check errors.log."))
                    }
                })

            } catch (error) {
                reject(failResponse("Error in Python process, check errors.log."))

            }


        })
    
}