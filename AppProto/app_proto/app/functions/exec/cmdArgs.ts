export function formatCMDLineArgs(cmdArgs: any) {
    const keyValArgSeparator = "KEYPAIRSEP";
    const keyPairJoiner = "KEYVALSEP";
    const spaceJoiner = "SPACESEP";

    const keyPairs = [];
    for (let key in cmdArgs) {
        if (!cmdArgs.hasOwnProperty(key)) continue; 
        const val = cmdArgs[key].toString();
        const keySpaceSep = key.split(" ").join(spaceJoiner);
        const valSpaceSep = val.split(" ").join(spaceJoiner);

        const keyPair = `${keySpaceSep}${keyPairJoiner}${valSpaceSep}`;

        console.log(keyPair);

        keyPairs.push(keyPair);
    }

    const cmdLineArg = keyPairs.length === 0 ?  "" : keyPairs.join(keyValArgSeparator);
    return cmdLineArg; 
}