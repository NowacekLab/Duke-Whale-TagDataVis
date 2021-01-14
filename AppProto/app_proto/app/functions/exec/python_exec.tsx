import {spawn} from "./constants";

export default async function handlePythonExec(executor: string, args: Array<string>) {
    
    return new Promise<{success:boolean, response:string}>((resolve, reject) => {
            try {

                const pythonProcess = spawn(executor, args);

                pythonProcess && pythonProcess.stdout && pythonProcess.stdout.on('data', (data: any) => {

                    const resp = data.toString().trim();

                    if (resp.startsWith("ERROR")) {
                        throw Error();
                    }

                    if (resp.startsWith("SUCCESS")) {
                        resolve({
                            success: true, 
                            response: resp
                        })
                    }
                })

                pythonProcess && pythonProcess.stdout && pythonProcess.stdout.on('error', (err: string) => {
                    throw Error(err);
                })

                pythonProcess && pythonProcess.on("exit", (code: any) => {
                    throw Error(code);
                })

            } catch (error) {

                reject({
                    success: false, 
                    response: error,
                })

            }


        })
    
}