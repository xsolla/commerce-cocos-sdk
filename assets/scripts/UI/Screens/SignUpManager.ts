// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox, Toggle, sys } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
import { TokenStorage } from '../../Common/TokenStorage';
import { UIManager, UIScreenType } from '../UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('SignUpManager')
export class SignUpManager extends Component {

    @property(Button)
    backButton: Button;

    @property(EditBox)
    usernameEditBox: EditBox;

    @property(EditBox)
    emailEditBox: EditBox;

    @property(EditBox)
    passwordEditBox: EditBox;

    @property(Button)
    signUpButton: Button;

    @property(Button)
    logInButton: Button;

    @property(Button)
    privacyPolicyButton: Button;

    start() {
        
    }

    onEnable() {
        this.usernameEditBox.string = '';
        this.emailEditBox.string = '';
        this.passwordEditBox.string = '';

        this.signUpButton.interactable = false;

        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.Starting);
    }

    onLoginClicked() {
        UIManager.instance.openScreen(UIScreenType.BasicAuth);
    }

    onCredentialsChanged() {
        this.signUpButton.interactable = this.usernameEditBox.string.length > 0 && this.emailEditBox.string.length > 0 && this.passwordEditBox.string.length > 0;
    }

    onSignUpClicked() {
        XsollaLogin.registerNewUser(this.usernameEditBox.string, this.passwordEditBox.string, this.emailEditBox.string, 'xsollatest', 'xsollatest', null, token => {
            if(token != null) {
                console.log(token);
                TokenStorage.saveToken(token, true);
                UIManager.instance.openScreen(UIScreenType.MainMenu);
            }
            else {
                UIManager.instance.showMessagePopup('Resistration completed successfully!', () => {
                    UIManager.instance.openScreen(UIScreenType.BasicAuth);
                });                
            }
        }, err => {
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        } )
    }

    onPrivacyPolicyClicked() {
        sys.openURL('https://xsolla.com/privacypolicy');
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.logInButton.node.on(Button.EventType.CLICK, this.onLoginClicked, this);
        this.signUpButton.node.on(Button.EventType.CLICK, this.onSignUpClicked, this);
        this.privacyPolicyButton.node.on(Button.EventType.CLICK, this.onPrivacyPolicyClicked, this);
        this.usernameEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.emailEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.logInButton.node.off(Button.EventType.CLICK, this.onLoginClicked, this);
        this.signUpButton.node.off(Button.EventType.CLICK, this.onSignUpClicked, this);
        this.privacyPolicyButton.node.off(Button.EventType.CLICK, this.onPrivacyPolicyClicked, this);
        this.usernameEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.emailEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }
}
