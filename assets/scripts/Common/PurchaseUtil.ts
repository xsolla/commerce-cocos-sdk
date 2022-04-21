// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { StoreItem, VirtualCurrencyPackage, XsollaCatalog } from "db://xsolla-commerce-sdk/scripts/api/XsollaCatalog";
import { OrderTracker, XsollaOrderStatus, } from "db://xsolla-commerce-sdk/scripts/common/OrderTracker";
import { OrderCheckObject } from "db://xsolla-commerce-sdk/scripts/common/OrderCheckObject";
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UIManager } from "../UI/UIManager";
import { BrowserUtil } from "db://xsolla-commerce-sdk/scripts/common/BrowserUtil";

export class PurchaseUtil {

    private static _cachedOrderCheckObjects: Array<OrderCheckObject> = [];

    static buyItem(item: StoreItem | VirtualCurrencyPackage, onSuccessPurchase?: () => void) {
        let isVirtual = item.virtual_prices.length > 0;
        if (isVirtual) {
            UIManager.instance.showConfirmationPopup('Are you sure you want to purchase this item?', 'CONFIRM', () => {
                UIManager.instance.showLoaderPopup(true);
                XsollaCatalog.purchaseItemForVirtualCurrency(TokenStorage.getToken().access_token, item.sku, item.virtual_prices[0].sku, orderId => {
                    UIManager.instance.showLoaderPopup(false);
                    UIManager.instance.showMessagePopup('Your order has been successfully processed!');
                    onSuccessPurchase?.();
                }, error => {
                    UIManager.instance.showLoaderPopup(false);
                    console.log(error.description);
                    UIManager.instance.showErrorPopup(error.description);
                })
            });
        }
        else {
            UIManager.instance.showLoaderPopup(true);
            XsollaCatalog.fetchPaymentToken(TokenStorage.getToken().access_token, item.sku, 1, undefined, undefined, undefined, undefined, result => {
                UIManager.instance.showLoaderPopup(false);
                this.checkPendingOrder(result.orderId, () => {
                    onSuccessPurchase?.();
                });
                BrowserUtil.openPurchaseUI(result.token);
            }, error => {
                UIManager.instance.showLoaderPopup(false);
                console.log(error.description);
                UIManager.instance.showErrorPopup(error.description);
            });
        }
    }

    static checkPendingOrder(orderId: number, onSuccess: () => void) {
        let orderCheckObject = OrderTracker.createOrderCheckObject(orderId, (resultOrderId, orderStatus) => {
            if (orderStatus == XsollaOrderStatus.done) {
                UIManager.instance.showMessagePopup('success purchase!');
                onSuccess();
                this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
                orderCheckObject.destroy();
            }
        }, errorMessage => {
            OrderTracker.shortPollingCheckOrder(orderId, () => {
                UIManager.instance.showMessagePopup('success purchase!');
                onSuccess();
            });
            this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        }, () => {
            OrderTracker.shortPollingCheckOrder(orderId, () => {
                UIManager.instance.showMessagePopup('success purchase!');
                onSuccess();
            });
            this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        });

        this._cachedOrderCheckObjects.push(orderCheckObject);
    }
}