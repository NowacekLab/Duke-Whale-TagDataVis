def formatCMDLineArg(cmdArgs: dict):
    argsToJoin = [] 
    for kwarg in cmdArgs: 
        val = cmdArgs[kwarg]
        formatted = f"{kwarg}:{val}"
        argsToJoin.append(formatted)
        
    formattedArg = ";-;".join(argsToJoin)
    
    return formattedArg