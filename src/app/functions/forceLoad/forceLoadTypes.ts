export interface ForceLoadState {
    shouldForceLoad: boolean
}

export type GenericForceLoadAction = UpdateForceLoad;

interface UpdateForceLoad {
    type: typeof UPDATE_FORCE_LOAD, 
    payload: boolean
}

export const UPDATE_FORCE_LOAD = 'UPDATE_FORCE_LOAD';