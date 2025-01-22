// Copyright 2025 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox } from 'cc';
import { UserAttributesManager } from './UserAttributesManager';
const { ccclass, property } = _decorator;

 
@ccclass('AddUserAttributeManager')
export class AddUserAttributeManager extends Component {

    @property(Button)
    cancelButton: Button;

    @property(Button)
    closeButton: Button;

    @property(Button)
    addButton: Button;

    @property(EditBox)
    keyEditBox: EditBox;

    @property(EditBox)
    valueEditBox: EditBox;

    private _parent: UserAttributesManager;

    onEnable() {
        this.addListeners();
        this.addButton.interactable = false;
        this.keyEditBox.string = '';
        this.valueEditBox.string = '';
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.cancelButton.node.on(Button.EventType.CLICK, this.onCancelClicked, this);
        this.closeButton.node.on(Button.EventType.CLICK, this.onCancelClicked, this);
        this.addButton.node.on(Button.EventType.CLICK, this.onAddClicked, this);
        this.keyEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
        this.valueEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
    }

    removeListeners () {
        this.cancelButton.node.off(Button.EventType.CLICK, this.onCancelClicked, this);
        this.closeButton.node.off(Button.EventType.CLICK, this.onCancelClicked, this);
        this.addButton.node.off(Button.EventType.CLICK, this.onAddClicked, this);
        this.keyEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
        this.valueEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
    }

    init(parent: UserAttributesManager) {
        this._parent = parent;
    }

    onCancelClicked() {
        this._parent.onCancelClicked();
    }

    onAddClicked() {
        this._parent.addAttribute(this.keyEditBox.string, this.valueEditBox.string);
    }

    onAttributeDataChanged() {
        this.addButton.interactable = this.keyEditBox.string.length > 0 && this.valueEditBox.string.length > 0;
    }
}