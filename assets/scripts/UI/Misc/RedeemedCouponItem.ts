// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Sprite, Label } from 'cc';
import { RedeemedCouponItem as XsollaRedeemedCouponItem} from 'db://xsolla-commerce-sdk/scripts/api/XsollaStore';
import { ImageUtils } from '../Utils/ImageUtils';
const { ccclass, property } = _decorator;
 
@ccclass('RedeemedCouponItem')
export class RedeemedCouponItem extends Component {

    @property(Sprite)
    icon: Sprite;

    @property(Label)
    itemName: Label;

    @property(Label)
    description: Label;

    @property(Label)
    counter: Label;

    init(bundle: XsollaRedeemedCouponItem) {
        ImageUtils.loadImage(bundle.image_url, spriteFrame => {
            if(this.icon != null) {
                this.icon.spriteFrame = spriteFrame;
            }
        });
        this.itemName.string = bundle.name;
        this.description.string = bundle.description;
        this.counter.string = bundle.quantity.toString();
    }
}