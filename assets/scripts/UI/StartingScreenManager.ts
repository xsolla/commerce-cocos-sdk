// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button } from 'cc';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('StartingScreenManager')
export class StartingScreenManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

    @property(Button)
    basicAuthButton: Button;

    @property(Button)
    otherAuthButton: Button;

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
        this.basicAuthButton.node.on('click', this.onBasicAuthClicked, this);
        this.otherAuthButton.node.on('click', this.onOtherAuthClicked, this);
    }

    removeListeners() {
        this.basicAuthButton.node.off('click', this.onBasicAuthClicked, this);
        this.otherAuthButton.node.off('click', this.onOtherAuthClicked, this);
    }

    onBasicAuthClicked() {
        this.uiManager.openBasicAuth(this.node);
    }

    onOtherAuthClicked() {
        this.uiManager.openPasswordlessAuth(this.node);
    }
}
