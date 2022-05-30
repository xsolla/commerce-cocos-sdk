// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, CCString, sys } from 'cc';
import { Xsolla } from 'db://xsolla-commerce-sdk/scripts/Xsolla';
const { ccclass, property } = _decorator;
 
@ccclass('XsollaAndroid')
export class XsollaAndroid extends Component {

    @property(CCString)
    facebookAppId: String = '';

    @property(CCString)
    googleAppId: String = '';

    @property(CCString)
    wechatAppId: String = '';

    @property(CCString)
    qqAppId: String = '';
    
    start() {
        if (sys.platform.toLowerCase() == 'android') {
            jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeAuth", "xLoginInit",
                "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                Xsolla.settings.loginId,
                Xsolla.settings.clientId.toString(),
                this.facebookAppId,
                this.googleAppId,
                this.wechatAppId,
                this.qqAppId);
        }
    }
}
