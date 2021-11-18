// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, sys } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
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
        this.basicAuthButton.node.on('click', this.onBasicAuthClicked, this);
        this.deviceIdAuthButton.node.on('click', this.onDeviceIdAuthClicked, this);
        this.otherAuthButton.node.on('click', this.onOtherAuthClicked, this);
    }

    removeListeners() {
        this.basicAuthButton.node.off('click', this.onBasicAuthClicked, this);
        this.deviceIdAuthButton.node.off('click', this.onDeviceIdAuthClicked, this);
        this.otherAuthButton.node.off('click', this.onOtherAuthClicked, this);
    }

    onBasicAuthClicked() {
        this.uiManager.openBasicAuth(this.node);
    }

    onDeviceIdAuthClicked() {
        let deviceId: string;
        if(sys.platform.toLowerCase() == 'android') {
            deviceId = jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "getDeviceId", "()Ljava/lang/String;");
        }
        if(sys.platform.toLowerCase() == 'ios') {
            deviceId = ''; // add native iOS implementation
        }

        XsollaLogin.authByDeviceId('Test', deviceId, 'xsollatest', 'xsollatest', token => {
            console.log(token);
            this.uiManager.openMainMenu(this.node);
        }, err => {
            console.log(err);
            this.uiManager.openErrorScreen(this.node, err.description);
        })
    }

    onOtherAuthClicked() {
        this.uiManager.openPasswordlessAuth(this.node);
    }
}
