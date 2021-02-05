import {successResponse, failResponse} from "../responses";

export const spawn = require("child_process").spawn; 


export default async function handlePythonExec(executor: string, args: Array<string>) {
    
    return new Promise<{success:boolean, response:string}>((resolve, reject) => {
            try {

                const pythonProcess =  spawn(executor, args);

                pythonProcess && pythonProcess.stdout && pythonProcess.stdout.on('data', (data: any) => {

                    const resp = data.toString().trim();

                    if (resp.startsWith("ERROR")) {
                        reject(failResponse("Error in Python process, check errors.log."))
                    }

                    if (resp.startsWith("SUCCESS")) {
                        resolve(successResponse(resp))
                    }
                })

                pythonProcess && pythonProcess.on('error', (err: any) => {

                    console.log('PYTHON EXEC ON ERROR')

                    reject(failResponse("Error in Python process, check errors.log."))
                })

                pythonProcess && pythonProcess.on("exit", (code: any, signal: any) => {

                    console.log('PYTHON PROCESS ON EXIT')

                    const errorText = pythonProcess.stderr.toString().trim();
                    console.log("ERROR")
                    console.log(errorText)
                    if (code || signal) {
                        console.log("CODE: ");
                        console.log(code);
                        console.log("SIGNAL: ");
                        console.log(signal);
                        
                        reject(failResponse("Error in Python process, check errors.log."))
                    }
                })

            } catch (error) {

                console.log("REJECT SECTION");

                reject(failResponse("Error in Python process, check errors.log."))

            }


        })
    
}