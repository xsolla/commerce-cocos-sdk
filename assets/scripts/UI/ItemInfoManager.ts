// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Sprite, assetManager, ImageAsset, SpriteFrame, Texture2D, instantiate, Button } from 'cc';
import { StoreBundleContent, StoreItem } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCommerce';
import { BundleItemComponent } from './Misc/BundleItemComponent';
import { StoreManager } from './StoreManager';
const { ccclass, property } = _decorator;

@ccclass('ItemInfoManager')
export class ItemInfoManager extends Component {

    @property(Sprite)
    icon: Sprite;

    @property(Label)
    itemName: Label;

    @property(Label)
    description: Label;

    @property(Node)
    bundleContainer: Node;

    @property(Label)
    bundleLabel: Label;

    @property(Node)
    bundleList: Node;

    @property(Sprite)
    currency: Sprite;

    @property(Label)
    price: Label;

    @property(Label)
    priceWithoutDiscount: Label;

    @property(Button)
    buyBtn: Button;

    private _parent: StoreManager;

    private _data: StoreItem;

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.buyBtn.node.on(Button.EventType.CLICK, this.buyItemClicked, this);
    }

    removeListeners () {
        this.buyBtn.node.off(Button.EventType.CLICK, this.buyItemClicked, this);
    }

    init(item:StoreItem, parent:StoreManager, bundleContent?:Array<StoreBundleContent>) {

        this._parent = parent;
        this._data = item;

        assetManager.loadRemote<ImageAsset>(item.image_url, (err, imageAsset) => {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrame.texture = texture;
            this.icon.spriteFrame = spriteFrame;
        });

        this.itemName.string = item.name;
        this.description.string = item.description;
        let isVirtualCurrency = item.virtual_prices.length > 0;
        this.currency.node.active = isVirtualCurrency;
        let price;
        let priceWithoutDiscount;
        if(isVirtualCurrency) {
            price =  item.virtual_prices[0].amount.toString();
            priceWithoutDiscount =  item.virtual_prices[0].amount_without_discount.toString();
        } else {
            price = this._parent.formatPrice(parseFloat(item.price.amount), item.price.currency);
            priceWithoutDiscount = this._parent.formatPrice(parseFloat(item.price.amount_without_discount), item.price.currency);
        }

        this.price.string = price;
        this.priceWithoutDiscount.string = priceWithoutDiscount;
        this.priceWithoutDiscount.node.getParent().active = price != priceWithoutDiscount;

        this.bundleContainer.active = bundleContent != null;

        if(isVirtualCurrency) {
            assetManager.loadRemote<ImageAsset>(item.virtual_prices[0].image_url, (err, imageAsset) => {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                this.currency.spriteFrame = spriteFrame;
            });
        }

        if(bundleContent) {
            this.bundleList.destroyAllChildren();
            this.bundleLabel.string = 'This bundle includes '+ bundleContent.length + ' items:'
            for(let bundle of bundleContent) {
                let bundleItem = instantiate(this._parent.bundleItemPrefab);
                this.bundleList.addChild(bundleItem);
                let bundleItemComponent = bundleItem.getComponent(BundleItemComponent);
                bundleItemComponent.init(bundle);
            }
        }
    }

    buyItemClicked() {
        this._parent.buyItem(this._data);
    }
}