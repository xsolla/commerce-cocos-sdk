// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { sys, VERSION } from 'cc';
import { SDK_VERSION } from './Constants';

export enum RequestContentType {
    None = 0,
    Json = 1,
    WwwForm = 2
}

export class HttpUtil {

    static createRequest(url:string, verb:string, contentType:RequestContentType = RequestContentType.None, authToken?:string,
        onComplete?:(result:any) => void, onError?:(error:HttpError) => void) : XMLHttpRequest {

        let request = new XMLHttpRequest();

        request.open(verb, url, true);

        // TODO Check what can be done in relation to CORS issue for WebGL
        if(!sys.isBrowser) {
            request.setRequestHeader('X-ENGINE', 'COCOS');
            request.setRequestHeader('X-ENGINE-V', VERSION);
            request.setRequestHeader('X-SDK', 'COMMERCE');
            request.setRequestHeader('X-SDK-V', SDK_VERSION);
        }

        switch(contentType) {
            case RequestContentType.Json: {
                request.setRequestHeader('Content-Type', 'application/json');
                break;
            } 
            case RequestContentType.WwwForm: {
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
                    let response = JSON.parse(request.response);

                    // Try parse Login API error
                    if (response.error) {
                        let error: HttpError = {
                            code: response.error.code,
                            description: response.error.description
                        }
                        onError(error);
                        return;
                    }

                    // Try parse Commerce API error
                    if (response.errorMessage) {
                        let error: HttpError = {
                            statusCode: response.statusCode,
                            errorCode: response.errorCode,
                            errorMessage: response.errorMessage,
                        }
                        onError(error);
                        return;
                    }

                    let error: HttpError = {
                        code: 'Unknown error',
                        description: 'Unknown error',
                        errorMessage: 'Unknown error',
                        statusCode: 0,
                        errorCode: 0
                    }
                    onError(error);
                }
            }
        };

        request.onerror = function () {
            let error: HttpError = {
                code: 'Network error',
                description: 'Network error',
                errorMessage: 'Network error',
                statusCode: 0,
                errorCode: 0
            }
            onError(error);
        }

        return request;
    }

    static encodeFormData(data:object) : string {
        var encodedFormData = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                encodedFormData.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))                  
            }
        }
        return encodedFormData.join("&");
    }

    static decodeUrlParams(url:string) : any {
        let hashes = url.slice(url.indexOf("?") + 1).split("&");
        return hashes.reduce((params, hash) => {
            let split = hash.indexOf("=");
            if (split < 0) {
                return Object.assign(params, {
                    [hash]: null
                });
            }
            let key = hash.slice(0, split);
            let val = hash.slice(split + 1);
            return Object.assign(params, { [key]: decodeURIComponent(val) });
        }, {});
    }
}

export interface HttpError {
    code?: string,
    description?: string,
    errorMessage?: string,
    statusCode?: number,
    errorCode?: number
}