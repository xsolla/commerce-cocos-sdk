// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, EditBox, instantiate, Prefab, Label } from 'cc';
import { RedeemedCouponItem as XsollaRedeemedCouponItem, XsollaCatalog } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCatalog';
import { TokenStorage } from '../../Common/TokenStorage';
import { RedeemedCouponItem } from '../Misc/RedeemedCouponItem';
import { UIManager } from '../UIManager';
import { StoreManager } from './StoreManager';
const { ccclass, property } = _decorator;

@ccclass('StoreRedeemCouponManager')
export class StoreRedeemCouponManager extends Component {

    @property(Button)
    closeBtn: Button;

    @property(EditBox)
    couponEditBox: EditBox;

    @property(Button)
    cancelBtn: Button;

    @property(Button)
    redeemBtn: Button;

    @property(Label)
    receivedItemsDescription: Label;

    @property(Node)
    itemsList: Node;

    @property(Prefab)
    itemPrefab: Prefab;

    private _parent: StoreManager;

    onEnable() {
        this.addListeners();
        this.itemsList.destroyAllChildren();
        this.couponEditBox.string = '';
        this.redeemTextChanged();
        this.receivedItemsDescription.node.active = false;
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners() {
        this.closeBtn.node.on(Button.EventType.CLICK, this.closeClicked, this);
        this.cancelBtn.node.on(Button.EventType.CLICK, this.closeClicked, this);
        this.redeemBtn.node.on(Button.EventType.CLICK, this.redeemCouponClicked, this);
        this.couponEditBox.node.on(EditBox.EventType.TEXT_CHANGED, this.redeemTextChanged, this);
    }

    removeListeners() {
        this.closeBtn.node.off(Button.EventType.CLICK, this.closeClicked, this);
        this.cancelBtn.node.off(Button.EventType.CLICK, this.closeClicked, this);
        this.redeemBtn.node.off(Button.EventType.CLICK, this.redeemCouponClicked, this);
        this.couponEditBox.node.off(EditBox.EventType.TEXT_CHANGED, this.redeemTextChanged, this);
    }

    closeClicked() {
        this._parent.openAllItemsScreen();
    }

    redeemTextChanged() {
        this.redeemBtn.enabled = this.couponEditBox.string.length > 0;
    }

    redeemCouponClicked() {
        this.itemsList.destroyAllChildren();
        this.receivedItemsDescription.node.active = false;
        UIManager.instance.showLoaderPopup(true);
        XsollaCatalog.redeemCoupon(TokenStorage.token.access_token, this.couponEditBox.string, (items: Array<XsollaRedeemedCouponItem>) => {
            UIManager.instance.showLoaderPopup(false);
            this.populateItemsList(items);
            this.couponEditBox.string = '';
            this.redeemTextChanged();
        }, error => {
            UIManager.instance.showLoaderPopup(false);
            console.log(error.description);
            UIManager.instance.showErrorPopup(error.description);
        });
    }

    init(parent: StoreManager) {
        this._parent = parent;
    }

    populateItemsList(items: Array<XsollaRedeemedCouponItem>) {
        this.receivedItemsDescription.node.active = true;
        for(let item of items) {
            let instantiatedItem = instantiate(this.itemPrefab);
            this.itemsList.addChild(instantiatedItem);
            instantiatedItem.getComponent(RedeemedCouponItem).init(item);
        }
    }
}