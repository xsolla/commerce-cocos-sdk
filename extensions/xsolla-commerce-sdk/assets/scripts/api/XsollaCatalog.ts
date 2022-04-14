// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { handleCommerceError, CommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { BonusItem } from "./XsollaCart";
import { PaymentTokenResult, XsollaOrders } from "./XsollaOrders";

export class XsollaCatalog {

    /**
     * @en
     * Gets a list of virtual items available for the configured project.
     * @zh
     * 获取所配置项目的可用虚拟物品列表。
     */
    static getCatalog(locale:string, country:string, additionalFields:Array<string>, onComplete?:(itemsData:StoreItemsData) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_items')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let itemsData:StoreItemsData = JSON.parse(result);
            itemsData.groupIds = new Set<string>();
            for(let item of itemsData.items) {
                for(let itemGroup of item.groups) {
                    itemsData.groupIds.add(itemGroup.external_id);
                }
            }
            onComplete?.(itemsData);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Gets a list of bundles for building a catalog.
     * @zh
     * 获取用于生成目录的捆绑包列表。
     */
    static getBundleList(locale:string, country:string, additionalFields:Array<string>, onComplete?:(itemsData:StoreListOfBundles) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0) {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/bundle')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let bundlesList: StoreListOfBundles = JSON.parse(result);
            onComplete?.(bundlesList);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Gets a specified bundle.
     * @zh
     * 获取指定的捆绑包。
     */
    static getSpecifiedBundle(sku:string, onComplete?:(bundle:StoreBundle) => void, onError?:(error:CommerceError) => void) {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/bundle/sku/{sku}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('sku', sku)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let bundle: StoreBundle = JSON.parse(result);
            onComplete?.(bundle);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Gets a list of all virtual items.
     * @zh
     * 获取全部虚拟物品的列表。
     */
    static getCatalogSimplified(locale:string, onComplete?:(data: StoreItemsList) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{ProjectID}/items/virtual_items/all')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let itemsList: StoreItemsList = JSON.parse(result);
            onComplete?.(itemsList);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Gets the list of virtual currencies.
     * @zh
     * 获取虚拟货币的列表。
     */
    static getVirtualCurrencyList(locale:string, country:string, additionalFields:Array<string>, onComplete?:(data:VirtualCurrencyData) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_currency')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let virtualCurrencyData: VirtualCurrencyData = JSON.parse(result);
            onComplete?.(virtualCurrencyData);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Gets the list of virtual currency packages.
     * @zh
     * 获取虚拟货币套餐的列表。
     */
    static getVirtualCurrencyPackages(locale:string, country:string, additionalFields:Array<string>, onComplete?:(data:VirtualCurrencyPackagesData) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_currency/package')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let virtualCurrencyPackages: VirtualCurrencyPackagesData = JSON.parse(result);
            onComplete?.(virtualCurrencyPackages);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Gets an item list from the specified group for building a catalog.
     * @zh
     * 从指定组中获取商品列表用于生成目录。
     */
    static getItemsBySpecifiedGroup(externalId: string, locale:string, country:string, additionalFields:Array<string>, onComplete?:(itemsList: StoreItemsList) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/virtual_items/group/{externalId}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('externalId', externalId.length != 0 ? externalId: 'all')
            .addStringParam('locale', locale)
            .addStringParam('country', country)
            .addArrayParam('additional_fields[]', additionalFields)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let itemsList: StoreItemsList = JSON.parse(result);
            onComplete?.(itemsList);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Gets the list of virtual item groups.
     * @zh
     * 获取虚拟物品组的列表。
     */
    static getItemGroups(locale:string, onComplete?:(groups:Array<ItemGroup>) => void, onError?:(error:CommerceError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/items/groups')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let groups: Array<ItemGroup> = JSON.parse(result).groups;
            onComplete?.(groups);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Buys an item using virtual currency.
     * @zh
     * 使用虚拟货币购买商品。
     */
    static purchaseItemForVirtualCurrency(authToken:string, itemSKU:string, currencySKU:string, onComplete?:(orderId: number) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/payment/item/{itemSKU}/virtual/{currencySKU}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('itemSKU', itemSKU.toString())
            .setPathParam('currencySKU', currencySKU.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.None, authToken, result => {
            let orderId: number  = JSON.parse(result).order_id;
            onComplete?.(orderId);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Redeems a coupon code. The user gets a bonus after a coupon is redeemed.
     * @zh
     * 兑换优惠券码。用户在兑换优惠券后获得奖励。
     */
     static redeemCoupon(authToken:string, couponCode:string, onComplete?:(items: Array<RedeemedCouponItem>) => void, onError?:(error:CommerceError) => void): void {
        let body = {
            coupon_code: couponCode
        };

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/coupon/redeem')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, authToken, result => {
            let items: Array<RedeemedCouponItem>  = JSON.parse(result).items;
            onComplete?.(items);
        }, handleCommerceError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Gets coupon rewards by its code. Can be used to let users choose one of many items as a bonus.
     * The usual case is choosing a DRM if the coupon contains a game as a bonus.
     * @zh
     * 通过优惠券码获得奖励。可用于让用户从多个商品中选择一个作为奖励。如优惠券包含游戏作为奖励，常见情况是选择一个DRM。
     */
     static getCouponRewards(authToken:string, couponCode:string, onComplete?:(data: CouponRewardData) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/coupon/code/{couponCode}/rewards')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('couponCode', couponCode)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let data: CouponRewardData  = JSON.parse(result);
            onComplete?.(data);
        }, handleCommerceError(onError));
        request.send();
    }

    /**
     * @en
     * Initiates an item purchase session and fetches token for a payment console.
     * @zh
     * 发起商品购买会话并获取支付控制台的令牌。
     */
     static fetchPaymentToken(authToken:string, itemSKU:string, quantity:number, currency?:string, country?:string, locale?:string, customParameters?:object, onComplete?:(tokenResult: PaymentTokenResult) => void, onError?:(error:CommerceError) => void): void {

        let body = {
            currency: currency,
            country: country,
            sandbox: Xsolla.settings.enableSandbox,
            customParameters: customParameters,
            quantity: quantity,
            settings: XsollaOrders.getPaymentSettings()
        };

        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/payment/item/{itemSKU}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('itemSKU', itemSKU)
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

export interface VirtualCurrencyCalculatedPrice {
    amount: string,
    amount_without_discount: string
}

export interface VirtualCurrencyPrice {
    sku: string,
    is_default: boolean,
    amount: number,
    amount_without_discount: number,
    image_url: string,
    name: string,
    description: string,
    type: string,
    calculated_price: VirtualCurrencyCalculatedPrice
}

export interface Price {
    amount: string,
    amount_without_discount: string,
    currency: string
}

export interface OrderItem {
    sku: string,
    quantity: number,
    is_free: string,
    price: Price
}

export interface OrderContent {
    price: Price,
    virtual_price: VirtualCurrencyPrice,
    is_free: string,
    items: Array<OrderItem>
}

export interface StoreItemMediaList {
    type: string,
    url: string
}

export interface ItemAttributeValue {
    external_id: string,
    value: string
}

export interface ItemAttribute {
    external_id: string,
    name: string,
    values: Array<ItemAttributeValue>
}

export interface StoreBundleContent {
    sku: string,
    name: string,
    type: string,
    description: string,
    image_url: string,
    quantity: number,
    price: Price,
    virtual_prices: Array<VirtualCurrencyPrice>
}

export interface ExpirationPeriod {
    value: number,
    type: string
}

export interface Consumable {
    usages_count: number
}

export interface ItemOptions {
    consumable: Consumable,
    expiration_period: ExpirationPeriod
}

export interface ItemGroup {
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
    groups: Array<ItemGroup>,
    is_free: boolean,
    price: Price,
    virtual_prices: Array<VirtualCurrencyPrice>,
    image_url: string,
    inventory_options: ItemOptions,
    bundle_type: string,
    total_content_price: Price,
    content: Array<StoreBundleContent>,
    attributes: Array<ItemAttribute>,
    long_description: string,
    order: number,
    media_list: Array<StoreItemMediaList>
}

export interface StoreItemsData {
    items: Array<StoreItem>,
    groupIds: Set<string>,
    groups: Array<ItemGroup>
}

export interface StoreItemsList {
    items: Array<StoreItem>
}

export interface VirtualCurrency {
    sku: string,
    name: string,
    groups: Array<string>,
    attributes: Array<ItemAttribute>,
    type: string,
    description: string,
    image_url: string,
    is_free: boolean,
    price: Price,
    virtual_prices: Array<VirtualCurrencyPrice>,
    inventory_options: ItemOptions,
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
    inventory_options: ItemOptions
}

export interface VirtualCurrencyPackage {
    sku: string,
    name: string,
    type: string,
    virtual_item_type: string,
    description: string,
    image_url: string,
    inventory_options: ItemOptions,
    attributes: Array<ItemAttribute>,
    groups: Array<ItemGroup>,
    bundle_type: string,
    is_free: boolean,
    price: Price,
    virtual_prices: Array<VirtualCurrencyPrice>,
    content: Array<CurrencyPackageContent>,
    long_description: string,
    order: number,
    media_list: Array<StoreItemMediaList>
}

export interface VirtualCurrencyPackagesData {
    items: Array<VirtualCurrencyPackage>
}

export interface StoreBundle {
    sku: string,
    name: string,
    groups: Array<ItemGroup>,
    attributes: Array<ItemAttribute>,
    type: string,
    bundle_type: string,
    description: string,
    image_url: string,
    is_free: string,
    price: Price,
    total_content_price: Price,
    virtual_prices: Array< VirtualCurrencyPrice>,
    content: Array<StoreBundleContent>
}

export interface StoreListOfBundles {
    items: Array<StoreBundle>
}

export interface RedeemedCouponItem {
    sku: string,
    name: string,
    description: string,
    type: string,
    virtual_item_type: string,
    groups: Array<ItemGroup>,
    attributes: Array<ItemAttribute>,
    is_free: boolean,
    price: Price,
    virtual_prices: Array<VirtualCurrencyPrice>,
    image_url: string,
    inventory_options: ItemOptions,
    quantity: number
}

export interface CouponRewardData {
    bonus: Array<BonusItem>,
    is_selectable: boolean
}
