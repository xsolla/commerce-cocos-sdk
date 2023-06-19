// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { sys } from "cc";
import { NativeUtil } from "../common/NativeUtil";
import { CommerceError, handleCommerceError } from "../core/Error";
import { HttpUtil, RequestContentType } from "../core/HttpUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { PaymentRedirectCondition, PaymentRedirectStatusManual, PaymentUISettings, PaymentUiSize, PaymentUiVersion, RedirectPolicySettings, Xsolla } from "../Xsolla";
import { OrderContent } from "./XsollaCatalog";

export class XsollaOrders {

    /**
     * @en
     * Checks pending order status by its ID.
     * @zh
     * 根据订单ID查询待处理订单的状态。
     */
    static checkOrder(accessToken:string, orderId:number, onComplete?:(checkOrderResult: CheckOrderResult) => void, onError?:(error:CommerceError) => void): void {
        let url = new UrlBuilder('https://store.xsolla.com/api/v2/project/{projectID}/order/{orderId}')
            .setPathParam('projectID', Xsolla.settings.projectId)
            .setPathParam('orderId', orderId.toString())
            .build();

        let request = HttpUtil.createRequest(url, 'GET', RequestContentType.None, accessToken, result => {
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
        let platfrom = sys.platform.toLowerCase();
        let isAndroidPlatform = platfrom == 'android';
        let isIosPlatform = platfrom == 'ios';

        let uiSettings: PaymentUISettings = Xsolla.settings.paymentUISettingsWebGL;
        if(isAndroidPlatform) {
            uiSettings = Xsolla.settings.paymentUISettingsAndroid;
        }
        if(isIosPlatform) {
            uiSettings = Xsolla.settings.paymentUISettingsIOS;
        }
        if(uiSettings == null) {
            uiSettings = {
                theme: "default",
                size: PaymentUiSize.medium,
                version: PaymentUiVersion.mobile
            };
        }
        
        let paymentUISettings = {
            theme: uiSettings.theme == null ? "default" : uiSettings.theme,
            size: uiSettings.size == null ? PaymentUiSize[PaymentUiSize.medium] : PaymentUiSize[uiSettings.size],
            version: uiSettings.version == null ? PaymentUiVersion[PaymentUiVersion.desktop] : PaymentUiVersion[uiSettings.version]
        };

        let paymentSettings: any = {
            ui: paymentUISettings
        };
        let redirectPolicySettings: RedirectPolicySettings = Xsolla.settings.redirectPolicySettingsWebGL;
        if(isAndroidPlatform) {
            redirectPolicySettings = Xsolla.settings.redirectPolicySettingsAndroid;
        }
        if(isIosPlatform) {
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

        if(redirectPolicySettings.useSettingsFromPublisherAccount) {
            if (sys.isMobile){
                paymentSettings.return_url = 'app://xpayment.' + NativeUtil.getAppId();

                paymentSettings.redirect_policy = {
                    redirect_conditions: PaymentRedirectCondition[PaymentRedirectCondition.any],
                    status_for_manual_redirection: PaymentRedirectStatusManual[PaymentRedirectStatusManual.none],
                    delay: 0,
                    redirect_button_caption: ''
                }
            }
        }
        else
        {
            if(redirectPolicySettings.returnUrl != '') {
                paymentSettings.return_url = redirectPolicySettings.returnUrl
            }
            let redirectSettings = {
                redirect_conditions: PaymentRedirectCondition[redirectPolicySettings.redirectCondition],
                status_for_manual_redirection: this.getPaymentRedirectStatusManual(redirectPolicySettings.redirectStatusManual),
                delay: redirectPolicySettings.redirectDelay,
                redirect_button_caption: redirectPolicySettings.redirectButtonCaption
            }
            paymentSettings.redirect_policy = redirectSettings
        }

        return paymentSettings;
    }

    private static getPaymentRedirectStatusManual(redirectStatusManual: PaymentRedirectStatusManual) {
        if(redirectStatusManual == PaymentRedirectStatusManual.purchase_for_virtual_currency) {
            return 'vc';
        }
        return PaymentRedirectStatusManual[redirectStatusManual];
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
