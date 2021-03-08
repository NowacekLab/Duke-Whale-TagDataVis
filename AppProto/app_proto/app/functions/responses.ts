import {isEmptyObj} from "./object_helpers";

type respObj = {
    success: boolean, 
    response: string
}

export function successResponse(response?: any): respObj {
    /**
     * Always returns response as a STRING 
     */

    const resp = response && typeof(response) === "string" ? response : "";

    return {
        success: true,
        response: resp
    }
}

export function failResponse(response?: any): respObj {
    /**
     * Always returns response as a STRING 
     */

    const resp = typeof(response) === "string" ? response : "";

    return {
        success: false,
        response: resp
    }
}

type respObjAny = {
    success: boolean, 
    response: any
}

export function successResponseAny(response: any) {
    return {
        success: true, 
        response: response,
    }
}

export function failResponseAny(response: any) {
    return {
        success: true,
        response: response
    }
}

export function throwErrIfFail(resp: respObj) {
    if (!resp.success) throw Error(resp.response);
}

export function emptyObjAsError(obj: Object, success: any, fail: any) {
    if (isEmptyObj(obj)) return failResponse(fail);
    return {
        success: true, 
        response: success
    };
}