// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button } from 'cc';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('MainMenuManager')
export class MainMenuManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

    @property(Button)
    logOutButton: Button;

    start() {
        
    }

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
        this.logOutButton.node.on('click', this.onLogoutClicked, this);
    }

    removeListeners() {
        this.logOutButton.node.off('click', this.onLogoutClicked, this);
    }

    onLogoutClicked() {
        this.uiManager.openStartingScreen(this.node);
    }
}
