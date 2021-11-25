// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Event, Button, SpriteFrame, Sprite, Color } from 'cc';
import { SocialAuthManager } from '../SocialAuthManager';
const { ccclass, property } = _decorator;
 
@ccclass('SocialNetworkItem')
export class SocialNetworkItem extends Component {

    @property(Label)
    socialNetworkName: Label;

    @property(Sprite)
    socialNetworkLogo: Sprite;

    @property(Button)
    socialNetworkButton: Button;

    @property(Color)
    NormalColor: Color = new Color(255, 255, 255, 255);

    @property(Color)
    HoverColor: Color = new Color(255, 0, 91, 255);

    private _parent: SocialAuthManager;

    start() {
        this.node.on(Node.EventType.MOUSE_ENTER, () => {
            this.socialNetworkName.color = this.HoverColor;
            this.socialNetworkLogo.color = this.HoverColor;         
        });
        this.node.on(Node.EventType.MOUSE_LEAVE, () => {
            this.socialNetworkName.color = this.NormalColor;
            this.socialNetworkLogo.color = this.NormalColor;
        });
    }

    onDestroy() {

    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    init(name:string, logo:SpriteFrame, parent:SocialAuthManager) {
        this.socialNetworkName.string = name;
        this.socialNetworkLogo.spriteFrame = logo;
        this._parent = parent;
    }

    onClicked() {
        this._parent.authViaSocialNetwork(this.socialNetworkName.string.toLowerCase());
    }

    addListeners () {
        this.socialNetworkButton.node.on(Button.EventType.CLICK, this.onClicked, this);
    }

    removeListeners () {
        this.socialNetworkButton.node.off(Button.EventType.CLICK, this.onClicked, this);
    }
}
