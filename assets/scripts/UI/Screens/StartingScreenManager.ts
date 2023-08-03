// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox, Toggle, Node, sys, director } from 'cc';
import { Token, XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { HttpUtil, RequestContentType } from 'db://xsolla-commerce-sdk/scripts/core/HttpUtil';
import { UIManager, UIScreenType } from '../UIManager';
import { NativeUtil } from 'db://xsolla-commerce-sdk/scripts/common/NativeUtil';
import { Events } from 'db://xsolla-commerce-sdk/scripts/core/Events';
const { ccclass, property } = _decorator;
 
@ccclass('StartingScreenManager')
export class StartingScreenManager extends Component {

    @property(EditBox)
    usernameEditBox: EditBox;

    @property(EditBox)
    passwordEditBox: EditBox;

    @property(Button)
    logInButton: Button;

    @property(Button)
    moreLoginOptionsButton: Button;

    @property(Button)
    resetPasswordButton: Button;

    @property(Toggle)
    remeberMeToggle: Toggle;

    @property(Button)
    demoUserButton: Button;

    @property(Button)
    signUpButton: Button;

    @property(Node)
    socialContainer: Node;

    @property(Button)
    googleButton: Button;

    @property(Button)
    twitterButton: Button;

    @property(Button)
    discordButton: Button;

    @property(Button)
    socialOtherButton: Button;

    start() {
        
    }

    onEnable() {
        this.usernameEditBox.string = '';
        this.passwordEditBox.string = '';

        this.logInButton.interactable = false;

        this.remeberMeToggle.isChecked = true;

        this.socialContainer.active = sys.isMobile;

        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
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
        });
    }

    onMoreLoginOptionsClicked() {
        UIManager.instance.openScreen(UIScreenType.MoreLoginOptions);
    }

    onDemoUserClicked() {
        UIManager.instance.showLoaderPopup(true);
        let request = HttpUtil.createRequest('https://us-central1-xsolla-sdk-demo.cloudfunctions.net/generateDemoUserToken', 'POST', RequestContentType.WwwForm, null, result => {
            let token: Token = JSON.parse(result);
            UIManager.instance.showLoaderPopup(false);
            console.log(token);
            TokenStorage.saveToken(token, true);
            UIManager.instance.openScreen(UIScreenType.MainMenu);
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        });
        request.send();
    }

    onCredentialsChanged() {
        this.logInButton.interactable = this.usernameEditBox.string.length > 0 && this.passwordEditBox.string.length > 0;
    }

    onSignUpClicked() {
        UIManager.instance.openScreen(UIScreenType.SignUp);
    }

    onResetPasswordClicked() {
        UIManager.instance.openScreen(UIScreenType.ResetPassword);
    }

    onGoogleClicked() {
        UIManager.instance.showLoaderPopup(true);
        NativeUtil.authSocial("google");
    }

    onTwitterClicked() {
        UIManager.instance.showLoaderPopup(true);
        NativeUtil.authSocial("twitter");
    }

    onDiscordClicked() {
        UIManager.instance.showLoaderPopup(true);
        NativeUtil.authSocial("discord");
    }

    onOtherSocialClicked() {
        UIManager.instance.openScreen(UIScreenType.SocialAuth);
    }

    handleSuccessfulSocialAuth(token:Token) {
        UIManager.instance.showLoaderPopup(false);
        TokenStorage.saveToken(token, true);
        UIManager.instance.openScreen(UIScreenType.MainMenu);
    }

    handleCancelSocialAuth() {
        UIManager.instance.showLoaderPopup(false);
    }

    handleErrorSocialAuth(error:string) {
        UIManager.instance.showLoaderPopup(false);
        console.log(error);
        UIManager.instance.showErrorPopup(error);
    }

    addListeners () {
        this.logInButton.node.on(Button.EventType.CLICK, this.onLoginClicked, this);
        this.moreLoginOptionsButton.node.on(Button.EventType.CLICK, this.onMoreLoginOptionsClicked, this);
        this.demoUserButton.node.on(Button.EventType.CLICK, this.onDemoUserClicked, this);
        this.signUpButton.node.on(Button.EventType.CLICK, this.onSignUpClicked, this);
        this.resetPasswordButton.node.on(Button.EventType.CLICK, this.onResetPasswordClicked, this);
        this.googleButton.node.on(Button.EventType.CLICK, this.onGoogleClicked, this);
        this.twitterButton.node.on(Button.EventType.CLICK, this.onTwitterClicked, this);
        this.discordButton.node.on(Button.EventType.CLICK, this.onDiscordClicked, this);
        this.socialOtherButton.node.on(Button.EventType.CLICK, this.onOtherSocialClicked, this);
        this.usernameEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);

        director.getScene().on(Events.SOCIAL_AUTH_SUCCESS, this.handleSuccessfulSocialAuth, this );
        director.getScene().on(Events.SOCIAL_AUTH_ERROR, this.handleErrorSocialAuth, this );
        director.getScene().on(Events.SOCIAL_AUTH_CANCELED, this.handleCancelSocialAuth, this );
    }

    removeListeners () {
        this.logInButton.node.off(Button.EventType.CLICK, this.onLoginClicked, this);
        this.moreLoginOptionsButton.node.off(Button.EventType.CLICK, this.onMoreLoginOptionsClicked, this);
        this.demoUserButton.node.off(Button.EventType.CLICK, this.onDemoUserClicked, this);
        this.signUpButton.node.off(Button.EventType.CLICK, this.onSignUpClicked, this);
        this.resetPasswordButton.node.off(Button.EventType.CLICK, this.onResetPasswordClicked, this);
        this.googleButton.node.off(Button.EventType.CLICK, this.onGoogleClicked, this);
        this.twitterButton.node.off(Button.EventType.CLICK, this.onTwitterClicked, this);
        this.discordButton.node.off(Button.EventType.CLICK, this.onDiscordClicked, this);
        this.socialOtherButton.node.off(Button.EventType.CLICK, this.onOtherSocialClicked, this);
        this.usernameEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.passwordEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);

        director.getScene().off(Events.SOCIAL_AUTH_SUCCESS, this.handleSuccessfulSocialAuth, this );
        director.getScene().off(Events.SOCIAL_AUTH_ERROR, this.handleErrorSocialAuth, this );
        director.getScene().off(Events.SOCIAL_AUTH_CANCELED, this.handleCancelSocialAuth, this );
    }
}
