// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox, Toggle } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
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

    @property(Button)
    resetPasswordButton: Button;

    @property(Toggle)
    remeberMeToggle: Toggle;

    @property(Button)
    demoUserButton: Button;

    @property(Button)
    signUpButton: Button;

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
        XsollaAuth.authByUsernameAndPassword(this.usernameEditBox.string, this.passwordEditBox.string, this.remeberMeToggle.isChecked, token => {
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

    onSignUpClicked() {
        UIManager.instance.openScreen(UIScreenType.SignUp);
    }

    oResetPasswordClicked() {
        UIManager.instance.openScreen(UIScreenType.ResetPassword);
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.logInButton.node.on(Button.EventType.CLICK, this.onLoginClicked, this);
        this.demoUserButton.node.on(Button.EventType.CLICK, this.onDemoUserClicked, this);
        this.signUpButton.node.on(Button.EventType.CLICK, this.onSignUpClicked, this);
        this.resetPasswordButton.node.on(Button.EventType.CLICK, this.oResetPasswordClicked, this);
        this.usernameEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.logInButton.node.off(Button.EventType.CLICK, this.onLoginClicked, this);
        this.demoUserButton.node.off(Button.EventType.CLICK, this.onDemoUserClicked, this);
        this.signUpButton.node.off(Button.EventType.CLICK, this.onSignUpClicked, this);
        this.resetPasswordButton.node.off(Button.EventType.CLICK, this.oResetPasswordClicked, this);
        this.usernameEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }
}
