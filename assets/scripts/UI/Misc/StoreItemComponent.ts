// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Sprite, Label, assetManager, ImageAsset, SpriteFrame, Texture2D, Button } from 'cc';
import { StoreItem } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCommerce';
import { StoreManager } from '../StoreManager';
const { ccclass, property } = _decorator;
 
@ccclass('StoreItemComponent')
export class StoreItemComponent extends Component {

    @property(Sprite)
    icon: Sprite;

    @property(Node)
    timerContainer: Node;

    @property(Label)
    timerLabel: Label;

    @property(Label)
    itemName: Label;

    @property(Sprite)
    currencyIcon: Sprite;

    @property(Label)
    price: Label;

    @property(Label)
    priceWithoutDiscount: Label;

    @property(Button)
    buyBtn: Button;

    @property(Button)
    previewBtn: Button;

    @property(Label)
    purchased: Label;

    private _parent: StoreManager;

    private _data: StoreItem;

    private _isVirtualCurrency: boolean;

    init(data: StoreItem, parent:StoreManager, isItemInInventory: boolean) {
        this._parent = parent;
        this._data = data;
        this.timerContainer.active = data.virtual_item_type == 'non_renewing_subscription';
        let isItemPurchased = data.virtual_item_type == 'non_consumable' && isItemInInventory;
        let isBundle = data.bundle_type && data.bundle_type.length > 0;
        this.buyBtn.node.active = !isItemPurchased && !isBundle;
        this.purchased.node.active = isItemPurchased;
        this.previewBtn.node.active = isBundle;
        this._isVirtualCurrency = data.virtual_prices.length > 0;
        if(data.inventory_options && data.inventory_options.expiration_period) {
            this.timerLabel.string = data.inventory_options.expiration_period.value + data.inventory_options.expiration_period.type;
        }
        this.itemName.string = data.name;
        this.currencyIcon.node.active = this._isVirtualCurrency;
        let price;
        let priceWithoutDiscount;
        if(this._isVirtualCurrency) {
            price =  data.virtual_prices[0].amount.toString();
            priceWithoutDiscount =  data.virtual_prices[0].amount_without_discount.toString();
        } else {
            price = this._parent.formatPrice(parseFloat(data.price.amount), data.price.currency);
            priceWithoutDiscount = this._parent.formatPrice(parseFloat(data.price.amount_without_discount), data.price.currency);
        }

        this.price.string = price;
        this.priceWithoutDiscount.string = priceWithoutDiscount;
        this.priceWithoutDiscount.node.getParent().active = price != priceWithoutDiscount;

        assetManager.loadRemote<ImageAsset>(data.image_url, (err, imageAsset) => {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrame.texture = texture;
            this.icon.spriteFrame = spriteFrame;
        });

        if(this._isVirtualCurrency) {
            assetManager.loadRemote<ImageAsset>(data.virtual_prices[0].image_url, (err, imageAsset) => {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                this.currencyIcon.spriteFrame = spriteFrame;
            });
        }
    }

    onInfoClicked() {
        this._parent.showItemInfo(this._data);
    }

    onBuyClicked() {
        this._parent.buyItem(this._data);
    }
}
