export function formatCMDLineArgs(cmdArgs: any) {
    const keyValArgSeparator = ";-;";
    const keyPairJoiner = ":";

    const keyPairs = [];
    for (var key in cmdArgs) {
        if (!cmdArgs.hasOwnProperty(key)) continue; 
        const val = cmdArgs[key];
        const keyPair = `${key}${keyPairJoiner}${val}`;
        keyPairs.push(keyPair);
    }

    const cmdLineArg = keyPairs.length === 0 ?  "" : keyPairs.join(keyValArgSeparator);
    return cmdLineArg; 
}