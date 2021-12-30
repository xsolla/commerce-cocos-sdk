// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Button, Texture2D, Sprite, SpriteFrame, UITransform } from 'cc';
import { UserAccountManager } from '../Screens/UserAccountManager';
const { ccclass, property, executeInEditMode} = _decorator;
 
@ccclass('UserAvatarItem')
@executeInEditMode(true)
export class UserAvatarItem extends Component {

    @property(Sprite)
    avatarSprite: Sprite;

    @property(Sprite)
    selectionSprite: Sprite;

    @property(Button)
    btn: Button;

    private _parent: UserAccountManager;

    private _texture: Texture2D;

    start() {
        this.showSelection(false);
    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.btn.node.on(Button.EventType.CLICK, this.onClicked, this);
    }

    removeListeners () {
        this.btn.node.off(Button.EventType.CLICK, this.onClicked, this);
    }

    init(texture: Texture2D, parent:UserAccountManager) {
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        this.avatarSprite.spriteFrame = spriteFrame;
        this.avatarSprite.getComponent(UITransform).setContentSize(40, 40); 
        this._parent = parent;
        this._texture = texture;
    }

    onClicked() {
        if(this.isSelected()) {
            return;
        }
        this.showSelection(true);
        this._parent.onSaveAvatar(this._texture, this);
    }

    showSelection(showSelection: boolean) {
        this.selectionSprite.node.active = showSelection;
    }

    isSelected(): boolean {
        return this.selectionSprite.node.active;
    }
}