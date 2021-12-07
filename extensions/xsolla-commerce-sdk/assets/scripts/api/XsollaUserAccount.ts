// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { LoginError, XsollaError } from "../core/XsollaError";
import { XsollaHttpUtil, XsollaRequestContentType } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla } from "../Xsolla";

export class XsollaUserAccount {
    static getUserDetails(token:string, onComplete?:(userDetails:UserDetails) => void, onError?:(error:LoginError) => void) {
        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/me').build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, token, result => {
            let user: UserDetails = JSON.parse(result);
            onComplete?.(user);
        }, XsollaError.handleLoginError(onError));
        request.send();
    }

    static updateUserDetails(token:string, userDetailsUpdate:UserDetailsUpdate, onComplete?:(userDetails:UserDetails) => void, onError?:(error:LoginError) => void) {
        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/me').build();

        let request = XsollaHttpUtil.createRequest(url, 'PATCH', XsollaRequestContentType.Json, token, result => {
            let user: UserDetails = JSON.parse(result);
            onComplete?.(user);
        }, XsollaError.handleLoginError(onError));
        request.send(JSON.stringify(userDetailsUpdate));
    }

    static getUserEmail(token:string, onComplete?:(email:string) => void, onError?:(error:LoginError) => void) {
        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/me/email').build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, token, result => {
            let userEmail: UserEmail = JSON.parse(result);
            onComplete?.(userEmail.current_email);
        }, XsollaError.handleLoginError(onError));
        request.send();
    }

    static getUserPhoneNumber(token:string, onComplete?:(phone:string) => void, onError?:(error:LoginError) => void) {
        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/me/phone').build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, token, result => {
            if (result) {
                let userPhone: UserPhone = JSON.parse(result);
                onComplete?.(userPhone.phone_number);
            }
            else {
                // phone number is not set
                onComplete?.('');
            }
            
        }, XsollaError.handleLoginError(onError));
        request.send();
    }

    static deleteUserPhoneNumber(token:string, phoneNumber:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/me/phone/{phoneNumber}')
            .setPathParam('phoneNumber', phoneNumber)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'DELETE', XsollaRequestContentType.None, token, onComplete, XsollaError.handleLoginError(onError));
        request.send();
    }

    static updateUserPhoneNumber(token:string, phoneNumber:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            phone_number: phoneNumber,
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/me/phone').build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, token, onComplete, XsollaError.handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    static checkUserAge(token:string, dateOfBirth:string, onComplete?:(accepted:boolean) => void, onError?:(error:LoginError) => void) {
        let body = {
            dob: dateOfBirth,
            project_id: Xsolla.settings.loginId
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/age/check').build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, token, result => {
            let age: UserAge = JSON.parse(result);
            onComplete?.(age.accepted);
        }, XsollaError.handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    static addUsernameAndEmailToAccount(token:string, email:string, password:string, username:string, receiveNewsteltters: boolean, onComplete?:(confirmationRequired:boolean) => void, onError?:(error:LoginError) => void) {
        let body = {
            email: email,
            password: password,
            username: username,
            promo_email_agreement: receiveNewsteltters ? 1 : 0
        };

        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/me/link_email_password').build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, token, result => {
            let emailConfirmation: EmailConfirmation = JSON.parse(result);
            onComplete?.(emailConfirmation.email_confirmation_required);
        }, XsollaError.handleLoginError(onError));
        request.send(JSON.stringify(body));
    }
}

export interface UserBan {
    date_from: string,
    date_to: string,
    reason: string
}

export interface UserGroup {
    id: number,
    is_default: boolean,
    is_deletable: boolean,
    name: string
}

export interface UserDetails {
    ban: UserBan,
    birthday: string,
    connection_information: string,
    country: string,
    email: string,
    external_id: string,
    first_name: string,
    gender: string,
    groups: Array<UserGroup>,
    id: string,
    is_anonymous: boolean,
    last_login: string,
    last_name: string,
    name: string,
    nickname: string,
    phone: string,
    phone_auth: string,
    picture: string,
    registered: string,
    tag: string,
    username: string
}

export interface UserDetailsUpdate {
    birthday?: string,
    gender?: string,
    firstName?: string,
    lastName?: string,
    nickname?: string
}

export interface UserEmail {
    current_email: string
}

export interface UserAge {
    accepted: boolean
}

export interface UserPhone {
    phone_number: string
}

export interface EmailConfirmation {
    email_confirmation_required: boolean
}