// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { handleCommerceError, CommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { Price, ItemAttribute, ItemGroup } from "./XsollaCatalog";
import { PaymentTokenResult, XsollaOrders } from "./XsollaOrders";

export class XsollaCart {

    /**
     * @en
     * Returns a list of items from the cart with the specified ID or from the cart of the current user. For each item, complete data is returned.
     * @zh
     * 返回指定ID购物车的商品列表或返回当前用户的购物车商品列表。每个商品均返回完整数据。
     */
    static getCart(authToken:string, cartId:string, locale:string, currency:string, onComplete?:(cartData:CartItemsData) => void, onError?:(error:CommerceError) => void): void {
        let endpoint = cartId == '' ? 'https://store.xsolla.com/api/v2/project/{project_id}/cart' : 'https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}';
        let url = new UrlBuilder(endpoint)
            .setPathParam('project_id', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .addStringParam('locale', locale)
            .addStringParam('currency', currency)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let itemsData:CartItemsData = JSON.parse(result);
            onComplete?.(itemsData);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Removes all items from the cart with the specified ID or from the cart of the current user.
     * @zh
     * 移除指定ID购物车中的所有商品或移除当前用户购物车中的所有商品。
     */
    static clearCart(authToken:string, cartId:string, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let endpoint = cartId == '' ? 'https://store.xsolla.com/api/v2/project/{project_id}/cart/clear' : 'https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}/clear';
        let url = new UrlBuilder(endpoint)
            .setPathParam('project_id', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.None, authToken, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Fills the cart with the specified ID or the cart of the current user with items. If there is already an item with the same SKU in the cart, the existing item position will be replaced by the passed value.
     * @zh
     * 用商品填充指定ID的购物车或填充当前用户的购物车。如购物车中已有相同SKU的商品，则用传入的值替换现有商品的位置。
     */
    static fillCart(authToken:string, cartId:string, items:Array<CartItem>, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let fillItems = items.map((item) => {
            return {
                sku: item.sku,
                quantity: item.quantity
            }
        });

        let body = {
            items: fillItems
        };

        let endpoint = cartId == '' ? 'https://store.xsolla.com/api/v2/project/{project_id}/cart/fill' : 'https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}/fill';
        let url = new UrlBuilder(endpoint)
            .setPathParam('project_id', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.Json, authToken, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Updates the quantity of a previously added item in the cart with the specified ID or in the current user cart. If there is no item with the specified SKU in the cart, it will be added.
     * @zh
     * 更新指定ID购物车或当前用户购物车中之前添加的商品的数量。如购物车中没有指定SKU的商品，则添加该商品。
     */
    static updateItemInCart(authToken:string, cartId:string, itemSku:string, quantity:number, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let body = {
            quantity: quantity
        };

        let endpoint = cartId == '' ? 'https://store.xsolla.com/api/v2/project/{project_id}/cart/item/{item_sku}' : 'https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}/item/{item_sku}';
        let url = new UrlBuilder(endpoint)
            .setPathParam('project_id', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .setPathParam('item_sku', itemSku)
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.Json, authToken, result => {
            onComplete?.();
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Removes the item from the cart with the specified ID or from the cart of the current user.
     * @zh
     * 移除指定ID购物车中的商品或移除当前用户购物车中的商品。
     */
    static removeItemFromCart(authToken:string, cartId:string, itemSku:string, onComplete?:() => void, onError?:(error:CommerceError) => void): void {
        let endpoint = cartId == '' ? 'https://store.xsolla.com/api/v2/project/{project_id}/cart/item/{item_sku}' : 'https://store.xsolla.com/api/v2/project/{project_id}/cart/{cart_id}/item/{item_sku}';
        let url = new UrlBuilder(endpoint)
            .setPathParam('project_id', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
            .setPathParam('item_sku', itemSku)
            .build();

        let request = HttpUtil.createRequest(url, 'DELETE', RequestContentType.None, authToken, result => {
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
     * 	Creates an order with items from the cart with the specified ID or from the cart of the current user. Returns the payment token and order ID.
     * @zh
     * 用指定ID购物车中的商品创建订单或用当前用户购物车中的商品创建订单。返回支付令牌和订单ID。
     */
     static fetchCartPaymentToken(authToken:string, cartId:string, currency?:string, country?:string, locale?:string, customParameters?:object, externalId?:string, onComplete?:(tokenResult: PaymentTokenResult) => void, onError?:(error:CommerceError) => void): void {
        let body = {
            currency: currency,
            country: country,
            locale: locale,
            sandbox: Xsolla.settings.enableSandbox,
            customParameters: customParameters,
            settings: XsollaOrders.getPaymentSettings()
        };

        body.settings.external_id = externalId;

        let endpoint = cartId == '' ? 'https://store.xsolla.com/api/v2/project/{project_id}/payment/cart':'https://store.xsolla.com/api/v2/project/{project_id}/payment/cart/{cart_id}';

        let url = new UrlBuilder(endpoint)
            .setPathParam('project_id', Xsolla.settings.projectId)
            .setPathParam('cart_id', cartId)
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


    /**
     * @en
     * Creates an order with all items from the free cart. The created order will get a `done` order status.
     * @zh
     * 使用免费购物车中的所有商品创建一个订单。创建的订单将具有`done`的订单状态。
     */
    static createOrderWithFreeCart(authToken:string, cartId:string, currency?:string, locale?:string, customParameters?:object, onComplete?:(orderId:number) => void, onError?:(error:CommerceError) => void): void {
        let body = {
            currency: currency,
            locale: locale,
            sandbox: Xsolla.settings.enableSandbox,
            customParameters: customParameters,
            settings: XsollaOrders.getPaymentSettings()
        };

        let endpoint = cartId == undefined ? 'https://store.xsolla.com/api/v2/project/{project_id}/free/cart':'https://store.xsolla.com/api/v2/project/{project_id}/free/cart/{cartId}';

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
            onComplete?.(tokenResult.orderId);
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
