// Copyright 2025 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox, Label } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('UserAccountItem')
export class UserAccountItem extends Component {
    
    @property(Button)
    editButton: Button;

    @property(Label)
    titleLabel: Label;

    @property(Label)
    valueLabel: Label;

    @property(EditBox)
    valueEditBox: EditBox;

    static ITEM_EDIT: string = 'itemEdit';

    start() {

    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onEditClicked() {
        this.editButton.node.active = false;
        this.titleLabel.node.active = false;
        this.valueLabel.node.active = false;
        this.valueEditBox.node.active = true;
        this.valueEditBox.setFocus();
    }

    onValueEdited() {
        if (this.valueEditBox.string != this.valueLabel.string) {
            this.node.emit(UserAccountItem.ITEM_EDIT, this.valueEditBox.string);
        }

        this.editButton.node.active = true;
        this.titleLabel.node.active = true;
        this.valueLabel.node.active = true;
        this.valueEditBox.node.active = false;
    }

    setValue(value: string) {
        this.valueLabel.string = value;
        if (this.valueEditBox != null && value != null) {
            this.valueEditBox.string = value;
        }
    }

    addListeners () {
        this.editButton?.node.on(Button.EventType.CLICK, this.onEditClicked, this);
        this.valueEditBox?.node.on(EditBox.EventType.EDITING_DID_ENDED, this.onValueEdited, this);
    }

    removeListeners () {
        this.editButton?.node.off(Button.EventType.CLICK, this.onEditClicked, this);    
        this.valueEditBox?.node.off(EditBox.EventType.EDITING_DID_ENDED, this.onValueEdited, this);
    }
}