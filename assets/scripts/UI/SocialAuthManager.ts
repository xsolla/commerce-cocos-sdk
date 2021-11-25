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
        this.populateAttributesList(this.socialNetworksData);
    }

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.socialNetworkFilterEditBox.string = '';

        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        this.uiManager.openStartingScreen(this.node);
    }

    populateAttributesList(attributes: SocialNetworkItemData[]) {
        for (let i = 0; i < attributes.length; ++i) {
            let socialNetworkItem = instantiate(this.socialNetworkItemPrefab);            
            this.socialNetworksList.content.addChild(socialNetworkItem);
            let itemData = this.socialNetworksData[i];
            socialNetworkItem.getComponent(SocialNetworkItem).init(itemData.name.toString(), itemData.logo, this);
        }
    }

    authViaSocialNetwork(platform:string) {

    }

    onSocialNetworkFilterChanged() {
        
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
