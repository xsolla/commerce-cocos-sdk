// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, sys } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
import { TokenStorage } from '../Common/TokenStorage';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('StartingScreenManager')
export class StartingScreenManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

    @property(Button)
    basicAuthButton: Button;

    @property(Button)
    deviceIdAuthButton: Button;

    @property(Button)
    otherAuthButton: Button;

    start() {
        this.deviceIdAuthButton.node.active = sys.isMobile;
    }

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
        this.basicAuthButton.node.on(Button.EventType.CLICK, this.onBasicAuthClicked, this);
        this.deviceIdAuthButton.node.on(Button.EventType.CLICK, this.onDeviceIdAuthClicked, this);
        this.otherAuthButton.node.on(Button.EventType.CLICK, this.onOtherAuthClicked, this);
    }

    removeListeners() {
        this.basicAuthButton.node.off(Button.EventType.CLICK, this.onBasicAuthClicked, this);
        this.deviceIdAuthButton.node.off(Button.EventType.CLICK, this.onDeviceIdAuthClicked, this);
        this.otherAuthButton.node.off(Button.EventType.CLICK, this.onOtherAuthClicked, this);
    }

    onBasicAuthClicked() {
        this.uiManager.openBasicAuth(this.node);
    }

    onDeviceIdAuthClicked() {
        let deviceId: string;
        let deviceName: string;
        if(sys.platform.toLowerCase() == 'android') {
            deviceId = jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "getDeviceId", "()Ljava/lang/String;");
            deviceName = jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "getDeviceName", "()Ljava/lang/String;");
        }
        if(sys.platform.toLowerCase() == 'ios') {
            deviceId = jsb.reflection.callStaticMethod("XsollaNativeUtils", "getDeviceId");
            deviceName = jsb.reflection.callStaticMethod("XsollaNativeUtils", "getDeviceName");
        }

        XsollaLogin.authByDeviceId(deviceName, deviceId, 'xsollatest', 'xsollatest', token => {
            console.log(token);
            TokenStorage.saveToken(token, true);
            this.uiManager.openMainMenu(this.node);
        }, err => {
            console.log(err);
            this.uiManager.openErrorScreen(err.description);
        })
    }

    onOtherAuthClicked() {
        this.uiManager.openPasswordlessAuth(this.node);
    }
}
