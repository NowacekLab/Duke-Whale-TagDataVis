from typing import Any, Tuple
import pandas as pd 
import logger 

PandasDataFrame = Any 
MatFileData = Any 

def getPandasDataFrameFromMatData(matFileData: MatFileData) -> PandasDataFrame:
    dataFrame = pd.DataFrame(data=matFileData)
    return dataFrame 

def getPandasDataFrameFromCSVPath(CSVFilePath: str) -> PandasDataFrame:
    dataFrame = pd.read_csv(CSVFilePath)
    return dataFrame 

def getIndicesPairFromPandasDataFrame(dataFrame: PandasDataFrame) -> Tuple[int, int]:
    
    # ! hard-coded, not done 
    startIndex = 32 
    endIndex = 232 
    indicesPair = (startIndex, endIndex)
    return indicesPair 

PandasDataFrame = Any
def savePandasDataFrame(df: PandasDataFrame, filePath: str) -> str:
    df.to_csv(filePath)
    return filePath 