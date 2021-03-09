import {successResponse, failResponse} from "../responses";
import {isWindows} from "../constants";

export const spawn = require("child_process").spawn; 


export default async function handlePythonExec(executor: string, args: Array<string>) {
    
    return new Promise<{success:boolean, response:string}>((resolve, reject) => {
            try {

                console.log("handle python exec");
                console.log(executor);
                console.log(args);

                const pythonProcess =  spawn(executor, args, {shell:isWindows});

                pythonProcess && pythonProcess.stdout && pythonProcess.stdout.on('data', (data: any) => {

                    const resp = data.toString().trim();

                    if (resp.startsWith("ERROR")) {
                        console.log("RESPONSE STARTED WITH ERROR: ");
                        console.log(resp);
                        reject(failResponse("Error in Python process, check errors.log."));
                    }

                    if (resp.startsWith("SUCCESS")) {
                        resolve(successResponse(resp))
                    }
                })

                pythonProcess && pythonProcess.on('error', (err: any) => {

                    console.log('PYTHON EXEC ON ERROR')
                    console.log(executor);
                    console.log(err);

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
                console.log(error);

                reject(failResponse("Error in Python process, check errors.log."))

            }


        })
    
}