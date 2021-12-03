// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { sys } from "cc";
import { XsollaStore } from "db://xsolla-commerce-sdk/scripts/api/XsollaStore";
import { UIManager } from "../UIManager";
import { PurchaseUtil } from "./PurchaseUtil";

export class OrderTracker {

    
    static shortPollingCheckOrder(orderId: number, token: string,  onSuccessPurchase?:() => void) {
        XsollaStore.checkOrder(token, orderId, result => {
            console.log('shortPollingCheckOrder ' + result.status);
            if(result.status == 'done') {
                if(!sys.isMobile) {
                    PurchaseUtil.сlosePaystationWidget();
                }
                UIManager.instance.openMessageScreen('success purchase!');
                onSuccessPurchase?.();
                return;
            }

            if(sys.isMobile || PurchaseUtil.bIsPaymentWidgetOpened) {
                if(result.status == 'new' || result.status == 'paid') {
                    setTimeout(result => {
                        this.shortPollingCheckOrder(orderId, token, onSuccessPurchase);
                    }, 3000);
                }
            }
        })
    }
}