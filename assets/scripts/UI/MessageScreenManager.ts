// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MessageScreenManager')
export class MessageScreenManager extends Component {

    @property(Button)
    okButton: Button;

    @property(Label)
    messageLabel: Label;

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onOkClicked() {
        this.node.active = false;
    }

    addListeners() {
        this.okButton.node.on(Button.EventType.CLICK, this.onOkClicked, this);
    }

    removeListeners() {
        this.okButton.node.off(Button.EventType.CLICK, this.onOkClicked, this);
    }

    showMessage(message: string, onClosed?: () => void) {
        this.messageLabel.string = message;
        onClosed?.();
    }

}