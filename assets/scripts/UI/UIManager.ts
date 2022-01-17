// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
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

    @property(Prefab)
    startingScreen: Prefab;

    @property(Prefab)
    basicAuth: Prefab;

    @property(Prefab)
    mainMenu: Prefab;

    @property(Prefab)
    passwordlessAuth: Prefab;

    @property(Prefab)
    socialAuth: Prefab;

    @property(Prefab)
    userAccountScreen: Prefab;

    @property(Prefab)
    characterScreen: Prefab;

    @property(Prefab)
    storeScreen: Prefab;

    @property(Prefab)
    inventoryScreen: Prefab;

    @property(Prefab)
    errorPopup: Prefab;

    @property(Prefab)
    messagePopup: Prefab;

    @property(Prefab)
    confirmationPopup: Prefab;

    @property(Prefab)
    loaderPopup: Prefab;

    static instance: UIManager;

    private _currentScreen: Node;
    private _previousScreen: Node;

    private _loaderCounter: number = 0;
    private _loaderPopupInstance: Node = null;

    onLoad() {
        UIManager.instance = this;
    }

    openScreen(screenToOpen:UIScreenType) {
        this._previousScreen = this._currentScreen;        
        switch(screenToOpen) {
            case UIScreenType.Starting: {
                this._currentScreen = instantiate(this.startingScreen);
                break;
            }
            case UIScreenType.BasicAuth: {
                this._currentScreen = instantiate(this.basicAuth);
                break;
            } 
            case UIScreenType.PasswordlessAuth: {
                this._currentScreen = instantiate(this.passwordlessAuth);
                break;
            }
            case UIScreenType.SocialAuth: {
                this._currentScreen = instantiate(this.socialAuth);
                break;
            }
            case UIScreenType.MainMenu: {
                this._currentScreen = instantiate(this.mainMenu);
                break;
            }
            case UIScreenType.Store: {
                this._currentScreen = instantiate(this.storeScreen);
                break;
            } 
            case UIScreenType.Inventory: {
                this._currentScreen = instantiate(this.inventoryScreen);
                break;
            } 
            case UIScreenType.Character: {
                this._currentScreen = instantiate(this.characterScreen);
                break;
            } 
            case UIScreenType.UserAccount: {
                this._currentScreen = instantiate(this.userAccountScreen);
                break;
            } 
        }
        this.node.addChild(this._currentScreen);
        this._previousScreen?.destroy();
    }

    showErrorPopup(errorMessage: string, onClosed?: () => void) {
        let errorPopupInstance = instantiate(this.errorPopup);
        errorPopupInstance.getComponent(ErrorPopup).showError(errorMessage, () => {
            onClosed?.();
            errorPopupInstance.destroy();
        });
        this.node.addChild(errorPopupInstance);
    }

    showMessagePopup(message: string, onClosed?: () => void) {
        let messagePopupInstance = instantiate(this.messagePopup);
        messagePopupInstance.getComponent(MessagePopup).showMessage(message, () => {
            onClosed?.();
            messagePopupInstance.destroy();
        });
        this.node.addChild(messagePopupInstance);
    }

    showConfirmationPopup(message: string, confirmBtnText: string,  onComfirm?: () => void, onClosed?: () => void) {
        let confirmationPopupInstance = instantiate(this.confirmationPopup);
        confirmationPopupInstance.getComponent(ConfirmationPopup).showMessage(message, confirmBtnText, () => {
            onComfirm?.();
            confirmationPopupInstance.destroy();
        }, () => {
            onClosed?.();
            confirmationPopupInstance.destroy();
        });
        this.node.addChild(confirmationPopupInstance);
    }

    showLoaderPopup(showLoader: boolean) {
        if(!showLoader && this._loaderCounter == 0) {
            console.warn('try to destroy the loader, but it is already destroyed.');
            return;
        }
        this._loaderCounter = showLoader ? this._loaderCounter + 1 : this._loaderCounter - 1;
        if(this._loaderCounter < 0) {
            this._loaderCounter = 0;
        }
        if(this._loaderCounter > 0 && this._loaderPopupInstance == null) {
            this._loaderPopupInstance = instantiate(this.loaderPopup);
            this._loaderPopupInstance.setPosition(0, 0, 10);
            this.node.addChild(this._loaderPopupInstance);
            console.log('loader added');
        }
        if(this._loaderCounter == 0 && this._loaderPopupInstance != null) {
            this._loaderPopupInstance.destroy();
            this._loaderPopupInstance = null;
            console.log('loader destroyed');
        }
    }
}