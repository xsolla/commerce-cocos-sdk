// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Texture2D, instantiate, Prefab, sys, Sprite, SpriteFrame, UITransform } from 'cc';
import { UserDetails, UserDetailsUpdate, XsollaUserAccount } from 'db://xsolla-commerce-sdk/scripts/api/XsollaUserAccount';
import { AuthenticationType, Xsolla } from '../../../../extensions/xsolla-commerce-sdk/assets/scripts/Xsolla';
import { TokenStorage } from '../../Common/TokenStorage';
import { UserAccountItem } from '../Misc/UserAccountItem';
import { UserAvatarItem } from '../Misc/UserAvatarItem';
import { UIManager, UIScreenType } from '../UIManager';
import { ImageUtils } from '../Utils/ImageUtils';
const { ccclass, property } = _decorator;
 
@ccclass('UserAccountManager')
export class UserAccountManager extends Component {

    @property(Button)
    backButton: Button;

    @property(UserAccountItem)
    emailItem: UserAccountItem;

    @property(UserAccountItem)
    usernameItem: UserAccountItem;

    @property(UserAccountItem)
    nicknameItem: UserAccountItem;

    @property(UserAccountItem)
    firstNameItem: UserAccountItem;

    @property(UserAccountItem)
    lastNameItem: UserAccountItem;

    @property(UserAccountItem)
    phoneNumberItem: UserAccountItem;

    @property(Sprite)
    avatar: Sprite;

    @property(Sprite)
    bigAvatar: Sprite;

    @property(Prefab)
    avatarItemPrefab: Prefab;

    @property(Texture2D)
    noAvatar: Texture2D;

    @property(Node)
    avatarPicker: Node;

    @property(Node)
    avatarsList: Node;

    @property(Button)
    removeAvatarButton: Button;

    @property(Button)
    avatarButton: Button;

    @property(Button)
    closeAvatarPickerButton: Button;

    @property(Texture2D)
    defaultAvatars: Texture2D[] = [];

    start() {
        this.avatarsList.destroyAllChildren();
        for(let avatarTexture of this.defaultAvatars) {
            let avatarItem = instantiate(this.avatarItemPrefab);
            this.avatarsList.addChild(avatarItem);
            avatarItem.getComponent(UserAvatarItem).init(avatarTexture, this);
        }
    }

