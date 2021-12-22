// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Label, Texture2D, instantiate, Prefab, sys, Sprite, assetManager, ImageAsset, SpriteFrame, UITransform } from 'cc';
import { UserDetails, UserDetailsUpdate, XsollaUserAccount } from 'db://xsolla-commerce-sdk/scripts/api/XsollaUserAccount';
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

    @property(Prefab)
    avatarItemPrefab: Prefab;

    @property(Texture2D)
    noAvatar: Texture2D;

    @property(Node)
    avatarPicker: Node;

    @property(Node)
    avatarModifier: Node;

    @property(Node)
    avatarEditRemoveContainer: Node;

    @property(Button)
    avatarEditButton: Button;

    @property(Button)
    avatarRemoveButton: Button;

    @property(Texture2D)
    defaultAvatars: Texture2D[] = [];

    start() {
        this.avatarPicker.destroyAllChildren();
        for(let avatarTexture of this.defaultAvatars) {
            let avatarItem = instantiate(this.avatarItemPrefab);
            this.avatarPicker.addChild(avatarItem);
            avatarItem.getComponent(UserAvatarItem).init(avatarTexture, this);
        }
        this.avatarModifier.active = !sys.isMobile;
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
        XsollaUserAccount.getUserDetails(TokenStorage.token.access_token, userDetails => {
            this.fillUserAccountItems(userDetails);
        }, err => {
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        });
    }

    updateUserAccountData(userDetailsUpdate: UserDetailsUpdate) {
        XsollaUserAccount.updateUserDetails(TokenStorage.token.access_token, userDetailsUpdate, userDetails => {
            this.fillUserAccountItems(userDetails);
        }, err => {
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
        let isPictureExist = userDetails.picture != null && userDetails.picture.length > 0;
        this.avatarRemoveButton.node.active = isPictureExist;
        if(isPictureExist) {
            assetManager.loadRemote<ImageAsset>(userDetails.picture, (err, imageAsset) => {
                if(imageAsset != null) {
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = imageAsset;
                    spriteFrame.texture = texture;
                    this.avatar.spriteFrame = spriteFrame;
                } else {
                    UIManager.instance.showErrorPopup(err.message);
                }
            });
        } else {
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = this.noAvatar;
            this.avatar.spriteFrame = spriteFrame;
        }
        this.avatar.getComponent(UITransform).setContentSize(100, 100); 
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
        XsollaUserAccount.updateUserPhoneNumber(TokenStorage.token.access_token, value, () => {
            this.phoneNumberItem.setValue(value);
        }, err => {
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
            this.refreshUserAccountScreen();
        });
    }

    setAvatarEditMode(isPickerVisible: boolean) {
        this.avatarPicker.active = isPickerVisible;
        this.avatarEditRemoveContainer.active = !isPickerVisible;
    }

    onAvatarEdited() {
        this.setAvatarEditMode(true);
    }

    onAvatarRemoved() {
        XsollaUserAccount.removeProfilePicture(TokenStorage.getToken().access_token, () => {
            this.avatarRemoveButton.node.active = false;
            this.refreshUserAccountScreen();
            this.setAvatarEditMode(false);
        }, error => {
            UIManager.instance.showErrorPopup(error.description);
            this.setAvatarEditMode(false);
        });
    }

    onSaveAvatar(texture: Texture2D, item: UserAvatarItem) {
        item.selectionSprite.node.active = true;
        ImageUtils.getBase64Image(texture, base64image => {
            let base64imageWithoutHeader:string = base64image.substring(base64image.indexOf(',') + 1);
            let buffer = Uint8Array.from(atob(base64imageWithoutHeader), c => c.charCodeAt(0))
            XsollaUserAccount.modifyUserProfilePicture(TokenStorage.getToken().access_token, buffer, () => {
                item.selectionSprite.node.active = false;
                this.avatarRemoveButton.node.active = true;
                this.refreshUserAccountScreen();
                this.setAvatarEditMode(false);
            }, error => {
                item.selectionSprite.node.active = false;
                UIManager.instance.showErrorPopup(error.description);
                this.setAvatarEditMode(false);
            });
        }, errorMessage => {
            UIManager.instance.showErrorPopup(errorMessage);
        });
    }

    addListeners () {
        this.backButton.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.nicknameItem.node.on(UserAccountItem.ITEM_EDIT, this.onNicknameEdited, this);
        this.firstNameItem.node.on(UserAccountItem.ITEM_EDIT, this.onFirstNameEdited, this);
        this.lastNameItem.node.on(UserAccountItem.ITEM_EDIT, this.onLastNameEdited, this);
        this.phoneNumberItem.node.on(UserAccountItem.ITEM_EDIT, this.onPhoneNumberEdited, this);
        this.avatarEditButton.node.on(Button.EventType.CLICK, this.onAvatarEdited, this);
        this.avatarRemoveButton.node.on(Button.EventType.CLICK, this.onAvatarRemoved, this);
    }

    removeListeners () {
        this.backButton.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.nicknameItem.node.off(UserAccountItem.ITEM_EDIT, this.onNicknameEdited, this);
        this.firstNameItem.node.off(UserAccountItem.ITEM_EDIT, this.onFirstNameEdited, this);
        this.lastNameItem.node.off(UserAccountItem.ITEM_EDIT, this.onLastNameEdited, this);
        this.phoneNumberItem.node.off(UserAccountItem.ITEM_EDIT, this.onPhoneNumberEdited, this);
        this.avatarEditButton.node.off(Button.EventType.CLICK, this.onAvatarEdited, this);
        this.avatarRemoveButton.node.off(Button.EventType.CLICK, this.onAvatarRemoved, this);
    }
}
