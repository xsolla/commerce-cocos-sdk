// Copyright 2021 Xsolla Inc. All Rights Reserved.
import { XsollaHttpError, XsollaHttpUtil, XsollaRequestContentType, XsollaRequestVerb } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla, XsollaAuthenticationType } from "../Xsolla";

export class XsollaCommerce {

    static fetchPaymentToken(authToken:string, itemSKU:string, quantity:number, currency?:string, country?:string, locale?:string, customParameters?:object, onComplete?:(tokenResult: PaymentTokenResult) => void, onError?:(error:CommerceError) => void): void {
        let body = {
            currency: currency,
            country: country,
            locale: locale,
            sandbox: Xsolla.settings.EnableSandbox,
            customParameters: customParameters,
            quantity: quantity
        };

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/payment/item/{itemSKU}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('itemSKU', itemSKU)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, authToken, result => {
            let jsonResult = JSON.parse(result);
            let tokenResult: PaymentTokenResult = {
                token: jsonResult.token,
                orderId: jsonResult.order_id
            };

            onComplete?.(tokenResult);
        }, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    static checkOrder(authToken:string, orderId:number, onComplete?:(checkOrderResult: CheckOrderResult) => void, onError?:(error:CommerceError) => void): void {

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/order/{orderId}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('orderId', orderId.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, authToken, result => {
            let jsonResult = JSON.parse(result);
            let checkOrderResult: CheckOrderResult = {
                orderId: jsonResult.order_id,
                status: jsonResult.status,
                content: jsonResult.content
            };
            onComplete?.(checkOrderResult);
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static buyItemWithVirtualCurrency(authToken:string, itemSKU:string, currencySKU:string, onComplete?:(orderId: number) => void, onError?:(error:CommerceError) => void): void {

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/payment/item/{itemSKU}/virtual/{currencySKU}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('itemSKU', itemSKU.toString())
            .setPathParam('currencySKU', currencySKU.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, authToken, result => {
            let jsonResult = JSON.parse(result);
            let orderId: number  = jsonResult.order_id;
            onComplete?.(orderId);
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static openPaystationWidget(token: string, sandbox: boolean) {
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
            XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS, function (event, data) {
                // PublishPaymentStatusUpdate
            });
    
                XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE, function (event, data) {
                if (data === undefined) {
                    // PublishPaymentCancel
                }
                else {
                    // PublishPaymentStatusUpdate
                }
            });
    
            XPayStationWidget.init(options);
            XPayStationWidget.open();
        }, false);
    
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }

    private static handleError(onError:(error:CommerceError) => void): (requestError:XsollaHttpError) => void {
        return requestError => {
            let commerceError: CommerceError = {
                code: requestError.code,
                description: requestError.description
            };
            onError(commerceError);
        };
    }
}

export interface CommerceError {
    status?: string,
    code: string,
    description: string
}

export interface PaymentTokenResult {
    token: string,
    orderId: number
}

export interface XsollaVirtualCurrencyCalculatedPrice {
    amount: string,
    amount_without_discount: string
}

export interface XsollaVirtualCurrencyPrice {
    sku: string,
    is_default: boolean,
    amount: number,
    amount_without_discount: number,
    image_url: string,
    name: string,
    description: string,
    type: string,
    calculated_price: XsollaVirtualCurrencyCalculatedPrice
}

export interface XsollaPrice {
    amount: string,
    amount_without_discount: string,
    currency: string
}

export interface XsollaOrderItem {
    sku: string,
    quantity: number,
    is_free: string,
    price: XsollaPrice
}

export interface XsollaOrderContent {
    price: XsollaPrice,
    virtual_price: XsollaVirtualCurrencyPrice,
    is_free: string,
    items: Array<XsollaOrderItem>
}

export interface CheckOrderResult {
    orderId: number,
    status: string,
    content: XsollaOrderContent
}