// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { CommonError, XsollaError } from "../core/XsollaError";
import { XsollaHttpError, XsollaHttpUtil, XsollaRequestContentType } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla, XsollaPublishingPlatform } from "../Xsolla";
import { XsollaItemAttribute, XsollaItemGroup } from "./XsollaCommerce";

export class XsollaInventory {

    static getInventory(authToken:string, platform?:XsollaPublishingPlatform, onComplete?:(itemsData:InventoryItemsData) => void, onError?:(error:CommonError) => void, limit:number = 50, offset:number = 0): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/inventory/items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addNumberParam('limit', limit)
            .addNumberParam('offset', offset)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, authToken, result => {
            let intentoryData: InventoryItemsData  = JSON.parse(result);
            onComplete?.(intentoryData);
        }, XsollaError.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static getVirtualCurrencyBalance(authToken:string, platform?:XsollaPublishingPlatform, onComplete?:(currencyData:VirtualCurrencyBalanceData) => void, onError?:(error:CommonError) => void): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/virtual_currency_balance')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', platform ? platform.toString() : null)
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, authToken, result => {
            let currencyData: VirtualCurrencyBalanceData  = JSON.parse(result);
            onComplete?.(currencyData);
        }, XsollaError.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static consumeInventoryItem(authToken:string, sku:string, quantity?:number, instanceID?:string, platform?:XsollaPublishingPlatform, onComplete?:() => void, onError?:(error:CommonError) => void): void {
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
        }, XsollaError.handleError(onError));
        request.send(JSON.stringify(body));
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