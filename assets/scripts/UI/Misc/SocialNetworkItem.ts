// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Button, Sprite, Color } from 'cc';
import { SocialAuthManager, SocialNetworkItemData } from '../Screens/SocialAuthManager';
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
    normalColor: Color = new Color(255, 255, 255, 255);

    @property(Color)
    hoverColor: Color = new Color(255, 0, 91, 255);

    @property(SocialNetworkItemData)
    data: SocialNetworkItemData = null;

    private _parent: SocialAuthManager;

    start() {
        this.node.on(Node.EventType.MOUSE_ENTER, () => {
            this.socialNetworkName.color = this.hoverColor;
            this.socialNetworkLogo.color = this.hoverColor;         
        });
        this.node.on(Node.EventType.MOUSE_LEAVE, () => {
            this.socialNetworkName.color = this.normalColor;
            this.socialNetworkLogo.color = this.normalColor;
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

    init(data:SocialNetworkItemData, parent:SocialAuthManager) {
        this.socialNetworkName.string = data.name.toString();
        this.socialNetworkLogo.spriteFrame = data.logo;
        this.data = data;
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
