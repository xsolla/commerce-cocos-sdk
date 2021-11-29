// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button } from 'cc';
import { TokenStorage } from '../Common/TokenStorage';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('MainMenuManager')
export class MainMenuManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

    @property(Button)
    logOutButton: Button;

    @property(Button)
    characterButton: Button;

    @property(Button)
    storeButton: Button;

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners() {
        this.logOutButton.node.on(Button.EventType.CLICK, this.onLogoutClicked, this);
        this.characterButton.node.on(Button.EventType.CLICK, this.onCharacterClicked, this);
        this.storeButton.node.on(Button.EventType.CLICK, this.onStoreClicked, this);
    }

    removeListeners() {
        this.logOutButton.node.off(Button.EventType.CLICK, this.onLogoutClicked, this);
        this.characterButton.node.off(Button.EventType.CLICK, this.onCharacterClicked, this);
        this.storeButton.node.off(Button.EventType.CLICK, this.onStoreClicked, this);
    }

    onLogoutClicked() {
        this.uiManager.openStartingScreen(this.node);
        TokenStorage.clearToken();
    }

    onCharacterClicked() {
        this.uiManager.openCharacterScreen(this.node);
    }

    onStoreClicked() {
        this.uiManager.openStoreScreen(this.node);
    }
}
