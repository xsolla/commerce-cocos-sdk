// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { CommerceError, XsollaError } from "../core/XsollaError";
import { XsollaHttpUtil, XsollaRequestContentType } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla, XsollaPublishingPlatform } from "../Xsolla";
import { XsollaItemAttribute, XsollaItemGroup } from "./XsollaStore";

export class XsollaInventory {

    static getInventory(authToken:string, platform?:XsollaPublishingPlatform, onComplete?:(itemsData:InventoryItemsData) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/inventory/items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addNumberParam('limit', limit)
            .addNumberParam('offset', offset)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, authToken, result => {
            let intentoryData: InventoryItemsData  = JSON.parse(result);
            onComplete?.(intentoryData);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }

    static getVirtualCurrencyBalance(authToken:string, platform?:XsollaPublishingPlatform, onComplete?:(currencyData:VirtualCurrencyBalanceData) => void, onError?:(error:CommerceError) => void): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/virtual_currency_balance')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, authToken, result => {
            let currencyData: VirtualCurrencyBalanceData  = JSON.parse(result);
            onComplete?.(currencyData);
        }, XsollaError.handleCommerceError(onError));
        request.send();
    }

    static consumeInventoryItem(authToken:string, sku:string, quantity?:number, instanceID?:string, platform?:XsollaPublishingPlatform, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let body = {
            sku: sku
        };
        body['quantity'] = quantity == null ||quantity == 0 ? null : quantity;
        body['instance_id'] = instanceID == null || instanceID == '' ? null : instanceID;

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/inventory/item/consume')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, authToken, result => {
            onComplete?.();
        }, XsollaError.handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    static getSubscriptions(authToken:string, platform?:XsollaPublishingPlatform, onComplete?:(subscriptionData:SubscriptionData) => void, onError?:(error:CommerceError) => void): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/subscriptions')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, authToken, result => {
            let subscriptionData: SubscriptionData  = JSON.parse(result);
            onComplete?.(subscriptionData);
        }, XsollaError.handleError(onError));
        request.send();
    }
}

export interface InventoryItem {
    sku: string,
    name: string,
    type: string,
    virtual_item_type: string,
    description: string,
    image_url: string,
    attributes: Array<XsollaItemAttribute>,
    groups: Array<XsollaItemGroup>,
    instance_id: string,
    quantity: number,
    remaining_uses: number
}

export interface InventoryItemsData {
    items: Array<InventoryItem>
}

export interface VirtualCurrencyBalance {
    sku: string,
    type: string,
    name: string,
    description: string,
    image_url: string,
    amount: number
}

export interface VirtualCurrencyBalanceData {
    items: Array<VirtualCurrencyBalance>
}

export interface SubscriptionItem {
    sku: string,
    name: string,
    type: string,
    virtual_item_type: string,
    description: string,
    image_url: string,
    expired_at: number,
    status: string
}

export interface SubscriptionData {
    items: Array<SubscriptionItem>
}