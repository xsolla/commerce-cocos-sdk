// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { XsollaOrders } from "../api/XsollaOrders";
import { CommerceError } from "../core/Error";
import { CentrifugoService, OrderStatusData } from "./CentrifugoService";
import { XsollaOrderStatus } from "./OrderTracker";

export class OrderCheckObject {

    private _shortPollingTimerInverval: number = -1;

    private _shortPollingLifeTime: number;
    private _bShortPollingExpired: boolean = false;
    private _orderId: number;
    private _accessToken: string;
    private _onSuccess: (orderId: number) => void;
    private _onError: (error:CommerceError) => void;

    init(accessToken: string, orderId: number, shouldStartWithCentrifugo: boolean = false,onSuccess:() => void, onError:(error:CommerceError) => void, shortPollingLifeTime: number = 600) {
        
        this._shortPollingLifeTime = Math.max(1, Math.min(shortPollingLifeTime, 3600)); // clamp
        this._orderId = orderId;
        this._accessToken = accessToken;
        this._onSuccess = onSuccess;
        this._onError = onError;

        if(shouldStartWithCentrifugo) {
            this.startCentrifugoTracking();
        } else {
            this.activateShortPolling();
        }
    }

    onConnectionError() {
        this.activateShortPolling();
    }

    onOrderStatusUpdated(data: OrderStatusData) {
        
        if(data.status.length == 0) {
            return;
        }

        if(data.order_id != this._orderId) {
            return;
        }

        let orderStatus = XsollaOrderStatus.unknown;
    
        if (data.status == 'new') {
            orderStatus = XsollaOrderStatus.new;
        }
        else if (data.status == 'paid') {
            orderStatus = XsollaOrderStatus.paid;
        }
        else if (data.status == 'done') {
            orderStatus = XsollaOrderStatus.done;
        }
        else if (data.status == 'canceled') {
            orderStatus = XsollaOrderStatus.canceled;
        }
        else {
            console.warn(`Centrifugo: Unknown order status: ${data.status} ${data.order_id}`);
        }
    
        if(orderStatus == XsollaOrderStatus.done) {
            this._onSuccess(data.order_id);
        }

        if(orderStatus == XsollaOrderStatus.canceled) {
            this._onError({ code: 0, description: 'Order canceled.'});
        }
    }

    onClosed(event:CloseEvent) {
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

    startCentrifugoTracking() {
        CentrifugoService.addTracker(this);
        CentrifugoService.orderStatusUpdated = this.onOrderStatusUpdated.bind(this);
        CentrifugoService.error = this.onConnectionError.bind(this);
        CentrifugoService.close = this.onClosed.bind(this);
    }

    stopCentrifugoTracking() {
        console.log('StopCentrifugoTracking');
        CentrifugoService.removeTracker(this);
        CentrifugoService.orderStatusUpdated.bind(null);
        CentrifugoService.error.bind(null);
        CentrifugoService.close.bind(null);
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
                this._onSuccess(this._orderId);
            }
        }, error => {
            this._onError(error);
        });
    }

    destroy() {
        this.stopCentrifugoTracking();
        this._bShortPollingExpired = true;
        clearTimeout( this._shortPollingTimerInverval);
    }
}