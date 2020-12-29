from typing import Any, Tuple

import pandas as pd 

from private.logs import logDecorator 

MODULE_NAME = "pandasHelper"
genericLog = logDecorator.genericLog(MODULE_NAME)

PandasDataFrame = Any 
MatFileData = Any 

@genericLog
def getPandasDataFrameFromMatData(matFileData: MatFileData) -> PandasDataFrame:
    dataFrame = pd.DataFrame(data=parsedData)
    return dataFrame 

@genericLog
def getPandasDataFrameFromCSVPath(CSVFilePath: str) -> PandasDataFrame:
    dataFrame = pd.read_csv(CSVFilePath)
    return dataFrame 

@genericLog
def getIndicesPairFromPandasDataFrame(dataFrame: PandasDataFrame) -> Tuple[int, int]:
    
    # ! hard-coded, not done 
    startIndex = 32 
    endIndex = 232 
    indicesPair = (startIndex, endIndex)
    return indicesPair 

PandasDataFrame = Any
@genericLog
def savePandasDataFrame(df: PandasDataFrame, filePath: str) -> str:
    df.to_csv(filePath)
    return filePath 