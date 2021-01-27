import {getDataFrameCSV} from "../data";
import {getNewDataFilePathFromObj,addDataFrameToObj} from "../keys";
import {handleGenerateGraphs} from "./graphs/graphs";
import {handleGenerateColumns} from "./graphs/columns";
import {throwErrIfFail, failResponse, successResponseAny} from "../responses";
import {getKeyFromObj} from "../object_helpers";

// kept in sync with save.tsx SAVE_HANDLERS
const GEN_HANDLERS: any = {
    'genCols': handleGenerateColumns, 
    'genGraphs': handleGenerateGraphs,
}

type genResult = Record<string, any>;
export type genFileArgs = {
    dataFilePath: string, 
    newDataFilePath: string,
}

export async function handleGenerate(genArgs: genFileArgs) {
    try {
        const newGenArgs = await addRequArgs(genArgs);

        const genResult = {} as genResult;

        for (let genType in GEN_HANDLERS) {
            const genHandler = GEN_HANDLERS[genType];
            const res = genHandler(newGenArgs);
            genResult[genType] = res;
        }

        return successResponseAny(genResult);
    } catch (error) {
        return failResponse(error);
    }
}

// TODO: could refactor out into keys module 
export function getColsFromGenObj(genResult: genResult) {
    return getKeyFromObj(genResult, 'genCols');
}  

export function getGraphsFromGenObj(genResult: genResult) {
    return getKeyFromObj(genResult, 'genGraphs');
}

export async function addRequArgs(genArgs: genFileArgs) {
    const genArgsCopy = Object.assign(genArgs);
    await addDataFrame(genArgsCopy);
    return genArgsCopy;
}

export async function addDataFrame(genArgs: genFileArgs) {
    const dataFrameResp = await getDataFrame(genArgs);
    throwErrIfFail(dataFrameResp);
    const dataFrame = dataFrameResp.response;

    addDataFrameToObj(genArgs, dataFrame);
}


async function getDataFrame(genArgs: genFileArgs) {
    const newDataFileResp = getNewDataFilePathFromObj(genArgs);
    throwErrIfFail(newDataFileResp);
    const CSVNewDataFilePath = newDataFileResp.response;
    const dataFrameResp = await getDataFrameCSV(CSVNewDataFilePath);
    throwErrIfFail(newDataFileResp);
    const newCSVDataFileDataFrame = dataFrameResp.response;
    return {
        success: true, 
        response: newCSVDataFileDataFrame
    }
}

// TODO: Function for data column values
    // iterates over columns of csv with danfo.js
        // stores in object as {columnName: [values]}