import {successResponse, failResponse, failResponseAny} from "./responses";
import {getFileInfoPath, getSaveDirPath} from "./paths";
import {mergeObjs} from "./object_helpers";

const remote = require('electron').remote;
const shell = remote.shell;

//@ts-ignore
export const fs = window.require('fs');
//@ts-ignore
const path = require('path');

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

export function pathGivenDir(dirPath: string, name: string) {
    return path.join(dirPath, name ?? "");
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

    const pathExists_ = await pathExists(path);

    if (!pathExists_) {
        await createPath(path);
    }
}

export async function createDir(dirPath: string) {
    return await fs.promises.mkdir(dirPath);
}

export async function createDirIfNotExist(dirPath: string) {

    const pathExists = await dirExists(dirPath);

    if (!pathExists) {
        await createDir(dirPath);
    }
}

export async function removeDir(dirPath: string) {
    await fs.promises.rmdir(dirPath);
    return;
}

export async function removeDirAndFiles(dirPath: string) {

    async function removeAllFiles(files: any) {

        if (!files) return;

        for (let idx in files) {
            const fileName = files[idx];
            const currPath = path.join(dirPath, fileName);
            fs.unlinkSync(currPath);
        }
    }

    try {
        const files = fs.readdirSync(dirPath);
        await removeAllFiles(files);
        await removeDir(dirPath);
    
        return successResponse("Successfully removed all files.");
    } catch (e) {
        return failResponse();
    }
}

export async function removeFromFileInfo(primaryKey: string) {

    const fileInfo = await getFileInfo();

    if (fileInfo.hasOwnProperty(primaryKey)) {
        delete fileInfo[primaryKey];
        await saveFileInfo(fileInfo);
        return successResponse();
    } else {
        return failResponse();
    }
}

export async function addToFileInfo(addInfo: any) {
    await createFileInfoIfNotExist();
    const existingFileInfo = await getFileInfo();
    const mergedInfo = mergeObjs(existingFileInfo, addInfo);
    await saveFileInfo(mergedInfo);
}

export async function addToFileInfoAttr(addInfo: any, attr: any) {
    const existingFileInfo = await getFileInfo();
    if (!existingFileInfo.hasOwnProperty(attr)) {
        existingFileInfo[attr] = {};
    }
    existingFileInfo[attr] = {
        ...existingFileInfo[attr],
        ...addInfo,
    }
    await saveFileInfo(existingFileInfo);
}

export async function editBatchInfoAttr(batchName: string, attr: any, addInfo: any) {
    try {
        const existingFileInfo = await getFileInfo();
        existingFileInfo[batchName] = {
            ...existingFileInfo[batchName],
            [attr]: {
                ...existingFileInfo[batchName][attr],
                ...addInfo
            }
        }
        await saveFileInfo(existingFileInfo);
        return successResponse("edit batch info");
    } catch (error) {
        return failResponseAny(error);
    }

}

export async function getFileInfo() {
    const savePath = getFileInfoPath();
    return await getObjFromPath(savePath);
}

export async function saveFileInfo(saveObj: any) {
    const savePath = getFileInfoPath();
    return await writeObjToPath(savePath, saveObj);
}

export async function createFileInfoIfNotExist() {

    const saveDir = getSaveDirPath();
    await createDirIfNotExist(saveDir);
    const savePath = getFileInfoPath();
    await createPathIfNotExist(savePath);
}

export function showPathInFileManager(path: string) {
    shell.showItemInFolder(path);
}

export function showUserSaveFilesInFileManager() {
    showPathInFileManager(getSaveDirPath());
}