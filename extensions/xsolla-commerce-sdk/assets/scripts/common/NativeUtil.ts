// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { sys, Texture2D } from "cc";
import { UserDetailsUpdate } from "../api/XsollaUserAccount";
import { Xsolla } from "../Xsolla";
import { TokenStorage } from "./TokenStorage";

export class NativeUtil {
    static authSocial(socialNetworkName: string) {
        if(sys.platform.toLowerCase() == 'ios') {
            jsb.reflection.callStaticMethod("XsollaNativeUtils", "authViaSocialNetwork:client:state:redirect:",
                socialNetworkName, Xsolla.settings.clientId, 'xsollatest', 'app://xsollalogin');
        }
        if(sys.platform.toLowerCase() == 'android') {
            jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeAuth", "authSocial", "(Ljava/lang/String;ZZ)V", socialNetworkName, true, false);
        }
    }

    static modifyUserAccountData(userDetailsUpdate: UserDetailsUpdate) {
        if (sys.platform.toLowerCase() == 'ios') {
            jsb.reflection.callStaticMethod("XsollaNativeUtils", "modifyUserAccountData:userBirthday:userFirstName:userGender:userLastName:userNickname:",
        TokenStorage.token.access_token, userDetailsUpdate.birthday, userDetailsUpdate.first_name, userDetailsUpdate.gender, userDetailsUpdate.last_name, userDetailsUpdate.nickname);
        }
        if (sys.platform.toLowerCase() == 'android') {
            jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "modifyUserAccountData",
        "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
            TokenStorage.token.access_token, userDetailsUpdate.birthday,
            userDetailsUpdate.first_name, userDetailsUpdate.gender,
            userDetailsUpdate.last_name, userDetailsUpdate.nickname);
        }
    }

    static updateUserAvatar(avatarUpdate: Texture2D) {
        if (sys.platform.toLowerCase() == 'ios') {
            jsb.reflection.callStaticMethod("XsollaNativeUtils", "updateUserProfilePicture:authToken:",
            avatarUpdate.image.nativeUrl, TokenStorage.token.access_token);
        }
        if (sys.platform.toLowerCase() == 'android') {
            jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "updateUserProfilePicture", "(Ljava/lang/String;Ljava/lang/String;)V",
            avatarUpdate.image.nativeUrl, TokenStorage.token.access_token);
        }
        
    }
}