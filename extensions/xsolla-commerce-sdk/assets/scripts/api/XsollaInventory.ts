// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { XsollaHttpError, XsollaHttpUtil, XsollaRequestContentType } from "../core/XsollaHttpUtil";
import { XsollaUrlBuilder } from "../core/XsollaUrlBuilder";
import { Xsolla } from "../Xsolla";
import { XsollaItemAttribute, XsollaItemGroup } from "./XsollaCommerce";

export class XsollaInventory {

    static getInventory(authToken:string, onComplete?:(itemsData:InventoryItemsData) => void, onError?:(error:InventoryError) => void, limit:number = 50, offset:number = 0): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/inventory/items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addNumberParam('limit', limit)
            .addNumberParam('offset', offset)
            .addStringParam('platform', XsollaInventory.getPublishingPlatformName())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, authToken, result => {
            let jsonResult = JSON.parse(result);
            let intentoryData: InventoryItemsData  = jsonResult;
            onComplete?.(intentoryData);
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static getVirtualCurrencyBalance(authToken:string, onComplete?:(currencyData:VirtualCurrencyBalanceData) => void, onError?:(error:InventoryError) => void): void {
        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/virtual_currency_balance')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', XsollaInventory.getPublishingPlatformName())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'GET', XsollaRequestContentType.Json, authToken, result => {
            let jsonResult = JSON.parse(result);
            let currencyData: VirtualCurrencyBalanceData  = jsonResult;
            onComplete?.(currencyData);
        }, this.handleError(onError));
        request.send(JSON.stringify({}));
    }

    static consumeInventoryItem(authToken:string, sku:string, quantity:number, instanceID:string, onComplete?:() => void, onError?:(error:InventoryError) => void): void {
        let body = {
            sku: sku
        };

        if(quantity == 0) {
            body['quantity'] = null;
        } else {
            body['quantity'] = quantity;
        }

        if(instanceID == '') {
            body['instance_id'] = null;
        } else {
            body['instance_id'] = instanceID;
        }

        let url = new XsollaUrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/user/inventory/item/consume')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('platform', XsollaInventory.getPublishingPlatformName())
            .build();

        let request = XsollaHttpUtil.createRequest(url, 'POST', XsollaRequestContentType.Json, authToken, result => {
            onComplete?.();
        }, this.handleError(onError));
        request.send(JSON.stringify(body));
    }

    static getPublishingPlatformName() {
        if(!Xsolla.settings.useCrossPlatformAccountLinking) {
            return '';
        }

        return Xsolla.settings.platform.toString();
    }

    static isItemInInventory(items:Array<InventoryItem>, itemSku:string)
    {
        let found = items.find(x => x.sku == itemSku)
        return found != null;
    }

    private static handleError(onError:(error:InventoryError) => void): (requestError:XsollaHttpError) => void {
        return requestError => {
            let commerceError: InventoryError = {
                code: requestError.errorCode,
                description: requestError.errorMessage,
                status: requestError.statusCode
            };
            onError?.(commerceError);
        };
    }
}

export interface InventoryError {
    status?: number,
    code: number,
    description: string
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