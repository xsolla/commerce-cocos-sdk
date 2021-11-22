// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, sys } from 'cc';
import { XsollaCommerce } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCommerce';
import { XsollaUrlBuilder } from 'db://xsolla-commerce-sdk/scripts/core/XsollaUrlBuilder';
import { Xsolla } from 'db://xsolla-commerce-sdk/scripts/Xsolla';
import { TokenStorage } from '../Common/TokenStorage';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('MainMenuManager')
export class MainMenuManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

    @property(Button)
    logOutButton: Button;

    @property(Button)
    loadItemsButton: Button;

    bIsPaymentWidgetOpened:boolean = false;

    onDestroy() {
        this.removeListeners();
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners() {
        this.logOutButton.node.on(Button.EventType.CLICK, this.onLogoutClicked, this);
        this.loadItemsButton.node.on(Button.EventType.CLICK, this.onLoadItemsClicked, this);
    }

    removeListeners() {
        this.logOutButton.node.off(Button.EventType.CLICK, this.onLogoutClicked, this);
        this.loadItemsButton.node.off(Button.EventType.CLICK, this.onLoadItemsClicked, this);
    }

    onLogoutClicked() {
        this.uiManager.openStartingScreen(this.node);
        TokenStorage.clearToken();
    }

    onLoadItemsClicked() {
        XsollaCommerce.fetchPaymentToken(TokenStorage.getToken().access_token, 'booster_max_1', 1, undefined, undefined, undefined, undefined, result => {
            if(sys.isMobile) {
                let url: XsollaUrlBuilder;
                if(Xsolla.settings.enableSandbox) {
                    url = new XsollaUrlBuilder('https://sandbox-secure.xsolla.com/paystation3');
                } else {
                    url = new XsollaUrlBuilder('https://secure.xsolla.com/paystation3');
                }
                url.addStringParam('access_token', result.token);
                this.shortPollingCheckOrder(result.orderId, result.token);
                sys.openURL(url.build());
            } else {
                this.bIsPaymentWidgetOpened = true;
                this.openPaystationWidget(result.orderId, result.token, Xsolla.settings.enableSandbox, () => {
                    this.shortPollingCheckOrder(result.orderId, result.token);
                }, () => {
                    this.bIsPaymentWidgetOpened = false;
                });
            }
        } );
    }

    shortPollingCheckOrder(orderId: number, token: string) {
        XsollaCommerce.checkOrder(token, orderId, result => {
            console.log('shortPollingCheckOrder ' + result.status);
            if(result.status == 'done') {
                if(!sys.isMobile) {
                    this.сlosePaystationWidget();
                }
                this.uiManager.openMessageScreen('success purchase!');
                return;
            }

            if(sys.isMobile || this.bIsPaymentWidgetOpened) {
                if(result.status == 'new' || result.status == 'paid') {
                    setTimeout(result => {
                        this.shortPollingCheckOrder(orderId, token);
                    }, 3000);
                }
            }
        })
    }

    openPaystationWidget(orderId: number, token: string, sandbox: boolean, onComplete?:() => void, onClosed?:() => void) {
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
    
        let statusChangedFunction = function (event, data) {
            console.log('openPaystationWidget status changed');
            onComplete();
        };

        let closeWidgetFunction = function (event, data) {
            if (data === undefined) {
                s.removeEventListener('load', loadFunction, false);
                XPayStationWidget.off(XPayStationWidget.eventTypes.STATUS, statusChangedFunction);
                XPayStationWidget.off(XPayStationWidget.eventTypes.CLOSE, closeWidgetFunction);
                onClosed();
            }
            else {

            }
        };

        let loadFunction = function (e) {
            XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS, statusChangedFunction);
            XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE, closeWidgetFunction);
    
            XPayStationWidget.init(options);
            XPayStationWidget.open();
        };

        s.addEventListener('load', loadFunction, false);
    
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }

    сlosePaystationWidget() {
		if (typeof XPayStationWidget !== undefined) {
			XPayStationWidget.off();
		}

		var elements = document.getElementsByClassName('xpaystation-widget-lightbox');
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
	}
}
