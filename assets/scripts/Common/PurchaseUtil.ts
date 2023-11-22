// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { StoreItem, VirtualCurrencyPackage, XsollaCatalog } from "db://xsolla-commerce-sdk/scripts/api/XsollaCatalog";
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UIManager } from "../UI/UIManager";
import { OrderTracker } from "db://xsolla-commerce-sdk/scripts/common/OrderTracker";
import { XsollaPayments } from "db://xsolla-commerce-sdk/scripts/api/XsollaPayments";

export class PurchaseUtil {

    static buyItem(item: StoreItem | VirtualCurrencyPackage, onSuccessPurchase?: () => void) {
        let isVirtual = item.virtual_prices.length > 0;
        let isFree = !isVirtual && item.price == null;
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
        else if (!isFree) {
            UIManager.instance.showLoaderPopup(true);
            XsollaCatalog.fetchPaymentToken(TokenStorage.getToken().access_token, item.sku, 1, undefined, undefined, undefined, undefined, undefined, result => {
                UIManager.instance.showLoaderPopup(false);
                OrderTracker.checkPendingOrder(result.token, result.orderId, () => {
                    UIManager.instance.showMessagePopup('success purchase!');
                    onSuccessPurchase?.();
                }, error => {
                    UIManager.instance.showMessagePopup(`Order checking failed - Status code: ${error.status}, Error code: ${error.code}, Error message: ${error.description}`);
                    console.log(error.description);
                });
                XsollaPayments.openPurchaseUI(result.token);
            }, error => {
                UIManager.instance.showLoaderPopup(false);
                console.log(error.description);
                UIManager.instance.showErrorPopup(error.description);
            });
        }
        else{
            UIManager.instance.showLoaderPopup(true);
            XsollaCatalog.createOrderWithSpecifiedFreeItem(TokenStorage.getToken().access_token, item.sku, 1, undefined, undefined, undefined, result => {
                UIManager.instance.showLoaderPopup(false);
                UIManager.instance.showMessagePopup('success purchase!');
                onSuccessPurchase?.();
            }, error => {
                UIManager.instance.showLoaderPopup(false);
                console.log(error.description);
                UIManager.instance.showErrorPopup(error.description);
            });
        }
    }
}