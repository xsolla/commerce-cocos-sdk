// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { XsollaHttpError, XsollaHttpUtil, XsollaRequestContentType, XsollaRequestVerb } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla, XsollaAuthenticationType } from "../Xsolla";

export class XsollaLogin {

    static authByUsernameAndPassword(username:string, password:string, rememberMe:boolean, payload?:string, onComplete?:(result:any) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == XsollaAuthenticationType.Oauth2) {
            this.authByUsernameAndPasswordOauth(username, password, onComplete, onError);
        }
        else {
            this.authByUsernameAndPasswordJwt(username, password, rememberMe, payload, onComplete, onError);
        }
    }

    private static authByUsernameAndPasswordOauth(username:string, password:string, onComplete?:(result:any) => void, onError?:(error:LoginError) => void) {
        let body = {
            password: username,
            username: password
        };
        
        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/oauth2/login/token')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('scope', 'offline')
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, onComplete, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    private static authByUsernameAndPasswordJwt(username:string, password:string, rememberMe:boolean, payload?:string, onComplete?:(result:any) => void, onError?:(error:LoginError) => void) {
        let body = {
            password: username,
            remember_me: rememberMe,
            username: password
        };
        
        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/login')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .addBoolParam('with_logout', true)
            .addStringParam('payload', payload)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, onComplete, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    private static handleError(onError:(error:LoginError) => void): (requestError:XsollaHttpError) => void {
        return requestError => {
            let loginError: LoginError = {
                code: requestError.code,
                description: requestError.description
            };
            onError(loginError);
        };
    }
}

export interface LoginResponse {
    login_url: string;
}

export interface LoginError {
    code: string,
    description: string
}

