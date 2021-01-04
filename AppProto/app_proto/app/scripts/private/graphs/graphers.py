from typing import List, Tuple, Callable, Mapping

from private.graphs.graphs2D import graphers2D 
from private.graphs.graphs3D import graphers3D 
from private.logs import logDecorator

MODULE_NAME = "graphers"
genericLog = logDecorator.genericLog(MODULE_NAME)

GRAPHERS2D = graphers2D.GRAPHERS
GRAPHERS3D = graphers3D.GRAPHERS 
ALL_GRAPHERS = [(GRAPHERS2D, "2D"), (GRAPHERS3D, "3D")]

# Types 
GRAPHER_KWARG = str
GRAPHING_FUNCTION = Callable
GRAPH_NAME = str
GRAPHER_TUP = Tuple[GRAPHING_FUNCTION, GRAPH_NAME]
GRAPHER_TUPS = List[GRAPHER_TUP]
GRAPHERS_DICT = Mapping[GRAPHER_KWARG, GRAPHER_TUPS]

@genericLog
def _addGraphTypeMarkerToGrapherTups(grapherTups: GRAPHER_TUPS, graphType: str) -> GRAPHER_TUPS: 
    
    newGrapherTups = []
    
    for grapherTup in grapherTups:
        grapherFunc = grapherTup[0]
        grapherNames = grapherTup[1:]
        
        newGrapherTup = (grapherFunc, graphType, *grapherNames)
        
        newGrapherTups.append(newGrapherTup)
    
    return newGrapherTups 

@genericLog 
def getAllGraphers() -> GRAPHERS_DICT:    
    allGraphers = {} 
    
    for grapher, graphType in ALL_GRAPHERS: 
        
        for grapherKwarg in grapher: 
            if not grapherKwarg in allGraphers: 
                allGraphers[grapherKwarg] = [] 
            grapherTups = grapher[graphersKwarg]
            grapherTups = _addGraphTypeMarkerToGrapherTups(grapherTups, graphType)
            allGraphers[grapherKwarg] += grapherTups 
    
    return allGraphers 