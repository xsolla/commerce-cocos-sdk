// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { CurrencyFormatter } from 'db://xsolla-commerce-sdk/scripts/common/CurrencyFormatter';
import { UIManager, UIScreenType } from './UI/UIManager';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { TokenUtils } from 'db://xsolla-commerce-sdk/scripts/common/TokenParser';
const { ccclass } = _decorator;
 
@ccclass('XsollaDemo')
export class XsollaDemo extends Component {
    start () {
        CurrencyFormatter.init();
        UIManager.instance.openScreen(UIScreenType.Starting);  
        this.tryAutomaticAuth();
    }

    tryAutomaticAuth() {
        let cachedToken = TokenStorage.getToken();
        if (!cachedToken) {
            return;
        }
        if (!TokenUtils.isTokenExpired(cachedToken)) {
            UIManager.instance.openScreen(UIScreenType.MainMenu);
            return;
        }
        UIManager.instance.showLoaderPopup(true);
        XsollaAuth.refreshToken(cachedToken.refresh_token, token => {
            UIManager.instance.showLoaderPopup(false);
            TokenStorage.saveToken(token, true);
            UIManager.instance.openScreen(UIScreenType.MainMenu);
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            TokenStorage.clearToken();
        });
    }
}