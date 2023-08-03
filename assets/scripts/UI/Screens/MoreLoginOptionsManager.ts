// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, sys, director } from 'cc';
import { Token, XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UIManager, UIScreenType } from '../UIManager';
import { NativeUtil } from 'db://xsolla-commerce-sdk/scripts/common/NativeUtil';
import { Events } from 'db://xsolla-commerce-sdk/scripts/core/Events';
const { ccclass, property } = _decorator;
 
@ccclass('MoreLoginOptionsManager')
export class MoreLoginOptionsManager extends Component {

    @property(Button)
    backButton: Button;

    @property(Button)
    authByPhoneButton: Button;

    @property(Button)
    authByEmailButton: Button;

    @property(Button)
    deviceIdAuthButton: Button;

    @property(Button)
    xsollaWidgetAuthButton: Button;

    start() {
        this.deviceIdAuthButton.node.active = sys.isMobile;
        this.xsollaWidgetAuthButton.node.active = !sys.isBrowser;
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners() {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.deviceIdAuthButton.node.on(Button.EventType.CLICK, this.onDeviceIdAuthClicked, this);
        this.authByEmailButton.node.on(Button.EventType.CLICK, this.onAuthByEmailClicked, this);
        this.authByPhoneButton.node.on(Button.EventType.CLICK, this.onAuthByPhoneClicked, this);
        this.xsollaWidgetAuthButton.node.on(Button.EventType.CLICK, this.onXsollaWidgetAuthClicked, this);

        director.getScene().on(Events.XSOLLA_WIDGET_AUTH_SUCCESS, this.handleSuccessfulXsollaWidgetAuth, this );
        director.getScene().on(Events.XSOLLA_WIDGET_AUTH_ERROR, this.handleErrorXsollaWidgetAuth, this );
        director.getScene().on(Events.XSOLLA_WIDGET_AUTH_CANCELED, this.handleCancelXsollaWidgetAuth, this );
    }

    removeListeners() {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.deviceIdAuthButton.node.off(Button.EventType.CLICK, this.onDeviceIdAuthClicked, this);
        this.authByEmailButton.node.off(Button.EventType.CLICK, this.onAuthByEmailClicked, this);
        this.authByPhoneButton.node.off(Button.EventType.CLICK, this.onAuthByPhoneClicked, this);
        this.xsollaWidgetAuthButton.node.off(Button.EventType.CLICK, this.onXsollaWidgetAuthClicked, this);

        director.getScene().off(Events.XSOLLA_WIDGET_AUTH_SUCCESS, this.handleSuccessfulXsollaWidgetAuth, this );
        director.getScene().off(Events.XSOLLA_WIDGET_AUTH_ERROR, this.handleErrorXsollaWidgetAuth, this );
        director.getScene().off(Events.XSOLLA_WIDGET_AUTH_CANCELED, this.handleCancelXsollaWidgetAuth, this );
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.Starting);
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

        UIManager.instance.showLoaderPopup(true);
        XsollaAuth.authByDeviceId(deviceName, deviceId, 'xsollatest', token => {
            UIManager.instance.showLoaderPopup(false);
            console.log(token);
            TokenStorage.saveToken(token, true);
            UIManager.instance.openScreen(UIScreenType.MainMenu);
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        })
    }

    onAuthByEmailClicked() {
        UIManager.instance.openScreen(UIScreenType.AuthByEmail);
    }

    onAuthByPhoneClicked() {
        UIManager.instance.openScreen(UIScreenType.AuthByPhone);
    }

    onXsollaWidgetAuthClicked() {
        UIManager.instance.showLoaderPopup(true);
        NativeUtil.authWithXsollaWidget();
    }

    handleSuccessfulXsollaWidgetAuth(token:Token) {
        UIManager.instance.showLoaderPopup(false);
        TokenStorage.saveToken(token, true);
        UIManager.instance.openScreen(UIScreenType.MainMenu);
    }

    handleCancelXsollaWidgetAuth() {
        UIManager.instance.showLoaderPopup(false);
    }

    handleErrorXsollaWidgetAuth(error:string) {
        UIManager.instance.showLoaderPopup(false);
        console.log(error);
        UIManager.instance.showErrorPopup(error);
    }
}