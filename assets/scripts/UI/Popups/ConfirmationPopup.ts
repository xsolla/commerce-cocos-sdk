// Copyright 2025 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Label, Button } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('ConfirmationPopup')
export class ConfirmationPopup extends Component {

    @property(Label)
    message: Label;

    @property(Label)
    confirmBtnLabel: Label;

    @property(Button)
    confirmBtn: Button;

    @property(Button)
    cancelBtn: Button;

    private _onConfirm: () => void;

    private _onCancel: () => void;

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.confirmBtn.node.on(Button.EventType.CLICK, this.onConfirmClicked, this);
        this.cancelBtn.node.on(Button.EventType.CLICK, this.onCancelClicked, this);
    }

    removeListeners () {
        this.confirmBtn.node.off(Button.EventType.CLICK, this.onConfirmClicked, this);
        this.cancelBtn.node.off(Button.EventType.CLICK, this.onCancelClicked, this);
    }

    showMessage(message: string, confirmBtnText: string,  onComfirm?: () => void, onClosed?: () => void) {
        this.message.string = message;
        this.confirmBtnLabel.string = confirmBtnText;
        this._onConfirm = onComfirm;
        this._onCancel = onClosed;
    }

    onConfirmClicked() {
        if(this._onConfirm) {
            this._onConfirm();
        }
    }

    onCancelClicked() {
        if(this._onCancel) {
            this._onCancel();
        }
    }
}