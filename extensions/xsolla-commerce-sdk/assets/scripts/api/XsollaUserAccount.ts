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
     * 获取用户详细信息。
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
     * 修改指定用户的详细信息。
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
     * Gets the user email.
     * @zh
     * 获取用户邮箱。
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
     * Gets the user phone number.
     * @zh
     * 获取用户手机号码。
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
     * 删除用户手机号码。
     */
    static removeUserPhoneNumber(token:string, phoneNumber:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/phone/{phoneNumber}')
            .setPathParam('phoneNumber', phoneNumber)
            .build();

        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, token, onComplete, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * 	Gets the user phone number.
     * @zh
     * 获取用户手机号码。
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
     * Checks the user age for a particular region. The age requirements depend on the region. Service determines the user location by the IP address.
     * @zh
     * 检查指定区域的用户年龄。年龄要求取决于区域位置。服务根据IP地址判断用户位置。
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
     * 向现有用户帐户添加用户名/邮箱和密码认证。此调用在帐户通过设备ID或手机号创建时使用。
     */
    static addUsernameAndEmailAuthToAccount(token:string, email:string, password:string, username:string, receiveNewsteltters: boolean, onComplete?:(confirmationRequired:boolean) => void, onError?:(error:LoginError) => void) {
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
     * Modifies the user profile picture.
     * @zh
     * 修改用户个人资料图片。
     */
    static updateUserProfilePicture(token:string, buffer?:Uint8Array, onComplete?:() => void, onError?:(error:LoginError) => void) {
        if (buffer == null) {
            onError?.({ code:'-1', description:'Picture is invalid.'});
            return;
        }

        let boundaryStr = '---------------------------' + Date.now().toString();
        let beginBoundary = Uint8Array.from('\r\n--' + boundaryStr + '\r\n', x => x.charCodeAt(0));
        let endBoundary = Uint8Array.from('\r\n--' + boundaryStr + '--\r\n', x => x.charCodeAt(0));
        let pictureHeaderStr = 'Content-Disposition: form-data;';
        pictureHeaderStr = pictureHeaderStr.concat('name=\"picture\";');
        pictureHeaderStr = pictureHeaderStr.concat('filename=\"avatar.png\"');
        pictureHeaderStr = pictureHeaderStr.concat('\r\nContent-Type: \r\n\r\n');
        let pictureHeader = Uint8Array.from(pictureHeaderStr, x => x.charCodeAt(0));

        let length = beginBoundary.length + pictureHeader.length + buffer.length + endBoundary.length;
        let uploadContent:Uint8Array = new Uint8Array(length);
        let offset = 0;
        uploadContent.set(beginBoundary, offset);
        offset += beginBoundary.length;
        uploadContent.set(pictureHeader, offset);
        offset += pictureHeader.length;
        uploadContent.set(buffer, offset);
        offset += buffer.length;
        uploadContent.set(endBoundary, offset);

        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/picture').build();
        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.None, token, onComplete, handleLoginError(onError));
        request.setRequestHeader('Content-Type', (`multipart/form-data; boundary =${boundaryStr}`));
        request.send(uploadContent);
    }

    /**
     * @en
     * Removes the user profile picture.
     * @zh
     * 删除用户个人资料图片。
     */
    static removeProfilePicture(token:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/picture').build();
        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, token, result => {
            onComplete?.();
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Gets user devices.
     * @zh
     * 获取用户设备。
     */
    static getUserDevices(token:string, onComplete?:(userDevices:Array<UserDevice>) => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/devices').build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let userDevices = JSON.parse(result);
            onComplete?.(userDevices);
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Links the specified device to the user account.
     * @zh
     * 将指定设备关联至用户帐户。
     */
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

    /**
     * @en
     * Unlinks the specified device from the user account.
     * @zh
     * 取消指定设备与用户帐户的关联。
     */
    static unlinkDeviceFromAccount(token:string, deviceId:number, onComplete?:() => void, onError?:(error:LoginError) => void) {

        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/devices/{deviceId}')
            .setPathParam('deviceId', deviceId.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, token, onComplete, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Gets friends.
     * @zh
     * 获取好友。
     */
     static getFriends(token:string, type:FriendsType, sortBy:UsersSortCriteria, sortOrder:UsersSortOrder,
        onComplete?:(data: FriendsData) => void, onError?:(error:LoginError) => void, after:string = '', limit: number = 20) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/relationships')
            .addStringParam('type', FriendsType[type])
            .addStringParam('sort_by', UsersSortCriteria[sortBy])
            .addStringParam('sort_order', UsersSortOrder[sortOrder])
            .addStringParam('after', after)
            .addNumberParam('limit', limit)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let friendsData: FriendsData = JSON.parse(result);
            onComplete?.(friendsData);
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Updates relationships with the specified user.
     * @zh
     * 更新与指定用户的关系。
     */
     static updateFriends(token:string, action:FriendAction, userID:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            user: userID,
            action: FriendAction[action],
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/relationships').build();
        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, token, onComplete, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Gets social friends.
     * @zh
     * 获取社交网络好友。
     */
     static getSocialFriends(token:string, platform:string, onComplete?:(data:SocialFriendsData) => void, onError?:(error:LoginError) => void,
        offset:number = 0, limit: number = 500, fromThisGame: boolean = false) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/social_friends')
            .addNumberParam('limit', limit)
            .addNumberParam('offset', offset)
            .addBoolParam('with_xl_uid', fromThisGame, false)
            .addStringParam('platform', platform)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let socialFriendsData: SocialFriendsData = JSON.parse(result);
            onComplete?.(socialFriendsData);
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Updates social friends on the server.
     * @zh
     * 更新服务器上的社交网络好友。
     */
     static updateSocialFriends(token:string, platform:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/social_friends/update')
            .addStringParam('platform', platform)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.None, token, onComplete, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Searches for users with the specified nickname.
     * @zh
     * 搜索指定昵称的用户。
     */
     static searchUsersByNickname(token:string, nickname:string, onComplete?:(resultData: UserSearchResult) => void, onError?:(error:LoginError) => void,
        offset:number = 0, limit:number = 100) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/search/by_nickname')
            .addStringParam('nickname', nickname)
            .addNumberParam('limit', limit)
            .addNumberParam('offset', offset)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let resultData: UserSearchResult = JSON.parse(result);
            onComplete?.(resultData);
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Gets specified friend public profile information.
     * @zh
     * 获取指定好友的公开资料信息。
     */
     static getPublicInfo(token:string, userID:string, onComplete?:(receivedUserProfile: PublicProfile) => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/{userID}/public')
            .setPathParam('userID', userID)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let receivedProfile: PublicProfile = JSON.parse(result);
            onComplete?.(receivedProfile);
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Gets user attributes.
     * @zh
     * 获取用户属性。
     */
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

        let url = new UrlBuilder('https://login.xsolla.com/api/attributes/users/me/get').build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, token, result => {
            let attributes = JSON.parse(result);
            onComplete?.(attributes);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Gets user read-only attributes.
     * @zh
     * 获取用户只读属性。
     */
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

        let url = new UrlBuilder('https://login.xsolla.com/api/attributes/users/me/get_read_only').build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, token, result => {
            let attributes = JSON.parse(result);
            onComplete?.(attributes);
        }, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Modifies the list of user attributes by creating/editing its items (changes made on the server side).
     * @zh
     * 通过创建/编辑属性项修改用户属性列表（更改在服务器侧进行）。
     */
    static updateUserAttributes(token:string, attributes:Array<UserAttribute>, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            attributes: attributes,
            publisher_project_id: parseInt(Xsolla.settings.projectId)
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/attributes/users/me/update').build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, token, onComplete, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Removes user attributes with specified keys (changes made on the server side).
     * @zh
     * 删除指定键的用户属性（更改在服务器侧进行）。
     */
    static removeUserAttributes(token:string, keys:Array<string>, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let body = {
            removing_keys: keys,
            publisher_project_id: parseInt(Xsolla.settings.projectId)
        };

        let url = new UrlBuilder('https://login.xsolla.com/api/attributes/users/me/update').build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, token, onComplete, handleLoginError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Gets the URL to link social network to the user’s account. The social network should be used for authentication.
     * @zh
     * 获取将社交网络与用户帐户关联的URL。社交网络应用于认证。
     */
    static getUrlToLinkSocialAccount(token:string, platform:string, onComplete?:(authUrl:string) => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/social_providers/{providerName}/login_url')
            .setPathParam('providerName', platform)
            .addStringParam('login_url', 'https://login.xsolla.com/api/blank')
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let authUrl = JSON.parse(result);
            onComplete?.(authUrl.url);
        }, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Unlinks the social network, which is used by the player for authentication, from the user account.
     * @zh
     * 从用户帐户中取消关联玩家用于身份认证的社交网络。
     */
    static unlinkSocialAccount(token:string, platform:string, onComplete?:() => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/social_providers/{providerName}')
            .setPathParam('providerName', platform)
            .build();

        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, token, onComplete, handleLoginError(onError));
        request.send();
    }

    /**
     * @en
     * Gets the list of linked social networks used by the player for authentication.
     * @zh
     * 获取玩家关联的用于身份认证的社交网络列表。
     */
    static getLinkedSocialAccounts(token:string, onComplete?:(linkedAccounts:Array<LinkedSocialNetwork>) => void, onError?:(error:LoginError) => void) {
        let url = new UrlBuilder('https://login.xsolla.com/api/users/me/social_providers').build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, token, result => {
            let linkedAccountsArray = JSON.parse(result);
            onComplete?.(linkedAccountsArray);
        }, handleLoginError(onError));
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

export enum FriendsType {
    friends,
    friend_requested,
    friend_requested_by,
    blocked,
    blocked_by
}

export enum UsersSortCriteria {
    by_nickname,
    by_update
}

export enum UsersSortOrder {
    asc,
    desc
}

export enum FriendAction {
    friend_request_add,
    friend_request_cancel,
    friend_request_approve,
    friend_request_deny,
    friend_remove,
    block,
    unblock
}

export interface FriendDetails {
    status_incoming: string,
    status_outgoing: string,
    updated: number,
    user: UserDetails
}

export interface FriendsData {
    next_after: string,
    next_url: string,
    relationships: Array<FriendDetails>
}

export interface SocialFriend {
    avatar: string,
    name: string,
    platform: string,
    tag: string,
    user_id: string,
    xl_uid: string
}

export interface SocialFriendsData {
    data: Array<SocialFriend>,
    limit: number,
    offset: number,
    platform: string,
    total_count: number
}

export interface PublicProfile {
    avatar: string,
    is_me: boolean,
    last_login: string,
    nickname: string,
    tag: string,
    registered: string,
    user_id: string
}

export interface UserSearchResult {
    offset: number,
    total_count: number,
    users: Array<PublicProfile>
}

export interface UserAttribute {
    key: string,
    permission: string;
    value: string
}

export interface LinkedSocialNetwork {
    provider: string,
    full_name?: string;
    social_id: string,
    picture?: string,
    nickname?: string
}
