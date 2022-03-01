// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { sys } from "cc";
import { StoreItem, VirtualCurrencyPackage, XsollaCatalog } from "db://xsolla-commerce-sdk/scripts/api/XsollaCatalog";
import { UrlBuilder } from "db://xsolla-commerce-sdk/scripts/core/UrlBuilder";
import { Xsolla } from "db://xsolla-commerce-sdk/scripts/Xsolla";
import { UIManager } from "../UI/UIManager";
import { OrderTracker, XsollaOrderStatus } from "./OrderTracker";
import { TokenStorage } from "./TokenStorage";
import { OrderCheckObject } from "./OrderCheckObject";

export class PurchaseUtil {

    private static _cachedOrderCheckObjects: Array<OrderCheckObject> = [];

    static bIsSuccessPurchase:boolean = false;

    static buyItem(item: StoreItem | VirtualCurrencyPackage, onSuccessPurchase?:() => void) {
        let isVirtual = item.virtual_prices.length > 0;
        if(isVirtual) {
            UIManager.instance.showConfirmationPopup('Are you sure you want to purchase this item?', 'CONFIRM', () => {
                UIManager.instance.showLoaderPopup(true);
                XsollaCatalog.buyItemWithVirtualCurrency(TokenStorage.getToken().access_token, item.sku, item.virtual_prices[0].sku, orderId => {
                    UIManager.instance.showLoaderPopup(false);
                    UIManager.instance.showMessagePopup('Your order has been successfully processed!');
                    onSuccessPurchase?.();
                }, error => {
                    UIManager.instance.showLoaderPopup(false);
                    console.log(error.description);
                    UIManager.instance.showErrorPopup(error.description);
                })
            });
            return;
        }

        UIManager.instance.showLoaderPopup(true);
        XsollaCatalog.fetchPaymentToken(TokenStorage.getToken().access_token, item.sku, 1, undefined, undefined, undefined, undefined, result => {
            UIManager.instance.showLoaderPopup(false);
            if(sys.isMobile) {
                let url: UrlBuilder;
                if(Xsolla.settings.enableSandbox) {
                    url = new UrlBuilder('https://sandbox-secure.xsolla.com/paystation3');
                } else {
                    url = new UrlBuilder('https://secure.xsolla.com/paystation3');
                }
                url.addStringParam('access_token', result.token);

                this.checkPendingOrder(result.orderId, () => {
                    onSuccessPurchase?.();
                });
                sys.openURL(url.build());
            } else {
                this.openPaystationWidget(result.orderId, result.token, Xsolla.settings.enableSandbox, () => {
                    this.checkPendingOrder(result.orderId, () => {
                        onSuccessPurchase?.();
                        this.сlosePaystationWidget();
                    });
                }, () => {
                    this.сlosePaystationWidget();
                });
            }
        }, error => {
            UIManager.instance.showLoaderPopup(false);
            console.log(error.description);
            UIManager.instance.showErrorPopup(error.description);
        } );
    }

    static checkPendingOrder(orderId:number, onSuccess:() => void) {
        let orderCheckObject = OrderTracker.createOrderCheckObject(orderId, (resultOrderId, orderStatus) => {
            if(orderStatus == XsollaOrderStatus.done) {
                UIManager.instance.showMessagePopup('success purchase!');
                onSuccess();
                this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
                orderCheckObject.destroy();
            }
        }, errorMessage => {
            OrderTracker.shortPollingCheckOrder(orderId, onSuccess);
            this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        }, () => {
            OrderTracker.shortPollingCheckOrder(orderId, onSuccess);
            this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        });

        this._cachedOrderCheckObjects.push(orderCheckObject);
    }

    static openPaystationWidget(orderId: number, token: string, sandbox: boolean, onComplete?:() => void, onClosed?:() => void) {
        console.log('openPaystationWidget opened');
        PurchaseUtil.bIsSuccessPurchase = false;
        var jsToken = token;
        var isSandbox = sandbox;
        var options = {
            access_token: jsToken,
            sandbox: isSandbox,
            lightbox: {
                width: '740px',
                height: '760px',
                spinner: 'round',
                spinnerColor: '#cccccc',
            }
        };
        
        var s = document.createElement('script');
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://static.xsolla.com/embed/paystation/1.2.3/widget.min.js";
    
        s.addEventListener('load', function (e) {
            console.log('openPaystationWidget load event');
            XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS, function (event, data) {
                console.log('openPaystationWidget status event');
                if(!PurchaseUtil.bIsSuccessPurchase) {
                    console.log('onComplete');
                    PurchaseUtil.bIsSuccessPurchase = true;
                    onComplete();
                }
            });
    
                XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE, function (event, data) {
                    console.log('openPaystationWidget close event');
                    onClosed();
            });
    
            XPayStationWidget.init(options);
            XPayStationWidget.open();
        }, false);
    
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }

    static сlosePaystationWidget() {
        console.log('сlosePaystationWidget');
		if (typeof XPayStationWidget !== undefined) {
			XPayStationWidget.off();
		}

		var elements = document.getElementsByClassName('xpaystation-widget-lightbox');
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
	}
}