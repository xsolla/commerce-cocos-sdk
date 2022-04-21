// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox, sys, ScrollView, Prefab, SpriteFrame, instantiate, CCString, director } from 'cc';
import { Token } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UIManager, UIScreenType } from '../UIManager';
import { SocialNetworkItem } from '../Misc/SocialNetworkItem';
import { Events } from 'db://xsolla-commerce-sdk/scripts/core/Events';
import { NativeUtil } from 'db://xsolla-commerce-sdk/scripts/common/NativeUtil';
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

    start() {
        this.populateSocialNetworksList();
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
        UIManager.instance.openScreen(UIScreenType.Starting);
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
        UIManager.instance.showLoaderPopup(true);
        NativeUtil.authSocial(socialNetworkName);
    }

    handleSuccessfulSocialAuth(token:Token) {
        UIManager.instance.showLoaderPopup(false);
        TokenStorage.saveToken(token, true);
        UIManager.instance.openScreen(UIScreenType.MainMenu);
    }

    handleCancelSocialAuth() {
        UIManager.instance.showLoaderPopup(false);
    }

    handleErrorSocialAuth(error:string) {
        UIManager.instance.showLoaderPopup(false);
        console.log(error);
        UIManager.instance.showErrorPopup(error);
    }

    onSocialNetworkFilterChanged() {
        this.refreshSocialNetworksList();
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.socialNetworkFilterEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onSocialNetworkFilterChanged, this);
        director.getScene().on(Events.SOCIAL_AUTH_SUCCESS, this.handleSuccessfulSocialAuth, this );
        director.getScene().on(Events.SOCIAL_AUTH_ERROR, this.handleErrorSocialAuth, this );
        director.getScene().on(Events.SOCIAL_AUTH_CANCELED, this.handleCancelSocialAuth, this );
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.socialNetworkFilterEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onSocialNetworkFilterChanged, this);
        director.getScene().off(Events.SOCIAL_AUTH_SUCCESS, this.handleSuccessfulSocialAuth, this );
        director.getScene().off(Events.SOCIAL_AUTH_ERROR, this.handleErrorSocialAuth, this );
        director.getScene().off(Events.SOCIAL_AUTH_CANCELED, this.handleCancelSocialAuth, this );
    }
}
