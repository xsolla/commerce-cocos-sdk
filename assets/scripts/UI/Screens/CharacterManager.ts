// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Prefab, ScrollView, instantiate, EditBox } from 'cc';
import { UserAttribute, XsollaAttributes } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAttributes';
import { TokenStorage } from '../../Common/TokenStorage';
import { AttributeItem } from '../Misc/AttributeItem';
import { UIManager, UIScreenType } from '../UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('CharacterManager')
export class CharacterManager extends Component {

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

    onEnable() {
        this.openAllAttributesScreen(this.addAttributeScreen);
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.MainMenu);
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
        UIManager.instance.showLoaderPopup(true);
        XsollaAttributes.getUserAttributes(TokenStorage.token.access_token, null, null, attributes => {
            UIManager.instance.showLoaderPopup(false);
            this.populateAttributesList(attributes);
            this.attributesList.scrollToTop();
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
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

        UIManager.instance.showLoaderPopup(true);
        XsollaAttributes.updateUserAttributes(TokenStorage.token.access_token, [newAttrinbute], () => {
            this.openAllAttributesScreen(this.addAttributeScreen);
            UIManager.instance.showLoaderPopup(false);
        }, err => {
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
            UIManager.instance.showLoaderPopup(false);
        });
    }

    removeAttribute(key:string, attributeItem:Node) {
        UIManager.instance.showLoaderPopup(true);
        XsollaAttributes.removeUserAttributes(TokenStorage.token.access_token, [key], () => {
            this.attributesList.content.removeChild(attributeItem);
            UIManager.instance.showLoaderPopup(false);
        }, err => {
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
            UIManager.instance.showLoaderPopup(false);
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
