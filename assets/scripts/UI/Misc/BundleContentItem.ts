// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Sprite, Label, assetManager, ImageAsset, SpriteFrame, Texture2D } from 'cc';
import { StoreBundleContent } from 'db://xsolla-commerce-sdk/scripts/api/XsollaStore';
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
        assetManager.loadRemote<ImageAsset>(bundle.image_url, (err, imageAsset) => {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrame.texture = texture;
            this.icon.spriteFrame = spriteFrame;
        });
        this.bundleName.string = bundle.name;
        this.description.string = bundle.description;
        this.counter.string = bundle.quantity.toString();
    }
}