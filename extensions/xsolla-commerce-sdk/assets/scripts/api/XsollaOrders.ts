// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { sys } from "cc";
import { CommerceError, handleCommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { PaymentRedirectCondition, PaymentRedirectStatusManual, PaymentUiSize, PaymentUiTheme, PaymentUiVersion, RedirectPolicySettings, Xsolla } from "../Xsolla";
import { OrderContent } from "./XsollaCatalog";

export class XsollaOrders {

    /**
     * @en
     * Checks pending order status by its ID.
     * @zh
     * 根据订单ID查询待处理订单的状态。
     */
    static checkOrder(authToken:string, orderId:number, onComplete?:(checkOrderResult: CheckOrderResult) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/order/{orderId}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('orderId', orderId.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, authToken, result => {
            let jsonResult = JSON.parse(result);
            let checkOrderResult: CheckOrderResult = {
                orderId: jsonResult.order_id,
                status: jsonResult.status,
                content: jsonResult.content
            };
            onComplete?.(checkOrderResult);
        }, handleCommerceError(onError));
        request.send();
    }

    static getPaymentSettings() {
        let paymentUISettings: any = {
            theme: this.getPaymentInerfaceTheme()
        };
            
        paymentUISettings.size = Xsolla.settings.paymentInterfaceSize == null ? PaymentUiSize[PaymentUiSize.medium] : PaymentUiSize[Xsolla.settings.paymentInterfaceSize];
        paymentUISettings.version = Xsolla.settings.paymentInterfaceVersion == null ? PaymentUiVersion[PaymentUiVersion.desktop] : PaymentUiVersion[Xsolla.settings.paymentInterfaceVersion]

        let paymentSettings: any = {
            ui: paymentUISettings
        };
        let redirectPolicySettings: RedirectPolicySettings = Xsolla.settings.redirectPolicySettingsWebGL;
        if(sys.platform.toLowerCase() == 'android') {
            redirectPolicySettings = Xsolla.settings.redirectPolicySettingsAndroid;
        }
        if(sys.platform.toLowerCase() == 'ios') {
            redirectPolicySettings = Xsolla.settings.redirectPolicySettingsIOS;
        }

        if(redirectPolicySettings == null) {
            redirectPolicySettings = {
                useSettingsFromPublisherAccount: true,
                returnUrl: '',
                redirectCondition: PaymentRedirectCondition.none,
                redirectDelay: 0,
                redirectStatusManual: PaymentRedirectStatusManual.none,
                redirectButtonCaption: ''
            };
        }

        if(!redirectPolicySettings.useSettingsFromPublisherAccount) {
            if(redirectPolicySettings.returnUrl != '') {
                paymentSettings.return_url = redirectPolicySettings.returnUrl
            }
            let redirectSettings = {
                redirect_conditions: PaymentRedirectCondition[redirectPolicySettings.redirectCondition],
                status_for_manual_redirection: PaymentRedirectStatusManual[redirectPolicySettings.redirectStatusManual],
                delay: redirectPolicySettings.redirectDelay,
                redirect_button_caption: redirectPolicySettings.redirectButtonCaption
            }
            paymentSettings.redirect_policy = redirectSettings
        }

        return paymentSettings;
    }

    private static getPaymentInerfaceTheme() {
        if(Xsolla.settings.paymentInterfaceTheme == null) {
            return 'default';
        }
        switch(Xsolla.settings.paymentInterfaceTheme) {
            case PaymentUiTheme.default_light:
            return 'default';
            case PaymentUiTheme.default_dark:
            return 'default-dark';
            case PaymentUiTheme.dark:
            return 'dark';
            case PaymentUiTheme.ps4_default_light:
            return 'ps4-default-light';
            case PaymentUiTheme.ps4_default_dark:
            return 'ps4-default-dark';
        }
    }
}

export interface CheckOrderResult {
    orderId: number,
    status: string,
    content: OrderContent
}

export interface PaymentTokenResult {
    token: string,
    orderId: number
}
