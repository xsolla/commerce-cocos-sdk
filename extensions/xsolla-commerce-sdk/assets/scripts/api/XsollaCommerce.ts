// Copyright 2021 Xsolla Inc. All Rights Reserved.
import { XsollaHttpError, XsollaHttpUtil, XsollaRequestContentType, XsollaRequestVerb } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla, XsollaAuthenticationType } from "../Xsolla";

export class XsollaCommerce {

    static itemsData: StoreItemsData;

    static virtualCurrencyData: VirtualCurrencyData;

    static virtualCurrencyPackages: VirtualCurrencyPackagesData;

    static updateVirtualItems(locale:string, country:string, additionalFields:Array<string>, onComplete?:() => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, null, result => {
            let jsonResult = JSON.parse(result);
            this.itemsData = jsonResult;
            onComplete?.();
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static getAllItemsList(locale:string, onComplete?:(itemsList: StoreItemsList) => void, onError?:(error:CommerceError) => void): void {

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, null, result => {
            let jsonResult = JSON.parse(result);
            let itemsList: StoreItemsList = jsonResult;
            onComplete?.(itemsList);
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static updateVirtualCurrencies(locale:string, country:string, additionalFields:Array<string>, onComplete?:() => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_currency')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, null, result => {
            let jsonResult = JSON.parse(result);
            this.virtualCurrencyData = jsonResult;
            onComplete?.();
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static updateVirtualCurrencyPackages(locale:string, country:string, additionalFields:Array<string>, onComplete?:() => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_currency/package')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, null, result => {
            let jsonResult = JSON.parse(result);
            this.virtualCurrencyPackages = jsonResult;
            onComplete?.();
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static getItemsListBySpecifiedGroup(externalId: string, locale:string, country:string, additionalFields:Array<string>, onComplete?:(itemsList: StoreItemsList) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_items/group/{externalId}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('externalId', externalId.length != 0 ? externalId: 'all')
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, null, result => {
            let jsonResult = JSON.parse(result);
            let itemsList: StoreItemsList = jsonResult;
            onComplete?.(itemsList);
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static updateItemGroups(locale:string, onComplete?:() => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/groups')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, null, result => {
            let jsonResult = JSON.parse(result);
            if(this.itemsData != null) {
                this.itemsData = {
                    items:[],
                    groupIds:null,
                    groups:[]
                }
            }
            this.itemsData = jsonResult.groups;
            onComplete?.();
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static fetchPaymentToken(authToken:string, itemSKU:string, quantity:number, currency?:string, country?:string, locale?:string, customParameters?:object, onComplete?:(tokenResult: PaymentTokenResult) => void, onError?:(error:CommerceError) => void): void {
        let body = {
            currency: currency,
            country: country,
            locale: locale,
            sandbox: Xsolla.settings.enableSandbox,
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

    private static handleError(onError:(error:CommerceError) => void): (requestError:XsollaHttpError) => void {
        return requestError => {
            let commerceError: CommerceError = {
                code: requestError.errorCode,
                description: requestError.errorMessage,
                status: requestError.statusCode
            };
            onError?.(commerceError);
        };
    }
}

export interface CommerceError {
    status?: number,
    code: number,
    description: string
}

export interface CheckOrderResult {
    orderId: number,
    status: string,
    content: XsollaOrderContent
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

export interface StoreItemMediaList {
    type: string,
    url: string
}

export interface XsollaItemAttributeValue {
    external_id: string,
    value: string
}

export interface XsollaItemAttribute {
    external_id: string,
    name: string,
    values: Array<XsollaItemAttributeValue>
}

export interface StoreBundleContent {
    sku: string,
    name: string,
    type: string,
    description: string,
    image_url: string,
    quantity: number,
    price: XsollaPrice,
    virtual_prices: Array<XsollaVirtualCurrencyPrice>
}

export interface XsollaExpirationPeriod {
    value: number,
    type: string
}

export interface XsollaConsumable {
    usages_count: number
}

export interface XsollaItemOptions {
    consumable: XsollaConsumable,
    expiration_period: XsollaExpirationPeriod
}

export interface XsollaItemGroup {
    //id: number,
    external_id: string
    name: string,
    description: string,
    image_url: string,
    level: number,
    order: number,
    parent_external_id: string,
    children: Array<string>
}

export interface StoreItem {
    sku: string,
    name: string,
    description: string,
    type: string,
    virtual_item_type: string,
    groups: Array<XsollaItemGroup>,
    is_free: boolean,
    price: XsollaPrice,
    virtual_prices: Array<XsollaVirtualCurrencyPrice>,
    image_url: string,
    inventory_options: XsollaItemOptions,
    bundle_type: string,
    total_content_price: XsollaPrice,
    content: Array<StoreBundleContent>,
    attributes: Array<XsollaItemAttribute>,
    long_description: string,
    order: number,
    media_list: Array<StoreItemMediaList>
}

export interface StoreItemsData {
    items: Array<StoreItem>,
    groupIds: Set<string>,
    groups: Array<XsollaItemGroup>
}

export interface StoreItemsList {
    items: Array<StoreItem>
}

export interface VirtualCurrency {
    sku: string,
    name: string,
    groups: Array<string>,
    attributes: Array<XsollaItemAttribute>,
    type: string,
    description: string,
    image_url: string,
    is_free: boolean,
    price: XsollaPrice,
    virtual_prices: Array<XsollaVirtualCurrencyPrice>,
    inventory_options: XsollaItemOptions,
    long_description: string,
    order: number,
    media_list: Array<StoreItemMediaList>
}

export interface VirtualCurrencyData {
    items: VirtualCurrency
}

export interface CurrencyPackageContent {
    sku: string,
    name: string,
    type: string,
    description: string,
    image_url: string,
    quantity: number,
    inventory_options: XsollaItemOptions
}

export interface VirtualCurrencyPackage {
    sku: string,
    name: string,
    type: string,
    description: string,
    image_url: string,
    attributes: Array<XsollaItemAttribute>,
    groups: Array<XsollaItemGroup>,
    bundle_type: string,
    is_free: boolean,
    price: XsollaPrice,
    virtual_prices: Array<XsollaVirtualCurrencyPrice>,
    content: CurrencyPackageContent,
    long_description: string,
    order: number,
    media_list: Array<StoreItemMediaList>
}

export interface VirtualCurrencyPackagesData {
    items: VirtualCurrencyPackage
}