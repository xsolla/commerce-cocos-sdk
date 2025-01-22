// Copyright 2025 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, EditBox, Label } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UIManager, UIScreenType } from '../UIManager';
const { ccclass, property } = _decorator;

@ccclass('AuthByPhoneManager')
export class AuthByPhoneManager extends Component {

    @property(Node)
    credentialsScreen: Node;

    @property(Node)
    confirmationScreen: Node;

    @property(Button)
    backButton: Button;

    @property(Button)
    sendCodeButton: Button;

    @property(Button)
    confirmCodeButton: Button;

    @property(Button)
    resendCodeButton: Button;

    @property(EditBox)
    credentialsEditBox: EditBox;

    @property(EditBox)
    confirmationCodeEditBox: EditBox;

    @property(Label)
    stepCountLabel: Label;

    @property(Node)
    codeExpiresInContainer: Node;

    @property(Label)
    codeExpiresInLabel: Label;

    @property(Label)
    codeExpiredLabel: Label;

    private _expiresInInverval: number;

    private _expiresInCurrentTime: number;

    private _operationId: string;

    private _step: number;

    onEnable() {
        this._operationId = '';
        this.credentialsEditBox.string = '';
        this.confirmationCodeEditBox.string = '';
        this.changeStep(1);
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
        clearTimeout( this._expiresInInverval);
    }

    changeStep(step: number) {
        this._step = step;
        this.sendCodeButton.interactable = false;
        this.confirmCodeButton.interactable = false;

        this.credentialsScreen.active = this._step == 1;
        this.confirmationScreen.active = this._step == 2;
        this.stepCountLabel.string = `${this._step}/2`;

        clearTimeout( this._expiresInInverval);
        if(step == 2) {
            this._expiresInCurrentTime = 180;
            this.confirmCodeButton.node.active = true;
            this.resendCodeButton.node.active = false;
            this.codeExpiresInContainer.active = true;
            this.codeExpiredLabel.node.active = false;
            this.updateExpiresInTime();
        }
    }

    updateExpiresInTime() {
        this._expiresInCurrentTime--;
        let minutes: number = (this._expiresInCurrentTime - this._expiresInCurrentTime % 60) / 60;
        let seconds: number = this._expiresInCurrentTime % 60;
        let minutesStr: string = minutes > 9 ? minutes.toString() : '0' + minutes.toString();
        let secondsStr: string = seconds > 9 ? seconds.toString() : '0' + seconds.toString();
        this.codeExpiresInLabel.string = `${minutesStr}:${secondsStr}`;
        if(this._expiresInCurrentTime > 0) {
            this._expiresInInverval = setTimeout(() => {
                this.updateExpiresInTime();
            }, 1000);
        } else {
            this.confirmCodeButton.node.active = false;
            this.resendCodeButton.node.active = true;
            this.codeExpiresInContainer.active = false;
            this.codeExpiredLabel.node.active = true;
        }
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.MoreLoginOptions);
    }

    sendCodeClicked() {
        UIManager.instance.showLoaderPopup(true);
        XsollaAuth.startAuthByPhoneNumber(this.credentialsEditBox.string, 'xsollatest', operationId => {
            UIManager.instance.showLoaderPopup(false);
            this._operationId = operationId;
            this.changeStep(2);
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        });
    }

    confirmCodeClicked() {
        UIManager.instance.showLoaderPopup(true);
        XsollaAuth.completeAuthByPhoneNumber(this.confirmationCodeEditBox.string, this._operationId, this.credentialsEditBox.string, token => {
            UIManager.instance.showLoaderPopup(false);
            console.log(token);
            TokenStorage.saveToken(token, true);
            UIManager.instance.openScreen(UIScreenType.MainMenu);
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        });
    }

    onCredentialsChanged() {
        this.sendCodeButton.interactable = this.credentialsEditBox.string.length > 0;
    }

    onConfirmCodeChanged() {
        this.confirmCodeButton.interactable = this.confirmationCodeEditBox.string.length > 0;
    }

    resendCodeClicked() {
        this.sendCodeClicked();
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.sendCodeButton.node.on(Button.EventType.CLICK, this.sendCodeClicked, this);
        this.confirmCodeButton.node.on(Button.EventType.CLICK, this.confirmCodeClicked, this);
        this.resendCodeButton.node.on(Button.EventType.CLICK, this.resendCodeClicked, this);

        this.credentialsEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.confirmationCodeEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onConfirmCodeChanged, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.sendCodeButton.node.off(Button.EventType.CLICK, this.sendCodeClicked, this);
        this.confirmCodeButton.node.off(Button.EventType.CLICK, this.confirmCodeClicked, this);
        this.resendCodeButton.node.off(Button.EventType.CLICK, this.resendCodeClicked, this);

        this.credentialsEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.confirmationCodeEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onConfirmCodeChanged, this);
    }
}