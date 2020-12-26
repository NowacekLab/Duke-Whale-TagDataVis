    """[For checking whether given cmd line kwargs match required kwargs]

        PUBLIC MODULES: 
        - allKwargsExist 
    """


from typing import Collection 
from logs import logDecorator 

MODULE_NAME = "kwargsCheck.py"

@logDecorator.genericLog(MODULE_NAME)
def allKwargsExist(cmdArgs: dict, requiredKwargs: Collection[str]):
    """[Checks whether cmd line args have all the required kwargs]

    Args:
        cmdArgs (dict): [given cmd line args parsed from the cmd line string in main.py]
        requiredKwargs (Collection[str]): [required kwargs]

    Raises:
        Exception: [thrown when the given cmd line args do not have all the required kwargs]
    """
    for kwarg in requiredKwargs: 
        if not kwarg in cmdArgs: 
            raise Exception(f"Given args ({cmdArgs}) does not hold all required args ({requiredKwargs})")