// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, EditBox, EventHandler, sys, System, Toggle } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
import { TokenStorage } from '../Common/TokenStorage';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('BasicAuthManager')
export class BasicAuthManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

    @property(Button)
    backButton: Button;

    @property(EditBox)
    usernameEditBox: EditBox;

    @property(EditBox)
    passwordEditBox: EditBox;

    @property(Button)
    logInButton: Button;

    @property(Toggle)
    remeberMeToggle: Toggle;

    @property(Button)
    demoUserButton: Button;

    start() {
        
    }

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.usernameEditBox.string = '';
        this.passwordEditBox.string = '';

        this.logInButton.interactable = false;

        this.remeberMeToggle.isChecked = true;

        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        this.uiManager.openStartingScreen(this.node);
    }

    onLoginClicked() {
        XsollaLogin.authByUsernameAndPassword(this.usernameEditBox.string, this.passwordEditBox.string, this.remeberMeToggle.isChecked, 'xsollatest', token => {
            console.log(token);
            TokenStorage.saveToken(token, this.remeberMeToggle.isChecked);
            this.uiManager.openMainMenu(this.node);
        }, err => {
            console.log(err);
            this.uiManager.openErrorScreen(this.node, err.description);
        })
    }

    onDemoUserClicked() {
        this.usernameEditBox.string = 'xsolla';
        this.passwordEditBox.string = 'xsolla';

        this.onLoginClicked();
    }

    onCredentialsChanged() {
        this.logInButton.interactable = this.usernameEditBox.string.length > 0 && this.passwordEditBox.string.length > 0;
    }

    addListeners () {
        this.backButton.node.on('click', this.onBackClicked, this);
        this.logInButton.node.on('click', this.onLoginClicked, this);
        this.demoUserButton.node.on('click', this.onDemoUserClicked, this);
        this.usernameEditBox.node.on('text-changed', this.onCredentialsChanged, this);
        this.passwordEditBox.node.on('text-changed', this.onCredentialsChanged, this);
    }

    removeListeners () {
        this.backButton.node.off('click', this.onBackClicked, this);
        this.logInButton.node.off('click', this.onLoginClicked, this);
        this.demoUserButton.node.off('click', this.onDemoUserClicked, this);
        this.usernameEditBox.node.off('text-changed', this.onCredentialsChanged, this);
        this.passwordEditBox.node.off('text-changed', this.onCredentialsChanged, this);
    }
}
