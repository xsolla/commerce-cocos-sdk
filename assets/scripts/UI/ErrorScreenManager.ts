// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('ErrorScreenManager')
export class ErrorScreenManager extends Component {

    @property(Label)
    errorDescriptionLabel: Label;

    private _onClosed: () => void;

    onTryAgainClicked() {
        this.node.active = false;
        this._onClosed();
    }

    showError(errorMessage: string, onClosed?: () => void) {
        this.errorDescriptionLabel.string = errorMessage;
        this._onClosed = onClosed;
    }
}
