// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
import { Xsolla, XsollaAuthenticationType } from 'db://xsolla-commerce-sdk/scripts/Xsolla';
import { UIManager, UIScreenType } from '../UI/UIManager';
import { CurrencyFormatter } from './CurrencyFormatter';
import { TokenUtils } from './TokenParser';
import { TokenStorage } from './TokenStorage';
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
        if(Xsolla.settings.authType == XsollaAuthenticationType.Oauth2) {
            XsollaLogin.refreshToken(cachedToken.refresh_token, token => {
                TokenStorage.saveToken(token, true);
                UIManager.instance.openScreen(UIScreenType.MainMenu);
            }, err => {
                console.log(err);
                TokenStorage.clearToken();
            });
        }
    }
}