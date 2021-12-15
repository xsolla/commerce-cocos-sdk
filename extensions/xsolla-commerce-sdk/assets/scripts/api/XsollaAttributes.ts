// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { LoginError, XsollaError } from "../core/XsollaError";
import { XsollaHttpUtil, XsollaRequestContentType } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla } from "../Xsolla";

export class XsollaAttributes {

    static getUserAttributes(token:string, userId?:string, keys?:Array<string>, onComplete?:(attributes:Array<UserAttribute>) => void, onError?:(error:LoginError) => void) {
        let body = {
            publisher_project_id: parseInt(Xsolla.settings.projectId)
        };
        if(userId && userId.length > 0) {
            body['user_id'] = userId;
        }
        if(keys && keys.length > 0) {
            body['keys'] = keys;
        }

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/attributes/users/me/get').build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, token, result => {
            let attributes = JSON.parse(result);
            onComplete?.(attributes);
        }, XsollaError.handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    static getUserReadOnlyAttributes(token:string, userId?:string, keys?:Array<string>, onComplete?:(attributes:Array<UserAttribute>) => void, onError?:(error:LoginError) => void) {
        let body = {
            publisher_project_id: parseInt(Xsolla.settings.projectId)
        };
        if(userId && userId.length > 0) {
            body['user_id'] = userId;
        }
        if(keys && keys.length > 0) {
            body['keys'] = keys;
        }

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/attributes/users/me/get_read_only').build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, token, result => {
            let attributes = JSON.parse(result);
            onComplete?.(attributes);
        }, XsollaError.handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    static updateUserAttributes(token:string, attributes:Array<UserAttribute>, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            attributes: attributes,
            publisher_project_id: parseInt(Xsolla.settings.projectId)
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/attributes/users/me/update').build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, token, onComplete, XsollaError.handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    static removeUserAttributes(token:string, keys:Array<string>, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            removing_keys: keys,
            publisher_project_id: parseInt(Xsolla.settings.projectId)
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/attributes/users/me/update').build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, token, onComplete, XsollaError.handleLoginError(onError));
        request.send(JSON.stringify(body));
    }
}

export interface UserAttribute {
    key: string,
    permission: string;
    value: string
}

