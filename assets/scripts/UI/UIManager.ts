// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, find } from 'cc';
import { TokenStorage } from '../Common/TokenStorage';
import { ConfirmationScreenManager } from './ConfirmationScreenManager';
import { ErrorScreenManager } from './ErrorScreenManager';
import { MessageScreenManager } from './MessageScreenManager';
import { CurrencyFormatter } from './Utils/CurrencyFormatter';
const { ccclass, property } = _decorator;
 
@ccclass('UIManager')
export class UIManager extends Component {

    @property(Node)
    startingScreen: Node;

    @property(Node)
    basicAuth: Node;

    @property(Node)
    mainMenu: Node;

    @property(Node)
    passwordlessAuth: Node;

    @property(Node)
    socialAuth: Node;

    @property(Node)
    characterScreen: Node;

    @property(Node)
    storeScreen: Node;

    @property(Node)
    inventoryScreen: Node;

    @property(ErrorScreenManager)
    errorScreen: ErrorScreenManager;

    @property(MessageScreenManager)
    messageScreen: MessageScreenManager;

    @property(ConfirmationScreenManager)
    confirmationScreen: ConfirmationScreenManager;

    static instance: UIManager;

    start() {
        this.startingScreen.active = true;
        UIManager.instance = this;
        CurrencyFormatter.init();
        if(TokenStorage.getToken() != null) {
            this.openMainMenu(this.startingScreen);
        }
    }

    openStartingScreen(currentScreen:Node) {
        currentScreen.active = false;
        this.startingScreen.active = true;
    }

    openBasicAuth(currentScreen:Node) {
        currentScreen.active = false;
        this.basicAuth.active = true;
    }

    openMainMenu(currentScreen:Node) {
        currentScreen.active = false;
        this.mainMenu.active = true;
    }

    openPasswordlessAuth(currentScreen:Node) {
        currentScreen.active = false;
        this.passwordlessAuth.active = true;
    }

    openSocialAuth(currentScreen:Node) {
        currentScreen.active = false;
        this.socialAuth.active = true;
    }

    openCharacterScreen(currentScreen:Node) {
        currentScreen.active = false;
        this.characterScreen.active = true;
    }

    openStoreScreen(currentScreen:Node) {
        currentScreen.active = false;
        this.storeScreen.active = true;
    }

    openInventoryScreen(currentScreen:Node) {
        currentScreen.active = false;
        this.inventoryScreen.active = true;
    }

    openErrorScreen(errorMessage: string, onClosed?: () => void) {
        this.errorScreen.node.active = true;
        this.errorScreen.showError(errorMessage, () => {
            this.errorScreen.node.active = false;
            onClosed?.();
        });
    }

    openMessageScreen(message: string, onClosed?: () => void) {
        this.messageScreen.node.active = true;
        this.messageScreen.showMessage(message, () => {
            onClosed?.();
        });
    }

    openConfirmationScreen(message: string, confirmBtnText: string,  onComfirm?: () => void, onClosed?: () => void) {
        this.confirmationScreen.node.active = true;
        this.confirmationScreen.showMessage(message, confirmBtnText, () => {
            this.confirmationScreen.node.active = false;
            onComfirm?.();
        }, () => {
            this.confirmationScreen.node.active = false;
            onClosed?.();
        });
    }
}