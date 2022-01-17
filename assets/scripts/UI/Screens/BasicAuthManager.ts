// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox, Toggle } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
import { TokenStorage } from '../../Common/TokenStorage';
import { UIManager, UIScreenType } from '../UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('BasicAuthManager')
export class BasicAuthManager extends Component {

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
        UIManager.instance.openScreen(UIScreenType.Starting);
    }

    onLoginClicked() {
        UIManager.instance.showLoaderPopup(true);
        XsollaLogin.authByUsernameAndPassword(this.usernameEditBox.string, this.passwordEditBox.string, this.remeberMeToggle.isChecked, 'xsollatest', token => {
            UIManager.instance.showLoaderPopup(false);
            console.log(token);
            TokenStorage.saveToken(token, this.remeberMeToggle.isChecked);
            UIManager.instance.openScreen(UIScreenType.MainMenu);
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
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
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.logInButton.node.on(Button.EventType.CLICK, this.onLoginClicked, this);
        this.demoUserButton.node.on(Button.EventType.CLICK, this.onDemoUserClicked, this);
        this.usernameEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.logInButton.node.off(Button.EventType.CLICK, this.onLoginClicked, this);
        this.demoUserButton.node.off(Button.EventType.CLICK, this.onDemoUserClicked, this);
        this.usernameEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }
}
