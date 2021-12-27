// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { handleCommerceError, CommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { ItemAttribute, ItemGroup } from "./XsollaStore";

export class XsollaInventory {

    /**
     * @en
     * Gets the list of purchased virtual items.
     * @zh
     * 
     */
    static getInventory(authToken:string, platform?:PublishingPlatform, onComplete?:(itemsData:InventoryItemsData) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/inventory/items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addNumberParam('limit', limit)
            .addNumberParam('offset', offset)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let intentoryData: InventoryItemsData  = JSON.parse(result);
            onComplete?.(intentoryData);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Gets virtual currency balance.
     * @zh
     * 
     */
    static getVirtualCurrencyBalance(authToken:string, platform?:PublishingPlatform, onComplete?:(currencyData:VirtualCurrencyBalanceData) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/virtual_currency_balance')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let currencyData: VirtualCurrencyBalanceData  = JSON.parse(result);
            onComplete?.(currencyData);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Consumes an inventory item.
     * @zh
     * 
     */
    static consumeInventoryItem(authToken:string, sku:string, quantity?:number, instanceID?:string, platform?:PublishingPlatform, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let body = {
            sku: sku
        };
        body['quantity'] = quantity == null || quantity == 0 ? null : quantity;
        body['instance_id'] = instanceID == null || instanceID == '' ? null : instanceID;

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/inventory/item/consume')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, authToken, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Gets the list of user subscriptions.
     * @zh
     * 
     */
    static getSubscriptions(authToken:string, platform?:PublishingPlatform, onComplete?:(subscriptionData:SubscriptionData) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/subscriptions')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let subscriptionData: SubscriptionData  = JSON.parse(result);
            onComplete?.(subscriptionData);
        }, handleCommerceError(onError));
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
    attributes: Array<ItemAttribute>,
    groups: Array<ItemGroup>,
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

export enum PublishingPlatform {
    playstation_network = 0,
	xbox_live = 1,
	xsolla = 2,
	pc_standalone = 3,
	nintendo_shop = 4,
	google_play = 5,
	app_store_ios = 6,
	android_standalone = 7,
	ios_standalone = 8,
	android_other = 9,
	ios_other = 10,
	pc_other = 11
}