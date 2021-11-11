// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, find } from 'cc';
import { ErrorScreenManager } from './ErrorScreenManager';
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

    start() {
        this.startingScreen.active = true;
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

    openErrorScreen(errorMessage: string, onClosed?: () => void) {
        this.errorScreen.showError(errorMessage, onClosed);
    }
}