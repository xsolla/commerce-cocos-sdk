// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { OrderCheckObject } from "./OrderCheckObject";
import { CommerceError } from "../core/Error";

export class OrderTracker {
   
    private static _cachedOrderCheckObjects: Array<OrderCheckObject> = [];

    static createOrderCheckObject(accessToken: string, orderId:number, onSuccess:() => void, onError:(error:CommerceError) => void) {
        let orderCheckObject = new OrderCheckObject();
        orderCheckObject.init(accessToken, orderId, onSuccess, onError);
        return orderCheckObject;
    }

    static checkPendingOrder(accessToken: string, orderId: number, onSuccess: () => void, onError: (error: CommerceError) => void) {
        let orderCheckObject = OrderTracker.createOrderCheckObject(accessToken, orderId, () => {
            onSuccess();
            this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        }, error => {
            onError(error);
            this._cachedOrderCheckObjects = this._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        });
        this._cachedOrderCheckObjects.push(orderCheckObject);
    }
}

export enum XsollaOrderStatus {
    unknown = 0,
	new = 1,
	paid = 2,
	done = 3,
	canceled = 4
}