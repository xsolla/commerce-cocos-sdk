// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { CommerceError, handleCommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { OrderContent } from "./XsollaCatalog";

export class XsollaOrderCheckout {

    /**
     * @en
     * Initiates an item purchase session and fetches token for payment console.
     * @zh
     * 
     */
     static fetchPaymentToken(authToken:string, itemSKU:string, quantity:number, currency?:string, country?:string, locale?:string, customParameters?:object, onComplete?:(tokenResult: PaymentTokenResult) => void, onError?:(error:CommerceError) => void): void {
        let body = {
            currency: currency,
            country: country,
            locale: locale,
            sandbox: Xsolla.settings.enableSandbox,
            customParameters: customParameters,
            quantity: quantity
        };

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/payment/item/{itemSKU}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('itemSKU', itemSKU)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, authToken, result => {
            let jsonResult = JSON.parse(result);
            let tokenResult: PaymentTokenResult = {
                token: jsonResult.token,
                orderId: jsonResult.order_id
            };
            onComplete?.(tokenResult);
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

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