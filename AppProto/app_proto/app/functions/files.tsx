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

export function pathExists(checkPath: string) {
    return fs.existsSync(checkPath);
}

export function dirExists(dirPath: string) {
    return pathExists(dirPath);
}

export function createDirSync(dirPath: string) {
    return fs.mkdirSync(dirPath);
}

export function createDirIfNotExist(dirPath: string) {
    if (!dirExists(dirPath)) {
        createDirSync(dirPath);
    }
}