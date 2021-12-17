// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Label, Button } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('ErrorPopup')
export class ErrorPopup extends Component {

    @property(Label)
    errorDescriptionLabel: Label;

    @property(Button)
    tryAgainBtn: Button;

    private _onClosed: () => void;

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.tryAgainBtn.node.on(Button.EventType.CLICK, this.onTryAgainClicked, this);
    }

    removeListeners () {
        this.tryAgainBtn.node.off(Button.EventType.CLICK, this.onTryAgainClicked, this);
    }

    onTryAgainClicked() {
        this.node.active = false;
        this._onClosed();
    }

    showError(errorMessage: string, onClosed?: () => void) {
        this.errorDescriptionLabel.string = errorMessage;
        this._onClosed = onClosed;
    }
}
