// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, EditBox } from 'cc';
import { UserAttribute } from 'db://xsolla-commerce-sdk/scripts/api/XsollaUserAccount';
import { UserAttributesManager } from './UserAttributesManager';
const { ccclass, property } = _decorator;

 
@ccclass('EditUserAttributeManager')
export class EditUserAttributeManager extends Component {

    @property(Button)
    cancelButton: Button;

    @property(Button)
    closeButton: Button;

    @property(Button)
    saveButton: Button;

    @property(Button)
    removeButton: Button;

    @property(EditBox)
    keyEditBox: EditBox;

    @property(EditBox)
    valueEditBox: EditBox;

    private _parent: UserAttributesManager;

    private _data: UserAttribute;

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.cancelButton.node.on(Button.EventType.CLICK, this.onCancelClicked, this);
        this.closeButton.node.on(Button.EventType.CLICK, this.onCancelClicked, this);
        this.saveButton.node.on(Button.EventType.CLICK, this.onSaveClicked, this);
        this.removeButton.node.on(Button.EventType.CLICK, this.onRemoveClicked, this);
        this.keyEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
        this.valueEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
    }

    removeListeners () {
        this.cancelButton.node.off(Button.EventType.CLICK, this.onCancelClicked, this);
        this.closeButton.node.off(Button.EventType.CLICK, this.onCancelClicked, this);
        this.saveButton.node.off(Button.EventType.CLICK, this.onSaveClicked, this);
        this.removeButton.node.off(Button.EventType.CLICK, this.onRemoveClicked, this);
        this.keyEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
        this.valueEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.onAttributeDataChanged, this);
    }

    init(parent: UserAttributesManager, data: UserAttribute) {
        this._parent = parent;
        this._data = data;
        this.keyEditBox.string = data.key;
        this.valueEditBox.string = data.value;
        this.saveButton.interactable = false;
    }

    onCancelClicked() {
        this._parent.onCancelClicked();
    }

    onSaveClicked() {
        this._parent.editAttribute(this._data, this.keyEditBox.string, this.valueEditBox.string);
    }

    onRemoveClicked() {
        this._parent.removeAttribute(this._data.key);
    }

    onAttributeDataChanged() {
        this.saveButton.interactable = this.keyEditBox.string != this._data.key || this.valueEditBox.string != this._data.value;
    }
}