// Copyright 2025 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Label, Button } from 'cc';
import { UserAttribute } from 'db://xsolla-commerce-sdk/scripts/api/XsollaUserAccount';
import { UserAttributesManager } from '../Screens/UserAttributesManager';

const { ccclass, property } = _decorator;
 
@ccclass('AttributeItem')
export class AttributeItem extends Component {

    @property(Label)
    attributeKey: Label;

    @property(Label)
    attributeValue: Label;

    @property(Button)
    editButton: Button;

    data: UserAttribute;

    private _parent: UserAttributesManager;

    start() {
        
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    init(data: UserAttribute, parent: UserAttributesManager, isUserEditable: boolean) {
        this.attributeKey.string = data.key;
        this.attributeValue.string = data.value;
        this._parent = parent;
        this.data = data;
        this.editButton.node.active = isUserEditable;
    }

    onEditClicked() {
        this._parent.openEditAttributeScreen(this.data);
    }

    addListeners () {
        this.editButton.node.on(Button.EventType.CLICK, this.onEditClicked, this);
    }

    removeListeners () {
        this.editButton.node.off(Button.EventType.CLICK, this.onEditClicked, this);
    }
}
