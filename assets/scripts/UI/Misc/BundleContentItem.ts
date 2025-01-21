// Copyright 2025 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Sprite, Label} from 'cc';
import { StoreBundleContent } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCatalog';
import { ImageUtils } from 'db://xsolla-commerce-sdk/scripts/common/ImageUtils';
import { UIManager } from '../UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('BundleContentItem')
export class BundleContentItem extends Component {

    @property(Sprite)
    icon: Sprite;

    @property(Label)
    bundleName: Label;

    @property(Label)
    description: Label;

    @property(Label)
    counter: Label;

    init(bundle: StoreBundleContent) {
        ImageUtils.loadImage(bundle.image_url, spriteFrame => {
            if(this.icon != null) {
                this.icon.spriteFrame = spriteFrame;
            }
        }, error => {
            UIManager.instance.showErrorPopup(error);
        });
        this.bundleName.string = bundle.name;
        this.description.string = bundle.description;
        this.counter.string = bundle.quantity.toString();
    }
}