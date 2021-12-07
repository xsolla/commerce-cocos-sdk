// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { LoginError, XsollaError } from "../core/XsollaError";
import { XsollaHttpUtil, XsollaRequestContentType } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";

export class XsollaUserAccount {
    static getUserDetails(token:string, onComplete?:(userDetails:UserDetails) => void, onError?:(error:LoginError) => void) {
        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/me').build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, token, result => {
            let user = JSON.parse(result);
            onComplete?.(user);
        }, XsollaError.handleLoginError(onError));
        request.send();
    }

    static updateUserDetails(token:string, userDetailsUpdate:UserDetailsUpdate, onComplete?:(userDetails:UserDetails) => void, onError?:(error:LoginError) => void) {
        let url = new XsollaUrlBuilder('https://login.xsolla.com/api/users/me').build();

        let request = XsollaHttpUtil.createRequest(url, 'PATCH', XsollaRequestContentType.Json, token, result => {
            let user = JSON.parse(result);
            onComplete?.(user);
        }, XsollaError.handleLoginError(onError));
        request.send(JSON.stringify(userDetailsUpdate));
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
    birthday?:string,
    gender?:string,
    firstName?:string,
    lastName?:string,
    nickname?:string
}