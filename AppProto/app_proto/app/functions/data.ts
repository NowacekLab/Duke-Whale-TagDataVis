import {successResponseAny, failResponse} from "./responses";
import {getFileContents} from "./files";
export const neatCsv = require('neat-csv');

export type dataFrame = any;
export async function getDataFrameCSV(CSVFilePath: string) {
    try {
        const CSVFileContents = await getFileContents(CSVFilePath);
        const dataArr = await neatCsv(CSVFileContents);

        const df: any = {};

        for (let idx in dataArr) {
            const dataObj = dataArr[idx];
            for (let header in dataObj) {
                if (!(header === undefined || (typeof(header) === "string" && header.startsWith("Undefined") || header === ""))) {
                    const val = dataObj[header];
                    if (val) {
                        if (!df.hasOwnProperty(header)) {
                            df[header] = [];
                        }
                        df[header].push(val);
                    }
                }
            }
        }

        return successResponseAny(df);
    } catch (error) {
        return failResponse(error);
    }
}