// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Event, Button } from 'cc';
import { UserAttribute, XsollaLogin } from '../../../../extensions/xsolla-commerce-sdk/assets/scripts/api/XsollaLogin';
import { TokenStorage } from '../../Common/TokenStorage';
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

    start() {
        
    }

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    init(data: UserAttribute) {
        this.attributeKey.string = data.key;
        this.attributeValue.string = data.value;
    }

    onRemoveClicked() {
        XsollaLogin.removeUserAttributes(TokenStorage.token.access_token, [this.attributeKey.string], () => {
            this.node.parent.removeChild(this.node);
        }, err => {
            console.log(err);
        });
    }

    addListeners () {
        this.removeButton.node.on(Button.EventType.CLICK, this.onRemoveClicked, this);
    }

    removeListeners () {
        this.removeButton.node.off(Button.EventType.CLICK, this.onRemoveClicked, this);
    }
}
