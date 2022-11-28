// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { StoreItem, VirtualCurrencyPackage, XsollaCatalog } from "db://xsolla-commerce-sdk/scripts/api/XsollaCatalog";
import { OrderCheckObject } from "db://xsolla-commerce-sdk/scripts/common/OrderCheckObject";
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UIManager } from "../UI/UIManager";
import { BrowserUtil } from "db://xsolla-commerce-sdk/scripts/common/BrowserUtil";
import { CommerceError } from "db://xsolla-commerce-sdk/scripts/core/Error";
import { OrderTracker } from "db://xsolla-commerce-sdk/scripts/common/OrderTracker";

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
                this.checkPendingOrder(result.token, result.orderId, () => {
                    onSuccessPurchase?.();
                }, error => {
                    console.log(error.description);
                });
                BrowserUtil.openPurchaseUI(result.token);
            }, error => {
                UIManager.instance.showLoaderPopup(false);
                console.log(error.description);
                UIManager.instance.showErrorPopup(error.description);
            });
        }
    }

    static checkPendingOrder(accessToken: string, orderId: number, onSuccess: () => void, onError: (error: CommerceError) => void) {
        let orderCheckObject = OrderTracker.createOrderCheckObject(accessToken, orderId, () => {
            UIManager.instance.showMessagePopup('success purchase!');
            onSuccess();
            this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        }, error => {
            UIManager.instance.showMessagePopup(`Order checking failed - Status code: ${error.status}, Error code: ${error.code}, Error message: ${error.description}`);
            onError(error);
            this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        });
        this._cachedOrderCheckObjects.push(orderCheckObject);
    }
}