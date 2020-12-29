import os
import sys
import time
import json
from multiprocessing import Process 
from typing import Callable, Any, Tuple

# PACKAGE 
from private.graphs import graphers 
from private.logs import logDecorator
from private.helpers import pandasHelper, pathsHelper, keysHelper, kwargsHelper, filesHelper

MODULE_NAME = "graphs"
genericLog = logDecorator.genericLog(MODULE_NAME)

@genericLog
def __getGraphDirPathFromType(graphType: str): 
    
    GRAPHS_2D_DIR_PATH = pathsHelper.getGraphs2DDirPath()
    GRAPHS_3D_DIR_PATH = pathsHelper.getGraphs3DDirPath()
    
    graphTypeToDirPath = {
        "2D": GRAPHS_2D_DIR_PATH, 
        "3D": GRAPHS_3D_DIR_PATH 
    }
    
    graphDirPath = graphTypeToDirPath[graphType]
    
    return graphDirPath 

@genericLog
def __getGraphFuncFromTup(grapherTuple: Tuple) -> Callable: 
    
    return grapherTuple[0]

@genericLog
def __getGraphTypeFromTup(grapherTuple: Tuple) -> str:
    
    return grapherTuple[1]

@genericLog
def __getGraphNamesFromTup(grapherTuple: Tuple) -> List[str]:
    
    return grapherTuple[2:]

Graph = Any 
@genericLog
def __createGraphHTML(grapherTuple: Tuple, dataFileName: str): 
    
    graphType = __getGraphTypeFromTup(grapherTuple)
    graphTypeDirPath = __getGraphDirPathFromType(graphType)
    graphDirPath = os.path.join(graphTypeDirPath, dataFileName)
    
    for graph, name in zip(graphs, graphNames):
        HTMLPath = os.path.join(graphDirPath, name)
        graph.write_html(HTMLPath)
        
@genericLog
def __createGraphs(grapherTuple: Tuple, graphInputs: Tuple) -> List[Graph]: \
    
    grapherFunc = __getGraphFuncFromTup(grapherTuple)
    
    graphs = grapherFunc(*graphInputs)
    return graphs 

@genericLog
def __handleGraphCreation(grapherTuple: Tuple, graphInputs: Tuple, dataFileName: str): 
    graphs = __createGraphs(grapherTuple, graphInputs)
    __createGraphHTML(grapherTuple, dataFileName)

GRAPHERS_DICT = graphers.GRAPHERS_DICT 
@genericLog
def __getAllGraphers() -> GRAPHERS_DICT:
    allGraphers = graphers.getAllGraphers()
    return allGraphers

PandasDataFrame = Any
@genericLog
def __getXAxisFromPandasDataFrame(dataFrame: PandasDataFrame) -> List[int]:
    indicesPair = __getIndicesFromPandasDataFrame(dataFrame)
    startIndex, endIndex = indicesPair
    xAxis = list(range(startIndex, endIndex))
    return xAxis 

@genericLog
def __getIndicesFromPandasDataFrame(dataFrame: PandasDataFrame) -> Tuple[int, int]:
    indicesPair = pandasHelper.getIndicesPairFromPandasDataFrame(dataFrame)
    return indicesPair 
    
@genericLog
def __genericGetCSVFilePandasDataFrame(pathKey: str, graphKwargs: dict) -> PandasDataFrame: 
    CSVFilePath = graphKwargs[pathKey]
    dataFrame = pandasHelper.getPandasDataFrameFromCSVPath(CSVFilePath)
    return dataFrame 
    
@genericLog
def __getPreCalcFilePandasDataFrame(graphKwargs: dict) -> PandasDataFrame:
    PRECALC_KEY = keysHelper.getPreCalcKey()
    dataFrame = __genericGetCSVFilePandasDataFrame(PRECALC_KEY, graphKwargs)
    return dataFrame 
    
@genericLog
def __getDataFilePandasDataFrame(graphKwargs: dict) -> PandasDataFrame:
    DATA_FILE_PATH_KWARG = kwargsHelper.getDataFilePathKwarg()
    dataFrame = __genericGetCSVFilePandasDataFrame(PRECALC_KEY, graphKwargs)
    return dataFrame 

