// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { XsollaOrders } from "../api/XsollaOrders";
import { CommerceError } from "../core/Error";
import { UrlBuilder } from "../core/UrlBuilder";
import { Xsolla } from "../Xsolla";
import { XsollaOrderStatus } from "./OrderTracker";

export class OrderCheckObject {

    private _websocket: WebSocket;
    private _websocketTimerInverval: number = -1;
    private _shortPollingTimerInverval: number = -1;

    private _webSocketLifeTime: number;
    private _shortPollingLifeTime: number;
    private _bShortPollingExpired: boolean = false;
    private _orderId: number;
    private _accessToken: string;
    private _onSuccess: () => void;
    private _onError: (error:CommerceError) => void;

    init(accessToken: string, orderId: number, onSuccess:() => void, onError:(error:CommerceError) => void, webSocketLifeTime: number = 300, shortPollingLifeTime: number = 600) {
        
        let url = new UrlBuilder('wss://store-ws.xsolla.com/sub/order/status')
        .addStringParam('order_id', orderId.toString())
        .addStringParam('project_id', Xsolla.settings.projectId)
        .build();

        this._webSocketLifeTime = Math.max(1, Math.min(webSocketLifeTime, 3600)); // clamp
        this._shortPollingLifeTime = Math.max(1, Math.min(shortPollingLifeTime, 3600)); // clamp
        this._orderId = orderId;
        this._accessToken = accessToken;
        this._onSuccess = onSuccess;
        this._onError = onError;

        this._websocket = new WebSocket(url);

        this._websocket.onopen = function(event:Event) {
            console.log('Connected to the websocket server.');
        };
        this._websocket.onerror = this.onConnectionError.bind(this);
        this._websocket.onmessage = this.onMessage.bind(this);
        this._websocket.onclose = this.onClosed.bind(this);

        this._websocketTimerInverval = setTimeout(result => {
            console.log('Websocket object expired.');
            this._websocket.onopen = null;
            this._websocket.onerror = null;
            this._websocket.onmessage = null;
            this._websocket.onclose = null;
            this._websocket.close();
            this.activateShortPolling();
        }, this._webSocketLifeTime * 1000);
    }

    onConnectionError(event:Event) {
        let errorMessage = `Failed to connect to a websocket server`;
        console.log(errorMessage);
        this.activateShortPolling();
    }

    onMessage(event:MessageEvent) {
        console.log(`Received message from the websocket server:${event.data}`);
        let response = JSON.parse(event.data);

        if(response == null) {
            console.warn(`Can't parse received message.`);
            return;
        }
        let orderStatusStr:string = response['status'];
        let orderId:string = response['order_id'];
    
        let orderStatus = XsollaOrderStatus.unknown;
    
        if (orderStatusStr == 'new') {
            orderStatus = XsollaOrderStatus.new;
        }
        else if (orderStatusStr == 'paid') {
            orderStatus = XsollaOrderStatus.paid;
        }
        else if (orderStatusStr == 'done') {
            orderStatus = XsollaOrderStatus.done;
        }
        else if (orderStatusStr == 'canceled') {
            orderStatus = XsollaOrderStatus.canceled;
        }
        else {
            console.warn(`WebsocketObject: Unknown order status:${orderStatusStr} ${orderId}`);
        }
    
        if(orderStatus == XsollaOrderStatus.done) {
            this._onSuccess();
        }

        if(orderStatus == XsollaOrderStatus.canceled) {
            this._onError({ code: 0, description: 'Order canceled.'});
        }
    }

    onClosed(event:CloseEvent) {
        let errorMessage = `Connection to the websocket server has been closed with the code:${event.code}`;
        console.log(errorMessage);
        this.activateShortPolling();
    }

    activateShortPolling() {
        if(this._shortPollingTimerInverval == -1) {
            console.log('activate short polling');
            this._shortPollingTimerInverval = setTimeout(result => {
                console.log('Short polling expired.');
                this._bShortPollingExpired = true;
            }, this._shortPollingLifeTime * 1000);
            this.shortPollingCheckOrder();
        } else{
            console.log('short polling already activated');
        }
    }

    shortPollingCheckOrder() {
        XsollaOrders.checkOrder(this._accessToken, this._orderId, result => {
            console.log('shortPollingCheckOrder ' + result.status);
            if (result.status == 'new' || result.status == 'paid') {
                if (this._bShortPollingExpired) {
                    this._onError({code: 0, description: 'Short polling expired.'});
                } else {
                    setTimeout(result => {
                        this.shortPollingCheckOrder();
                    }, 3000);
                }
            }

            if (result.status == 'canceled') {
                this._onError({code: 0, description: 'Order canceled.'});
            }
            if (result.status == 'done') {
                this._onSuccess();
            }
        }, error => {
            this._onError(error);
        });
    }

    destroy() {
        console.log('Destroy websocket.');
        if(this._websocket != null) {
            this._websocket.onopen = null;
            this._websocket.onerror = null;
            this._websocket.onmessage = null;
            this._websocket.onclose = null;
            this._websocket.close();
        }

        this._bShortPollingExpired = true;

        clearTimeout( this._websocketTimerInverval);
        clearTimeout( this._shortPollingTimerInverval);
    }
}