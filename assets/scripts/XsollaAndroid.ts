// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, CCString, sys } from 'cc';
import { Xsolla, AuthenticationType } from 'db://xsolla-commerce-sdk/scripts/Xsolla';
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
    
    start () {
        if(sys.platform.toLowerCase() == 'android') {
            if(Xsolla.settings.authType == AuthenticationType.Oauth2) {
                jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeAuth", "xLoginInitOauth",
                    "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                    Xsolla.settings.loginId, Xsolla.settings.clientId.toString(), "https://login.xsolla.com/api/blank",
                    this.facebookAppId, this.googleAppId, this.wechatAppId, this.qqAppId);
            }
            if(Xsolla.settings.authType == AuthenticationType.Jwt) {
                jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeAuth", "xLoginInitJwt",
                    "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                    Xsolla.settings.loginId, "https://login.xsolla.com/api/blank",
                    this.facebookAppId, this.googleAppId, this.wechatAppId, this.qqAppId);
            }
        }
    }
}
