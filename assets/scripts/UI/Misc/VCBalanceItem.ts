// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Sprite, Button, Label, UITransform } from 'cc';
import { VirtualCurrencyBalance } from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { StoreManager } from '../Screens/StoreManager';
import { ImageUtils } from '../Utils/ImageUtils';
const { ccclass, property } = _decorator;
 
@ccclass('VCBalanceItem')
export class VCBalanceItem extends Component {

    @property(Sprite)
    currencyIcon: Sprite;

    @property(Label)
    value: Label;

    @property(Button)
    btn: Button;

    private _parent: StoreManager;

    private _data: VirtualCurrencyBalance;

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.btn.node.on(Button.EventType.CLICK, this.onClicked, this);
    }

    removeListeners () {
        this.btn.node.off(Button.EventType.CLICK, this.onClicked, this);
    }

    init(data: VirtualCurrencyBalance, parent:StoreManager) {
        this._data = data;
        this._parent = parent;
        this.value.string = data.amount.toString();
        ImageUtils.loadImage(data.image_url, spriteFrame => {
            if(this.currencyIcon != null) {
                this.currencyIcon.spriteFrame = spriteFrame;
                this.currencyIcon.getComponent(UITransform).setContentSize(13, 13); 
            }
        });
    }

    onClicked() {
        this._parent.changeState(true);
    }
}