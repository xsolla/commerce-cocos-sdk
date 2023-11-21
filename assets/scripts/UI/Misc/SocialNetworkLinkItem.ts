// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Button, Sprite, Color } from 'cc';
import { SocialNetworkLinkItemData } from '../Screens/UserAccountManager';
const { ccclass, property } = _decorator;
 
@ccclass('SocialNetworkLinkItem')
export class SocialNetworkLinkItem extends Component {

    @property(Sprite)
    socialNetworkLogo: Sprite;

    @property(Sprite)
    linkedStatusIcon: Sprite;

    @property(Sprite)
    linkSocialNetworkIcon: Sprite;

    @property(Button)
    socialNetworkButton: Button;

    @property(Color)
    normalColor: Color = new Color(255, 255, 255, 255);

    @property(Color)
    hoverColor: Color = new Color(255, 0, 91, 255);

    @property(Color)
    linkedColor: Color = new Color(11, 178, 0, 255);

    @property(Color)
    linkNormalColor: Color = new Color(156, 156, 162, 255);

    @property(SocialNetworkLinkItemData)
    data: SocialNetworkLinkItemData = null;

    private _isLinked: boolean = false;

    static LINK_NETWORK: string = 'linkNetwork';

    start() {        
        this.node.on(Node.EventType.MOUSE_ENTER, () => {
            this.socialNetworkLogo.color = this.hoverColor;         
            this.linkSocialNetworkIcon.color = this.hoverColor;     
        });
        this.node.on(Node.EventType.MOUSE_LEAVE, () => {
            this.socialNetworkLogo.color = this.normalColor;
            this.linkSocialNetworkIcon.color = this.linkNormalColor;
        });
        this.linkedStatusIcon.color = this.linkedColor;
    }

    onDestroy() {

    }

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    init(data:SocialNetworkLinkItemData) {
        this.socialNetworkLogo.spriteFrame = data.logo;
        this.data = data;
    }

    setIsLinked(isLinked: boolean) {
        this._isLinked = isLinked;
        this.linkedStatusIcon.node.active = isLinked;
        this.linkSocialNetworkIcon.node.active = !isLinked;
    }

    onClicked() {
        this.node.emit(SocialNetworkLinkItem.LINK_NETWORK, this.data.name, this._isLinked);
    }

    addListeners () {
        this.socialNetworkButton.node.on(Button.EventType.CLICK, this.onClicked, this);
    }

    removeListeners () {
        this.socialNetworkButton.node.off(Button.EventType.CLICK, this.onClicked, this);
    }
}
