// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button } from 'cc';
import { TokenStorage } from '../Common/TokenStorage';
import { UIManager, UIScreenType } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('MainMenuManager')
export class MainMenuManager extends Component {

    @property(Button)
    logOutButton: Button;

    @property(Button)
    userAccountButton: Button;

    @property(Button)
    characterButton: Button;

    @property(Button)
    storeButton: Button;

    @property(Button)
    inventoryButton: Button;

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners() {
        this.logOutButton.node.on(Button.EventType.CLICK, this.onLogoutClicked, this);
        this.userAccountButton.node.on(Button.EventType.CLICK, this.onUserAccountClicked, this);
        this.characterButton.node.on(Button.EventType.CLICK, this.onCharacterClicked, this);
        this.storeButton.node.on(Button.EventType.CLICK, this.onStoreClicked, this);
        this.inventoryButton.node.on(Button.EventType.CLICK, this.onInventoryClicked, this);
    }

    removeListeners() {
        this.logOutButton.node.off(Button.EventType.CLICK, this.onLogoutClicked, this);
        this.userAccountButton.node.off(Button.EventType.CLICK, this.onUserAccountClicked, this);
        this.characterButton.node.off(Button.EventType.CLICK, this.onCharacterClicked, this);
        this.storeButton.node.off(Button.EventType.CLICK, this.onStoreClicked, this);
        this.inventoryButton.node.off(Button.EventType.CLICK, this.onInventoryClicked, this);
    }

    onLogoutClicked() {
        UIManager.instance.openScreen(UIScreenType.Starting, this.node);
        TokenStorage.clearToken();
    }

    onUserAccountClicked() {
        UIManager.instance.openScreen(UIScreenType.UserAccount, this.node);
    }

    onCharacterClicked() {
        UIManager.instance.openScreen(UIScreenType.Character, this.node);
    }

    onStoreClicked() {
        UIManager.instance.openScreen(UIScreenType.Store, this.node);
    }

    onInventoryClicked() {
        UIManager.instance.openScreen(UIScreenType.Inventory, this.node);
    }
}
