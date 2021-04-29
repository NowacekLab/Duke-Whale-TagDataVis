import {UPDATE_FORCE_LOAD} from "./forceLoadTypes";

export default class forceLoadActionsHandler {

    private dispatch: Function; 

    constructor(dispatch: Function) {
        this.dispatch = dispatch; 
    }  

    public activateForceLoad() {
        this.handleUpdateForceLoad(true);
    }
    public deactivateForceLoad() {
        this.handleUpdateForceLoad(false);
    }

    private handleUpdateForceLoad(shouldForceLoad: boolean) {
        this.dispatch({
            type: UPDATE_FORCE_LOAD,
            payload: shouldForceLoad
        })
    }
}