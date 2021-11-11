// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { XsollaHttpError, XsollaHttpUtil, XsollaRequestContentType, XsollaRequestVerb } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla, XsollaAuthenticationType } from "../Xsolla";

export class XsollaLogin {

    static authByUsernameAndPassword(username:string, password:string, rememberMe:boolean, payload?:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == XsollaAuthenticationType.Oauth2) {
            this.authByUsernameAndPasswordOauth(username, password, onComplete, onError);
        }
        else {
            this.authByUsernameAndPasswordJwt(username, password, rememberMe, payload, onComplete, onError);
        }
    }

    private static authByUsernameAndPasswordOauth(username:string, password:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
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

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, this.handleUrlWithToken(onComplete), this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    static refreshToken(refreshToken:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
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

    static exchangeAuthCode(authCode:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
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

    static startAuthByPhoneNumber(phoneNumber:string, payload?:string, state?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == XsollaAuthenticationType.Oauth2) {
            this.startAuthByPhoneNumberOauth(phoneNumber, state, onComplete, onError);
        }
        else {
            this.startAuthByPhoneNumberJwt(phoneNumber, payload, onComplete, onError);
        }
    }

    private static startAuthByPhoneNumberOauth(phoneNumber:string, state?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        let body = {
            phone_number: phoneNumber
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/oauth2/login/phone/request')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('response_type', 'code')
            .addStringParam('redirect_uri', 'https://login.xsolla.com/api/blank')
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, result => {
            let authOperationId: AuthOperationId = JSON.parse(result);
            onComplete?.(authOperationId.operation_id);
        }, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    private static startAuthByPhoneNumberJwt(phoneNumber:string, payload?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        let body = {
            phone_number: phoneNumber
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/login/phone/request')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .addBoolParam('with_logout', true)
            .addStringParam('payload', payload)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, result => {
            let authOperationId: AuthOperationId = JSON.parse(result);
            onComplete?.(authOperationId.operation_id);
        }, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    static completeAuthByPhoneNumber(confirmationCode:string, operationId:string, phoneNumber:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == XsollaAuthenticationType.Oauth2) {
            this.completeAuthByPhoneNumberOauth(confirmationCode, operationId, phoneNumber, onComplete, onError);
        }
        else {
            this.completeAuthByPhoneNumberJwt(confirmationCode, operationId, phoneNumber, onComplete, onError);
        }
    }

    private static completeAuthByPhoneNumberOauth(confirmationCode:string, operationId:string, phoneNumber:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            code: confirmationCode,
            operation_id: operationId,
            phone_number: phoneNumber
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/oauth2/login/phone/confirm')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, this.handleUrlWithCode(onComplete, onError), this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    private static completeAuthByPhoneNumberJwt(confirmationCode:string, operationId:string, phoneNumber:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            code: confirmationCode,
            operation_id: operationId,
            phone_number: phoneNumber
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/login/phone/confirm')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, this.handleUrlWithToken(onComplete), this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    static startAuthByEmail(emailAddress:string, payload?:string, state?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == XsollaAuthenticationType.Oauth2) {
            this.startAuthByEmailOauth(emailAddress, state, onComplete, onError);
        }
        else {
            this.startAuthByEmailJwt(emailAddress, payload, onComplete, onError);
        }
    }

    private static startAuthByEmailOauth(emailAddress:string, state?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        let body = {
            email: emailAddress
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/oauth2/login/email/request')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('response_type', 'code')
            .addStringParam('redirect_uri', 'https://login.xsolla.com/api/blank')
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, result => {
            let authOperationId: AuthOperationId = JSON.parse(result);
            onComplete?.(authOperationId.operation_id);
        }, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    private static startAuthByEmailJwt(emailAddress:string, payload?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        let body = {
            email: emailAddress
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/login/email/request')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .addBoolParam('with_logout', true)
            .addStringParam('payload', payload)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, result => {
            let authOperationId: AuthOperationId = JSON.parse(result);
            onComplete?.(authOperationId.operation_id);
        }, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    static completeAuthByEmail(confirmationCode:string, operationId:string, emailAddress:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == XsollaAuthenticationType.Oauth2) {
            this.completeAuthByEmailOauth(confirmationCode, operationId, emailAddress, onComplete, onError);
        }
        else {
            this.completeAuthByEmailJwt(confirmationCode, operationId, emailAddress, onComplete, onError);
        }
    }

    private static completeAuthByEmailOauth(confirmationCode:string, operationId:string, emailAddress:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            code: confirmationCode,
            operation_id: operationId,
            email: emailAddress
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/oauth2/login/email/confirm')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, this.handleUrlWithCode(onComplete, onError), this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    private static completeAuthByEmailJwt(confirmationCode:string, operationId:string, emailAddress:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            code: confirmationCode,
            operation_id: operationId,
            email: emailAddress
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/login/email/confirm')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, null, this.handleUrlWithToken(onComplete), this.handleError(onError));
        request.send(JSON.stringify(body));
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

    private static handleUrlWithToken(onComplete: (token: Token) => void): (result: any) => void {
        return result => {
            let authUrl: AuthUrl = JSON.parse(result);
            let params = XsollaHttpUtil.decodeUrlParams(authUrl.login_url);
            let token: Token = {
                access_token: params['token'],
                token_type: 'bearer'
            };
            onComplete?.(token);
        };
    }

    private static handleUrlWithCode(onComplete: (token: Token) => void, onError?:(error:LoginError) => void): (result: any) => void {
        return result => {
            let authUrl: AuthUrl = JSON.parse(result);
            let params = XsollaHttpUtil.decodeUrlParams(authUrl.login_url);
            this.exchangeAuthCode(params['code'], onComplete, onError);
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

export interface AuthOperationId {
    operation_id: string
}

export interface LoginError {
    code: string,
    description: string
}

