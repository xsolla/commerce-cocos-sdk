// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { sys } from "cc";
import { StoreItem, XsollaStore } from "db://xsolla-commerce-sdk/scripts/api/XsollaStore";
import { XsollaUrlBuilder } from "db://xsolla-commerce-sdk/scripts/core/XsollaUrlBuilder";
import { Xsolla } from "db://xsolla-commerce-sdk/scripts/Xsolla";
import { TokenStorage } from "../../Common/TokenStorage";
import { UIManager } from "../UIManager";
import { OrderTracker } from "./OrderTracker";

export class PurchaseUtil {

    static bIsPaymentWidgetOpened:boolean = false;

    static buyItem(item: StoreItem, onSuccessPurchase?:() => void) {
        let isVirtual = item.virtual_prices.length > 0;
        if(isVirtual) {
            UIManager.instance.openConfirmationScreen('Are you sure you want to purchase this item?', 'CONFIRM', () => {
                XsollaStore.buyItemWithVirtualCurrency(TokenStorage.getToken().access_token, item.sku, item.virtual_prices[0].sku, orderId => {
                    UIManager.instance.openMessageScreen('Your order has been successfully processed!');
                    onSuccessPurchase?.();
                }, error => {
                    console.log(error.description);
                    UIManager.instance.openErrorScreen(error.description);
                })
            });
            return;
        }

        XsollaStore.fetchPaymentToken(TokenStorage.getToken().access_token, item.sku, 1, undefined, undefined, undefined, undefined, result => {
            if(sys.isMobile) {
                let url: XsollaUrlBuilder;
                if(Xsolla.settings.enableSandbox) {
                    url = new XsollaUrlBuilder('https://sandbox-secure.xsolla.com/paystation3');
                } else {
                    url = new XsollaUrlBuilder('https://secure.xsolla.com/paystation3');
                }
                url.addStringParam('access_token', result.token);
                OrderTracker.shortPollingCheckOrder(result.orderId, result.token, onSuccessPurchase);
                sys.openURL(url.build());
            } else {
                this.bIsPaymentWidgetOpened = true;
                this.openPaystationWidget(result.orderId, result.token, Xsolla.settings.enableSandbox, () => {
                    OrderTracker.shortPollingCheckOrder(result.orderId, result.token, onSuccessPurchase);
                }, () => {
                    this.bIsPaymentWidgetOpened = false;
                });
            }
        } );
    }

    static openPaystationWidget(orderId: number, token: string, sandbox: boolean, onComplete?:() => void, onClosed?:() => void) {
        console.log('openPaystationWidget opened');
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
    
        let statusChangedFunction = function (event, data) {
            console.log('openPaystationWidget status changed');
            onComplete();
        };

        let closeWidgetFunction = function (event, data) {
                console.log('unbind');
                s.removeEventListener('load', loadFunction, false);
                XPayStationWidget.off(XPayStationWidget.eventTypes.STATUS, statusChangedFunction);
                XPayStationWidget.off(XPayStationWidget.eventTypes.CLOSE, closeWidgetFunction);
                onClosed();
        };

        let loadFunction = function (e) {
            console.log('bind');
            XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS, statusChangedFunction);
            XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE, closeWidgetFunction);
    
            XPayStationWidget.init(options);
            XPayStationWidget.open();
        };

        s.addEventListener('load', loadFunction, false);
    
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }

    static сlosePaystationWidget() {
		if (typeof XPayStationWidget !== undefined) {
			XPayStationWidget.off();
		}

		var elements = document.getElementsByClassName('xpaystation-widget-lightbox');
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
	}
}