import {graphingFuncs2D} from "./2DGraphs";
import {graphingFuncs3D} from "./3DGraphs";
import {dataFrame} from "../../data";
import {getDataFrameFromObj, getNewDataFilePathFromObj} from "../../keys";
import {isEmptyObj} from "../../object_helpers";
import {throwErrIfFail, emptyObjAsError} from "../../responses";
import {getDataFilePathFromObj} from "../../keys";
import {addToPath, fileNameFromPath, getGraphSaveDirPath} from "../../paths";
import {writeObjToPath, createDirIfNotExist} from "../../files";
import {saveArgs} from "../save";

export function getGraphGenerators() {
    return {
        ...graphingFuncs2D, 
        ...graphingFuncs3D 
    }
}

export type graphGenArgs = {
    dataFrame: dataFrame,
}

export function handleGenerateGraphs(graphArgs: graphGenArgs) {
    /**
     * graph name : graph JSON object IF successful 
     */
    const graphGenerators = getGraphGenerators();
    const dataFrameResp = getDataFrameFromObj(graphArgs);
    throwErrIfFail(dataFrameResp);
    const dataFrame = dataFrameResp.response;
    const genGraphResp = generateGraphs(graphGenerators, dataFrame);
    throwErrIfFail(genGraphResp);
    const genGraphs = genGraphResp.response;
    return genGraphs; 
}

export type graphingFunc = Function;
export type graphGenerators = Record<graphName, graphingFunc>;
export type graphJSON = any; 
function generateGraphs(graphGenerators: graphGenerators, dataFrame: dataFrame) {

    const generatedGraphs = {} as generatedGraphs;

    let graphGenerator;
    for (let graphName in graphGenerators) {

        graphGenerator = graphGenerators[graphName];
        try {
            const graphJSON = graphGenerator(dataFrame);
            if (isEmptyObj(graphJSON)) throw Error(`Failed to generate ${graphName}`);
            generatedGraphs[graphName] = graphJSON;
        } catch (error) {
            // TODO: remove console error  
            console.log(error);
        }

    }
    return emptyObjAsError(generatedGraphs, generatedGraphs, "No graphs successfully generated");
}



export async function handleSaveGeneratedGraphs(generatedGraphs: generatedGraphs, saveArgs: saveArgs) {
    const graphSaveDir = saveArgs['graphSaveDir'];

    console.log("GRAPH SAVE DIR: ");
    console.log(graphSaveDir);
    console.log("GENERATED GRAPHS: ");
    console.log(generatedGraphs);


    return await saveGeneratedGraphsToPaths(generatedGraphs, graphSaveDir);
}

export type graphName = string;
export type graphJSONPath = string;
export type savedGraphs = Record<graphName, graphJSONPath>;

export type graphJSONObj = Object;
export type generatedGraphs = Record<graphName, graphJSONObj>;
async function saveGeneratedGraphsToPaths(generatedGraphs: generatedGraphs, saveDir: string) {

    let savedGraphs = {} as savedGraphs;

    let graphJSONObj;
    for (let graphName in generatedGraphs) {
        const graphNameJSON = graphName + ".json";
        graphJSONObj = generatedGraphs[graphName];
        const savePath = addToPath(saveDir, graphNameJSON);
        const {success, response} = await writeObjToPath(savePath, graphJSONObj);
        
        if (success) {
            savedGraphs[graphName] = savePath; 
        }
        
    }

    return emptyObjAsError(savedGraphs, savedGraphs, "No graphs were saved.");
}