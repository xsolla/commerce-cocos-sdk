// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { CommerceError, handleCommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { OrderContent } from "./XsollaCatalog";

export class XsollaOrders {

    /**
     * @en
     * Checks pending order status by its ID.
     * @zh
     * 
     */
    static checkOrder(authToken:string, orderId:number, onComplete?:(checkOrderResult: CheckOrderResult) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/order/{orderId}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('orderId', orderId.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let jsonResult = JSON.parse(result);
            let checkOrderResult: CheckOrderResult = {
                orderId: jsonResult.order_id,
                status: jsonResult.status,
                content: jsonResult.content
            };
            onComplete?.(checkOrderResult);
        }, handleCommerceError(onError));
        request.send();
    }
}

export interface CheckOrderResult {
    orderId: number,
    status: string,
    content: OrderContent
}

export interface PaymentTokenResult {
    token: string,
    orderId: number
}