// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Prefab, ScrollView, instantiate } from 'cc';
import { UserAttribute, XsollaLogin } from '../../../extensions/xsolla-commerce-sdk/assets/scripts/api/XsollaLogin';
import { TokenStorage } from '../Common/TokenStorage';
import { AttributeItem } from './Misc/AttributeItem';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('CharacterManager')
export class CharacterManager extends Component {
    
    @property(UIManager)
    uiManager: UIManager;

    @property(Button)
    backButton: Button;

    @property(Prefab)
    attributeItemPrefab: Prefab;

    @property(ScrollView)
    attributesList: ScrollView;

    start() {
        
    }

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.attributesList.node.active = true;

        XsollaLogin.getUserAttributes(TokenStorage.token.access_token, null, null, attributes => {
            this.populateAttributesList(attributes);
            this.attributesList.scrollToTop();
        }, err => {
            console.log(err);
            this.uiManager.openErrorScreen(this.node, err.description);
        })

        this.addListeners();
    }

    onDisable() {
        this.clearAttributesList();
        this.removeListeners();
    }

    onBackClicked() {
        this.uiManager.openMainMenu(this.node);
    }

    populateAttributesList(attributes: Array<UserAttribute>) {
        for (let i = 0; i < attributes.length; ++i) {
            let attributeItem = instantiate(this.attributeItemPrefab);            
            this.attributesList.content.addChild(attributeItem);
            let attributesData = attributes[i];
            attributeItem.getComponent(AttributeItem).init(attributesData);
        }
    }

    clearAttributesList() {
        this.attributesList.content.destroyAllChildren();
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
    }
}
