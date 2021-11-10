// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { XsollaHttpError, XsollaHttpUtil, XsollaRequestContentType, XsollaRequestVerb } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla, XsollaAuthenticationType } from "../Xsolla";

export class XsollaLogin {

    static authByUsernameAndPassword(username:string, password:string, rememberMe:boolean, payload?:string, onComplete?:(result:Token) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == XsollaAuthenticationType.Oauth2) {
            this.authByUsernameAndPasswordOauth(username, password, onComplete, onError);
        }
        else {
            this.authByUsernameAndPasswordJwt(username, password, rememberMe, payload, onComplete, onError);
        }
    }

    private static authByUsernameAndPasswordOauth(username:string, password:string, onComplete?:(result:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            password: username,
            username: password
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/oauth2/login/token')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('scope', 'offline')
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, result => {
            let token: Token = JSON.parse(result);
            onComplete?.(token);
        }, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    private static authByUsernameAndPasswordJwt(username:string, password:string, rememberMe:boolean, payload?:string, onComplete?:(result:Token) => void, onError?:(error:LoginError) => void) {
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

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, result => {
            let authUrl: AuthUrl = JSON.parse(result);
            let params = XsollaHttpUtil.decodeUrlParams(authUrl.login_url);
            let token: Token = {
                access_token: params['token'],
                token_type: 'bearer'
            };
            onComplete?.(token);
        }, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    static refreshToken(refreshToken:string, onComplete?:(result:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            client_id: Xsolla.settings.clientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            redirect_uri: 'https://login.xsolla.com/api/blank'
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/oauth2/token').build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.WwwForm, null, result => {
            let token: Token = JSON.parse(result);
            onComplete?.(token);
        }, this.handleError(onError));
        request.send(XsollaHttpUtil.encodeFormData(body));
    }

    static exchangeAuthCode(authCode:string, onComplete?:(result:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            client_id: Xsolla.settings.clientId,
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: 'https://login.xsolla.com/api/blank'
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/oauth2/token').build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.WwwForm, null, result => {
            let token: Token = JSON.parse(result);
            onComplete?.(token);
        }, this.handleError(onError));
        request.send(XsollaHttpUtil.encodeFormData(body));
    }

    private static handleError(onError:(error:LoginError) => void): (requestError:XsollaHttpError) => void {
        return requestError => {
            let loginError: LoginError = {
                code: requestError.code,
                description: requestError.description
            };
            onError?.(loginError);
        };
    }
}

export interface Token {
    access_token: string,
    expire_in?: number,
    refresh_token?: string,
    token_type: string
}

export interface AuthUrl {
    login_url: string
}

export interface LoginError {
    code: string,
    description: string
}

