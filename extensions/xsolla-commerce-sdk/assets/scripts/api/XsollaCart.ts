// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { handleCommerceError, CommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { Price, ItemAttribute, ItemGroup } from "./XsollaCatalog";
import { PaymentTokenResult, XsollaOrders } from "./XsollaOrders";

export class XsollaCart {

    /**
     * @en
     * Returns user’s cart by cart ID.
     * @zh
     * 按购物车ID返回用户的购物车。
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
     * 返回当前用户的购物车。
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
     * Deletes all items in a specified cart.
     * @zh
     * 删除指定购物车中的全部商品。
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
     * 删除当前用户购物车中的全部商品。
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
     * 在指定购物车里添加商品。如果购物车中已有具有相同SKU的商品，则现有商品位置将被传入的值替换。
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
     * 在购物车里添加商品。如果购物车中已有具有相同SKU的商品，则现有商品将被传入的值替换。
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
     * 更新现有的购物车商品或在指定购物车中创建商品。
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
     * 更新现有的购物车商品或在当前用户的购物车中创建商品。
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
     * 从指定购物车中删除一个商品。
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
     * 从当前用户的购物车中删除一个商品。
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
     * Redeems a promo code. After redeeming a promo code, the user will get free items and/or the price of a cart will be decreased.
     * @zh
     * 兑换促销码。兑换促销码后，用户将得到免费商品和/或购物车价格折扣。
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
     * 通过促销码获得奖励。可用于让用户从多个商品中选择一个作为奖励。
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
     * 从购物车中移除促销码。移除促销码后，将重新计算购物车中所有商品的总价，去掉促销码提供的奖励和折扣。
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

    /**
     * @en
     * Initiates a cart purchase session and fetches a token for payment console.
     * @zh
     * 发起购物车购买会话并获取支付控制台的令牌。
     */
     static fetchCartPaymentToken(authToken:string, cartId:string, currency?:string, country?:string, locale?:string, customParameters?:object, onComplete?:(tokenResult: PaymentTokenResult) => void, onError?:(error:CommerceError) => void): void {
        let body = {
            currency: currency,
            country: country,
            locale: locale,
            sandbox: Xsolla.settings.enableSandbox,
            customParameters: customParameters,
            settings: XsollaOrders.getPaymentSettings()
        };

        let endpoint = cartId == undefined ? 'https://store.xsolla.com/api/v2/project/{project_id}/payment/cart':'https://store.xsolla.com/api/v2/project/{project_id}/payment/cart/{cartId}';

        let url = new UrlBuilder(endpoint)
            .setPathParam('project_id', Xsolla.settings.projectId)
            .setPathParam('cartId', cartId)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, authToken, result => {
            let jsonResult = JSON.parse(result);
            let tokenResult: PaymentTokenResult = {
                token: jsonResult.token,
                orderId: jsonResult.order_id
            };
            onComplete?.(tokenResult);
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
