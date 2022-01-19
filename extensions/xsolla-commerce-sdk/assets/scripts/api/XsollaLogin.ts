// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { sys } from "cc";
import { handleLoginError, LoginError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla, AuthenticationType } from "../Xsolla";

export class XsollaLogin {

    /**
     * @en
     * Authenticates the user by the username and password specified via the authentication interface.
     * @zh
     * 
     */
    static authByUsernameAndPassword(username:string, password:string, rememberMe:boolean, payload?:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == AuthenticationType.Oauth2) {
            this.authByUsernameAndPasswordOauth(username, password, onComplete, onError);
        }
        else {
            this.authByUsernameAndPasswordJwt(username, password, rememberMe, payload, onComplete, onError);
        }
    }

    private static authByUsernameAndPasswordOauth(username:string, password:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            password: password,
            username: username
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/login/token')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('scope', 'offline')
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            let token: Token = JSON.parse(result);
            onComplete?.(token);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static authByUsernameAndPasswordJwt(username:string, password:string, rememberMe:boolean, payload?:string, onComplete?:(result:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            password: password,
            remember_me: rememberMe,
            username: username
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/login')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .addBoolParam('with_logout', true)
            .addStringParam('payload', payload)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, this.handleUrlWithToken(onComplete), handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Refreshes the token in case it is expired. Works only when OAuth 2.0 is enabled.
     * @zh
     * 
     */
    static refreshToken(refreshToken:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            client_id: Xsolla.settings.clientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            redirect_uri: 'https://login.xsolla.com/api/blank'
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/token').build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.WwwForm, null, result => {
            let token: Token = JSON.parse(result);
            onComplete?.(token);
        }, handleLoginError(onError));
        request.send(HttpUtil.encodeFormData(body));
    }

    /**
     * @en
     * Exchanges the user authentication code to a valid JWT. Works only when OAuth 2.0 is enabled.
     * @zh
     * 
     */
    static exchangeAuthCode(authCode:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            client_id: Xsolla.settings.clientId,
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: 'https://login.xsolla.com/api/blank'
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/token').build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.WwwForm, null, result => {
            let token: Token = JSON.parse(result);
            onComplete?.(token);
        }, handleLoginError(onError));
        request.send(HttpUtil.encodeFormData(body));
    }

    /**
     * @en
     * Starts authentication by the user phone number and sends a confirmation code to their phone number.
     * @zh
     * 
     */
    static startAuthByPhoneNumber(phoneNumber:string, payload?:string, state?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == AuthenticationType.Oauth2) {
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

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/login/phone/request')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('response_type', 'code')
            .addStringParam('redirect_uri', 'https://login.xsolla.com/api/blank')
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            let authOperationId: AuthOperationId = JSON.parse(result);
            onComplete?.(authOperationId.operation_id);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static startAuthByPhoneNumberJwt(phoneNumber:string, payload?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        let body = {
            phone_number: phoneNumber
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/login/phone/request')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .addBoolParam('with_logout', true)
            .addStringParam('payload', payload)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            let authOperationId: AuthOperationId = JSON.parse(result);
            onComplete?.(authOperationId.operation_id);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Completes authentication by the user phone number and a confirmation code.
     * @zh
     * 
     */
    static completeAuthByPhoneNumber(confirmationCode:string, operationId:string, phoneNumber:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == AuthenticationType.Oauth2) {
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

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/login/phone/confirm')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, this.handleUrlWithCode(onComplete, onError), handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static completeAuthByPhoneNumberJwt(confirmationCode:string, operationId:string, phoneNumber:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            code: confirmationCode,
            operation_id: operationId,
            phone_number: phoneNumber
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/login/phone/confirm')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, this.handleUrlWithToken(onComplete), handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Starts authentication by the user email address and sends a confirmation code to their email address.
     * @zh
     * 
     */
    static startAuthByEmail(emailAddress:string, payload?:string, state?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == AuthenticationType.Oauth2) {
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

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/login/email/request')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('response_type', 'code')
            .addStringParam('redirect_uri', 'https://login.xsolla.com/api/blank')
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            let authOperationId: AuthOperationId = JSON.parse(result);
            onComplete?.(authOperationId.operation_id);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static startAuthByEmailJwt(emailAddress:string, payload?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void) {
        let body = {
            email: emailAddress
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/login/email/request')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .addBoolParam('with_logout', true)
            .addStringParam('payload', payload)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            let authOperationId: AuthOperationId = JSON.parse(result);
            onComplete?.(authOperationId.operation_id);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Completes authentication by the user email address and a confirmation code.
     * @zh
     * 
     */
    static completeAuthByEmail(confirmationCode:string, operationId:string, emailAddress:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == AuthenticationType.Oauth2) {
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

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/login/email/confirm')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, this.handleUrlWithCode(onComplete, onError), handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static completeAuthByEmailJwt(confirmationCode:string, operationId:string, emailAddress:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            code: confirmationCode,
            operation_id: operationId,
            email: emailAddress
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/login/email/confirm')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, this.handleUrlWithToken(onComplete), handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Authenticates a platform account user via deviceId.
     * @zh
     * 
     */
    static authByDeviceId(deviceName:string, deviceId:string, payload?:string, state?:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == AuthenticationType.Oauth2) {
            this.authByDeviceIdOauth(deviceName, deviceId, state, onComplete, onError);
        }
        else {
            this.authByDeviceIdJwt(deviceName, deviceId, payload, onComplete, onError);
        }
    }

    private static authByDeviceIdOauth(deviceName:string, deviceId:string, state?:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            device: deviceName,
            device_id: deviceId
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/login/device/{PlatformName}')
            .setPathParam('PlatformName', sys.platform.toLowerCase())
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('response_type', 'code')
            .addStringParam('redirect_uri', 'https://login.xsolla.com/api/blank')
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, this.handleUrlWithCode(onComplete, onError), handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static authByDeviceIdJwt(deviceName:string, deviceId:string, payload?:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            device: deviceName,
            device_id: deviceId
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/login/device/{PlatformName}')
            .setPathParam('PlatformName', sys.platform.toLowerCase())
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addBoolParam('with_logout', true)
            .addStringParam('payload', payload)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            let authResult = JSON.parse(result);
            let token: Token = {
                access_token: authResult.token,
                token_type: 'bearer'
            };
            onComplete?.(token);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Creates a new user.
     * @zh
     * 
     */
    static registerNewUser(username:string, password:string, email:string, payload?:string, state?:string, extras?: RegistrationExtras, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == AuthenticationType.Oauth2) {
            this.registerNewUserOauth(username, password, email, state, extras, onComplete, onError);
        }
        else {
            this.registerNewUserJwt(username, password, email, payload, extras, onComplete, onError);
        }
    }

    private static registerNewUserOauth(username:string, password:string, email:string, state?:string, extras?: RegistrationExtras, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            password: password,
            username: username,
            email: email,
            accept_consent: extras?.accept_consent,
            promo_email_agreement: extras?.promo_email_agreement ? 1 : 0,
            fields: extras?.fields
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/user')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('response_type', 'code')
            .addStringParam('redirect_uri', 'https://login.xsolla.com/api/blank')
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            if (request.status == 200) {
                this.handleUrlWithCode(onComplete, onError)(result);
            }
            else {
                onComplete?.(null);
            }
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static registerNewUserJwt(username:string, password:string, email:string, payload?:string, extras?: RegistrationExtras, onComplete?:(result:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            password: password,
            username: username,
            email: email,
            accept_consent: extras?.accept_consent,
            promo_email_agreement: extras?.promo_email_agreement ? 1 : 0,
            fields: extras?.fields
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/user')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .addStringParam('payload', payload)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            if (request.status == 200) {
                this.handleUrlWithToken(onComplete)(result);
            }
            else {
                onComplete?.(null);
            }
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Resends an account confirmation email to a user. To complete account confirmation, the user should follow the link in the email.
     * @zh
     * 
     */
    static resendAccountConfirmationEmail(username:string, payload?:string, state?:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        if(Xsolla.settings.authType == AuthenticationType.Oauth2) {
            this.resendAccountConfirmationEmailOauth(username, state, onComplete, onError);
        }
        else {
            this.resendAccountConfirmationEmailJwt(username, payload, onComplete, onError);
        }
    }

    private static resendAccountConfirmationEmailOauth(username:string, state?:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            username: username
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/user/resend_confirmation_link')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('redirect_uri', 'https://login.xsolla.com/api/blank')
            .addStringParam('state', state)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            onComplete?.();
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static resendAccountConfirmationEmailJwt(username:string, payload?:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            username: username
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/user/resend_confirmation_link')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .addStringParam('payload', payload)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            onComplete?.();
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Resets the user password with user confirmation. If the user data is kept in the Xsolla data storage or on your side, users receive a password change confirmation email.
     * @zh
     * 
     */
    static resetPassword(username:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            username: username
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/password/reset/request')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            onComplete?.();
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static handleUrlWithToken(onComplete: (token: Token) => void): (result: any) => void {
        return result => {
            let authUrl: AuthUrl = JSON.parse(result);
            let params = HttpUtil.decodeUrlParams(authUrl.login_url);
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
            let params = HttpUtil.decodeUrlParams(authUrl.login_url);
            this.exchangeAuthCode(params['code'], onComplete, onError);
        };
    }
}

export interface Token {
    access_token: string,
    expires_in?: number,
    refresh_token?: string,
    token_type: string
}

export interface AuthUrl {
    login_url: string
}

export interface AuthOperationId {
    operation_id: string
}

export interface RegistrationExtras {
    accept_consent?: boolean,
    promo_email_agreement?: boolean,
    fields?: any
}

