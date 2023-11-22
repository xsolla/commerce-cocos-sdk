// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { sys } from "cc";

export class NativeUtil {

    static getDeviceId() {
        if(sys.platform.toLowerCase() == 'android') {
            return jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "getDeviceId", "()Ljava/lang/String;");
        }
        if(sys.platform.toLowerCase() == 'ios') {
            return jsb.reflection.callStaticMethod("XsollaNativeUtils", "getDeviceId");
        }

        return '';
    }

    static getDeviceName() {
        if(sys.platform.toLowerCase() == 'android') {
            return jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "getDeviceName", "()Ljava/lang/String;");
        }
        if(sys.platform.toLowerCase() == 'ios') {
            return jsb.reflection.callStaticMethod("XsollaNativeUtils", "getDeviceName");
        }

        return '';
    }

    static getAppId() {
        let appId:string;
        if (sys.platform.toLowerCase() == 'ios') {
            appId = jsb.reflection.callStaticMethod("XsollaNativeUtils", "getBundleIdentifier");
        }
        if (sys.platform.toLowerCase() == 'android') {
            appId = jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "getPackageName", "()Ljava/lang/String;");
        }
        return appId;
    }
}