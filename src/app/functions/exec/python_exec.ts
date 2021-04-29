import {successResponse, failResponse} from "../responses";
import {isWindows} from "../constants";

export const spawn = require("child_process").spawn; 

export default async function handlePythonExec(executor: string, args: Array<string>) {

    console.log(executor);
    console.log(args);
    
    return new Promise<{success:boolean, response:string}>((resolve, reject) => {
            try {

                const pythonProcess =  spawn(executor, args, {shell:isWindows});

                pythonProcess && pythonProcess.stdout && pythonProcess.stdout.on('data', (data: any) => {

                    const resp = data.toString().trim();

                    console.log(resp);

                    if (resp.startsWith("SUCCESS")) {
                        resolve(successResponse(resp))
                    } else {
                        reject(failResponse("Error in Python process, check errors.log."));
                    }
                })

                pythonProcess && pythonProcess.on('error', (err: any) => {

                    console.log(err);

                    reject(failResponse("Error in Python process, check errors.log."))
                })

                pythonProcess && pythonProcess.on("exit", (code: any, signal: any) => {

                    console.log(code);
                    console.log(signal);

                    const errorText = pythonProcess.stderr.toString().trim();

                    console.log(errorText);

                    if (code || signal) {
                        reject(failResponse("Error in Python process, check errors.log."))
                    }
                })

            } catch (error) {

                console.log(error);

                reject(failResponse("Error in Python process, check errors.log."))

            }


        })
    
}