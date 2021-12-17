// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, EditBox, EventHandler, sys, System, Toggle, ScrollView, Prefab, SpriteFrame, instantiate, CCString } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
import { Xsolla, XsollaAuthenticationType } from 'db://xsolla-commerce-sdk/scripts/Xsolla';
import { Token } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
import { TokenStorage } from '../Common/TokenStorage';
import { SocialNetworkItem } from './Misc/SocialNetworkItem';
import { UIManager, UIScreenType } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('SocialNetworkItemData')
export class SocialNetworkItemData {

    @property(CCString)
    name: String = '';

    @property(SpriteFrame)
    logo: SpriteFrame = null;
}
 
@ccclass('SocialAuthManager')
export class SocialAuthManager extends Component {

    @property(Button)
    backButton: Button;

    @property(EditBox)
    socialNetworkFilterEditBox: EditBox;

    @property(Prefab)
    socialNetworkItemPrefab: Prefab;

    @property(ScrollView)
    socialNetworksList: ScrollView;

    @property([SocialNetworkItemData])
    socialNetworksData: SocialNetworkItemData[] = [];

    @property(CCString)
    facebookAppId: String = '';

    @property(CCString)
    googleAppId: String = '';

    @property(CCString)
    wechatAppId: String = '';

    @property(CCString)
    qqAppId: String = '';

    start() {
        this.populateSocialNetworksList();

        if(sys.platform.toLowerCase() == 'android') {
            if(Xsolla.settings.authType == XsollaAuthenticationType.Oauth2) {
                jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeAuth", "xLoginInitOauth",
                    "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                    Xsolla.settings.loginId, Xsolla.settings.clientId.toString(), "https://login.xsolla.com/api/blank",
                    this.facebookAppId, this.googleAppId, this.wechatAppId, this.qqAppId);
            }
            if(Xsolla.settings.authType == XsollaAuthenticationType.Jwt) {
                jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeAuth", "xLoginInitJwt",
                    "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                    Xsolla.settings.loginId, "https://login.xsolla.com/api/blank",
                    this.facebookAppId, this.googleAppId, this.wechatAppId, this.qqAppId);
            }
        }
    }

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.socialNetworkFilterEditBox.string = '';
        this.refreshSocialNetworksList();
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.Starting, this.node);
    }

    populateSocialNetworksList() {
        for (let i = 0; i < this.socialNetworksData.length; ++i) {
            let socialNetworkItem = instantiate(this.socialNetworkItemPrefab);            
            this.socialNetworksList.content.addChild(socialNetworkItem);
            let itemData = this.socialNetworksData[i];
            socialNetworkItem.getComponent(SocialNetworkItem).init(itemData, this);
        }
    }

    refreshSocialNetworksList() {
        let socialNetworkFilter = this.socialNetworkFilterEditBox.string;
        let socialNetworkItems = this.socialNetworksList.content.getComponentsInChildren(SocialNetworkItem);
        for (let i = 0; i < socialNetworkItems.length; ++i) {
            if(socialNetworkFilter.length == 0) {
                socialNetworkItems[i].node.active = true;
            }   
            else {
                socialNetworkItems[i].node.active = socialNetworkItems[i].data.name.toLowerCase().startsWith(socialNetworkFilter);
            }
        }
    }

    authViaSocialNetwork(socialNetworkName:string) {
        if(sys.platform.toLowerCase() == 'ios') {
            jsb.reflection.callStaticMethod("XsollaNativeUtils", "authViaSocialNetwork:client:state:redirect:",
                socialNetworkName, Xsolla.settings.clientId, 'xsollatest', 'app://xsollalogin');
        }
        if(sys.platform.toLowerCase() == 'android') {
            jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeAuth", "authSocial", "(Ljava/lang/String;ZZ)V", socialNetworkName, true, false);
        }
    }

    handleSuccessfulSocialAuth(token:Token) {
        TokenStorage.saveToken(token, true);
        UIManager.instance.openScreen(UIScreenType.MainMenu, this.node);
    }

    handleErrorSocialAuth(error:string) {
        console.log(error);
        UIManager.instance.openErrorScreen(error);
    }

    onSocialNetworkFilterChanged() {
        this.refreshSocialNetworksList();
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.socialNetworkFilterEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onSocialNetworkFilterChanged, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.socialNetworkFilterEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onSocialNetworkFilterChanged, this);
    }
}
