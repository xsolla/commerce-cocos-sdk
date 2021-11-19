// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, find } from 'cc';
import { TokenStorage } from '../Common/TokenStorage';
import { ErrorScreenManager } from './ErrorScreenManager';
import { MessageScreenManager } from './MessageScreenManager';
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

    @property(ErrorScreenManager)
    errorScreen: ErrorScreenManager;

    @property(MessageScreenManager)
    messageScreen: MessageScreenManager;

    start() {
        this.startingScreen.active = true;

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

    openErrorScreen(currentScreen:Node, errorMessage: string, onClosed?: () => void) {
        currentScreen.active = false;
        this.errorScreen.showError(errorMessage, () => {
            currentScreen.active = true;
            onClosed?.();
        });
    }

    openMessageScreen(message: string, onClosed?: () => void) {
        this.messageScreen.node.active = true;
        this.messageScreen.showMessage(message, () => {
            onClosed?.();
        });
    }
}