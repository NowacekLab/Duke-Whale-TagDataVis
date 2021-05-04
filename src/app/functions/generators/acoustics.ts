import {handleProcessAcoustics, acousticsCMDLineArgs} from '../exec/process';
import { failResponse, successResponse, throwErrIfFail } from '../responses';

export async function handleAcousticsAction(args: acousticsCMDLineArgs) {
    try {
        const resp = await handleProcessAcoustics(args);
        throwErrIfFail(resp);
        return successResponse("Successfully processed acoustics action.");
    } catch (error) {
        return failResponse(error);
    }
    }