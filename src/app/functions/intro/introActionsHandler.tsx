import {SET_NOT_FIRST} from "./introTypes";

export default class introActionHandler {

    private dispatch: Function;

    constructor(dispatch) {
        this.dispatch = dispatch;
    }

    public setNotUserFirstVisit() {
        this.dispatch({
            type: SET_NOT_FIRST,
            payload: {
                first: false 
            } 
        })

    }


}