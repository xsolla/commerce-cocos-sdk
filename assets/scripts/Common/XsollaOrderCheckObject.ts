// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { XsollaOrderStatus } from "./OrderTracker";

export class XsollaOrderCheckObject {

    private _websocket: WebSocket;
    private _timerInverval: number;

    init(url:string, onStatusReceived:(orderId:string, orderStatus:XsollaOrderStatus) => void, onError:(errorMessage:string) => void, onTimeout:() => void,
        socketLifeTime:number = 300) {
        
        socketLifeTime = Math.max(1, Math.min(socketLifeTime, 3600)); // clamp

        this._websocket = new WebSocket(url);

        this._websocket.onopen = function(event:Event) {
            console.log('Connected to the websocket server.');
        };
         this._websocket.onerror = function(event:Event) {
            let errorMessage = `Failed to connect to a websocket server`;
            console.log(errorMessage);
            onError(errorMessage);
         };
         this._websocket.onmessage = function(event:MessageEvent) {
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
        
           onStatusReceived(orderId, orderStatus);
        };
        this._websocket.onclose = function(event:CloseEvent) {
            let errorMessage = `Connection to the websocket server has been closed with the code:${event.code}`;
            console.log(errorMessage);
            onError(errorMessage);
        };

        this._timerInverval = setTimeout(result => {
            console.log('Websocket object expired.');
            onTimeout();
        }, socketLifeTime * 1000);
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
        clearTimeout( this._timerInverval);
    }
}