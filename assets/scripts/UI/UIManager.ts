// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, find } from 'cc';
import { CurrencyFormatter } from '../Common/CurrencyFormatter';
import { TokenStorage } from '../Common/TokenStorage';
import { ConfirmationPopup } from './Popups/ConfirmationPopup';
import { ErrorPopup } from './Popups/ErrorPopup';
import { MessagePopup } from './Popups/MessagePopup';

const { ccclass, property } = _decorator;

export enum UIScreenType {
    Starting = 0,
    BasicAuth = 1,
    PasswordlessAuth = 2,
    SocialAuth = 3,
    MainMenu = 4,
    Store = 5,
    Inventory = 6,
    Character = 7,
    UserAccount = 8
}
 
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
    userAccountScreen: Node;

    @property(Node)
    characterScreen: Node;

    @property(Node)
    storeScreen: Node;

    @property(Node)
    inventoryScreen: Node;

    @property(ErrorPopup)
    errorScreen: ErrorPopup;

    @property(MessagePopup)
    messageScreen: MessagePopup;

    @property(ConfirmationPopup)
    confirmationScreen: ConfirmationPopup;

    static instance: UIManager;

    start() {
        this.startingScreen.active = true;
        UIManager.instance = this;
        CurrencyFormatter.init();
        if(TokenStorage.getToken() != null) {
            this.openScreen(UIScreenType.MainMenu, this.startingScreen);
        }
    }

    openScreen(screenToOpen:UIScreenType, currentScreen:Node) {
        currentScreen.active = false;
        switch(screenToOpen) {
            case UIScreenType.Starting: {
                this.startingScreen.active = true;
                break;
            }
            case UIScreenType.BasicAuth: {
                this.basicAuth.active = true;
                break;
            } 
            case UIScreenType.PasswordlessAuth: {
                this.passwordlessAuth.active = true;
                break;
            }
            case UIScreenType.SocialAuth: {
                this.socialAuth.active = true;
                break;
            }
            case UIScreenType.MainMenu: {
                this.mainMenu.active = true;
                break;
            }
            case UIScreenType.Store: {
                this.storeScreen.active = true;
                break;
            } 
            case UIScreenType.Inventory: {
                this.inventoryScreen.active = true;
                break;
            } 
            case UIScreenType.Character: {
                this.characterScreen.active = true;
                break;
            } 
            case UIScreenType.UserAccount: {
                this.userAccountScreen.active = true;
                break;
            } 
        }
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