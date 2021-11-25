// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, EditBox, EventHandler, sys, System, Toggle, ScrollView, Prefab, SpriteFrame, instantiate } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
import { TokenStorage } from '../Common/TokenStorage';
import { SocialNetworkItem } from './Misc/SocialNetworkItem';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('SocialNetworkItemData')
export class SocialNetworkItemData {

    @property(String)
    name: String = '';

    @property(SpriteFrame)
    logo: SpriteFrame = null;
}
 
@ccclass('SocialAuthManager')
export class SocialAuthManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

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
        this.uiManager.openStartingScreen(this.node);
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
