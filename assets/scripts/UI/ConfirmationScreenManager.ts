// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('ConfirmationScreenManager')
export class ConfirmationScreenManager extends Component {

    @property(Label)
    message: Label;

    @property(Label)
    confirmBtnLabel: Label;

    private _onConfirm: () => void;

    private _onCancel: () => void;

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