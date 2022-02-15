// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox, Node, Toggle, sys, Label } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { UIManager, UIScreenType } from '../UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('ResetPasswordManager')
export class ResetPasswordManager extends Component {

    @property(Node)
    resetScreen: Node;

    @property(Node)
    successScreen: Node;

    @property(Button)
    backButton: Button;

    @property(Button)
    resetButton: Button;

    @property(Button)
    resendEmailButton: Button;

    @property(EditBox)
    emailEditBox: EditBox;

    @property(Label)
    confirmationEmailMessage: Label;

    start() {
        
    }

    onEnable() {
        this.emailEditBox.string = '';

        this.resetButton.interactable = false;

        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.Starting);
    }

    onResetClicked() {
        UIManager.instance.showLoaderPopup(true);
        XsollaAuth.resetPassword(this.emailEditBox.string, () => {
            UIManager.instance.showLoaderPopup(false);
            this.resetScreen.active = false;
            this.successScreen.active = true;      
            this.confirmationEmailMessage.string = this.confirmationEmailMessage.string.replace('{email}', this.emailEditBox.string);    
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        });
    }

    onCredentialsChanged() {
        this.resetButton.interactable = this.emailEditBox.string.length > 0;
    }


    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.resetButton.node.on(Button.EventType.CLICK, this.onResetClicked, this);
        this.resendEmailButton.node.on(Button.EventType.CLICK, this.onResetClicked, this);
        this.emailEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.resetButton.node.off(Button.EventType.CLICK, this.onResetClicked, this);
        this.resendEmailButton.node.off(Button.EventType.CLICK, this.onResetClicked, this);
        this.emailEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onCredentialsChanged, this);
    }
}
