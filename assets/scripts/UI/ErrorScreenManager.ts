// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('ErrorScreenManager')
export class ErrorScreenManager extends Component {

    @property(Button)
    tryAgainButton: Button;

    @property(Label)
    errorDescriptionLabel: Label;

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onTryAgainClicked() {
        this.node.active = false;
    }

    addListeners() {
        this.tryAgainButton.node.on('click', this.onTryAgainClicked, this);
    }

    removeListeners() {
        this.tryAgainButton.node.off('click', this.onTryAgainClicked, this);
    }

    showError(errorMessage: string, onClosed?: () => void) {
        this.node.active = true;
        this.errorDescriptionLabel.string = errorMessage;
        onClosed?.();
    }
}
