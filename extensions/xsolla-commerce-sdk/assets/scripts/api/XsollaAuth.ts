// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { director, sys } from "cc";
import { handleLoginError, LoginError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { Events } from "../core/Events";

export class XsollaAuth {

    /**
     * @en
     * Authenticates the user by the username and password specified via the authentication interface.
     * @zh
     * 通过认证界面上指定的用户名和密码认证用户身份。
     */
    static authByUsernameAndPassword(username:string, password:string, rememberMe:boolean, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
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

    /**
     * @en
     * Refreshes the token in case it is expired. Works only when OAuth 2.0 is enabled.
     * @zh
     * 刷新令牌以应对令牌过期。仅当启用了OAuth 2.0时有用。
     */
    static refreshToken(refreshToken:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            client_id: Xsolla.settings.clientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            redirect_uri: Xsolla.settings.redirectURI
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
     * Exchanges the user authentication code to a valid JWT.
     * @zh
     * 用用户认证代码交换一个有效JWT。
     */
    static exchangeAuthCode(authCode:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            client_id: Xsolla.settings.clientId,
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: Xsolla.settings.redirectURI
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
     * 启动通过用户手机号认证并向手机发送一个验证码。
     */
    static startAuthByPhoneNumber(phoneNumber:string, state?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void, sendPasswordlessAuthURL:boolean = false, passwordlessAuthURL:string = '') {
        let body:any = {
            phone_number: phoneNumber,
        };

        if(sendPasswordlessAuthURL) {
            body.send_link = true;
            body.link_url = passwordlessAuthURL;
        }

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/login/phone/request')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('response_type', 'code')
            .addStringParam('redirect_uri', Xsolla.settings.redirectURI)
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
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
     * 通过用户手机号和验证码完成认证。
     */
    static completeAuthByPhoneNumber(confirmationCode:string, operationId:string, phoneNumber:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
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

    /**
     * @en
     * Starts authentication by the user email address and sends a confirmation code to their email address.
     * @zh
     * 启动通过用户邮箱地址认证并向邮箱地址发送一个验证码。
     */
    static startAuthByEmail(emailAddress:string, state?:string, onComplete?:(operationId:string) => void, onError?:(error:LoginError) => void, sendPasswordlessAuthURL:boolean = false, passwordlessAuthURL:string = '') {
        let body:any = {
            email: emailAddress
        };

        if(sendPasswordlessAuthURL) {
            body.send_link = true;
            body.link_url = passwordlessAuthURL;
        }

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/login/email/request')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('response_type', 'code')
            .addStringParam('redirect_uri', Xsolla.settings.redirectURI)
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
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
     * 通过用户邮箱地址和验证码完成认证。
     */
    static completeAuthByEmail(confirmationCode:string, operationId:string, emailAddress:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
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

    /**
     * @en
     * Authenticates a platform account user via device ID.
     * @zh
     * 通过device ID认证平台帐户用户。
     */
    static authByDeviceId(deviceName:string, deviceId:string, state?:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
        let body = {
            device: deviceName,
            device_id: deviceId
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/login/device/{PlatformName}')
            .setPathParam('PlatformName', sys.platform.toLowerCase())
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('response_type', 'code')
            .addStringParam('redirect_uri', Xsolla.settings.redirectURI)
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, this.handleUrlWithCode(onComplete, onError), handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Authenticates user via an account in the specified social networks. Only for Android and iOS builds.
     * @zh
     * 通过指定社交网络帐户认证用户身份。仅适用于Android和iOS编译版本。
     */
    static authSocial(socialNetworkName:string, onComplete?:(token:Token) => void, onCancel?:() => void, onError?:(error:string) => void) {
        if(sys.platform.toLowerCase() == 'ios') {
            jsb.reflection.callStaticMethod("XsollaNativeUtils", "authViaSocialNetwork:client:state:redirect:",
                socialNetworkName, Xsolla.settings.clientId, 'xsollatest', 'app://xsollalogin');
        }
        if(sys.platform.toLowerCase() == 'android') {
            jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeAuth", "authSocial", "(Ljava/lang/String;Z)V", socialNetworkName, false);
        }

        director.getScene().on(Events.SOCIAL_AUTH_SUCCESS, (token:Token) => {
            director.getScene().off(Events.SOCIAL_AUTH_SUCCESS);
            director.getScene().off(Events.SOCIAL_AUTH_CANCELED);
            director.getScene().off(Events.SOCIAL_AUTH_ERROR);
            onComplete?.(token);
        }, this);
        director.getScene().on(Events.SOCIAL_AUTH_CANCELED, () => {
            director.getScene().off(Events.SOCIAL_AUTH_SUCCESS);
            director.getScene().off(Events.SOCIAL_AUTH_CANCELED);
            director.getScene().off(Events.SOCIAL_AUTH_ERROR);
            onCancel?.();
        }, this);
        director.getScene().on(Events.SOCIAL_AUTH_ERROR, (error:string) => {
            director.getScene().off(Events.SOCIAL_AUTH_SUCCESS);
            director.getScene().off(Events.SOCIAL_AUTH_CANCELED);
            director.getScene().off(Events.SOCIAL_AUTH_ERROR);
            onError?.(error);
        }, this);
    }

    /**
     * @en
     * Authenticates the user with Xsolla Login widget. Only for Android and iOS builds.
     * @zh
     * 通过艾克索拉登录管理器小组件认证用户身份。仅适用于Android和iOS编译版本。
     */
    static authWithXsollaWidget(onComplete?:(token:Token) => void, onCancel?:() => void, onError?:(error:string) => void) {
        if(sys.platform.toLowerCase() == 'ios') {
            jsb.reflection.callStaticMethod("XsollaNativeUtils", "authViaXsollaWidget:client:state:redirect:",
            Xsolla.settings.loginId, Xsolla.settings.clientId, 'xsollatest', 'app://xsollalogin');
        }
        if(sys.platform.toLowerCase() == 'android') {
            jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeAuth", "authViaXsollaWidget", "()V");
        }

        director.getScene().on(Events.XSOLLA_WIDGET_AUTH_SUCCESS, (token:Token) => {
            director.getScene().off(Events.XSOLLA_WIDGET_AUTH_SUCCESS);
            director.getScene().off(Events.XSOLLA_WIDGET_AUTH_CANCELED);
            director.getScene().off(Events.XSOLLA_WIDGET_AUTH_ERROR);
            onComplete?.(token);
        }, this);
        director.getScene().on(Events.SOCIAL_AUTH_CANCELED, () => {
            director.getScene().off(Events.XSOLLA_WIDGET_AUTH_SUCCESS);
            director.getScene().off(Events.XSOLLA_WIDGET_AUTH_CANCELED);
            director.getScene().off(Events.XSOLLA_WIDGET_AUTH_ERROR);
            onCancel?.();
        }, this);
        director.getScene().on(Events.SOCIAL_AUTH_ERROR, (error:string) => {
            director.getScene().off(Events.XSOLLA_WIDGET_AUTH_SUCCESS);
            director.getScene().off(Events.XSOLLA_WIDGET_AUTH_CANCELED);
            director.getScene().off(Events.XSOLLA_WIDGET_AUTH_ERROR);
            onError?.(error);
        }, this);
    }

    /**
     * @en
     * Creates a new user.
     * @zh
     * 创建新用户。
     */
    static registerNewUser(username:string, password:string, email:string, state?:string, extras?:RegistrationExtras, locale?:string, onComplete?:(token:Token) => void, onError?:(error:LoginError) => void) {
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
            .addStringParam('redirect_uri', Xsolla.settings.redirectURI)
            .addStringParam('state', state)
            .addStringParam('scope', 'offline')
            .addStringParam('locale', locale)
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

    /**
     * @en
     * Resends an account confirmation email to a user. To complete account confirmation, the user should follow the link in the email.
     * @zh
     * 重新向用户发送帐户验证邮件。要完成帐户验证，用户需点击邮件中的链接。
     */
    static resendAccountConfirmationEmail(username:string, state?:string, locale?:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            username: username
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/oauth2/user/resend_confirmation_link')
            .addNumberParam('client_id', Xsolla.settings.clientId)
            .addStringParam('redirect_uri', Xsolla.settings.redirectURI)
            .addStringParam('state', state)
            .addStringParam('locale', locale)
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
     * 通过用户确认重置用户密码。如用户数据保存在艾克索拉数据存储或您自己一侧，用户将收到一封密码更改确认邮件。
     */
    static resetPassword(username:string, locale:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            username: username
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/password/reset/request')
            .addStringParam('projectId', Xsolla.settings.loginId)
            .addStringParam('login_url', encodeURI(Xsolla.settings.redirectURI))
            .addStringParam('locale', locale)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, null, result => {
            onComplete?.();
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    private static handleUrlWithCode(onComplete: (token:Token) => void, onError?:(error:LoginError) => void): (result: any) => void {
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
