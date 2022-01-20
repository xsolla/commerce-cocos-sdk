// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { handleCommerceError, CommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { Price, ItemAttribute, ItemGroup } from "./XsollaStore";

export class XsollaCart {

    /**
     * @en
     * Returns user’s cart by cart ID.
     * @zh
     * 
     */
    static getCartById(cartId:string, locale:string, currency:string, onComplete?:(cartData:CartItemsData) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .addStringParam('locale', locale)
            .addStringParam('currency', currency)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let itemsData:CartItemsData = JSON.parse(result);
            onComplete?.(itemsData);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Returns the current user's cart.
     * @zh
     * 
     */
    static getCart(locale:string, currency:string, onComplete?:(cartData:CartItemsData) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('currency', currency)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let itemsData:CartItemsData = JSON.parse(result);
            onComplete?.(itemsData);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Deletes all items in specified cart.
     * @zh
     * 
     */
    static clearCartById(cartId:string, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}/clear')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.None, null, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Deletes all items in the current user's cart.
     * @zh
     * 
     */
    static clearCart(onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/clear')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.None, null, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Fills the specific cart with items. If the cart already has an item with the same SKU, the existing item position will be replaced by the passed value.
     * @zh
     * 
     */
    static fillCartById(cartId:string, items:Array<CartItem>, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let fillItems = items.map((item) => {
            return {
                sku: item.sku,
                quantity: item.quantity
            }
        });

        let body = {
            items: fillItems
        };

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}/fill')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.Json, null, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Fills the cart with items. If the cart already has an item with the same SKU, the existing item will be replaced by the passed value.
     * @zh
     * 
     */
    static fillCart(items:Array<CartItem>, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let fillItems = items.map((item) => {
            return {
                sku: item.sku,
                quantity: item.quantity
            }
        });

        let body = {
            items: fillItems
        };

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/fill')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.None, null, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Updates an existing cart item or creates the one in the specified cart.
     * @zh
     * 
     */
    static updateItemInCartById(cartId:string, itemSku:string, quantity:number, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let body = {
            quantity: quantity
        };

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}/item/{item_sku}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .setPathParam('item_sku', itemSku)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.Json, null, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Updates an existing cart item or creates the one in the current user's cart.
     * @zh
     * 
     */
    static updateItemInCart(itemSku:string, quantity:number, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let body = {
            quantity: quantity
        };

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/item/{item_sku}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('item_sku', itemSku)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.None, null, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Removes an item from the specified cart.
     * @zh
     * 
     */
    static removeItemFromCartById(cartId:string, itemSku:string, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}/item/{item_sku}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .setPathParam('item_sku', itemSku)
            .build();

        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, null, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Removes an item from the current user's cart.
     * @zh
     * 
     */
    static removeItemFromCart(itemSku:string, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/item/{item_sku}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('item_sku', itemSku)
            .build();

        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, null, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send();
    }
}

export interface CartItemsData {
    cart_id: string,
    price: Price,
    is_free: boolean,    
    items: Array<CartItem>
}

export interface CartItem {
    sku: string,
    name: string,
    description: string,
    type: string,
    virtual_item_type: string,
    groups: Array<ItemGroup>,
    is_free: boolean,
    is_bonus: boolean,
    price: Price,
    image_url: string,
    attributes: Array<ItemAttribute>,
    quantity: number
}