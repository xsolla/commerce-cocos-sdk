// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button } from 'cc';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UIManager, UIScreenType } from '../UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('MainMenuManager')
export class MainMenuManager extends Component {

    @property(Button)
    userAccountButton: Button;

    @property(Button)
    userAttributesButton: Button;

    @property(Button)
    storeButton: Button;

    @property(Button)
    inventoryButton: Button;

    @property(Button)
    logOutButton: Button;

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners() {
        this.userAccountButton.node.on(Button.EventType.CLICK, this.onUserAccountClicked, this);
        this.userAttributesButton.node.on(Button.EventType.CLICK, this.onUserAttributesClicked, this);
        this.storeButton.node.on(Button.EventType.CLICK, this.onStoreClicked, this);
        this.inventoryButton.node.on(Button.EventType.CLICK, this.onInventoryClicked, this);
        this.logOutButton.node.on(Button.EventType.CLICK, this.onLogoutClicked, this);
    }

    removeListeners() {
        this.userAccountButton.node.off(Button.EventType.CLICK, this.onUserAccountClicked, this);
        this.userAttributesButton.node.off(Button.EventType.CLICK, this.onUserAttributesClicked, this);
        this.storeButton.node.off(Button.EventType.CLICK, this.onStoreClicked, this);
        this.inventoryButton.node.off(Button.EventType.CLICK, this.onInventoryClicked, this);
        this.logOutButton.node.off(Button.EventType.CLICK, this.onLogoutClicked, this);
    }

    onUserAccountClicked() {
        UIManager.instance.openScreen(UIScreenType.UserAccount);
    }

    onUserAttributesClicked() {
        UIManager.instance.openScreen(UIScreenType.UserAttributes);
    }

    onStoreClicked() {
        UIManager.instance.openScreen(UIScreenType.Store);
    }

    onInventoryClicked() {
        UIManager.instance.openScreen(UIScreenType.Inventory);
    }

    onLogoutClicked() {
        UIManager.instance.openScreen(UIScreenType.Starting);
        TokenStorage.clearToken();
    }
}