GRAPHER_KWARG = str 
GRAPHER_INPUTS = List[Any]
@genericLog
def __getGrapherKwargToInputs(graphKwargs: dict) -> dict[GRAPHER_KWARG, GRAPHER_INPUTS]: 
    
    DATA_AXIS_INDICES_KWARG = kwargsHelper.getGrapherDataAxisIndicesKwarg()
    PRECALC_AXIS_INDICES_KWARG = kwargsHelper.getGrapherPreCalcAxisIndicesKwarg()
    DATA_FILE_KWARG = kwargsHelper.getGrapherDataFileKwarg()
    PRECALC_FILE_KWARG = kwargsHelper.getGrapherPrecalcFileKwarg()
    
    dataFilePandasDataFrame = __getDataFilePandasDataFrame(graphKwargs)
    preCalcFilePandasDataFrame = __getPreCalcFilePandasDataFrame(graphKwargs)
    indicesPair = __getIndicesFromPandasDataFrame(dataFilePandasDataFrame)
    xAxis = __getXAxisFromPandasDataFrame(dataFilePandasDataFrame)
    
    grapherKwargToInputs = {
        DATA_AXIS_INDICES_KWARG : [dataFilePandasDataFrame, xAxis, indicesPair],
        PRECALC_AXIS_INDICES_KWARG : [preCalcFilePandasDataFrame, xAxis, indicesPair],
        DATA_FILE_KWARG : [dataFilePandasDataFrame],
        PRECALC_FILE_KWARG : [preCalcFilePandasDataFrame]
    }
    
    return grapherKwargToInputs

@genericLog
def __getDataFileName(graphKwargs: dict) -> str:
    DATA_FILE_NAME_KWARG = kwargsHelper.getDataFileNameKwarg()
    dataFileName = graphKwargs[DATA_FILE_NAME_KWARG]
    return dataFileName
        
@genericLog 
def __createGrapherProcesses(graphKwargs: dict, grapherKwargToInputs: dict) -> List: 
    dataFileName = __getDataFileName(graphKwargs)
    
    all_processes = [] 
    
    allGraphers = __getAllGraphers() 
    for grapherKwarg in allGraphers: 
        
        grapherTuples = allGraphers[grapherKwarg]
        grapherInputs = grapherKwargToInputs[grapherKwarg]
        
        for grapherTuple in grapherTuples:
            process = Process(target=__handleGraphCreation, args=(grapherTuples, grapherInputs, dataFileName))
            all_processes.append(process)
    
    # ! remember to create a central path creator near the start of the application
        # ! all in 'files' dir 
            
@genericLog
def __generateAllGraphs(graphKwargs: dict):
    grapherKwargToInputs = __getGrapherKwargToInputs(grapherKwargs)
    grapherProcesses = __createGrapherProcesses(graphKwargs, grapherKwargToInputs)
    
    for process in grapherProcesses: 
        process.start() 
    for process in grapherProcesses: 
        process.join() 
        
@genericLog 
def __getFileGraphDirsFromFileName(dataFileName: str) -> List[str]: 
    dataFileName = __getDataFileName(graphKwargs)
    
    allGraphDirs = pathsHelper.getAllGraphsDirPaths()
    
    fileGraphDirs = [] 
    
    for graphDir in allGraphDirs: 
        
        fileGraphDir = os.path.join(graphDir, dataFileName)
        
        fileGraphDirs.append(fileGraphDir)
            
    return fileGraphDirs

@genericLog
def __getFileGraphDirsFromKwargs(graphKwargs: dict) -> List[str]:

    dataFileName = __getDataFileName(graphKwargs)
    fileGraphDirs = __getFileGraphDirsFromFileName(dataFileName)
    return fileGraphDirs 
    
@genericLog 
def __createGraphDirs(graphKwargs: dict):
        
    fileGraphDirs = __getFileGraphDirsFromKwargs(graphKwargs)
    
    for fileGraphDir in fileGraphDirs: 
        filesHelper.createDirIfNotExist(fileGraphDir)
        graphDirs.append(fileGraphDir)
        
@genericLog 
def __getFoundHTMLFiles(fileGraphDir: str) -> dict: 
    
    foundHTMLFiles = {}
    
    foundFiles = os.scandir(fileGraphDir)
    for foundFile in foundFiles: 
        foundFileName = foundFile.name 
        foundFilePath = os.path.join(fileGraphDir, foundFileName)
        foundHTMLFiles[foundFileName] = foundFilePath 
    
    return foundHTMLFiles 

@genericLog 
def __get3DGraphHTMLFiles() -> dict: 

    GRAPHS_3D_DIR_PATH = pathsHelper.getGraphs3DDirPath()
    
    foundHTMLFiles = __getFoundHTMLFiles(GRAPHS_3D_DIR_PATH)
    
    return foundHTMLFiles
    

@genericLog 
def __get2DGraphHTMLFiles() -> dict: 
    
    GRAPHS_2D_DIR_PATH = pathsHelper.getGraphs2DDirPath()

    foundHTMLFiles = __getFoundHTMLFiles(GRAPHS_2D_DIR_PATH)
    
    return foundHTMLFiles 
        
@genericLog 
def __addGeneratedGraphs(graphKwargs: dict): 
    
    graphKwargsCopy = graphKwargs.copy() 
    fileGraphDirs = __getFileGraphDirsFromKwargs()
    
                
@genericLog
def handleGenerateAllGraphs(graphKwargs: dict):
    __createGraphDirs(graphKwargs)
    __generateAllGraphs(graphKwargs)
    graphKwargs = __addGeneratedGraphs(graphKwargs)
    