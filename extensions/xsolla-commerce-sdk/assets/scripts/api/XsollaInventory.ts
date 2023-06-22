// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { handleCommerceError, CommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { ItemAttribute, ItemGroup } from "./XsollaCatalog";

export class XsollaInventory {

    /**
     * @en
     * Gets the list of purchased virtual items.
     * @zh
     * 获取所购虚拟物品的列表。
     */
    static getInventory(authToken:string, platform?:PublishingPlatform, onComplete?:(itemsData:InventoryItemsData) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/inventory/items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addNumberParam('limit', limit)
            .addNumberParam('offset', offset)
            .addStringParam('platform', platform ? PublishingPlatform[platform] : null)
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
     * 获取虚拟货币余额。
     */
    static getVirtualCurrencyBalance(authToken:string, platform?:PublishingPlatform, onComplete?:(currencyData:VirtualCurrencyBalanceData) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/virtual_currency_balance')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? PublishingPlatform[platform] : null)
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
     * 消耗物品库中的物品。
     */
    static consumeInventoryItem(authToken:string, sku:string, quantity?:number, instanceID?:string, platform?:PublishingPlatform, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let body = {
            sku: sku
        };
        body['quantity'] = quantity == null || quantity == 0 ? null : quantity;
        body['instance_id'] = instanceID == null || instanceID == '' ? null : instanceID;

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/inventory/item/consume')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? PublishingPlatform[platform] : null)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, authToken, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Gets the list of time limited items.
     * @zh
     * 获取时效性商品列表。
     */
    static getTimeLimitedItems(authToken:string, platform?:PublishingPlatform, onComplete?:(timeLimitedItemsData:TimeLimitedItemsData) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/time_limited_items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? PublishingPlatform[platform] : null)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let timeLimitedItemsData: TimeLimitedItemsData  = JSON.parse(result);
            onComplete?.(timeLimitedItemsData);
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

export interface TimeLimitedItem {
    sku: string,
    name: string,
    type: string,
    virtual_item_type: string,
    description: string,
    image_url: string,
    expired_at: number,
    status: string
}

export interface TimeLimitedItemsData {
    items: Array<TimeLimitedItem>
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
