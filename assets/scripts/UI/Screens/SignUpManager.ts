// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox, Node, sys, Label } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UIManager, UIScreenType } from '../UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('SignUpManager')
export class SignUpManager extends Component {

    @property(Node)
    registrationScreen: Node;

    @property(Node)
    successScreen: Node;

    @property(Button)
    backButton: Button;

    @property(Button)
    signUpButton: Button;

    @property(Button)
    privacyPolicyButton: Button;

    @property(Button)
    resendEmailButton: Button;

    @property(EditBox)
    usernameEditBox: EditBox;

    @property(EditBox)
    emailEditBox: EditBox;

    @property(EditBox)
    passwordEditBox: EditBox;

    @property(Label)
    confirmationEmailMessage: Label;

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
    
    onCredentialsChanged() {
        this.signUpButton.interactable = this.usernameEditBox.string.length > 0 && this.emailEditBox.string.length > 0 && this.passwordEditBox.string.length >= 6;
    }

    onSignUpClicked() {
        UIManager.instance.showLoaderPopup(true);
        XsollaAuth.registerNewUser(this.usernameEditBox.string, this.passwordEditBox.string, this.emailEditBox.string, 'xsollatest', 'xsollatest', null, token => {
            UIManager.instance.showLoaderPopup(false);
            if(token != null) {
                console.log(token);                
                TokenStorage.saveToken(token, true);
                UIManager.instance.openScreen(UIScreenType.MainMenu);
            }
            else {
                this.registrationScreen.active = false;
                this.successScreen.active = true;      
                this.confirmationEmailMessage.string = this.confirmationEmailMessage.string.replace('{email}', this.emailEditBox.string);    
            }
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        });
    }

    onPrivacyPolicyClicked() {
        sys.openURL('https://xsolla.com/privacypolicy');
    }

    onResendEmailClicked() {
        UIManager.instance.showLoaderPopup(true);
        XsollaAuth.resendAccountConfirmationEmail(this.usernameEditBox.string, 'xsollatest', 'xsollatest', () => {
            UIManager.instance.showLoaderPopup(false);
            console.log('Email resent successfully.')
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        });
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.signUpButton.node.on(Button.EventType.CLICK, this.onSignUpClicked, this);
        this.privacyPolicyButton.node.on(Button.EventType.CLICK, this.onPrivacyPolicyClicked, this);
        this.resendEmailButton.node.on(Button.EventType.CLICK, this.onResendEmailClicked, this);
        this.usernameEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.emailEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.signUpButton.node.off(Button.EventType.CLICK, this.onSignUpClicked, this);
        this.privacyPolicyButton.node.off(Button.EventType.CLICK, this.onPrivacyPolicyClicked, this);
        this.resendEmailButton.node.off(Button.EventType.CLICK, this.onResendEmailClicked, this);
        this.usernameEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.emailEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }
}
