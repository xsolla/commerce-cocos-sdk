// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MessageScreenManager')
export class MessageScreenManager extends Component {

    @property(Label)
    messageLabel: Label;

    @property(Button)
    okBtn: Button;

    private _onClosed: () => void;

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.okBtn.node.on(Button.EventType.CLICK, this.onOkClicked, this);
    }

    removeListeners () {
        this.okBtn.node.off(Button.EventType.CLICK, this.onOkClicked, this);
    }

    onOkClicked() {
        this.node.active = false;
        this._onClosed();
    }

    showMessage(message: string, onClosed?: () => void) {
        this.messageLabel.string = message;
        this._onClosed = onClosed;
    }
}