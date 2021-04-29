import {dataFrame} from "../../data";
import {throwErrIfFail, failResponse, successResponse, successResponseAny} from "../../responses";
import {getDataFrameFromObj, getDataFilePathFromObj} from "../../keys";
import {saveArgs} from "../save";
import {fileNameFromPath, getColSaveDirPath, addToPath} from "../../paths";
import { createDirIfNotExist, writeObjToPath } from "../../files";

type genColArgs = {
    dataFrame: dataFrame
}

export function handleGenerateColumns(genColArgs: genColArgs) {
    /**
     * for reference on what is returned, see 
     * https://github.com/plotly/react-chart-editor/blob/master/dev/dataSources.js
     * 
     * object of variable name : Array of variable values
     */

    const dataFrameResp = getDataFrameFromObj(genColArgs);
    throwErrIfFail(dataFrameResp);
    const dataFrame = dataFrameResp.response;
    const genColResp = generateColumns(dataFrame);
    throwErrIfFail(genColResp);
    const genCols = genColResp.response;
    return genCols;
}

export function generateColumns(df: any) {
    try {
        const dataToCol = {} as any;
        for (let col in df) {
            const data = df[col];
            dataToCol[col] = data;
        }
        return successResponseAny(dataToCol);
    } catch (error) {
        return failResponse(error);
    }
}




export type varName = string;
export type varValues = Array<any>;
export type generatedCols = Record<varName, varValues>;

export async function handleSaveGeneratedColumns(generatedCols: generatedCols, saveArgs: saveArgs) {
    const colSaveDir = saveArgs['colSaveDir'];

    return await saveGeneratedColumns(generatedCols, colSaveDir);
}

export async function saveGeneratedColumns(generatedCols: generatedCols, saveDir: string) {
    const savedCols: any = {};

    const colFileName = "cols.json";
    const savePath = addToPath(saveDir, colFileName);
    const writeResp = await writeObjToPath(savePath, generatedCols);
    throwErrIfFail(writeResp);

    savedCols[colFileName] = savePath;

    return successResponseAny(savedCols);
}