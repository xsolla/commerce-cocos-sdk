// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Prefab, ScrollView, instantiate, EditBox } from 'cc';
import { UserAttribute, XsollaUserAccount } from 'db://xsolla-commerce-sdk/scripts/api/XsollaUserAccount';
import { TokenStorage } from '../../Common/TokenStorage';
import { AttributeItem } from '../Misc/AttributeItem';
import { UIManager, UIScreenType } from '../UIManager';
import { AddUserAttributeManager } from './AddUserAttributeManager';
import { EditUserAttributeManager } from './EditUserAttributeManager';
const { ccclass, property } = _decorator;
 
@ccclass('UserAttributesManager')
export class UserAttributesManager extends Component {

    @property(Button)
    backButton: Button;

    @property(Button)
    addAttributeButton: Button;

    @property(Node)
    allAttributesScreen: Node;

    @property(AddUserAttributeManager)
    addAttributeManager: AddUserAttributeManager;

    @property(EditUserAttributeManager)
    editAttributeManager: EditUserAttributeManager;

    @property(Prefab)
    attributeItemPrefab: Prefab;

    @property(ScrollView)
    attributesList: ScrollView;

    start() {
        this.addAttributeManager.init(this);
    }

    onEnable() {
        this.openAttributeScreen(this.allAttributesScreen);
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.MainMenu);
    }

    onCancelClicked() {
        this.openAttributeScreen(this.allAttributesScreen);
    }

    onAddAttributeClicked() {
        this.openAttributeScreen(this.addAttributeManager.node);
    }

    openAttributeScreen(currentScreen:Node) {
        if(currentScreen == this.allAttributesScreen) {
            this.attributesList.content.destroyAllChildren();
            UIManager.instance.showLoaderPopup(true);
            XsollaUserAccount.getUserAttributes(TokenStorage.token.access_token, null, null, attributes => {
                UIManager.instance.showLoaderPopup(false);
                this.populateAttributesList(attributes);
                this.attributesList.scrollToTop();
            }, err => {
                UIManager.instance.showLoaderPopup(false);
                console.log(err);
                UIManager.instance.showErrorPopup(err.description);
            });
        }

        this.allAttributesScreen.active = false;
        this.editAttributeManager.node.active = false;
        this.addAttributeManager.node.active = false;
        currentScreen.active = true;
    }

    openEditAttributeScreen(data: UserAttribute) {
        this.openAttributeScreen(this.editAttributeManager.node);
        this.editAttributeManager.init(this, data);
    }

    populateAttributesList(attributes: Array<UserAttribute>) {
        for (let i = 0; i < attributes.length; ++i) {
            let attributeItem = instantiate(this.attributeItemPrefab);            
            this.attributesList.content.addChild(attributeItem);
            let attributesData = attributes[i];
            attributeItem.getComponent(AttributeItem).init(attributesData, this);
        }
    }

    addAttribute(key:string, value:string) {
        let newAttrinbute: UserAttribute = {
            key: key,
            permission: 'public',
            value: value
        };

        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.updateUserAttributes(TokenStorage.token.access_token, [newAttrinbute], () => {
            this.openAttributeScreen(this.allAttributesScreen);
            UIManager.instance.showLoaderPopup(false);
        }, err => {
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
            UIManager.instance.showLoaderPopup(false);
        });
    }

    removeAttribute(key:string) {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.removeUserAttributes(TokenStorage.token.access_token, [key], () => {
            this.openAttributeScreen(this.allAttributesScreen);
            UIManager.instance.showLoaderPopup(false);
        }, err => {
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
            UIManager.instance.showLoaderPopup(false);
        });
    }

    editAttribute(data:UserAttribute, newKey: string, newValue: string) {
        let arr: Array<UserAttribute> = new Array<UserAttribute>();
        for(let attributeNode of this.attributesList.content.children) {
            let attributeItem: AttributeItem = attributeNode.getComponent(AttributeItem);
            let userAttribute:UserAttribute = attributeItem.data;
           if(data == attributeItem.data) {
               userAttribute.key = newKey;
               userAttribute.value = newValue;
           }
           arr.push(userAttribute);
        }

        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.updateUserAttributes(TokenStorage.token.access_token, arr, () => {
            UIManager.instance.showLoaderPopup(false);
            this.openAttributeScreen(this.allAttributesScreen);
        }, err => {
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
            UIManager.instance.showLoaderPopup(false);
        });
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.addAttributeButton.node.on(Button.EventType.CLICK, this.onAddAttributeClicked, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.addAttributeButton.node.off(Button.EventType.CLICK, this.onAddAttributeClicked, this);
    }
}
