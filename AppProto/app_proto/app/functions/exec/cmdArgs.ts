export function formatCMDLineArgs(cmdArgs: any) {
    const keyValArgSeparator = "KEYPAIRSEP";
    const keyPairJoiner = "KEYVALSEP";

    const keyPairs = [];
    for (let key in cmdArgs) {
        if (!cmdArgs.hasOwnProperty(key)) continue; 
        const val = cmdArgs[key];
        const keyPair = `${key}${keyPairJoiner}${val}`;

        console.log(keyPair);

        keyPairs.push(keyPair);
    }

    const cmdLineArg = keyPairs.length === 0 ?  "" : keyPairs.join(keyValArgSeparator);
    return cmdLineArg; 
}