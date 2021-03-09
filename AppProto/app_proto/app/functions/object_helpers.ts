import {failResponse, successResponse, successResponseAny} from "./responses";

export function isEmptyObj(obj: Object) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return true; 
}

function objMissingKeyResp(key: string) {
    const response = `Object missing key: ${key}`
    return failResponse(response);
}

export function getKeyFromObj(obj: any, key: string) {
    if (!obj.hasOwnProperty(key)) {
        return objMissingKeyResp(key);
    } 
    return successResponseAny(obj[key]);
}

export function addValToObj(obj: any, key: string, val: any) {
    obj[key] = val; 
    return obj;
}

export function convertToJSON(obj: Object) {
    const jsonStr = JSON.stringify(obj, null, 4);
    return jsonStr; 
}

export function convertFromJSON(jsonStr: string) {
    const obj = JSON.parse(jsonStr);
    return obj;
}

export function mergeObjs(obj1: any, obj2: any) {
    return {
        ...obj1, 
        ...obj2,
    }
}

export function deepCopyObjectOnlyProps(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}