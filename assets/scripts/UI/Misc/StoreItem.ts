// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Sprite, Label, assetManager, ImageAsset, SpriteFrame, Texture2D, Button, UITransform } from 'cc';
import { StoreItem as XsollaStoreItem } from 'db://xsolla-commerce-sdk/scripts/api/XsollaStore';
import { CurrencyFormatter } from '../../Common/CurrencyFormatter';
import { PurchaseUtil } from '../../Common/PurchaseUtil';
import { StoreManager } from '../Screens/StoreManager';
const { ccclass, property } = _decorator;
 
@ccclass('StoreItem')
export class StoreItem extends Component {

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

    private _data: XsollaStoreItem;

    private _isVirtualCurrency: boolean;

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.buyBtn.node.on(Button.EventType.CLICK, this.onBuyClicked, this);
        this.previewBtn.node.on(Button.EventType.CLICK, this.onInfoClicked, this);
    }

    removeListeners () {
        this.buyBtn.node.off(Button.EventType.CLICK, this.onBuyClicked, this);
        this.previewBtn.node.off(Button.EventType.CLICK, this.onInfoClicked, this);
    }

    init(data: XsollaStoreItem, parent:StoreManager, isItemInInventory: boolean) {
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
            price = CurrencyFormatter.formatPrice(parseFloat(data.price.amount), data.price.currency);
            priceWithoutDiscount = CurrencyFormatter.formatPrice(parseFloat(data.price.amount_without_discount), data.price.currency);
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
                this.currencyIcon.getComponent(UITransform).setContentSize(40, 40); 
            });
        }
    }

    onBuyClicked() {
        PurchaseUtil.buyItem(this._data);
    }

    onInfoClicked() {
        this._parent.showItemInfo(this._data);
    }
}
