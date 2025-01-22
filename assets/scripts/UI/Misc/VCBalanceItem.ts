// Copyright 2025 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Sprite, Button, Label, UITransform } from 'cc';
import { VirtualCurrencyBalance } from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { ImageUtils } from 'db://xsolla-commerce-sdk/scripts/common/ImageUtils';
import { UIManager } from '../UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('VCBalanceItem')
export class VCBalanceItem extends Component {

    @property(Sprite)
    currencyIcon: Sprite;

    @property(Label)
    value: Label;

    @property(Button)
    btn: Button;

    private _data: VirtualCurrencyBalance;

    static CURRENCY_CLICK: string = 'currencyClick';

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

    init(data: VirtualCurrencyBalance) {
        this._data = data;
        this.value.string = data.amount.toString();
        ImageUtils.loadImage(data.image_url, spriteFrame => {
            if(this.currencyIcon != null) {
                this.currencyIcon.spriteFrame = spriteFrame;
                this.currencyIcon.getComponent(UITransform).setContentSize(13, 13); 
            }
        }, error => {
            UIManager.instance.showErrorPopup(error);
        });
    }

    onClicked() {
        this.node.emit(VCBalanceItem.CURRENCY_CLICK);
    }
}