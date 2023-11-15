// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { Game, game } from "cc";
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
        console.log(`addTracker ${tracker.orderId}`);
        CentrifugoService._trackers.push(tracker);
        if(CentrifugoService._centrifugoClient == null) {
            CentrifugoService.createCentrifugoClient();
        }
    }

    static removeTracker(tracker: OrderCheckObject) {
        const index = CentrifugoService._trackers.indexOf(tracker, 0);
        if (index > -1) {
            CentrifugoService._trackers.splice(index, 1);
            console.log(`removeTracker ${tracker.orderId}`);
        }
        if(CentrifugoService._trackers.length == 0 && CentrifugoService._centrifugoClient != null) {
            CentrifugoService.terminateCentrifugoClient();
        }
    }

    static createCentrifugoClient() {
        CentrifugoService._centrifugoClient = new CentrifugoClient();
        CentrifugoService._centrifugoClient.onOpen = CentrifugoService.onCentrifugoOpen.bind(CentrifugoService);
        CentrifugoService._centrifugoClient.onMessageReceived = CentrifugoService.OnCentrifugoMessageReceived.bind(CentrifugoService);
        CentrifugoService._centrifugoClient.onError = CentrifugoService.onCentrifugoError.bind(CentrifugoService);
        CentrifugoService._centrifugoClient.onClose = CentrifugoService.onCentrifugoClosed.bind(CentrifugoService);
        CentrifugoService._centrifugoClient.connect();

        game.on(Game.EVENT_SHOW, CentrifugoService.onDisconnectClient);
        game.on(Game.EVENT_HIDE, CentrifugoService.onConnectClient);
    }

    static onDisconnectClient() {

    }

    static onConnectClient() {

    }

    static terminateCentrifugoClient() {
        CentrifugoService._centrifugoClient.onMessageReceived.bind(null);
        CentrifugoService._centrifugoClient.onError.bind(null);
        CentrifugoService._centrifugoClient.onClose.bind(null);
        CentrifugoService._centrifugoClient.disconnect();
        CentrifugoService._centrifugoClient = null;
        clearTimeout(CentrifugoService._centrifugoTimerInverval);
        game.off(Game.EVENT_SHOW, CentrifugoService.onDisconnectClient);
        game.off(Game.EVENT_HIDE, CentrifugoService.onConnectClient);
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

        CentrifugoService._centrifugoClient.send(JSON.stringify(connectionMessage));

        CentrifugoService._centrifugoTimerInverval = setTimeout(CentrifugoService.doPing, 1 * 1000);
        
        console.log('Centrifugo client created');
    }

    static OnCentrifugoMessageReceived(message: string) {
        CentrifugoService._pingCounter = 0;

        let receivedObject = JSON.parse(message);

        if(receivedObject["push"] != null) {
            let orderStatusMessage: OrderStatusMessage = receivedObject;
            CentrifugoService._trackers.forEach(tracker => tracker.onOrderStatusUpdated(orderStatusMessage.push.pub.data));
            return;
        }

        if(receivedObject["connect"] != null) {
            console.log('Connect message received.');
            return;
        }
        console.log(`Can't parse received centrifugo message.`);
    }

    static onCentrifugoError(errorMessage: string) {
        CentrifugoService._trackers.forEach(tracker => tracker.onConnectionError());
    }

    static onCentrifugoClosed(errorMessage: string) {
        CentrifugoService._trackers.forEach(tracker => tracker.onClosed(errorMessage));
    }

    static doPing() {
        CentrifugoService._pingCounter += 1;
        if(CentrifugoService._pingCounter >= CentrifugoService._pingInterval) {
            CentrifugoService._pingCounter = 0;
            CentrifugoService._centrifugoClient.sendPing();
            if(CentrifugoService._centrifugoClient.isAlive()) {
                CentrifugoService._timeoutCounter = 0;
            } else {
                CentrifugoService._timeoutCounter += CentrifugoService._pingInterval;
                if(CentrifugoService._timeoutCounter >= CentrifugoService._timeoutLimit) {
                    console.log('Centrifugo connection timeout limit exceeded.');
                    CentrifugoService.onCentrifugoClosed('Network problems');
                }
            }
        }
        CentrifugoService._centrifugoTimerInverval = setTimeout(CentrifugoService.doPing, 1 * 1000);
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