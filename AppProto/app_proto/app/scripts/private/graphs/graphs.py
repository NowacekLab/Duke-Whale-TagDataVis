import os
import sys
import time
import json
from multiprocessing import Process 
from typing import Callable, Any, Tuple, List, Mapping

# PACKAGE 
from private.graphs import graphers 
from private.logs import logDecorator
from private.helpers import pandasHelper, pathsHelper, keysHelper, kwargsHelper, filesHelper

MODULE_NAME = "graphs"
genericLog = logDecorator.genericLog(MODULE_NAME)

@genericLog
def _getGraphDirPathFromType(graphType: str): 
    
    GRAPHS_2D_DIR_PATH = pathsHelper.getGraphs2DDirPath()
    GRAPHS_3D_DIR_PATH = pathsHelper.getGraphs3DDirPath()
    
    graphTypeToDirPath = {
        "2D": GRAPHS_2D_DIR_PATH, 
        "3D": GRAPHS_3D_DIR_PATH 
    }
    
    graphDirPath = graphTypeToDirPath[graphType]
    
    return graphDirPath 

@genericLog
def _getGraphFuncFromTup(grapherTuple: Tuple) -> Callable: 
    
    return grapherTuple[0]

@genericLog
def _getGraphTypeFromTup(grapherTuple: Tuple) -> str:
    
    return grapherTuple[1]

@genericLog
def _getGraphNamesFromTup(grapherTuple: Tuple) -> List[str]:
    
    return grapherTuple[2:]

Graph = Any 
@genericLog
def _createGraphHTML(grapherTuple: Tuple, graphs: List, dataFileName: str): 
    
    graphType = _getGraphTypeFromTup(grapherTuple)
    graphTypeDirPath = _getGraphDirPathFromType(graphType)
    graphDirPath = os.path.join(graphTypeDirPath, dataFileName)
    
    graphNames = _getGraphNamesFromTup(grapherTuple)
    
    for graph, name in zip(graphs, graphNames):
        HTMLPath = os.path.join(graphDirPath, name)
        graph.write_html(HTMLPath)
        
@genericLog
def _createGraphs(grapherTuple: Tuple, graphInputs: Tuple) -> List[Graph]: \
    
    grapherFunc = _getGraphFuncFromTup(grapherTuple)
    
    graphs = grapherFunc(*graphInputs)
    return graphs 

@genericLog
def _handleGraphCreation(grapherTuples: List[Tuple], graphInputs: Tuple, dataFileName: str): 
    for grapherTuple in grapherTuples: 
            
        graphs = _createGraphs(grapherTuple, graphInputs)
        _createGraphHTML(grapherTuple, graphs, dataFileName)
    

GRAPHERS_DICT = graphers.GRAPHERS_DICT 
@genericLog
def _getAllGraphers() -> GRAPHERS_DICT:
    allGraphers = graphers.getAllGraphers()
    return allGraphers

PandasDataFrame = Any
@genericLog
def _getXAxisFromPandasDataFrame(dataFrame: PandasDataFrame) -> List[int]:
    indicesPair = _getIndicesFromPandasDataFrame(dataFrame)
    startIndex, endIndex = indicesPair
    xAxis = list(range(startIndex, endIndex))
    return xAxis 

@genericLog
def _getIndicesFromPandasDataFrame(dataFrame: PandasDataFrame) -> Tuple[int, int]:
    indicesPair = pandasHelper.getIndicesPairFromPandasDataFrame(dataFrame)
    return indicesPair 
    
@genericLog
def _genericGetCSVFilePandasDataFrame(pathKey: str, graphKwargs: dict) -> PandasDataFrame: 
    CSVFilePath = graphKwargs[pathKey]    
    dataFrame = pandasHelper.getPandasDataFrameFromCSVPath(CSVFilePath)
    return dataFrame 
    
@genericLog
def _getPreCalcFilePandasDataFrame(graphKwargs: dict) -> PandasDataFrame:
    PRECALC_KEY = keysHelper.getPreCalcKey()
    dataFrame = _genericGetCSVFilePandasDataFrame(PRECALC_KEY, graphKwargs)
    return dataFrame 
    
@genericLog
def _getDataFilePandasDataFrame(graphKwargs: dict) -> PandasDataFrame:
    CSV_PATH_KEY = keysHelper.getCSVPathKey()
    dataFrame = _genericGetCSVFilePandasDataFrame(CSV_PATH_KEY, graphKwargs)
    return dataFrame 

GRAPHER_KWARG = str 
GRAPHER_INPUTS = List[Any]
@genericLog
def _getGrapherKwargToInputs(graphKwargs: dict) -> Mapping[GRAPHER_KWARG, GRAPHER_INPUTS]: 
    
    DATA_AXIS_INDICES_KWARG = kwargsHelper.getGrapherDataAxisIndicesKwarg()
    PRECALC_AXIS_INDICES_KWARG = kwargsHelper.getGrapherPreCalcAxisIndicesKwarg()
    DATA_FILE_KWARG = kwargsHelper.getGrapherDataFileKwarg()
    PRECALC_FILE_KWARG = kwargsHelper.getGrapherPrecalcFileKwarg()
    
    dataFilePandasDataFrame = _getDataFilePandasDataFrame(graphKwargs)
    # !preCalcFile below done in a hurry, can isolate to helpers with other paths too
    preCalcFile = graphKwargs[keysHelper.getPreCalcKey()]
    preCalcFilePandasDataFrame = _getPreCalcFilePandasDataFrame(graphKwargs)
    indicesPair = _getIndicesFromPandasDataFrame(dataFilePandasDataFrame)
    xAxis = _getXAxisFromPandasDataFrame(dataFilePandasDataFrame)
    
    grapherKwargToInputs = {
        DATA_AXIS_INDICES_KWARG : [dataFilePandasDataFrame, xAxis, indicesPair],
        PRECALC_AXIS_INDICES_KWARG : [preCalcFilePandasDataFrame, xAxis, indicesPair],
        DATA_FILE_KWARG : [dataFilePandasDataFrame],
        PRECALC_FILE_KWARG : [preCalcFile]
    }
    
    return grapherKwargToInputs

