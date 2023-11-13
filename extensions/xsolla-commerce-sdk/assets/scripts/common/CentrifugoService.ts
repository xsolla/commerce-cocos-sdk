// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { Xsolla } from "../Xsolla";
import { CentrifugoClient } from "./CentrifugoClient";
import { OrderCheckObject } from "./OrderCheckObject";
import { TokenStorage } from "./TokenStorage";

export class CentrifugoService {

    private static _trackers: Array<OrderCheckObject> = [];
    private static _centrifugoClient: CentrifugoClient;
    private static _pingCounter: number = 0;
    private static _timeoutCounter: number = 0;
    private static _centrifugoTimerInverval: number;
    private static _pingInterval: number = 25;
    private static _timeoutLimit: number = 600;

    static addTracker(tracker: OrderCheckObject) {
        console.log(`addTracker ${tracker.orderId}`)
        this._trackers.push(tracker);
        if(this._centrifugoClient == null) {
            this.createCentrifugoClient();
        }
    }

    static removeTracker(tracker: OrderCheckObject) {
        console.log(`removeTracker ${tracker.orderId}`)
        const index = this._trackers.indexOf(tracker, 0);
        if (index > -1) {
            this._trackers.splice(index, 1);
        }
        if(this._trackers.length == 0 && this._centrifugoClient != null) {
            this.terminateCentrifugoClient();
        }
    }

    static createCentrifugoClient() {
        this._centrifugoClient = new CentrifugoClient();
        this._centrifugoClient.onOpen = this.onCentrifugoOpen.bind(this);
        this._centrifugoClient.onMessageReceived = this.OnCentrifugoMessageReceived.bind(this);
        this._centrifugoClient.onError = this.onCentrifugoError.bind(this);
        this._centrifugoClient.onClose = this.onCentrifugoClosed.bind(this);
        this._centrifugoClient.connect();
    }

    static terminateCentrifugoClient() {
        this._centrifugoClient.onMessageReceived.bind(null);
        this._centrifugoClient.onError.bind(null);
        this._centrifugoClient.onClose.bind(null);
        this._centrifugoClient.disconnect();
        this._centrifugoClient = null;
        clearTimeout(this._centrifugoTimerInverval);
        console.log('Centrifugo client terminated');
    }

    static onCentrifugoOpen() {
        let id: number = Math.floor( Math.random() * 100000000 );
        let projectId: number = Number(Xsolla.settings.projectId);

        let connectionMessage: ConnectionMessage = {
            connect: {
                data: {
                    auth: TokenStorage.getToken().access_token,
                    project_id: projectId
                }
            },
            id: id
        }

        this._centrifugoClient.send(JSON.stringify(connectionMessage));

        this._centrifugoTimerInverval = setTimeout(this.doPing, 1 * 1000);
        console.log('Centrifugo client created');
    }

    static OnCentrifugoMessageReceived(message: string) {
        this._pingCounter = 0;

        let receivedObject = JSON.parse(message);

        if(receivedObject["push"] != null) {
            let orderStatusMessage: OrderStatusMessage = receivedObject;
            this._trackers.forEach(tracker => tracker.onOrderStatusUpdated(orderStatusMessage.push.pub.data));
            return;
        }

        if(receivedObject["connect"] != null) {
            console.log('Connect message received.');
            return;
        }
        console.log(`Can't parse received centrifugo message.`);
    }

    static onCentrifugoError(errorMessage: string) {
        this._trackers.forEach(tracker => tracker.onConnectionError());
    }

    static onCentrifugoClosed(errorMessage: string) {
        this._trackers.forEach(tracker => tracker.onClosed(errorMessage));
    }

    static doPing() {
        this._pingCounter += 1;
        if(this._pingCounter >= this._pingInterval) {
            this._pingCounter = 0;
            this._centrifugoClient.sendPing();
            if(this._centrifugoClient.isAlive()) {
                this._timeoutCounter = 0;
            } else {
                this._timeoutCounter += this._pingInterval;
                if(this._timeoutCounter >= this._timeoutLimit) {
                    console.log('Centrifugo connection timeout limit exceeded.');
                    this.onCentrifugoClosed('Network problems');
                }
            }
        }
        this._centrifugoTimerInverval = setTimeout(this.doPing, 1 * 1000);
    }
}

export interface OrderStatusData {
    order_id: number;
    status: string;
}

export interface OrderStatusPub {
    data: OrderStatusData;
    offset: number;
}

export interface OrderStatusPush {
    pub: OrderStatusPub;
    channel: string;
}

export interface OrderStatusMessage {
    push: OrderStatusPush;
}

export interface ConnectionData {
    auth: string;
    project_id: number;
}

export interface ConnectCommand {
    data: ConnectionData;
}

export interface ConnectionMessage {
    connect: ConnectCommand;
    id: number;
}