    onEnable() {
        this.refreshUserAccountScreen();
        this.setAvatarEditMode(false);
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.MainMenu);
    }

    refreshUserAccountScreen() {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.getUserDetails(TokenStorage.token.access_token, userDetails => {
            UIManager.instance.showLoaderPopup(false);
            this.fillUserAccountItems(userDetails);
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        });
        this.avatarsList.getComponentsInChildren(UserAvatarItem).forEach(item => item.showSelection(false));
    }

    updateUserAccountData(userDetailsUpdate: UserDetailsUpdate) {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.updateUserDetails(TokenStorage.token.access_token, userDetailsUpdate, userDetails => {
            UIManager.instance.showLoaderPopup(false);
            this.fillUserAccountItems(userDetails);
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
            this.refreshUserAccountScreen();
        });
    }

    fillUserAccountItems(userDetails: UserDetails) {
        this.emailItem.setValue(userDetails.email);
        this.usernameItem.setValue(userDetails.username);
        this.nicknameItem.setValue(userDetails.nickname);
        this.firstNameItem.setValue(userDetails.first_name);
        this.lastNameItem.setValue(userDetails.last_name);
        this.phoneNumberItem.setValue(userDetails.phone);
        this.refreshUserAvatar(userDetails);
    }

    refreshUserAvatar(userDetails: UserDetails) {
        let isPictureExist = userDetails.picture != null && userDetails.picture.length > 0;
        this.removeAvatarButton.enabled = isPictureExist;
        if(isPictureExist) {
            ImageUtils.loadImage(userDetails.picture, spriteFrame => {
                if(this.avatar != null) {
                    this.avatar.spriteFrame = spriteFrame;
                    this.bigAvatar.spriteFrame = spriteFrame;
                }
            });
    
        } else {
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = this.noAvatar;
            this.avatar.spriteFrame = spriteFrame;
            this.bigAvatar.spriteFrame = spriteFrame;
        }
        this.avatar.getComponent(UITransform).setContentSize(100, 100);
        this.bigAvatar.getComponent(UITransform).setContentSize(256, 256);
    }

    onNicknameEdited(value: string) {
        let userDetailsUpdate: UserDetailsUpdate = {
            nickname: value
        }
        this.updateUserAccountData(userDetailsUpdate);
    }

    onFirstNameEdited(value: string) {
        let userDetailsUpdate: UserDetailsUpdate = {
            first_name: value
        }
        this.updateUserAccountData(userDetailsUpdate);
    }

    onLastNameEdited(value: string) {
        let userDetailsUpdate: UserDetailsUpdate = {
            last_name: value
        }
        this.updateUserAccountData(userDetailsUpdate);
    }

    onPhoneNumberEdited(value: string) {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.updateUserPhoneNumber(TokenStorage.token.access_token, value, () => {
            UIManager.instance.showLoaderPopup(false);
            this.phoneNumberItem.setValue(value);
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
            this.refreshUserAccountScreen();
        });
    }

    onAvatarEdited() {
        this.setAvatarEditMode(true);
    }

    onAvatarRemoved() {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.removeProfilePicture(TokenStorage.getToken().access_token,
            () => this.handleSuccessfulAvatarUpdate(), error => this.handleErrorAvatarUpdate(error.description));
    }

    onAvatarPickerClosed() {
        this.setAvatarEditMode(false);
    }

    onSaveAvatar(texture: Texture2D, item: UserAvatarItem) {
        UIManager.instance.showLoaderPopup(true);
        if(sys.isBrowser) {
            ImageUtils.getBase64Image(texture, base64image => {
                let base64imageWithoutHeader:string = base64image.substring(base64image.indexOf(',') + 1);
                let buffer = Uint8Array.from(atob(base64imageWithoutHeader), c => c.charCodeAt(0));
                XsollaUserAccount.modifyUserProfilePicture(TokenStorage.getToken().access_token, buffer,
                    () => this.handleSuccessfulAvatarUpdate(), error => this.handleErrorAvatarUpdate(error.description));
            }, error => this.handleErrorAvatarUpdate(error));
        }
        if(sys.platform.toLowerCase() == 'android') {
            jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "modifyUserProfilePicture", "(Ljava/lang/String;Ljava/lang/String;Z)V",
                texture.image.nativeUrl, TokenStorage.token.access_token, Xsolla.settings.authType == AuthenticationType.Oauth2);
        }
    }

    handleSuccessfulAvatarUpdate() {
        UIManager.instance.showLoaderPopup(false);
        this.refreshUserAccountScreen();
    }

    handleErrorAvatarUpdate(error:string) {
        UIManager.instance.showLoaderPopup(false);
        UIManager.instance.showErrorPopup(error);
        this.setAvatarEditMode(false);
    }

    setAvatarEditMode(isPickerVisible: boolean) {
        this.avatarPicker.active = isPickerVisible;
        this.avatarsList.getComponentsInChildren(UserAvatarItem).forEach(item => item.showSelection(false));
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.nicknameItem.node.on(UserAccountItem.ITEM_EDIT, this.onNicknameEdited, this);
        this.firstNameItem.node.on(UserAccountItem.ITEM_EDIT, this.onFirstNameEdited, this);
        this.lastNameItem.node.on(UserAccountItem.ITEM_EDIT, this.onLastNameEdited, this);
        this.phoneNumberItem.node.on(UserAccountItem.ITEM_EDIT, this.onPhoneNumberEdited, this);
        this.removeAvatarButton.node.on(Button.EventType.CLICK, this.onAvatarRemoved, this);
        this.avatarButton.node.on(Button.EventType.CLICK, this.onAvatarEdited, this);
        this.closeAvatarPickerButton.node.on(Button.EventType.CLICK, this.onAvatarPickerClosed, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.nicknameItem.node.off(UserAccountItem.ITEM_EDIT, this.onNicknameEdited, this);
        this.firstNameItem.node.off(UserAccountItem.ITEM_EDIT, this.onFirstNameEdited, this);
        this.lastNameItem.node.off(UserAccountItem.ITEM_EDIT, this.onLastNameEdited, this);
        this.phoneNumberItem.node.off(UserAccountItem.ITEM_EDIT, this.onPhoneNumberEdited, this);
        this.removeAvatarButton.node.off(Button.EventType.CLICK, this.onAvatarRemoved, this);
        this.avatarButton.node.off(Button.EventType.CLICK, this.onAvatarEdited, this);
        this.closeAvatarPickerButton.node.off(Button.EventType.CLICK, this.onAvatarPickerClosed, this);
    }
}
