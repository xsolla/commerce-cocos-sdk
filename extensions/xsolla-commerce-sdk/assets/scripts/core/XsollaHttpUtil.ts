// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { VERSION } from 'cc';
import { SDK_VERSION } from '../XsollaConstants';

export enum XsollaRequestVerb {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
    PATCH = 4
}

export enum XsollaRequestContentType {
    None = 0,
    Json = 1,
    WwwForm = 2
}

export class XsollaHttpUtil {

    static createRequest(url:string, verb:string, contentType:XsollaRequestContentType = XsollaRequestContentType.None, authToken?:string,
        onComplete?:(result:any) => void, onError?:(error:XsollaHttpError) => void) : XMLHttpRequest {

        let request = new XMLHttpRequest();

        request.open(verb, url, true);

        // TODO Check what can be done in relation to CORS issue for WebGL
        // request.setRequestHeader('X-ENGINE', 'COCOS');
        // request.setRequestHeader('X-ENGINE-V', VERSION);
        // request.setRequestHeader('X-SDK', 'COMMERCE');
        // request.setRequestHeader('X-SDK-V', SDK_VERSION);

        switch(contentType) {
            case XsollaRequestContentType.Json: {
                request.setRequestHeader('Content-Type', 'application/json');
                break;
            } 
            case XsollaRequestContentType.WwwForm: {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                break;
            } 
            default: {
                break; 
            } 
        }

        if (authToken != null) {
            request.setRequestHeader('Authorization', 'Bearer ' + authToken);
        }

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    onComplete(request.response);
                }
                else {
                    // Try parse Login API error
                    if (request.response.hasOwnProperty('error')) {
                        let error: XsollaHttpError = {
                            code: request.response.error.code,
                            description: request.response.error.description
                        }
                        onError(error);
                        return;
                    }                    
                    // Try parse Commerce API error
                    if (request.response.hasOwnProperty('errorMessage')) {
                        let error: XsollaHttpError = {
                            statusCode: request.response.statusCode,
                            errorCode: request.response.errorCode,
                            errorMessage: request.response.errorMessage,
                        }
                        onError(error);
                        return;
                    }

                    let error: XsollaHttpError = {
                        description: 'Unknown error',
                        errorMessage: 'Unknown error',
                    }
                    onError(error);
                }
            }
        };

        request.onerror = function () {
            let error: XsollaHttpError = {
                description: 'Network error',
                errorMessage: 'Network error',
            }
            onError(error);
        }

        return request;
    }
}

export interface XsollaHttpError {
    code?: string,
    description?: string,
    errorMessage?: string,
    statusCode?: number,
    errorCode?: number
}