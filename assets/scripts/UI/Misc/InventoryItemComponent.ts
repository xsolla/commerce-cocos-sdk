// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Sprite, Label, Button, ImageAsset, SpriteFrame, Texture2D, assetManager, Color } from 'cc';
import { InventoryItem } from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { InventoryManager } from '../Screens/InventoryManager';
const { ccclass, property } = _decorator;

@ccclass('InventoryItemComponent')
export class InventoryItemComponent extends Component {

    @property(Sprite)
    icon: Sprite;

    @property(Node)
    timerContainer: Node;

    @property(Label)
    timerLabel: Label;

    @property(Sprite)
    timerIcon: Sprite;

    @property(Label)
    itemName: Label;

    @property(Node)
    counterContainer: Node;

    @property(Label)
    counterLabel: Label;

    @property(Button)
    btn: Button;

    private _parent: InventoryManager;

    private _data: InventoryItem;

    private _expires_at: number;

    private _redColor: Color = new Color(255, 0, 91);
    private _whiteColor: Color = new Color(255, 255, 255);

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners() {
        this.btn.node.on(Button.EventType.CLICK, this.onClicked, this);
    }

    removeListeners() {
        this.btn.node.off(Button.EventType.CLICK, this.onClicked, this);
    }

    init(data: InventoryItem, parent:InventoryManager, expires_at: number) {
        this._data = data;
        this._parent = parent;
        this._expires_at = expires_at;

        this.itemName.string = data.name;

        let utcNow = InventoryItemComponent.convertDateToUTC(new Date());
        let isExpired = (expires_at * 1000) < utcNow.getTime();
        this.timerIcon.node.active = !isExpired;
        let isNonRenewingSubscription = data.virtual_item_type == 'non_renewing_subscription';
        this.counterContainer.active = !isNonRenewingSubscription;
        this.counterLabel.string = data.quantity.toString();

        this.timerContainer.active = isNonRenewingSubscription;
        if(isNonRenewingSubscription) {
            this.timerLabel.color = isExpired ? this._redColor : this._whiteColor;
            this.timerLabel.string = InventoryItemComponent.expireText(expires_at);
        }
        assetManager.loadRemote<ImageAsset>(data.image_url, (err, imageAsset) => {
            if(imageAsset != null) {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                this.icon.spriteFrame = spriteFrame;
            }
        });
    }

    onClicked() {
        this._parent.showItemInfo(this._data, this._expires_at);
    }

    static expireText(expires_at: number) {
        let utcNow = InventoryItemComponent.convertDateToUTC(new Date());
        let expireDate = InventoryItemComponent.toDate(expires_at);
        let isExpired = (expires_at * 1000) < utcNow.getTime();
        if(isExpired) {
            let diff = InventoryItemComponent.showDiff(expireDate, utcNow);
            return 'Expired ' + diff.days + ' day(s) ago';
        } else {
            let diff = InventoryItemComponent.showDiff(utcNow, expireDate);
            if(diff.months > 0) {
                return diff.months + 'm '+ diff.days +'d remaining';
            } else if(diff.days > 0) {
                return diff.days + 'd ' + diff.hours +'h remaining';
            } else if(diff.hours > 0) {
                return diff.hours + 'h ' + diff.minutes + 'm remaining';
            } else {
                return diff.minutes +' min remaining';
            }
        }
    }

    static showDiff(date1:Date, date2:Date) {

        let diff = date2.getTime() - date1.getTime(); // in milliseconds
        diff = Math.floor(diff/1000); // in seconds

        let days = Math.floor(diff/(24*60*60));
        let months = Math.floor(days/30);
        let leftSec = diff - days * 24*60*60;
        days = days - months * 30;
        let hrs = Math.floor(leftSec/(60*60));
        leftSec = leftSec - hrs * 60*60;
    
        var min = Math.floor(leftSec/(60));
        leftSec = leftSec - min * 60;
       
        return {
            months: months,
            days: days,
            hours: hrs,
            minutes: min,
            seconds: leftSec
        };
    }

    static toDate(seconds: number) {
        var t = new Date(1970, 0, 1);
        t.setUTCSeconds(seconds);
        return t;
    }

    static convertDateToUTC(date:Date) { 
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
}