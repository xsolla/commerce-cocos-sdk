// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { handleLoginError, LoginError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";

export class XsollaUserAccount {

    /**
     * @en
     * Gets user details.
     * @zh
     * 
     */
    static getUserDetails(token:string, onComplete?:(userDetails:UserDetails) => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me').build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let user: UserDetails = JSON.parse(result);
            onComplete?.(user);
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Modifies specified user details.
     * @zh
     * 
     */
    static updateUserDetails(token:string, userDetailsUpdate:UserDetailsUpdate, onComplete?:(userDetails:UserDetails) => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me').build();

        let request = HttpUtil.createRequest(url, 'PATCH', RequestContentType.Json, token, result => {
            let user: UserDetails = JSON.parse(result);
            onComplete?.(user);
        }, handleLoginError(onError));
        request.send(JSON.stringify(userDetailsUpdate));
    }

    /**
     * @en
     * Gets user email.
     * @zh
     * 
     */
    static getUserEmail(token:string, onComplete?:(email:string) => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/email').build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let userEmail: UserEmail = JSON.parse(result);
            onComplete?.(userEmail.current_email);
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Gets user phone number.
     * @zh
     * 
     */
    static getUserPhoneNumber(token:string, onComplete?:(phone:string) => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/phone').build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            if (result) {
                let userPhone: UserPhone = JSON.parse(result);
                onComplete?.(userPhone.phone_number);
            }
            else {
                // phone number is not set
                onComplete?.('');
            }            
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Deletes the user phone number.
     * @zh
     * 
     */
    static deleteUserPhoneNumber(token:string, phoneNumber:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/phone/{phoneNumber}')
            .setPathParam('phoneNumber', phoneNumber)
            .build();

        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, token, onComplete, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Gets user phone number.
     * @zh
     * 
     */
    static updateUserPhoneNumber(token:string, phoneNumber:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            phone_number: phoneNumber,
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/phone').build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, token, onComplete, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Checks user age for a particular region. The age requirements depend on the region. Service determines the user location by the IP address.
     * @zh
     * 
     */
    static checkUserAge(token:string, dateOfBirth:string, onComplete?:(accepted:boolean) => void, onError?:(error:LoginError) => void) {
        let body = {
            dob: dateOfBirth,
            project_id: Xsolla.settings.loginId
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/users/age/check').build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, token, result => {
            let age: UserAge = JSON.parse(result);
            onComplete?.(age.accepted);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Adds the username/email and password authentication to the existing user account. 
     * This call is used if the account is created via the device ID or phone number.
     * @zh
     * 
     */
    static addUsernameAndEmailToAccount(token:string, email:string, password:string, username:string, receiveNewsteltters: boolean, onComplete?:(confirmationRequired:boolean) => void, onError?:(error:LoginError) => void) {
        let body = {
            email: email,
            password: password,
            username: username,
            promo_email_agreement: receiveNewsteltters ? 1 : 0
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/link_email_password').build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, token, result => {
            let emailConfirmation: EmailConfirmation = JSON.parse(result);
            onComplete?.(emailConfirmation.email_confirmation_required);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Modifies user profile picture.
     * @zh
     * 
     */
    static modifyUserProfilePicture(token:string, buffer?:Uint8Array, onComplete?:() => void, onError?:(error:LoginError) => void) {
        if (buffer == null) {
            onError?.({ code:'-1', description:'Picture is invalid.'});
            return;
        }

        let boundary = '---------------------------' + Date.now.toString();
        let beginBoundary = '\r\n--' + boundary + '\r\n';
        let endBoundary = '\r\n--' + boundary + '--\r\n';

        let pictureHeaderStr = 'Content-Disposition: form-data;';
        pictureHeaderStr = pictureHeaderStr.concat('name=\"picture\";');
        pictureHeaderStr = pictureHeaderStr.concat('filename=\"avatar.png\"');
        pictureHeaderStr = pictureHeaderStr.concat('\r\nContent-Type: \r\n\r\n');

        let length = beginBoundary.length + pictureHeaderStr.length + buffer.length + endBoundary.length;
        let uploadContent:Uint8Array = new Uint8Array(length);
        let offset = 0;
        let enc = new TextEncoder(); 
        uploadContent.set(enc.encode(beginBoundary));
        offset += beginBoundary.length;
        uploadContent.set(enc.encode(pictureHeaderStr), offset);
        offset += pictureHeaderStr.length;
        uploadContent.set(buffer, offset);
        offset += buffer.length;
        uploadContent.set(enc.encode(endBoundary), offset);

        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/picture').build();
        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.None, token, onComplete, handleLoginError(onError));
        request.setRequestHeader('Content-Type', (`multipart/form-data; boundary =${boundary}`));
        request.send(uploadContent);
    }

    /**
     * @en
     * Removes user profile picture.
     * @zh
     * 
     */
    static removeProfilePicture(token:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/picture').build();    
        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, token, result => {
            onComplete?.();
        }, handleLoginError(onError));
        request.send();
    }

    static getUserDevices(token:string, onComplete?:(userDevices:Array<UserDevice>) => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/devices').build();
        
        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let userDevices = JSON.parse(result);
            onComplete?.(userDevices);
        }, handleLoginError(onError));
        request.send();
    }

    static linkDeviceToAccount(token:string, platformName:string, deviceName:string, deviceId:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            device: deviceName,
            device_id: deviceId,
        };
        
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/devices/{platformName}')
            .setPathParam('platformName', platformName)
            .build();
        
        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, token, onComplete, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    static unlinkDeviceFromAccount(token:string, deviceId:number, onComplete?:() => void, onError?:(error:LoginError) => void) {
       
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/devices/{deviceId}')
            .setPathParam('deviceId', deviceId.toString())
            .build();
        
        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, token, onComplete, handleLoginError(onError));
        request.send();
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
    first_name?: string,
    last_name?: string,
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

export interface UserDevice {
    device: string,
    id: number,
    last_used_at: string,
    type: string
}