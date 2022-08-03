// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { handleSubscriptionError, SubscriptionError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";

export class XsollaSubscriptions {

    /**
     * @en
     * Returns a list of all plans, including plans purchased by the user while promotions are active.
     * @zh
     *
     */
    static getSubscriptionPublicPlans(planId:Array<number>, planExternalId:Array<string>, country?:string, locale?:string, onComplete?:(itemsList: SubscriptionPlansList) => void, onError?:(error:SubscriptionError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://subscriptions.xsolla.com/api/public/v1/projects/{projectID}/user_plans')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addArrayParam('plan_id', planId)
            .addArrayParam('plan_external_id', planExternalId)
            .addStringParam('country', country)
            .addStringParam('locale', locale)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, null, result => {
            let itemsList: SubscriptionPlansList = JSON.parse(result);
            onComplete?.(itemsList);
        }, handleSubscriptionError(onError));
        request.send();
    }

    /**
     * @en
     * Returns a list of all plans, including plans purchased by the user while promotions are active.
     * @zh
     *
     */
     static getSubscriptionPlans(authToken:string, planId:Array<number>, planExternalId:Array<string>, country?:string, locale?:string, onComplete?:(itemsList: SubscriptionPlansList) => void, onError?:(error:SubscriptionError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://subscriptions.xsolla.com/api/user/v1/projects/{projectID}/plans')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addArrayParam('plan_id', planId)
            .addArrayParam('plan_external_id', planExternalId)
            .addStringParam('country', country)
            .addStringParam('locale', locale)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let itemsList: SubscriptionPlansList = JSON.parse(result);
            onComplete?.(itemsList);
        }, handleSubscriptionError(onError));
        request.send();
    }

    /**
     * @en
     * Returns a list of active recurrent subscriptions that have the `active`, `non renewing`, and `pause` status.
     * @zh
     *
     */
     static getSubscriptions(authToken:string, locale?:string, onComplete?:(itemsList: SubscriptionsList) => void, onError?:(error:SubscriptionError) => void, limit:number = 50, offset:number = 0): void {
        let url = new UrlBuilder('https://subscriptions.xsolla.com/api/user/v1/projects/{projectID}/subscriptions')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('locale', locale)
            .addStringParam('limit', limit.toString())
            .addStringParam('offset', offset.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let itemsList: SubscriptionsList = JSON.parse(result);
            onComplete?.(itemsList);
        }, handleSubscriptionError(onError));
        request.send();
    }

    /**
     * @en
     * Returns information about a subscription by its ID. Subscription can have any status.
     * @zh
     *
     */
     static getSubscriptionDetails(authToken:string, subscriptionId: number, locale?:string, onComplete?:(details: SubscriptionDetails) => void, onError?:(error:SubscriptionError) => void): void {
        let url = new UrlBuilder('https://subscriptions.xsolla.com/api/user/v1/projects/{projectID}/subscriptions/{subscriptionId}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('subscriptionId', subscriptionId.toString())
            .addStringParam('locale', locale)
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let details: SubscriptionDetails = JSON.parse(result);
            onComplete?.(details);
        }, handleSubscriptionError(onError));
        request.send();
    }

    /**
     * @en
     * Returns Pay Station URL for the subscription purchase.
     * @zh
     *
     */
     static getSubscriptionPurchaseUrl(authToken:string, planExternalId: string, country?:string, onComplete?:(linkToPaystation: string) => void, onError?:(error:SubscriptionError) => void): void {
        let body = {
            plan_external_id: planExternalId,
            settings: {
                sandbox: Xsolla.settings.enableSandbox
            }
        };

        let url = new UrlBuilder('https://subscriptions.xsolla.com/api/user/v1/projects/{projectID}/subscriptions/buy')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('country', country)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, authToken, result => {
            let linkData: SubscriptionPaystationLink = JSON.parse(result);
            onComplete?.(linkData.link_to_ps);
        }, handleSubscriptionError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Returns Pay Station URL for the subscription management.
     * @zh
     *
     */
     static getSubscriptionManagementUrl(authToken:string, country?:string, onComplete?:(linkToPaystation: string) => void, onError?:(error:SubscriptionError) => void): void {
        let body = {
            settings: {
                sandbox: Xsolla.settings.enableSandbox
            }
        };

        let url = new UrlBuilder('https://subscriptions.xsolla.com/api/user/v1/projects/{projectID}/subscriptions/manage')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .addStringParam('country', country)
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, authToken, result => {
            let linkData: SubscriptionPaystationLink = JSON.parse(result);
            onComplete?.(linkData.link_to_ps);
        }, handleSubscriptionError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Returns Pay Station URL for the subscription renewal.
     * @zh
     *
     */
     static getSubscriptionRenewalUrl(authToken:string, subscriptionId:number, onComplete?:(linkToPaystation: string) => void, onError?:(error:SubscriptionError) => void): void {
        let body = {
            settings: {
                sandbox: Xsolla.settings.enableSandbox
            }
        };

        let url = new UrlBuilder('https://subscriptions.xsolla.com/api/user/v1/projects/{projectID}/subscriptions/{subscriptionId}/renew')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('subscriptionId', subscriptionId.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'POST', RequestContentType.Json, authToken, result => {
            let linkData: SubscriptionPaystationLink = JSON.parse(result);
            onComplete?.(linkData.link_to_ps);
        }, handleSubscriptionError(onError));
        request.send(JSON.stringify(body));
    }

    /**
     * @en
     * Changes a regular subscription status to non_renewing (subscription is automatically canceled after expiration).
     * @zh
     *
     */
     static cancelSubscription(authToken:string, subscriptionId:number, onComplete?:() => void, onError?:(error:SubscriptionError) => void): void {
        let url = new UrlBuilder('https://subscriptions.xsolla.com/api/user/v1/projects/{projectID}/subscriptions/{subscriptionId}/cancel')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('subscriptionId', subscriptionId.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'PUT', RequestContentType.Json, authToken, onComplete, handleSubscriptionError(onError));
        request.send();
    }
}

export interface SubscriptionPlansList {
    items: Array<SubscriptionPlan>,
    has_more: boolean
}

export interface SubscriptionPlan {
    plan_id: number,
    plan_external_id: string,
    plan_group_id: string,
    plan_type: string,
    plan_name: string,
    plan_description: string,
    plan_start_date: string,
    plan_end_date: string,
    product_id: number,
    product_external_id: string,
    product_name: string,
    product_description: string,
    status: string,
    is_in_trial: boolean,
    trial_period: number,
    date_create: string,
    date_next_charge: string,
    date_last_charge: string,
    charge: SubscriptionCharge,
    period: SubscriptionPeriod,
    date_end: string,
    is_renew_possible: boolean,
    is_change_to_non_renew_possible: boolean,
    is_change_plan_allowed: boolean
}

export interface SubscriptionCharge {
    amount: number,
    amount_with_promotion: number,
    currency: string
}

export interface SubscriptionPeriod {
    value: number,
    unit: string
}

export interface SubscriptionsList {
    items: Array<Subscription>,
    has_more: boolean
}

export interface Subscription {
    id: number,
    plan_id: number,
    plan_external_id: string,
    plan_name: string,
    plan_description: string,
    plan_start_date: string,
    plan_end_date: string,
    product_id: number,
    product_external_id: string,
    product_name: string,
    product_description: string,
    status: string,
    is_in_trial: boolean,
    trial_period: number,
    date_create: string,
    date_next_charge: string,
    date_last_charge: string,
    charge: SubscriptionCharge,
    period: SubscriptionPeriod
}

export interface SubscriptionDetails {
    id: number,
    plan_id: number,
    plan_external_id: string,
    plan_name: string,
    plan_description: string,
    plan_start_date: string,
    plan_end_date: string,
    product_id: number,
    product_external_id: string,
    product_name: string,
    product_description: string,
    status: string,
    is_in_trial: boolean,
    trial_period: number,
    date_create: string,
    date_next_charge: string,
    date_last_charge: string,
    charge: SubscriptionCharge,
    period: SubscriptionPeriod,
    date_end: string,
    is_renew_possible: boolean,
    is_change_to_non_renew_possible: boolean,
    is_change_plan_allowed: boolean
}

export interface SubscriptionPaystationLink {
    link_to_ps: string
}
