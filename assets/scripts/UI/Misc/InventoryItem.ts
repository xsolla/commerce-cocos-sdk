// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Sprite, Label, Button, Color } from 'cc';
import { InventoryItem as XsollaInventoryItem } from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { InventoryManager } from '../Screens/InventoryManager';
import { ImageUtils } from '../Utils/ImageUtils';
const { ccclass, property } = _decorator;

@ccclass('InventoryItem')
export class InventoryItem extends Component {

    @property(Sprite)
    icon: Sprite;

    @property(Sprite)
    background: Sprite;

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

    private _data: XsollaInventoryItem;

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

    init(data: XsollaInventoryItem, parent:InventoryManager, expires_at: number = 0) {
        if(data == null) {
            this.background.color = new Color(0, 0, 0, 0);
            this.icon.node.active = false;
            this.itemName.node.active = false;
            this.timerContainer.active = false;
            this.counterContainer.active = false;
            return;
        }
        this._data = data;
        this._parent = parent;
        this._expires_at = expires_at;

        this.itemName.string = data.name;

        let utcNow = InventoryItem.convertDateToUTC(new Date());
        let isExpired = (expires_at * 1000) < utcNow.getTime();
        this.timerIcon.node.active = !isExpired;
        let isNonRenewingSubscription = data.virtual_item_type == 'non_renewing_subscription';
        this.counterContainer.active = !isNonRenewingSubscription;
        this.counterLabel.string = data.quantity.toString();

        this.timerContainer.active = isNonRenewingSubscription;
        if(isNonRenewingSubscription) {
            this.timerLabel.color = isExpired ? this._redColor : this._whiteColor;
            this.timerLabel.string = InventoryItem.expireText(expires_at);
        }
        ImageUtils.loadImage(data.image_url, spriteFrame => {
            if(this.icon != null) {
                this.icon.spriteFrame = spriteFrame;
            }
        });
    }

    onClicked() {
        if(this._data != null) {
            this._parent.showItemInfo(this._data, this._expires_at);
        }
    }

    static expireText(expires_at: number) {
        let utcNow = InventoryItem.convertDateToUTC(new Date());
        let expireDate = InventoryItem.toDate(expires_at);
        let isExpired = (expires_at * 1000) < utcNow.getTime();
        if(isExpired) {
            let diff = InventoryItem.showDiff(expireDate, utcNow);
            return 'Expired ' + diff.days + ' day(s) ago';
        } else {
            let diff = InventoryItem.showDiff(utcNow, expireDate);
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