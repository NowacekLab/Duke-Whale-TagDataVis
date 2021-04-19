import {handleProcessWavelets, waveletsCMDLineArgs} from '../exec/process';
import { failResponse, successResponse, throwErrIfFail } from '../responses';

export async function handleWaveletsAction(args: waveletsCMDLineArgs) {
    try {
        const resp = await handleProcessWavelets(args);
        throwErrIfFail(resp);
        return successResponse("Successfully processed wavelets action.");
    } catch (error) {
        return failResponse(error);
    }
}