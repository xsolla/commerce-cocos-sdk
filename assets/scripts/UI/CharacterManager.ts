// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button } from 'cc';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('CharacterManager')
export class CharacterManager extends Component {
    
    @property(UIManager)
    uiManager: UIManager;

    @property(Button)
    backButton: Button;

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

    onBackClicked() {
        this.uiManager.openMainMenu(this.node);
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
    }
}
