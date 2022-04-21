// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { sys, _decorator } from 'cc';
import { UrlBuilder } from '../core/UrlBuilder';
import { Xsolla } from '../Xsolla';

export class BrowserUtil {

    static openPurchaseUI(token: string) {
        let sandbox = Xsolla.settings.enableSandbox;

        if (sys.isMobile) {
            let url: UrlBuilder;
            if (sandbox) {
                url = new UrlBuilder('https://sandbox-secure.xsolla.com/paystation3');
            } else {
                url = new UrlBuilder('https://secure.xsolla.com/paystation3');
            }
            url.addStringParam('access_token', token);
            sys.openURL(url.build());
        }
        else {
            this.openPaystationWidget(token, sandbox);
        }
    }

    private static openPaystationWidget(token: string, sandbox: boolean) {
        console.log('openPaystationWidget opened');
        var jsToken = token;
        var isSandbox = sandbox;
        var options = {
            access_token: jsToken,
            sandbox: isSandbox,
            lightbox: {
                width: '740px',
                height: '760px',
                spinner: 'round',
                spinnerColor: '#cccccc',
            }
        };

        var s = document.createElement('script');
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://static.xsolla.com/embed/paystation/1.2.3/widget.min.js";

        s.addEventListener('load', function (e) {
            console.log('openPaystationWidget load event');
            // @ts-ignore 
            XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS, function (event, data) {
                console.log('openPaystationWidget status event');
                BrowserUtil.closePaystationWidget();
            });

            // @ts-ignore 
            XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE, function (event, data) {
                console.log('openPaystationWidget close event');
                BrowserUtil.closePaystationWidget();
            });

            // @ts-ignore
            XPayStationWidget.init(options);
            // @ts-ignore
            XPayStationWidget.open();
        }, false);

        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }

    private static closePaystationWidget() {
        console.log('closePaystationWidget');
        // @ts-ignore
        if (typeof XPayStationWidget !== undefined) {
            // @ts-ignore
            XPayStationWidget.off();
        }

        var elements = document.getElementsByClassName('xpaystation-widget-lightbox');
        for (var i = 0; i < elements.length; i++) {
            (elements[i] as HTMLElement).style.display = 'none';
        }
    }
}