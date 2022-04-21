// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Prefab, ScrollView, instantiate } from 'cc';
import { UserAttribute, XsollaUserAccount } from 'db://xsolla-commerce-sdk/scripts/api/XsollaUserAccount';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { AttributeItem } from '../Misc/AttributeItem';
import { GroupsItem } from '../Misc/GroupsItem';
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
    userEditableAttributesList: ScrollView;

    @property(ScrollView)
    readOnlyAttributesList: ScrollView;

    @property(GroupsItem)
    readOnlyGroupItem: GroupsItem;

    @property(GroupsItem)
    userEditableGroupItem: GroupsItem;

    @property(Node)
    readOnlyAttributesScreen: Node;

    @property(Node)
    userEditableAttributesScreen: Node;

    private _selectedGroup: string;

    start() {
        this.addAttributeManager.init(this);
        this.readOnlyGroupItem.init('readOnly', 'READ-ONLY');
        this.userEditableGroupItem.init('userEditable', 'USER-EDITABLE');
        this.groupSelected('readOnly');
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
        this.openAttributeScreen(this.allAttributesScreen, false);
    }

    onAddAttributeClicked() {
        this.openAttributeScreen(this.addAttributeManager.node);
    }

    openAttributeScreen(currentScreen: Node, needToUpdate: boolean = true) {
        if(currentScreen == this.allAttributesScreen) {
            if(needToUpdate) {
                this.readOnlyAttributesList.content.destroyAllChildren();
                this.userEditableAttributesList.content.destroyAllChildren();
                UIManager.instance.showLoaderPopup(true);
                XsollaUserAccount.getUserAttributes(TokenStorage.token.access_token, null, null, userEditableAttributes => {
                    XsollaUserAccount.getUserReadOnlyAttributes(TokenStorage.token.access_token, null, null, readOnlyAttributes => {
                        UIManager.instance.showLoaderPopup(false);
                        this.populateUserEditableAttributesList(userEditableAttributes);
                        this.userEditableAttributesList.scrollToTop();
                        this.populateReadOnlyAttributesList(readOnlyAttributes);
                        this.readOnlyAttributesList.scrollToTop();
                    }, err => {
                        UIManager.instance.showLoaderPopup(false);
                        console.log(err);
                        UIManager.instance.showErrorPopup(err.description);
                    });
                }, err => {
                    UIManager.instance.showLoaderPopup(false);
                    console.log(err);
                    UIManager.instance.showErrorPopup(err.description);
                });
            }
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

    populateUserEditableAttributesList(attributes: Array<UserAttribute>) {
        for (let i = 0; i < attributes.length; ++i) {
            let attributeItem = instantiate(this.attributeItemPrefab);            
            this.userEditableAttributesList.content.addChild(attributeItem);
            let attributesData = attributes[i];
            attributeItem.getComponent(AttributeItem).init(attributesData, this, true);
        }
    }

    populateReadOnlyAttributesList(attributes: Array<UserAttribute>) {
        for (let i = 0; i < attributes.length; ++i) {
            let attributeItem = instantiate(this.attributeItemPrefab);            
            this.readOnlyAttributesList.content.addChild(attributeItem);
            let attributesData = attributes[i];
            attributeItem.getComponent(AttributeItem).init(attributesData, this, false);
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
        for(let attributeNode of this.userEditableAttributesList.content.children) {
            let attributeItem: AttributeItem = attributeNode.getComponent(AttributeItem);
            let userAttribute:UserAttribute = attributeItem.data;
           if(data == attributeItem.data) {
                continue;
           }
           arr.push(userAttribute);
        }
        let newAttribute: UserAttribute = {
            key: newKey,
            value: newValue,
            permission: 'public'
        };
        arr.push(newAttribute);

        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.updateUserAttributes(TokenStorage.token.access_token, arr, () => {
            XsollaUserAccount.removeUserAttributes(TokenStorage.token.access_token, [data.key], () => {
                UIManager.instance.showLoaderPopup(false);
                this.openAttributeScreen(this.allAttributesScreen);
            }, err => {
                console.log(err);
                UIManager.instance.showErrorPopup(err.description);
                UIManager.instance.showLoaderPopup(false);
            });
        }, err => {
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
            UIManager.instance.showLoaderPopup(false);
        });
    }

    groupSelected(groupId: string) {
        if(this._selectedGroup == groupId) {
            return;
        }
        this.readOnlyGroupItem.select( this.readOnlyGroupItem.groupId == groupId);
        this.readOnlyAttributesScreen.active = this.readOnlyGroupItem.groupId == groupId;
        this.userEditableGroupItem.select( this.userEditableGroupItem.groupId == groupId);
        this.userEditableAttributesScreen.active = this.userEditableGroupItem.groupId == groupId;

    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.addAttributeButton.node.on(Button.EventType.CLICK, this.onAddAttributeClicked, this);
        this.readOnlyGroupItem.node.on(GroupsItem.GROUP_CLICK, this.groupSelected, this);
        this.userEditableGroupItem.node.on(GroupsItem.GROUP_CLICK, this.groupSelected, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.addAttributeButton.node.off(Button.EventType.CLICK, this.onAddAttributeClicked, this);
        this.readOnlyGroupItem.node.off(GroupsItem.GROUP_CLICK, this.groupSelected, this);
        this.userEditableGroupItem.node.off(GroupsItem.GROUP_CLICK, this.groupSelected, this);
    }
}
