// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MessageScreenManager')
export class MessageScreenManager extends Component {

    @property(Label)
    messageLabel: Label;

    private _onClosed: () => void;

    onOkClicked() {
        this.node.active = false;
        this._onClosed();
    }

    showMessage(message: string, onClosed?: () => void) {
        this.messageLabel.string = message;
        this._onClosed = onClosed;
    }
}