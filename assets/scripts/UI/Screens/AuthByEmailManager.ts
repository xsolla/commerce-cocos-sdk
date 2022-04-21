// Copyright 2022 Xsolla Inc. All Rights Reserved

import { _decorator, Component, Node, Button, EditBox, Label } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UIManager, UIScreenType } from '../UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('AuthByEmailManager')
export class AuthByEmailManager extends Component {

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

    @property(EditBox)
    credentialsEditBox: EditBox;

    @property(EditBox)
    confirmationCodeEditBox: EditBox;

    @property(Label)
    stepCountLabel: Label;

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
    }

    changeStep(step: number) {
        this._step = step;
        this.sendCodeButton.interactable = false;
        this.confirmCodeButton.interactable = false;

        this.credentialsScreen.active = this._step == 1;
        this.confirmationScreen.active = this._step == 2;
        this.stepCountLabel.string = `${this._step}/2`;
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.Starting);
    }

    sendCodeClicked() {
        UIManager.instance.showLoaderPopup(true);
        XsollaAuth.startAuthByEmail(this.credentialsEditBox.string, 'xsollatest', 'xsollatest', operationId => {
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
        XsollaAuth.completeAuthByEmail(this.confirmationCodeEditBox.string, this._operationId, this.credentialsEditBox.string, token => {
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

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.sendCodeButton.node.on(Button.EventType.CLICK, this.sendCodeClicked, this);
        this.confirmCodeButton.node.on(Button.EventType.CLICK, this.confirmCodeClicked, this);

        this.credentialsEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.confirmationCodeEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onConfirmCodeChanged, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.sendCodeButton.node.off(Button.EventType.CLICK, this.sendCodeClicked, this);
        this.confirmCodeButton.node.off(Button.EventType.CLICK, this.confirmCodeClicked, this);

        this.credentialsEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
        this.confirmationCodeEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onConfirmCodeChanged, this);
    }
}