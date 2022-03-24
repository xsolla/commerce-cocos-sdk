// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { OrderCheckObject } from "./OrderCheckObject";
import { XsollaOrders } from "../api/XsollaOrders";
import { Xsolla } from "../Xsolla";
import { TokenStorage } from "./TokenStorage";
import { UrlBuilder } from "../core/UrlBuilder";

export class OrderTracker {
    static shortPollingCheckOrder(orderId: number, onSuccessPurchase:() => void) {
        XsollaOrders.checkOrder(TokenStorage.getToken().access_token, orderId, result => {
            console.log('shortPollingCheckOrder ' + result.status);
            if(result.status == 'done') {
                onSuccessPurchase();
                return;
            }

            if(result.status == 'new' || result.status == 'paid') {
                setTimeout(result => {
                    this.shortPollingCheckOrder(orderId, onSuccessPurchase);
                }, 3000);
            }
        })
    }

    static createOrderCheckObject(orderId:number, onStatusReceived:(orderId:string, orderStatus:XsollaOrderStatus) => void, onError:(errorMessage:string) => void, onTimeout:() => void,
    socketLifeTime:number = 300) {
        let url = new UrlBuilder('wss://store-ws.xsolla.com/sub/order/status')
            .addStringParam('order_id', orderId.toString())
            .addStringParam('project_id', Xsolla.settings.projectId)
            .build();

        let orderCheckObject = new OrderCheckObject();
        orderCheckObject.init(url, onStatusReceived, onError, onTimeout, socketLifeTime);
        return orderCheckObject;
    }
}

export enum XsollaOrderStatus {
    unknown = 0,
	new = 1,
	paid = 2,
	done = 3,
	canceled = 4
}