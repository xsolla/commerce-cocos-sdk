// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, find, Button, EditBox } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

enum AuthOption {
    Phone = 0,
    Email = 1
}
 
@ccclass('PasswordlessAuthManager')
export class PasswordlessAuthManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

    @property(Node)
    authOptionsScreen: Node;

    @property(Node)
    credentialsScreen: Node;

    @property(Node)
    confirmationScreen: Node;

    @property(Button)
    backButton: Button;

    @property(Button)
    phoneButton: Button;

    @property(Button)
    emailButton: Button;

    @property(Button)
    sendCodeButton: Button;

    @property(Button)
    confirmCodeButton: Button;

    @property(EditBox)
    credentialsEditBox: EditBox;

    @property(EditBox)
    confirmationCodeEditBox: EditBox;

    private _authOption: AuthOption;
    private _operationId: string;

    start() {

    }

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.credentialsEditBox.string = '';
        this.confirmationCodeEditBox.string = '';

        this._operationId = '';

        this.authOptionsScreen.active = true;
        this.credentialsScreen.active = false;
        this.confirmationScreen.active = false;

        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        this.authOptionsScreen.active = false;
        this.credentialsScreen.active = false;
        this.confirmationScreen.active = false;

        this.uiManager.openStartingScreen(this.node);
    }

    phoneClicked() {
        this.credentialsEditBox.placeholder = 'Enter your phone';
        this._authOption = AuthOption.Phone;
        this.openCredentialsScreen(this.authOptionsScreen);
    }

    emailClicked() {
        this.credentialsEditBox.placeholder = 'Enter your email';
        this._authOption = AuthOption.Email;
        this.openCredentialsScreen(this.authOptionsScreen);
    }

    sendCodeClicked() {
        if(this._authOption == AuthOption.Phone) {
            XsollaLogin.startAuthByPhoneNumber(this.credentialsEditBox.string, 'xsollatest', 'xsollatest', operationId => {
                this._operationId = operationId;
                this.openConfirmationScreen(this.credentialsScreen);
            }, err => {
                console.log(err);
                this.uiManager.openErrorScreen(this.node, err.description);
            });
            return;
        }
        if(this._authOption == AuthOption.Email) {
            XsollaLogin.startAuthByEmail(this.credentialsEditBox.string, 'xsollatest', 'xsollatest', operationId => {
                this._operationId = operationId;
                this.openConfirmationScreen(this.credentialsScreen);
            }, err => {
                console.log(err);
                this.uiManager.openErrorScreen(this.node, err.description);
            });
            return;
        }
    }

    confirmCodeClicked() {
        if(this._authOption == AuthOption.Phone) {
            XsollaLogin.completeAuthByPhoneNumber(this.confirmationCodeEditBox.string, this._operationId, this.credentialsEditBox.string, token => {
                console.log(token);
                this.uiManager.openMainMenu(this.node);
            }, err => {
                console.log(err);
                this.uiManager.openErrorScreen(this.node, err.description);
            });
            return;
        }
        if(this._authOption == AuthOption.Email) {
            XsollaLogin.completeAuthByEmail(this.confirmationCodeEditBox.string, this._operationId, this.credentialsEditBox.string, token => {
                console.log(token);
                this.uiManager.openMainMenu(this.node);
            }, err => {
                console.log(err);
                this.uiManager.openErrorScreen(this.node, err.description);
            });
            return;
        }
    }

    openCredentialsScreen(currentScreen:Node) {
        currentScreen.active = false;
        this.credentialsScreen.active = true;
        this.sendCodeButton.interactable = false;
    }

    openConfirmationScreen(currentScreen:Node) {
        currentScreen.active = false;
        this.confirmationScreen.active = true;
        this.confirmCodeButton.interactable = false;
    }

    onCredentialsChanged() {
        this.sendCodeButton.interactable = this.credentialsEditBox.string.length > 0;
    }

    onConfirmCodeChanged() {
        this.confirmCodeButton.interactable = this.confirmationCodeEditBox.string.length > 0;
    }

    addListeners () {
        this.backButton.node.on('click', this.onBackClicked, this);
        this.phoneButton.node.on('click', this.phoneClicked, this);
        this.emailButton.node.on('click', this.emailClicked, this);
        this.sendCodeButton.node.on('click', this.sendCodeClicked, this);
        this.confirmCodeButton.node.on('click', this.confirmCodeClicked, this);

        this.credentialsEditBox.node.on('text-changed', this.onCredentialsChanged, this);
        this.confirmationCodeEditBox.node.on('text-changed', this.onConfirmCodeChanged, this);
    }

    removeListeners () {
        this.backButton.node.off('click', this.onBackClicked, this);
        this.phoneButton.node.off('click', this.phoneClicked, this);
        this.emailButton.node.off('click', this.emailClicked, this);
        this.sendCodeButton.node.off('click', this.sendCodeClicked, this);
        this.confirmCodeButton.node.off('click', this.confirmCodeClicked, this);

        this.credentialsEditBox.node.off('text-changed', this.onCredentialsChanged, this);
        this.confirmationCodeEditBox.node.off('text-changed', this.onConfirmCodeChanged, this);
    }
}