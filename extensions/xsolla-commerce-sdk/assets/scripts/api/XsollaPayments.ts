// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { director, sys } from "cc";
import { Xsolla } from "../Xsolla";
import { BrowserUtil } from "../common/BrowserUtil";
import { NativeUtil } from "../common/NativeUtil";
import { UrlBuilder } from "../core/UrlBuilder";
import { Events } from "../core/Events";

export class XsollaPayments {

    /**
     * @en
     * Opens payment UI in the browser with a provided payment token. `onClose` callback is called after the browser is closed. The event is tracked only when the payment UI is opened in the built-in browser. External browser events can't be tracked.
     * @zh
     * 使用提供的支付令牌在浏览器中打开支付UI。浏览器关闭后会调用`onClose`回调。仅当支付UI在内置浏览器中打开时才会跟踪该事件。无法跟踪外部浏览器事件。
     */
    static openPurchaseUI(token: string, onClose?:(isManually: boolean) => void) {
        if (Xsolla.settings.enableInAppBrowser) {
            if (!sys.isBrowser) {
                if (sys.platform.toLowerCase() == 'ios') {
                    jsb.reflection.callStaticMethod("XsollaNativeUtils", "openPurchaseUI:sandbox:redirectUri:",
                        token,
                        Xsolla.settings.enableSandbox,
                        "app://xpayment." + NativeUtil.getAppId());
                }

                if (sys.platform.toLowerCase() == 'android') {
                    jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativePayments", "openPurchaseUI",
                        "(Ljava/lang/String;ZLjava/lang/String;Ljava/lang/String;)V",
                        token,
                        Xsolla.settings.enableSandbox,
                        "app",
                        "xpayment." + NativeUtil.getAppId());
                }

                director.getScene().on(Events.PAYMENT_CLOSE, (isManually: boolean) => {
                    director.getScene().off(Events.PAYMENT_CLOSE);
                    onClose?.(isManually);
                });
            }
            else {
                BrowserUtil.openPaystationWidget(token, Xsolla.settings.enableSandbox, onClose);
            }
        } else {
            let url: UrlBuilder;
            if (Xsolla.settings.enableSandbox) {
                url = new UrlBuilder('https://sandbox-secure.xsolla.com/paystation3');
            } else {
                url = new UrlBuilder('https://secure.xsolla.com/paystation3');
            }
            url.addStringParam('access_token', token);
            sys.openURL(url.build());
        }
    }
}