@genericLog
def _getCSVFileName(graphKwargs: dict) -> str:

    CSV_FILE_NAME_KEY = keysHelper.getCSVNameKey()
    CSVFileName = graphKwargs[CSV_FILE_NAME_KEY]
    return CSVFileName
        
@genericLog 
def _createGrapherProcesses(graphKwargs: dict, grapherKwargToInputs: dict) -> List: 
    CSVFileName = _getCSVFileName(graphKwargs)
    
    all_processes = [] 
    
    allGraphers = _getAllGraphers() 
    for grapherKwarg in allGraphers: 
        
        grapherTuples = allGraphers[grapherKwarg]
        grapherInputs = grapherKwargToInputs[grapherKwarg]
            
        process = Process(target=_handleGraphCreation, args=(grapherTuples, grapherInputs, CSVFileName))
        all_processes.append(process)
            
    return all_processes 
            
@genericLog
def _generateAllGraphs(graphKwargs: dict):
    grapherKwargToInputs = _getGrapherKwargToInputs(graphKwargs)
    # grapherProcesses = _createGrapherProcesses(graphKwargs, grapherKwargToInputs)
    
    # for process in grapherProcesses: 
    #     process.start() 
    # for process in grapherProcesses: 
    #     process.join() 
    
    CSVFileName = _getCSVFileName(graphKwargs)
    
    all_processes = [] 
    
    allGraphers = _getAllGraphers() 
    for grapherKwarg in allGraphers: 
        
        grapherTuples = allGraphers[grapherKwarg]
        grapherInputs = grapherKwargToInputs[grapherKwarg]
        
        _handleGraphCreation(grapherTuples, grapherInputs, CSVFileName)
                        
@genericLog 
def _getFileGraphDirsFromFileName(dataFileName: str) -> List[str]:     
    allGraphDirs = pathsHelper.getAllGraphsDirPaths()
    
    fileGraphDirs = [] 
    
    for graphDir in allGraphDirs: 
        
        fileGraphDir = os.path.join(graphDir, dataFileName)
        
        fileGraphDirs.append(fileGraphDir)
            
    return fileGraphDirs

@genericLog
def _getFileGraphDirsFromKwargs(graphKwargs: dict) -> List[str]:

    CSVFileName = _getCSVFileName(graphKwargs)
    fileGraphDirs = _getFileGraphDirsFromFileName(CSVFileName)
    return fileGraphDirs 
    
@genericLog 
def _createGraphDirs(graphKwargs: dict):
        
    fileGraphDirs = _getFileGraphDirsFromKwargs(graphKwargs)
    
    for fileGraphDir in fileGraphDirs: 
        filesHelper.createDirIfNotExist(fileGraphDir)
        
@genericLog 
def _getFoundHTMLFiles(fileGraphDir: str) -> dict: 
    
    foundHTMLFiles = {}
    
    foundFiles = os.scandir(fileGraphDir)
    for foundFile in foundFiles: 
        foundFileName = foundFile.name 
        foundFilePath = os.path.join(fileGraphDir, foundFileName)
        foundHTMLFiles[foundFileName] = foundFilePath 
    
    return foundHTMLFiles 

@genericLog 
def _getGraphKeyToDirPathMapping() -> dict: 
    
    graphKeyToDirPathMapping = {}
    
    GRAPH_2D_KEY = keysHelper.getGraph2DKey()
    GRAPHS_2D_DIR_PATH = pathsHelper.getGraphs2DDirPath()
    GRAPH_3D_KEY = keysHelper.getGraph3DKey()
    GRAPHS_3D_DIR_PATH = pathsHelper.getGraphs3DDirPath()
    
    graphKeyToDirPathMapping[GRAPH_2D_KEY] = GRAPHS_2D_DIR_PATH
    graphKeyToDirPathMapping[GRAPH_3D_KEY] = GRAPHS_3D_DIR_PATH
    
    return graphKeyToDirPathMapping    
        
@genericLog 
def _addGeneratedGraphs(graphKwargs: dict): 
    
    graphKwargsCopy = graphKwargs.copy() 
    
    graphKeyToDirPathMapping = _getGraphKeyToDirPathMapping()
    
    CSV_FILE_NAME_KEY = keysHelper.getCSVNameKey()
    CSVFileName = graphKwargs[CSV_FILE_NAME_KEY]
    
    for graphKey in graphKeyToDirPathMapping: 
        
        graphDirPath = graphKeyToDirPathMapping[graphKey]
        fileGraphDirPath = os.path.join(graphDirPath, CSVFileName)
        
        HTMLFilesAtDir = _getFoundHTMLFiles(fileGraphDirPath)
        
        graphKwargsCopy[graphKey] = HTMLFilesAtDir 
    
    return graphKwargsCopy
    
@genericLog
def handleGenerateAllGraphs(graphKwargs: dict):
    _createGraphDirs(graphKwargs)
    _generateAllGraphs(graphKwargs)
    graphKwargs = _addGeneratedGraphs(graphKwargs)
    return graphKwargs 