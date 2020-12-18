import {ChangeChosenFile} from "./graphFileTypes";

export default class graphFileActionsHandler {

    private dispatch: Function; 

    constructor(dispatch: Function) {
        this.dispatch = dispatch; 
    }

    public resetFileName() {
        this.changeFileName("");
    }

    public changeFileName(fileName: string) {
        this.dispatch({
            type: ChangeChosenFile, 
            payload: fileName 
        })
    }

}