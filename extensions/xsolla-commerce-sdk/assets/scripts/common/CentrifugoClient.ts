// Copyright 2025 Xsolla Inc. All Rights Reserved.

import { UrlBuilder } from "../core/UrlBuilder";

export class CentrifugoClient {

    public onOpen: () => void;
    public onMessageReceived: (message: string) => void;
    public onError: (errorMessage: string) => void;
    public onClose: (reason: string) => void;

    private _pingMessage: string = '{}';
    private _pongMessage: string = '{}';

    private _websocket: WebSocket;

    connect() {
        let url = new UrlBuilder('wss://ws-store.xsolla.com/connection/websocket')
        .build();
        this._websocket = new WebSocket(url);
        this._websocket.onopen = this.onSocketOpen.bind(this);
        this._websocket.onerror = this.onSocketError.bind(this);
        this._websocket.onmessage = this.onSocketMessage.bind(this);
        this._websocket.onclose = this.onSocketClose.bind(this);
    }

    disconnect() {
        if(this._websocket.readyState != WebSocket.CLOSED) {
            this._websocket.close();
        }
        this._websocket = null;
    }

    send(data: string) {
        console.log(`Centrifugo. Websocket send data: ${data}`);
        this._websocket.send(data);
    }

    sendPing() {
        console.log(`Centrifugo. Websocket send ping.`);
        this._websocket.send(this._pingMessage);
    }

    isAlive() {
        return this._websocket.readyState == WebSocket.OPEN;
    }

    onSocketOpen(event:Event) {
        console.log('Centrifugo. Connected to the websocket server.');
        this.onOpen();
    }

    onSocketError(event:Event) {
        console.log('Centrifugo. Failed to connect to a websocket server.');
    }

    onSocketMessage(event:MessageEvent) {
        if(event.data == this._pingMessage) {
            console.log('Centrifugo. Websocket handshake.');
            this._websocket.send(this._pongMessage);
            return;
        }

        console.log(`Centrifugo. Received message from the websocket server:${event.data}`);
        this.onMessageReceived(event.data);
    }

    onSocketClose(event:CloseEvent) {
        console.log(`Centrifugo. Connection to the websocket server has been closed with code: ${event.code} and reason: ${event.reason}`);
        this.onClose(event.reason);
    }
}