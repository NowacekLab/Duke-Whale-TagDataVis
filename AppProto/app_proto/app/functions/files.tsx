import {successResponse, failResponse} from "./responses";

export const fs = window.require('fs');

export function writeToPathSync(filePath: string, content: any) {
    try {
        fs.writeFileSync(filePath, content);
        return successResponse();
    } catch (error) {
        return failResponse(error);
    }
}

export async function writeToPath(filePath: string, content: any) {
    try {
        await fs.promises.writeFile(filePath, content);
        return successResponse();
    } catch (error) {
        return failResponse(error);
    }
}

export async function writeObjToPath(filePath: string, obj: Object) {
    const content = JSON.stringify(obj, null, 4);
    return await writeToPath(filePath, content);
}

export async function getObjFromPath(filePath: string) {
    const content = await getFileContents(filePath);
    const JSONContent = JSON.parse(content);
    return JSONContent;
}

export async function getFileContents(filePath: string) {
    const content = await fs.promises.readFile(filePath);
    return content; 

}

export function getFileContentsSync(filePath: string) {
    const content = fs.readFileSync(filePath);
    return content;
}

export async function pathExists(checkPath: string) {
    return fs.existsSync(checkPath);
}

export async function dirExists(dirPath: string) {
    return await pathExists(dirPath);
}

export async function createPath(path: string) {
    return await fs.promises.writeFile(path, JSON.stringify({}));
}

export async function createPathIfNotExist(path: string) {

    console.log("CREATE PATH IF NOT EXISTS")
    console.log(path);

    const pathExists_ = await pathExists(path);

    console.log(pathExists_)

    if (!pathExists_) {
        await createPath(path);
    }
}

export async function createDir(dirPath: string) {
    return await fs.promises.mkdir(dirPath);
}

export async function createDirIfNotExist(dirPath: string) {

    console.log("CREATE DIR IF NOT EXISTS")
    console.log(dirPath);

    const pathExists = await dirExists(dirPath);

    console.log(pathExists);

    if (!pathExists) {
        await createDir(dirPath);
    }
}