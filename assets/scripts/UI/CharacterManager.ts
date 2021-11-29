// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Prefab, ScrollView, instantiate, EditBox } from 'cc';
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

    @property(Button)
    addAttributeButton: Button;

    @property(Button)
    saveButton: Button;

    @property(Button)
    cancelButton: Button;

    @property(EditBox)
    keyEditBox: EditBox;

    @property(EditBox)
    valueEditBox: EditBox;

    @property(Node)
    allAttributesScreen: Node;

    @property(Node)
    addAttributeScreen: Node;

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
        this.openAllAttributesScreen(this.addAttributeScreen);
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        this.uiManager.openMainMenu(this.node);
    }

    onAddAttributeClicked() {
        this.openAddAttributeScreen(this.allAttributesScreen);
    }

    onSaveClicked() {
        this.addAttribute(this.keyEditBox.string, this.valueEditBox.string);
    }

    onCancelClicked() {
        this.openAllAttributesScreen(this.addAttributeScreen);
    }

    onAttributeDataChanged() {
        this.saveButton.interactable = this.keyEditBox.string.length > 0 && this.valueEditBox.string.length > 0;
    }

    openAllAttributesScreen(currentScreen:Node) {
        this.clearAttributesList();

        XsollaLogin.getUserAttributes(TokenStorage.token.access_token, null, null, attributes => {
            this.populateAttributesList(attributes);
            this.attributesList.scrollToTop();
        }, err => {
            console.log(err);
            this.uiManager.openErrorScreen(err.description);
        });

        currentScreen.active = false;
        this.allAttributesScreen.active = true;
    }

    openAddAttributeScreen(currentScreen:Node) {
        this.keyEditBox.string = '';
        this.valueEditBox.string = '';        

        currentScreen.active = false;
        this.addAttributeScreen.active = true;

        this.saveButton.interactable = false;
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

        XsollaLogin.updateUserAttributes(TokenStorage.token.access_token, [newAttrinbute], () => {
            this.openAllAttributesScreen(this.addAttributeScreen);
        }, err => {
            console.log(err);
            this.uiManager.openErrorScreen(err.description);
        });
    }

    removeAttribute(key:string, attributeItem:Node) {
        XsollaLogin.removeUserAttributes(TokenStorage.token.access_token, [key], () => {
            this.attributesList.content.removeChild(attributeItem);
        }, err => {
            console.log(err);
            this.uiManager.openErrorScreen(err.description);
        });
    }

    clearAttributesList() {
        this.attributesList.content.destroyAllChildren();
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.addAttributeButton.node.on(Button.EventType.CLICK, this.onAddAttributeClicked, this);
        this.saveButton.node.on(Button.EventType.CLICK, this.onSaveClicked, this);
        this.cancelButton.node.on(Button.EventType.CLICK, this.onCancelClicked, this);

        this.keyEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
        this.valueEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.addAttributeButton.node.off(Button.EventType.CLICK, this.onAddAttributeClicked, this);
        this.saveButton.node.off(Button.EventType.CLICK, this.onSaveClicked, this);
        this.cancelButton.node.off(Button.EventType.CLICK, this.onCancelClicked, this);

        this.keyEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
        this.valueEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
    }
}
