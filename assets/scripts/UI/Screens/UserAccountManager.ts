// Copyright 2025 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Texture2D, instantiate, Prefab, sys, Sprite, SpriteFrame, UITransform, CCString, ScrollView } from 'cc';
import { UserDetails, UserDetailsUpdate, XsollaUserAccount } from 'db://xsolla-commerce-sdk/scripts/api/XsollaUserAccount';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { UserAccountItem } from '../Misc/UserAccountItem';
import { UserAvatarItem } from '../Misc/UserAvatarItem';
import { UIManager, UIScreenType } from '../UIManager';
import { ImageUtils } from 'db://xsolla-commerce-sdk/scripts/common/ImageUtils';
import { SocialNetworkLinkItem } from '../Misc/SocialNetworkLinkItem';
import { LoginError } from 'db://xsolla-commerce-sdk/scripts/core/Error';
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

    @property(Texture2D)
    defaultAvatars: Texture2D[] = [];

    @property(ScrollView)
    socialNetworkLinksList: ScrollView;

    @property(Prefab)
    socialNetworkLinkItemPrefab: Prefab;

    @property([SocialNetworkLinkItemData])
    socialNetworkLinksData: SocialNetworkLinkItemData[] = [];

    start() {
        this.populateAvatrsList();

        if (sys.isMobile) {
            this.populateSocialNetworksList();
            this.refreshLinkedSocialNetworks();
        }
        else {
            this.socialNetworkLinksList.node.active = false;
        }
    }

    onEnable() {
        this.refreshUserAccountData();
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

    populateSocialNetworksList() {
        for (let i = 0; i < this.socialNetworkLinksData.length; ++i) {
            let socialNetworkLinkItem = instantiate(this.socialNetworkLinkItemPrefab);
            this.socialNetworkLinksList.content.addChild(socialNetworkLinkItem);
            let itemLinkData = this.socialNetworkLinksData[i];
            socialNetworkLinkItem.getComponent(SocialNetworkLinkItem).init(itemLinkData);
            socialNetworkLinkItem.on(SocialNetworkLinkItem.LINK_NETWORK, this.onNetworkLinkClicked, this);
        }
    }

    refreshLinkedSocialNetworks() {
        UIManager.instance.showLoaderPopup(true);

        this.socialNetworkLinksList.content.getComponentsInChildren(SocialNetworkLinkItem).forEach(element => {
            element.setIsLinked(false);
        });

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

    refreshSocialNetworkLinkStatus(networkName: string, isNetworkLinked: boolean) {
        let socialNetworkLinkItems = this.socialNetworkLinksList.content.getComponentsInChildren(SocialNetworkLinkItem);
        let linkedItem = socialNetworkLinkItems.find(item => item.data.name.toUpperCase() === networkName.toUpperCase());
        if (linkedItem) {
            linkedItem.setIsLinked(isNetworkLinked);
            linkedItem.node.setSiblingIndex(0);
            this.socialNetworkLinksList.scrollToLeft();
        }
    }

    modifyUserAccountData(userDetailsUpdate: UserDetailsUpdate) {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.updateUserDetails(TokenStorage.token.access_token, userDetailsUpdate, userDetails => {
            UIManager.instance.showLoaderPopup(false);
            this.refreshUserAccountData();
        }, (error:LoginError) => {
            console.log(error);
            UIManager.instance.showLoaderPopup(false);
            UIManager.instance.showErrorPopup(error.description);
            this.refreshUserAccountData();
        });
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

    setAvatarEditMode(isPickerVisible: boolean) {
        this.avatarPicker.active = isPickerVisible;
        this.avatarsList.getComponentsInChildren(UserAvatarItem).forEach(item => item.showSelection(false));
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
            }, error => {
                UIManager.instance.showErrorPopup(error);
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
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.updateUserProfilePicture(TokenStorage.getToken().access_token, texture, () => {
            UIManager.instance.showLoaderPopup(false);
            this.refreshUserAccountData();
        }, error => {
            console.log(error);
            UIManager.instance.showLoaderPopup(false);
            UIManager.instance.showErrorPopup(error.description);
            this.setAvatarEditMode(false);
        });
    }

    onAvatarRemoved() {
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.removeProfilePicture(TokenStorage.getToken().access_token,
            () => {
                UIManager.instance.showLoaderPopup(false);
                this.refreshUserAccountData();
            }, error => {
                console.log(error);
                UIManager.instance.showLoaderPopup(false);
                UIManager.instance.showErrorPopup(error.description);
                this.setAvatarEditMode(false);
            });
    }

    onAvatarPickerOpened() {
        this.setAvatarEditMode(true);
    }

    onAvatarPickerClosed() {
        this.setAvatarEditMode(false);
    }

    onNetworkLinkClicked(networkName: string, isNetworkLinked: boolean) {
        if (isNetworkLinked) {
            console.log(networkName + ' is already linked.')
            return;
        }
        UIManager.instance.showLoaderPopup(true);
        XsollaUserAccount.linkSocialNetwork(TokenStorage.getToken().access_token, networkName, (networkName:string) => {
            UIManager.instance.showLoaderPopup(false);
            this.refreshSocialNetworkLinkStatus(networkName, true);
        }, error => {
            UIManager.instance.showLoaderPopup(false);
            console.log(error);
            UIManager.instance.showErrorPopup(error);
        });
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
