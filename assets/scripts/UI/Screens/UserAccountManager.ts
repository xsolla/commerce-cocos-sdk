// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Texture2D, instantiate, Prefab, sys, Sprite, SpriteFrame, UITransform, CCString, CCBoolean, ScrollView } from 'cc';
import { UserDetails, UserDetailsUpdate, XsollaUserAccount } from 'db://xsolla-commerce-sdk/scripts/api/XsollaUserAccount';
import { AuthenticationType, Xsolla } from 'db://xsolla-commerce-sdk/scripts/Xsolla';
import { TokenStorage } from '../../Common/TokenStorage';
import { SocialNetworkLinkItem } from '../Misc/SocialNetworkLinkItem';
import { UserAccountItem } from '../Misc/UserAccountItem';
import { UserAvatarItem } from '../Misc/UserAvatarItem';
import { UIManager, UIScreenType } from '../UIManager';
import { ImageUtils } from '../Utils/ImageUtils';
const { ccclass, property } = _decorator;

@ccclass('SocialNetworkLinkItemData')
export class SocialNetworkLinkItemData {

    @property(CCString)
    name: String = '';

    @property(SpriteFrame)
    logo: SpriteFrame = null;
}

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
    openAvatarPickerButton: Button;

    @property(Button)
    closeAvatarPickerButton: Button;

    @property(Button)
    removeAvatarButton: Button;

    @property(ScrollView)
    socialNetworkLinksList: ScrollView;

    @property(Texture2D)
    defaultAvatars: Texture2D[] = [];

    @property(Prefab)
    socialNetworkLinkItemPrefab: Prefab;

    @property([SocialNetworkLinkItemData])
    socialNetworkLinksData: SocialNetworkLinkItemData[] = [];

    start() {
        this.populateAvatrsList();
        this.populateSocialNetworksList();
    }

    onEnable() {
        this.refreshUserAccountData();
        this.refreskLinkedSocialNetworks();
        this.setAvatarEditMode(false);
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.MainMenu);
    }

    populateAvatrsList() {
        for (let avatarTexture of this.defaultAvatars) {
            let avatarItem = instantiate(this.avatarItemPrefab);
            this.avatarsList.addChild(avatarItem);
            avatarItem.getComponent(UserAvatarItem).init(avatarTexture);
            avatarItem.on(UserAvatarItem.AVATAR_PICK, this.onAvatarEdited, this);
        }
    }

    populateSocialNetworksList() {
        for (let i = 0; i < this.socialNetworkLinksData.length; ++i) {
            let socialNetworkLinkItem = instantiate(this.socialNetworkLinkItemPrefab);            
            this.socialNetworkLinksList.content.addChild(socialNetworkLinkItem);
            let itemLinkData = this.socialNetworkLinksData[i];
            socialNetworkLinkItem.getComponent(SocialNetworkLinkItem).init(itemLinkData);
            socialNetworkLinkItem.on(SocialNetworkLinkItem.LINK_NETWORK, this.onNetworkLinkClicked, this);
        }
    }

    refreshUserAccountData() {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.getUserDetails(TokenStorage.token.access_token, userDetails => {
            UIManager.instance.showLoaderPopup(false);
            this.refreshUserAccountItems(userDetails);
            this.refreshUserAvatar(userDetails);
        }, err => {
            console.log(err);
            UIManager.instance.showLoaderPopup(false);
            UIManager.instance.showErrorPopup(err.description);
        });
        this.avatarsList.getComponentsInChildren(UserAvatarItem).forEach(item => item.showSelection(false));
    }

    refreskLinkedSocialNetworks() {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.getLinkedSocialAccounts(TokenStorage.token.access_token, linkedAccounts => {
            UIManager.instance.showLoaderPopup(false);
            linkedAccounts.forEach(account => {
                this.refreshSocialNetworkLinkStatus(account.provider, true);
            });
        }, err => {
            console.log(err);
            UIManager.instance.showLoaderPopup(false);
            UIManager.instance.showErrorPopup(err.description);
        })
    }

    modifyUserAccountData(userDetailsUpdate: UserDetailsUpdate) {
        if (sys.isBrowser) {
            this.modifyUserAccountDataBrowser(userDetailsUpdate);
        }
        if (sys.platform.toLowerCase() == 'android') {
            this.modifyUserAccountDataAndroid(userDetailsUpdate);
        }
        if (sys.platform.toLowerCase() == 'ios') {
            this.modifyUserAccountDataIos(userDetailsUpdate);
        }
    }

    modifyUserAccountDataBrowser(userDetailsUpdate: UserDetailsUpdate) {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.updateUserDetails(TokenStorage.token.access_token, userDetailsUpdate, userDetails => {
            this.handleSuccessfulUserAccountDataUpdate();
        }, err => this.handleErrorUserAccountDataUpdate);
    }

    modifyUserAccountDataAndroid(userDetailsUpdate: UserDetailsUpdate) {
        UIManager.instance.showLoaderPopup(true);
        jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "modifyUserAccountData",
        "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V",
            TokenStorage.token.access_token, userDetailsUpdate.birthday,
            userDetailsUpdate.first_name, userDetailsUpdate.gender,
            userDetailsUpdate.last_name, userDetailsUpdate.nickname, Xsolla.settings.authType == AuthenticationType.Oauth2);
    }

    modifyUserAccountDataIos(userDetailsUpdate: UserDetailsUpdate) {
        //
    }

    handleSuccessfulUserAccountDataUpdate() {
        UIManager.instance.showLoaderPopup(false);
        this.refreshUserAccountData();
    }

    handleErrorUserAccountDataUpdate(error: string) {
        console.log(error);
        UIManager.instance.showLoaderPopup(false);
        UIManager.instance.showErrorPopup(error);
        this.refreshUserAccountData();
    }

    modifyUserPhoneNumber(phoneNumberUpdate: string) {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.updateUserPhoneNumber(TokenStorage.token.access_token, phoneNumberUpdate, () => {
            UIManager.instance.showLoaderPopup(false);
            this.phoneNumberItem.setValue(phoneNumberUpdate);
        }, err => {
            console.log(err);
            UIManager.instance.showLoaderPopup(false);
            UIManager.instance.showErrorPopup(err.description);
            this.refreshUserAccountData();
        });
    }

    updateUserAvatarBrowser(avatarUpdate: Texture2D) {
        UIManager.instance.showLoaderPopup(true);
        ImageUtils.getBase64Image(avatarUpdate, base64image => {
            let base64imageWithoutHeader: string = base64image.substring(base64image.indexOf(',') + 1);
            let buffer = Uint8Array.from(atob(base64imageWithoutHeader), c => c.charCodeAt(0));
            XsollaUserAccount.updateUserProfilePicture(TokenStorage.getToken().access_token, buffer,
                () => this.handleSuccessfulAvatarUpdate(), error => this.handleErrorAvatarUpdate(error.description));
        }, error => this.handleErrorAvatarUpdate(error));
    }

    updateUserAvatarAndroid(avatarUpdate: Texture2D) {
        UIManager.instance.showLoaderPopup(true);
        jsb.reflection.callStaticMethod("com/cocos/game/XsollaNativeUtils", "updateUserProfilePicture", "(Ljava/lang/String;Ljava/lang/String;Z)V",
            avatarUpdate.image.nativeUrl, TokenStorage.token.access_token, Xsolla.settings.authType == AuthenticationType.Oauth2);
    }

    updateUserAvatarIos(avatarUpdate: Texture2D) {
        UIManager.instance.showLoaderPopup(true);
        jsb.reflection.callStaticMethod("XsollaNativeUtils", "updateUserProfilePicture:authToken:",
            avatarUpdate.image.nativeUrl, TokenStorage.token.access_token);
    }

    handleSuccessfulAvatarUpdate() {
        UIManager.instance.showLoaderPopup(false);
        this.refreshUserAccountData();
    }

    handleErrorAvatarUpdate(error: string) {
        UIManager.instance.showLoaderPopup(false);
        UIManager.instance.showErrorPopup(error);
        this.setAvatarEditMode(false);
    }

    setAvatarEditMode(isPickerVisible: boolean) {
        this.avatarPicker.active = isPickerVisible;
        this.avatarsList.getComponentsInChildren(UserAvatarItem).forEach(item => item.showSelection(false));
    }

    linkSocialNetworkAndroid(networkName: string) {
        // TODO
    }

    linkSocialNetworkIos(networkName: string) {
        jsb.reflection.callStaticMethod("XsollaNativeUtils", "linkSocialNetwork:authToken:",
            networkName, TokenStorage.token.access_token);
    }

    refreshSocialNetworkLinkStatus(networkName: string, isNetworkLinked: boolean) {
        let socialNetworkLinkItems = this.socialNetworkLinksList.content.getComponentsInChildren(SocialNetworkLinkItem);
        let linkedItem = socialNetworkLinkItems.find(item => item.data.name === networkName);
        if(linkedItem) {
            linkedItem.setIsLinked(isNetworkLinked);
            linkedItem.node.setSiblingIndex(0);
            this.socialNetworkLinksList.scrollToLeft();
        }   
    }

    handleSuccessfulSocialNetworkLinking(networkName: string) {
        this.refreshSocialNetworkLinkStatus(networkName, true);
    }

    handleErrorSocialNetworkLinking(error: string) {
        UIManager.instance.showErrorPopup(error);
    }

    refreshUserAccountItems(userDetails: UserDetails) {
        this.emailItem.setValue(userDetails.email);
        this.usernameItem.setValue(userDetails.username);
        this.nicknameItem.setValue(userDetails.nickname);
        this.firstNameItem.setValue(userDetails.first_name);
        this.lastNameItem.setValue(userDetails.last_name);
        this.phoneNumberItem.setValue(userDetails.phone);
    }

    refreshUserAvatar(userDetails: UserDetails) {
        let isPictureExist = userDetails.picture != null && userDetails.picture.length > 0;
        this.removeAvatarButton.enabled = isPictureExist;
        if (isPictureExist) {
            ImageUtils.loadImage(userDetails.picture, spriteFrame => {
                if (this.avatar != null) {
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
        this.modifyUserAccountData(userDetailsUpdate);
    }

    onFirstNameEdited(value: string) {
        let userDetailsUpdate: UserDetailsUpdate = {
            first_name: value
        }
        this.modifyUserAccountData(userDetailsUpdate);
    }

    onLastNameEdited(value: string) {
        let userDetailsUpdate: UserDetailsUpdate = {
            last_name: value
        }
        this.modifyUserAccountData(userDetailsUpdate);
    }

    onPhoneNumberEdited(value: string) {
        this.modifyUserPhoneNumber(value);
    }

    onAvatarEdited(texture: Texture2D) {        
        if (sys.isBrowser) {
            this.updateUserAvatarBrowser(texture);
        }
        if (sys.platform.toLowerCase() == 'android') {
            this.updateUserAvatarAndroid(texture);
        }
        if (sys.platform.toLowerCase() == 'ios') {
            this.updateUserAvatarIos(texture);
        }
    }

    onAvatarRemoved() {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.removeProfilePicture(TokenStorage.getToken().access_token,
            () => this.handleSuccessfulAvatarUpdate(), error => this.handleErrorAvatarUpdate(error.description));
    }

    onAvatarPickerOpened() {
        this.setAvatarEditMode(true);
    }

    onAvatarPickerClosed() {
        this.setAvatarEditMode(false);
    }

    onNetworkLinkClicked(networkName: string, isNetworkLinked: boolean) {
        if(isNetworkLinked) {
            console.log(networkName + ' is already linked.')
            return;
        }

        if (sys.platform.toLowerCase() == 'android') {
            this.linkSocialNetworkAndroid(networkName);
        }
        if (sys.platform.toLowerCase() == 'ios') {
            this.linkSocialNetworkIos(networkName);
        }
    }

    addListeners() {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.nicknameItem.node.on(UserAccountItem.ITEM_EDIT, this.onNicknameEdited, this);
        this.firstNameItem.node.on(UserAccountItem.ITEM_EDIT, this.onFirstNameEdited, this);
        this.lastNameItem.node.on(UserAccountItem.ITEM_EDIT, this.onLastNameEdited, this);
        this.phoneNumberItem.node.on(UserAccountItem.ITEM_EDIT, this.onPhoneNumberEdited, this);
        this.openAvatarPickerButton.node.on(Button.EventType.CLICK, this.onAvatarPickerOpened, this);
        this.closeAvatarPickerButton.node.on(Button.EventType.CLICK, this.onAvatarPickerClosed, this);
        this.removeAvatarButton.node.on(Button.EventType.CLICK, this.onAvatarRemoved, this);
    }

    removeListeners() {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.nicknameItem.node.off(UserAccountItem.ITEM_EDIT, this.onNicknameEdited, this);
        this.firstNameItem.node.off(UserAccountItem.ITEM_EDIT, this.onFirstNameEdited, this);
        this.lastNameItem.node.off(UserAccountItem.ITEM_EDIT, this.onLastNameEdited, this);
        this.phoneNumberItem.node.off(UserAccountItem.ITEM_EDIT, this.onPhoneNumberEdited, this);
        this.openAvatarPickerButton.node.off(Button.EventType.CLICK, this.onAvatarPickerOpened, this);
        this.closeAvatarPickerButton.node.off(Button.EventType.CLICK, this.onAvatarPickerClosed, this);
        this.removeAvatarButton.node.off(Button.EventType.CLICK, this.onAvatarRemoved, this);
    }
}
