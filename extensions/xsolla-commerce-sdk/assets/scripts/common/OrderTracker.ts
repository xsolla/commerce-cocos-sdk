// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { OrderCheckObject } from "./OrderCheckObject";
import { CommerceError } from "../core/Error";
import { sys } from "cc";

export class OrderTracker {
   
    private static _cachedOrderCheckObjects: Array<OrderCheckObject> = [];

    static createOrderCheckObject(accessToken: string, orderId:number, onSuccess:() => void, onError:(error:CommerceError) => void) {
        let orderCheckObject = new OrderCheckObject();
        orderCheckObject.init(accessToken, orderId, !sys.isMobile, onSuccess, onError);
        return orderCheckObject;
    }

    static checkPendingOrder(accessToken: string, orderId: number, onSuccess: () => void, onError: (error: CommerceError) => void) {
        let orderCheckObject = OrderTracker.createOrderCheckObject(accessToken, orderId, () => {
            onSuccess();
            OrderTracker._cachedOrderCheckObjects = OrderTracker._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        }, error => {
            onError(error);
            OrderTracker._cachedOrderCheckObjects = OrderTracker._cachedOrderCheckObjects.filter(obj => obj !== orderCheckObject);
            orderCheckObject.destroy();
        });
        OrderTracker._cachedOrderCheckObjects.push(orderCheckObject);
    }
}

export enum XsollaOrderStatus {
    unknown = 0,
	new = 1,
	paid = 2,
	done = 3,
	canceled = 4
}