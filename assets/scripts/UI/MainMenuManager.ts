// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button } from 'cc';
import { PaymentTokenResult, StoreItemsList, XsollaCommerce } from '../../../extensions/xsolla-commerce-sdk/assets/scripts/api/XsollaCommerce';
import { XsollaLogin } from '../../../extensions/xsolla-commerce-sdk/assets/scripts/api/XsollaLogin';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('MainMenuManager')
export class MainMenuManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

    @property(Button)
    logOutButton: Button;

    @property(Button)
    loadItemsButton: Button;

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
        this.logOutButton.node.on('click', this.onLogoutClicked, this);
        this.loadItemsButton.node.on('click', this.onLoadItemsClicked, this);
    }

    removeListeners() {
        this.logOutButton.node.off('click', this.onLogoutClicked, this);
        this.loadItemsButton.node.off('click', this.onLoadItemsClicked, this);
    }

    onLogoutClicked() {
        this.uiManager.openStartingScreen(this.node);
    }

    onLoadItemsClicked() {
       XsollaCommerce.updateItemGroups('', () => {
            XsollaCommerce.itemsData.groups;
            console.log('successfull loading');
       }, error => {
           console.log('error');
       });
    }

    shortPollingCheckOrder(orderId: number) {
        XsollaCommerce.checkOrder(XsollaLogin.cachedToken.access_token, XsollaCommerce.cachedPaymentResult.orderId, result => {
            console.log('shortPollingCheckOrder ' + result.status);
            if(result.status == 'done')
            {
                this.uiManager.openMessageScreen('success purchase!');
                return;
            }
            if(result.status == 'new' || result.status == 'paid')
            {
                setTimeout( result => {
                    this.shortPollingCheckOrder(orderId);
                }, 3000);
            }
        })
    }
}
