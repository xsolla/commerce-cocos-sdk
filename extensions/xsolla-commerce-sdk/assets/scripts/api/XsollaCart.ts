// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { handleCommerceError, CommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { Price, ItemAttribute, ItemGroup } from "./XsollaCatalog";

export class XsollaCart {

    /**
     * @en
     * Returns user’s cart by cart ID.
     * @zh
     * 
     */
    static getCartById(cartId:string, locale:string, currency:string, onComplete?:(cartData:CartItemsData) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}')
            .setPathParam('project_id', Xsolla.settings.projectId)
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
            .setPathParam('project_id', Xsolla.settings.projectId)
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
            .setPathParam('project_id', Xsolla.settings.projectId)
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
            .setPathParam('project_id', Xsolla.settings.projectId)
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
            .setPathParam('project_id', Xsolla.settings.projectId)
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
            .setPathParam('project_id', Xsolla.settings.projectId)
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
            .setPathParam('project_id', Xsolla.settings.projectId)
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
            .setPathParam('project_id', Xsolla.settings.projectId)
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
            .setPathParam('project_id', Xsolla.settings.projectId)
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
            .setPathParam('project_id', Xsolla.settings.projectId)
            .setPathParam('item_sku', itemSku)
            .build();

        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, null, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Redeems a promo code. After redeeming a promo code, the user will get free items and/or the price of cart will be decreased.
     * @zh
     * 
     */
    static redeemPromocode(authToken:string, promocodeCode:string, cartId:string, onComplete?:(cartData:CartItemsData) => void, onError?:(error:CommerceError) => void): void {
        let body = {
            coupon_code: promocodeCode,
            cart: {
                id: cartId
            }
        };

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/promocode/redeem')
            .setPathParam('project_id', Xsolla.settings.projectId)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, authToken, result => {
            let itemsData:CartItemsData = JSON.parse(result);
            onComplete?.(itemsData);
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Gets promo code rewards by its code. Can be used to let users choose one of many items as a bonus.
     * @zh
     * 
     */
    static getPromocodeReward(authToken:string, promocodeCode:string, onComplete?:(rewardData: PromocodeRewardData) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/promocode/code/{promocode_code}/rewards')
            .setPathParam('project_id', Xsolla.settings.projectId)
            .setPathParam('promocode_code', promocodeCode)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let rewardData:PromocodeRewardData = JSON.parse(result);
            onComplete?.(rewardData);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Removes a promo code from a cart. After the promo code is removed, the total price of all items in the cart will be recalculated without bonuses and discounts provided by a promo code.
     * @zh
     * 
     */
    static removePromocode(authToken:string, cartId:string, onComplete?:(cartData:CartItemsData) => void, onError?:(error:CommerceError) => void): void {
        let body = {
            cart: {
                id: cartId
            }
        };
        
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{project_id}/promocode/remove')
            .setPathParam('project_id', Xsolla.settings.projectId)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.Json, authToken, result => {
            let itemsData:CartItemsData = JSON.parse(result);
            onComplete?.(itemsData);
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
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

export interface UnitItem {
    sku: string,
    name: string,
    type: string,
    drm_name: string,
    drm_sku: string
}

export interface RewardItem {
    sku: string,
    name: string,
    type: string,
    virtual_item_type: string,
    description: string,
    image_url: string,
    unit_items: Array<UnitItem>
}

export interface BonusItem {
    item: RewardItem,
    quantity: number
}

export interface Discount {
    percent: string
}

export interface PromocodeRewardData {
    bonus: Array<BonusItem>,
    discount: Discount,
    is_selectable: boolean
}