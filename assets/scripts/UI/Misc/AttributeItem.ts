// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Event, Button } from 'cc';
import { UserAttribute } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAttributes';
import { CharacterManager } from '../CharacterManager';
const { ccclass, property } = _decorator;
 
@ccclass('AttributeItem')
export class AttributeItem extends Component {

    @property(Label)
    attributeKey: Label;

    @property(Label)
    attributeValue: Label;

    @property(Button)
    removeButton: Button;

    private _parent: CharacterManager;

    start() {
        
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    init(data: UserAttribute, parent:CharacterManager) {
        this.attributeKey.string = data.key;
        this.attributeValue.string = data.value;
        this._parent = parent;
    }

    onRemoveClicked() {
        this._parent.removeAttribute(this.attributeKey.string, this.node);
    }

    addListeners () {
        this.removeButton.node.on(Button.EventType.CLICK, this.onRemoveClicked, this);
    }

    removeListeners () {
        this.removeButton.node.off(Button.EventType.CLICK, this.onRemoveClicked, this);
    }
}
