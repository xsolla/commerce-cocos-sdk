// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { CommerceError, XsollaError } from "../core/XsollaError";
import { XsollaHttpUtil, XsollaRequestContentType } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla } from "../Xsolla";

export class XsollaStore {

    static getVirtualItems(locale:string, country:string, additionalFields:Array<string>, onComplete?:(itemsData:StoreItemsData) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, null, result => {
            let itemsData:StoreItemsData = JSON.parse(result);
            itemsData.groupIds = new Set<string>();
            for(let item of itemsData.items) {
                for(let itemGroup of item.groups) {                    
                    itemsData.groupIds.add(itemGroup.external_id);
                }
            }
            onComplete?.(itemsData);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }

    static getBundles(locale:string, country:string, additionalFields:Array<string>, onComplete?:(itemsData:StoreListOfBundles) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0) {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/bundle')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, null, result => {
            let bundlesList: StoreListOfBundles = JSON.parse(result);
            onComplete?.(bundlesList);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }

    static getSpecifiedBundle(sku:string, onComplete?:(bundle:StoreBundle) => void, onError?:(error:CommerceError) => void) {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/bundle/sku/{sku}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('sku', sku)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, null, result => {
            let bundle: StoreBundle = JSON.parse(result);
            onComplete?.(bundle);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }

    static getAllItemsList(locale:string, onComplete?:(data: StoreItemsList) => void, onError?:(error:CommerceError) => void): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{ProjectID}/items/virtual_items/all')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, null, result => {
            let itemsList: StoreItemsList = JSON.parse(result);
            onComplete?.(itemsList);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }

    static getVirtualCurrencies(locale:string, country:string, additionalFields:Array<string>, onComplete?:(data:VirtualCurrencyData) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_currency')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, null, result => {
            let virtualCurrencyData: VirtualCurrencyData = JSON.parse(result);
            onComplete?.(virtualCurrencyData);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }

    static getVirtualCurrencyPackages(locale:string, country:string, additionalFields:Array<string>, onComplete?:(data:VirtualCurrencyPackagesData) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_currency/package')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, null, result => {
            let virtualCurrencyPackages: VirtualCurrencyPackagesData = JSON.parse(result);
            onComplete?.(virtualCurrencyPackages);
        }, XsollaError.handleCommerceError(onError));
        request.send();
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

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, null, result => {
            let itemsList: StoreItemsList = JSON.parse(result);
            onComplete?.(itemsList);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }

    static getItemGroups(locale:string, onComplete?:(groups:Array<XsollaItemGroup>) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/groups')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, null, result => {
            let groups: Array<XsollaItemGroup> = JSON.parse(result).groups;
            onComplete?.(groups);
        }, XsollaError.handleCommerceError(onError));
        request.send();
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
        }, XsollaError.handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    static checkOrder(authToken:string, orderId:number, onComplete?:(checkOrderResult: CheckOrderResult) => void, onError?:(error:CommerceError) => void): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/order/{orderId}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('orderId', orderId.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.None, authToken, result => {
            let jsonResult = JSON.parse(result);
            let checkOrderResult: CheckOrderResult = {
                orderId: jsonResult.order_id,
                status: jsonResult.status,
                content: jsonResult.content
            };
            onComplete?.(checkOrderResult);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }

    static buyItemWithVirtualCurrency(authToken:string, itemSKU:string, currencySKU:string, onComplete?:(orderId: number) => void, onError?:(error:CommerceError) => void): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/payment/item/{itemSKU}/virtual/{currencySKU}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('itemSKU', itemSKU.toString())
            .setPathParam('currencySKU', currencySKU.toString())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.None, authToken, result => {
            let orderId: number  = JSON.parse(result).order_id;
            onComplete?.(orderId);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }
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

export interface StoreBundle {
    sku: string,
    name: string,
    groups: Array<XsollaItemGroup>,
    attributes: Array<XsollaItemAttribute>,
    type: string,
    bundle_type: string,
    description: string,
    image_url: string,
    is_free: string,
    price: XsollaPrice,
    total_content_price: XsollaPrice,
    virtual_prices: Array< XsollaVirtualCurrencyPrice>,
    content: Array<StoreBundleContent>
}

export interface StoreListOfBundles {
    items: Array<StoreBundle>
}