// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { OrderCheckObject } from "./OrderCheckObject";
import { CommerceError } from "../core/Error";

export class OrderTracker {
   
    static createOrderCheckObject(accessToken: string, orderId:number, onSuccess:() => void, onError:(error:CommerceError) => void) {
        let orderCheckObject = new OrderCheckObject();
        orderCheckObject.init(accessToken, orderId, onSuccess, onError);
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